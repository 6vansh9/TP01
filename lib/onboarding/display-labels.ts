import type { ExperienceLevel, WorkPreferenceId } from "./types"

export function experienceLevelLabel(level: ExperienceLevel): string {
  if (level === "new") return "I am brand new to this"
  if (level === "some") return "I have some experience"
  if (level === "expert") return "I am an expert"
  return "—"
}

export function workPreferenceLabel(pref: WorkPreferenceId): string {
  if (pref === "find_self") return "I'd like to find opportunities myself"
  if (pref === "package_work") return "I'd like to package up my work for clients to buy"
  return "—"
}

export function profileMethodLabel(m: string | null): string {
  if (m === "linkedin") return "Import from LinkedIn"
  if (m === "resume") return "Upload your resume"
  if (m === "manual") return "Fill out manually (15 min)"
  return m || "—"
}
