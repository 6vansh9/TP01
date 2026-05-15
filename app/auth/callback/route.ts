import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const role = requestUrl.searchParams.get('role') ?? 'freelancer'
  if (!code) {
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
  if (error) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, role')
    .eq('id', user.id)
    .single()
  if (!profile) {
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.email,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      role,
      onboarding_completed: role === 'client',
    }, { onConflict: 'id' })
  } else if (!profile.role) {
    await supabase
      .from('profiles')
      .update({ role, onboarding_completed: role === 'client' })
      .eq('id', user.id)
  }
  const finalRole = profile?.role ?? role
  let dest: string
  if (!profile?.onboarding_completed) {
    dest = finalRole === 'client' ? '/dashboard/client' : '/onboarding'
  } else {
    dest = finalRole === 'client' ? '/dashboard/client' : '/dashboard/freelancer'
  }
  return NextResponse.redirect(new URL(dest, requestUrl.origin))
}
