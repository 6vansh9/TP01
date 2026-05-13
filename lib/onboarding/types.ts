export type ExperienceLevel = "new" | "some" | "expert" | null

export type FreelancerGoalId =
  | "main_income"
  | "side_income"
  | "experience_ft"
  | "no_goal"

export type WorkPreferenceId = "find_self" | "package_work" | null

export type ProfileSetupMethod = "linkedin" | "resume" | "manual" | null

export type WorkExperienceEntry = {
  id: string
  company: string
  title: string
  startDate: string
  endDate: string
  description: string
}

export type EducationEntry = {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export type LanguageRow = {
  id: string
  name: string
  proficiency: string
}

export type AddressForm = {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export type FreelancerOnboardingForm = {
  experienceLevel: ExperienceLevel
  goals: FreelancerGoalId[]
  workPreference: WorkPreferenceId
  openToContractToHire: boolean
  profileSetupMethod: ProfileSetupMethod
  workExperience: WorkExperienceEntry[]
  education: EducationEntry[]
  languages: LanguageRow[]
  bio: string
  hourlyRate: string
  avatarFile: File | null
  avatarPreviewUrl: string | null
  dob: string
  address: AddressForm
  phoneLocal: string
  phoneCountryCode: string
}

export const GOAL_LABELS: Record<FreelancerGoalId, string> = {
  main_income: "To earn my main income",
  side_income: "To make money on the side",
  experience_ft: "To get experience, for a full-time job",
  no_goal: "I don't have a goal in mind yet",
}

export const PROFICIENCY_OPTIONS = [
  { value: "basic", label: "Basic — I can chat if the other person speaks slowly" },
  { value: "conversational", label: "Conversational — I can discuss most everyday topics" },
  { value: "fluent", label: "Fluent — I can discuss complex topics and read professional material" },
  { value: "native", label: "Native or bilingual — I have complete command of this language" },
] as const
