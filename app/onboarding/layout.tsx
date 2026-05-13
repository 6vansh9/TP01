import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
export const dynamic = "force-dynamic"
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/onboarding")
  }
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/onboarding")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle()

  // If no profile at all, let them through to create one
  // If onboarding already done, send to dashboard
  if (profile?.onboarding_completed === true) {
    redirect("/dashboard/freelancer")
  }

  return <>{children}</>
}
