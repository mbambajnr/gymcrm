'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error || !authData.user) {
        redirect('/error')
    }

    // Fetch the role from the profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

    revalidatePath('/', 'layout')

    if (profile?.role === 'admin') {
        redirect('/admin-dashboard')
    } else {
        redirect('/dashboard')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signUp(data)

    if (error || !authData.user) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')

    // Default redirect to dashboard after signup
    redirect('/dashboard')
}
