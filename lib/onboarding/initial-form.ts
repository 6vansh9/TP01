import type { AddressForm, FreelancerOnboardingForm, LanguageRow } from "./types"
export function newRowId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
function defaultLanguages(): LanguageRow[] {
  return [{ id: newRowId(), name: "English", proficiency: "" }]
}
function defaultAddress(): AddressForm {
  return { street: "", city: "", state: "", zip: "", country: "IN" }
}
export function createInitialOnboardingForm(): FreelancerOnboardingForm {
  return {
    experienceLevel: null,
    goals: [],
    workPreference: null,
    openToContractToHire: false,
    profileSetupMethod: null,
    workExperience: [],
    education: [],
    languages: defaultLanguages(),
    title: "",
    skills: [],
    bio: "",
    hourlyRate: "",
    avatarFile: null,
    avatarPreviewUrl: null,
    dob: "",
    address: defaultAddress(),
    phoneLocal: "",
    phoneCountryCode: "+91",
    phone: "",
    phone_verified: false,
    edu_email: "",
    edu_verified: false,
  }
}
