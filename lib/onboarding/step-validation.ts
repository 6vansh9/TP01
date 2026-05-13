import type { FreelancerOnboardingForm } from "./types"
export function canAdvanceFromStep(step: number, form: FreelancerOnboardingForm): boolean {
  switch (step) {
    case 1:
      return form.experienceLevel != null
    case 2:
      return form.goals.length > 0
    case 3:
      return form.workPreference != null
    case 4:
      return form.profileSetupMethod != null
    case 5:
    case 6:
      return true
    case 7:
      return form.languages.every((l) => l.name.trim() && l.proficiency)
    case 8:
      return form.title.trim().length > 0 && form.skills.length >= 1
    case 9:
      return form.bio.trim().length >= 100
    case 10: {
      const n = Number.parseFloat(form.hourlyRate)
      return Number.isFinite(n) && n > 0
    }
    case 11:
      return (
        !!form.avatarFile &&
        !!form.dob &&
        !!form.address.country &&
        !!form.address.city &&
        form.phoneLocal.trim().length >= 6
      )
    default:
      return true
  }
}
