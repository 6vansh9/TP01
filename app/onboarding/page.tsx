import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { FreelancerOnboardingClient } from "@/components/onboarding/freelancer-onboarding-client"
import type { ProfilePreviewSeed } from "@/components/onboarding/step-views-2"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Complete your profile — TaskPay",
  description: "Freelancer onboarding for TaskPay",
}

export default async function OnboardingPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/onboarding")
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/onboarding")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, rating, review_count, jobs_completed, hourly_rate")
    .eq("id", user.id)
    .maybeSingle()

  const preview: ProfilePreviewSeed = {
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    rating: profile?.rating ?? null,
    review_count: profile?.review_count ?? null,
    jobs_completed: profile?.jobs_completed ?? null,
    hourly_rate: profile?.hourly_rate ?? null,
  }

  return <FreelancerOnboardingClient preview={preview} />
}
