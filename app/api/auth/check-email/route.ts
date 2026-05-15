// app/api/auth/check-email/route.ts
// Call this on your signup page before sending the magic link.
// POST { email } → { exists: true/false }

import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // List users filtered by email
  const { data, error } = await adminSupabase.auth.admin.listUsers()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const exists = data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  return NextResponse.json({ exists })
}
