'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: (formData.get('email') as string).trim(),
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error || !authData.user) {
        redirect(`/error?message=${encodeURIComponent(error?.message || 'Authentication failed')}`)
    }

    // Fetch the role and gym info from the profiles table using Admin Client to bypass RLS
    const adminSupabase = await createAdminClient()
    const { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('role, gym_name')
        .eq('id', authData.user.id)
        .single()

    if (profileError) {
        console.error('Login profile fetch error:', profileError)
        // If profile doesn't exist yet, we might need to redirect to details
        if (profileError.code === 'PGRST116') {
            redirect('/signup/details')
        }
        redirect(`/error?message=${encodeURIComponent("Profile retrieval failed: " + profileError.message)}`)
    }

    revalidatePath('/', 'layout')

    // Determine redirection based on role and setup status
    const isManager = authData.user.user_metadata?.role === 'manager' || profile?.role === 'manager'
    const hasFinishedSetup = !!profile?.gym_name

    if (isManager) {
        redirect('/manager-dashboard')
    }

    // Treat as Owner/Admin
    if (!hasFinishedSetup) {
        redirect('/signup/details')
    }

    redirect('/admin-dashboard')
}

export async function signup(formData: FormData) {
    try {
        const supabase = await createClient()

        const email = (formData.get('email') as string).trim()
        const password = formData.get('password') as string

        // 1. Attempt Signup
        console.log('--- SIGNUP INITIATED ---', email)
        const { error: signUpError, data: authData } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/signup/details`,
            },
        })

        if (signUpError) {
            console.error('Signup Error:', signUpError.message)
            redirect(`/error?message=${encodeURIComponent(signUpError.message)}`)
        }

        console.log('Signup success. User created:', authData.user?.id)

        // 2. Force Session Establishment
        // If email confirmation is off, signUp might log us in (authData.session will exist).
        // If it's ON, authData.session will be null.
        if (!authData.session) {
            console.log('No session after signup. Email confirmation likely required. Attempting verification check...')
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) {
                console.log('Verification required. Redirecting to notice page.')
                redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`)
            }
        }

        console.log('Session established. Redirecting to details onboarding.')
        revalidatePath('/', 'layout')
        redirect('/signup/details')
    } catch (error: any) {
        if (error.digest?.includes('NEXT_REDIRECT')) throw error
        console.error('Fatal Signup Error:', error)
        redirect(`/error?message=${encodeURIComponent(error.message || 'Fatal signup failure')}`)
    }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const fullName = formData.get('fullName') as string
    const gymName = formData.get('gymName') as string
    const phone = formData.get('phone') as string

    console.log('Attempting to activate workspace for user:', user.id, { fullName, gymName, phone })

    // 1. Update Auth Metadata for the name and phone
    const { error: authError } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone: phone,
            role: 'admin',
            has_finished_setup: true
        }
    })

    if (authError) {
        console.error('Auth metadata update failed:', authError.message)
        redirect(`/error?message=${encodeURIComponent(authError.message)}`)
    }

    // 2. Upsert Profiles table for role and gym name using Admin Client to bypass RLS
    const { error } = await adminSupabase
        .from('profiles')
        .upsert({
            id: user.id,
            gym_name: gymName,
            role: 'admin' // Users signing up via web are owners/admins
        })

    if (error) {
        console.error('Profile update failed:', error.message)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/admin-dashboard')
}

export async function resendVerificationEmail(email: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/signup/details`,
        },
    })

    if (error) {
        console.error('Resend Error:', error.message)
        throw new Error(error.message)
    }

    return { success: true }
}
