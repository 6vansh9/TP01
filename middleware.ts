import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return NextResponse.next({ request })

  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = profile?.role

    // Freelancer trying to access client pages → redirect to freelancer dashboard
    if (role === "freelancer" && path.startsWith("/dashboard/client")) {
      return NextResponse.redirect(new URL("/dashboard/freelancer", request.url))
    }

    // Client trying to access freelancer pages → redirect to client dashboard
    if (role === "client" && path.startsWith("/dashboard/freelancer")) {
      return NextResponse.redirect(new URL("/dashboard/client", request.url))
    }

    // Client trying to browse jobs as freelancer
    if (role === "client" && path === "/find-work") {
      return NextResponse.redirect(new URL("/dashboard/client", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
