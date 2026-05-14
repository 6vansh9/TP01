import type { SupabaseClient } from "@supabase/supabase-js"
import type { FreelancerOnboardingForm } from "./types"

function experienceLevelForDb(level: FreelancerOnboardingForm["experienceLevel"]): string | null {
  if (level === "new") return "brand_new"
  if (level === "some") return "some_experience"
  if (level === "expert") return "expert"
  return null
}

export async function submitFreelancerOnboarding(
  supabase: SupabaseClient,
  userId: string,
  form: FreelancerOnboardingForm,
): Promise<{ error: Error | null }> {
  try {
    let avatarUrl: string | null = form.avatarPreviewUrl

    if (form.avatarFile) {
      const ext = form.avatarFile.type === "image/png" ? "png" : "webp"
      const path = `${userId}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, form.avatarFile, { upsert: true, contentType: form.avatarFile.type })
      if (uploadError) return { error: uploadError }
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path)
      avatarUrl = pub.publicUrl
    }

    const rate = Number.parseFloat(form.hourlyRate)
    if (!Number.isFinite(rate) || rate <= 0) {
      return { error: new Error("Invalid hourly rate") }
    }

    const phone = `${form.phoneCountryCode}${form.phoneLocal}`.replace(/\s+/g, "")
    const locationLine = [form.address.city, form.address.state, form.address.country]
      .filter(Boolean)
      .join(", ")

    // Get full_name from auth user metadata
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const fullName = authUser?.user_metadata?.full_name ?? authUser?.email?.split("@")[0] ?? null

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        title: form.title.trim() || null,
        skills: form.skills.length > 0 ? form.skills : null,
        experience_level: experienceLevelForDb(form.experienceLevel),
        goals: form.goals,
        work_preference: form.workPreference,
        open_to_contract_to_hire: form.openToContractToHire,
        profile_setup_method: form.profileSetupMethod,
        work_experience: form.workExperience,
        education: form.education,
        languages: form.languages,
        bio: form.bio.trim(),
        hourly_rate: rate,
        avatar_url: avatarUrl,
        phone,
        edu_email: form.edu_email || null,
        edu_verified: form.edu_verified ?? false,
        phone_verified: form.phone_verified ?? false,
        dob: form.dob || null,
        address: form.address,
        location: locationLine || null,
        onboarding_completed: true,
        is_available: true,
      })
      .eq("id", userId)

    if (error) return { error: error }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) }
  }
}
