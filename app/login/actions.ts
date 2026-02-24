'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
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
        redirect('/dashboard')
    }

    // Treat as Owner/Admin
    if (!hasFinishedSetup) {
        redirect('/signup/details')
    }

    redirect('/admin-dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signUp(data)

    if (error || !authData.user) {
        redirect(`/error?message=${encodeURIComponent(error?.message || 'Signup failed')}`)
    }

    revalidatePath('/', 'layout')
    redirect('/signup/details')
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
