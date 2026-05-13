import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  console.log('[callback] code present:', !!code)

  if (!code) {
    console.log('[callback] no code, redirecting to /login')
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  console.log('[callback] exchangeCodeForSession error:', error?.message ?? 'none')

  const { data: { user } } = await supabase.auth.getUser()
  console.log('[callback] user:', user?.id ?? 'null')

  if (!user) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  console.log('[callback] profile:', profile, 'profileErr:', profileErr?.message)

  const dest = profile?.onboarding_completed ? '/dashboard/freelancer' : '/onboarding'
  console.log('[callback] redirecting to:', dest)

  return NextResponse.redirect(new URL(dest, requestUrl.origin))
}
