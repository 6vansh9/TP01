import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE() {
  const cookieStore = await cookies()
  
  console.log("COOKIES FOUND:", cookieStore.getAll().map(c => c.name))

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

  console.log("CALLING getUser...")
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log("USER:", user?.id, "ERROR:", authError?.message)

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await adminSupabase.from("proposals").delete().eq("freelancer_id", user.id)
  await adminSupabase.from("proposals").delete().eq("client_id", user.id)
  await adminSupabase.from("jobs").delete().eq("client_id", user.id)
  await adminSupabase.from("profiles").delete().eq("id", user.id)

  const { error } = await adminSupabase.auth.admin.deleteUser(user.id, true)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}
