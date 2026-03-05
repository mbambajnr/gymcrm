import { NextResponse } from 'next/server'
// The client you created in Step 2
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        // If there's no error, OR if we already have a user session (code was likely already exchanged)
        const { data: { user } } = await supabase.auth.getUser()

        if (!exchangeError || user) {
            let finalNext = next

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('gym_name, role')
                    .eq('id', user.id)
                    .single()

                // If they haven't finished setup (no gym name) and they aren't a manager, 
                // force them to the details page regardless of 'next' parameter
                if (!profile?.gym_name && profile?.role !== 'manager' && finalNext === '/') {
                    finalNext = '/signup/details'
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${finalNext}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${finalNext}`)
            } else {
                return NextResponse.redirect(`${origin}${finalNext}`)
            }
        }
    }

    // If we're here, it means the code was invalid AND we have no session
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
