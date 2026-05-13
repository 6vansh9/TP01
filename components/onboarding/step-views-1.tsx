"use client"

import { useState } from "react"
import {
  Briefcase,
  GraduationCap,
  Linkedin,
  Rocket,
  Sparkles,
  Target,
  Upload,
  UserPen,
  Wrench,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { MOTIVATION_QUOTE } from "@/lib/onboarding/constants"
import { newRowId } from "@/lib/onboarding/initial-form"
import type {
  ExperienceLevel,
  FreelancerGoalId,
  FreelancerOnboardingForm,
  ProfileSetupMethod,
  WorkPreferenceId,
} from "@/lib/onboarding/types"
import { GOAL_LABELS } from "@/lib/onboarding/types"

const TP = "#2563EB"

type SetForm = React.Dispatch<React.SetStateAction<FreelancerOnboardingForm>>

export function StepExperienceLevel({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const options: { id: ExperienceLevel; title: string; subtitle: string; icon: typeof Sparkles }[] = [
    { id: "new", title: "I am brand new to this", subtitle: "I am looking for my first freelance projects and want to build my reputation.", icon: Sparkles },
    { id: "some", title: "I have some experience", subtitle: "I have completed a few projects and want to grow my client base.", icon: Wrench },
    { id: "expert", title: "I am an expert", subtitle: "I have deep experience and want premium clients and challenging work.", icon: Rocket },
  ]
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-balance text-center font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">How would you describe your freelance experience?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">This helps us personalize job recommendations. You can update it later.</p>
      <div className="mt-10 flex flex-col gap-4">
        {options.map((opt) => {
          const selected = form.experienceLevel === opt.id
          const Icon = opt.icon
          return (
            <button key={opt.id!} type="button" onClick={() => setForm((f) => ({ ...f, experienceLevel: opt.id }))}
              className={cn("flex w-full gap-5 rounded-2xl border-2 bg-card p-6 text-left shadow-sm transition-all hover:shadow-md md:gap-6 md:p-8", selected ? "ring-2 ring-offset-2 ring-offset-background" : "border-border hover:border-muted-foreground/30")}
              style={selected ? { borderColor: TP } : undefined}>
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl md:size-20" style={{ background: `linear-gradient(135deg, ${TP}22, ${TP}08)`, color: TP }}>
                <Icon className="size-8 md:size-10" strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold md:text-xl">{opt.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{opt.subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const GOAL_ICONS: Record<FreelancerGoalId, typeof Target> = {
  main_income: Briefcase,
  side_income: Sparkles,
  experience_ft: GraduationCap,
  no_goal: Target,
}

export function StepGoals({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const ids = Object.keys(GOAL_LABELS) as FreelancerGoalId[]
  function toggle(id: FreelancerGoalId) {
    setForm((f) => {
      const has = f.goals.includes(id)
      return { ...f, goals: has ? f.goals.filter((g) => g !== id) : [...f.goals, id] }
    })
  }
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-balance text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">What is your main goal on TaskPay?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Select all that apply.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ids.map((id) => {
          const selected = form.goals.includes(id)
          const Icon = GOAL_ICONS[id]
          return (
            <button key={id} type="button" onClick={() => toggle(id)}
              className={cn("flex min-h-[140px] flex-col gap-4 rounded-2xl border-2 bg-card p-6 text-left shadow-sm transition-all hover:shadow-md", selected ? "ring-2 ring-offset-2 ring-offset-background" : "border-border hover:border-muted-foreground/30")}
              style={selected ? { borderColor: TP } : undefined}>
              <div className="flex size-14 items-center justify-center rounded-xl" style={{ background: `linear-gradient(135deg, ${TP}22, ${TP}08)`, color: TP }}>
                <Icon className="size-7" strokeWidth={1.25} />
              </div>
              <p className="font-medium leading-snug">{GOAL_LABELS[id]}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function StepWorkPreference({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const opts: { id: WorkPreferenceId; title: string; subtitle: string; icon: typeof Briefcase }[] = [
    { id: "find_self", title: "I'd like to find opportunities myself", subtitle: "Browse jobs, send proposals, and negotiate with clients.", icon: Briefcase },
    { id: "package_work", title: "I'd like to package up my work for clients to buy", subtitle: "Productized services and repeatable offers (coming soon).", icon: Target },
  ]
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-balance text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">How do you prefer to work?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Choose the option that fits you best today.</p>
      <div className="mt-10 flex flex-col gap-4">
        {opts.map((opt) => {
          const selected = form.workPreference === opt.id
          const Icon = opt.icon
          return (
            <button key={opt.id!} type="button" onClick={() => setForm((f) => ({ ...f, workPreference: opt.id }))}
              className={cn("flex w-full gap-5 rounded-2xl border-2 bg-card p-6 text-left shadow-sm transition-all md:gap-6 md:p-8", selected ? "ring-2 ring-offset-2 ring-offset-background" : "border-border hover:border-muted-foreground/30")}
              style={selected ? { borderColor: TP } : undefined}>
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl md:size-20" style={{ background: `linear-gradient(135deg, ${TP}22, ${TP}08)`, color: TP }}>
                <Icon className="size-8 md:size-10" strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold md:text-xl">{opt.title}</p>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">{opt.subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <Checkbox id="cth" checked={form.openToContractToHire} onCheckedChange={(v) => setForm((f) => ({ ...f, openToContractToHire: v === true }))} />
        <Label htmlFor="cth" className="cursor-pointer text-sm leading-relaxed font-normal">I&apos;m open to contract-to-hire opportunities</Label>
      </div>
    </div>
  )
}

export function StepProfileMethod({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const [linkedinText, setLinkedinText] = useState("")
  const [parsing, setParsing] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const methods: { id: ProfileSetupMethod; label: string; icon: typeof Linkedin }[] = [
    { id: "linkedin", label: "Import from LinkedIn", icon: Linkedin },
    { id: "resume", label: "Upload your resume (PDF)", icon: Upload },
    { id: "manual", label: "Fill out manually (15 min)", icon: UserPen },
  ]

  async function parseLinkedIn() {
    if (!linkedinText.trim()) { toast.error("Paste your LinkedIn text first"); return }
    setParsing(true)
    try {
      const res = await fetch("/api/parse-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "linkedin", text: linkedinText })
      })
      const json = await res.json()
      if (!json.success) { toast.error("Could not parse — try again"); return }
      const d = json.data
      setForm((f) => ({
        ...f,
        title: d.title ?? f.title,
        bio: d.bio ?? f.bio,
        skills: d.skills?.length ? d.skills : f.skills,
      }))
      toast.success("Profile imported! Review and edit in the next steps.")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setParsing(false)
    }
  }

  async function parseResume(file: File) {
    setParsing(true)
    try {
      const text = await extractTextFromPDF(file)
      const res = await fetch("/api/parse-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "resume", text })
      })
      const json = await res.json()
      if (!json.success) { toast.error("Could not parse resume — try again"); return }
      const d = json.data
      setForm((f) => ({
        ...f,
        title: d.title ?? f.title,
        bio: d.bio ?? f.bio,
        skills: d.skills?.length ? d.skills : f.skills,
        workExperience: d.work_experience?.map((w: { company: string; title: string; startDate: string; endDate: string; description: string }) => ({ ...w, id: newRowId() })) ?? f.workExperience,
        education: d.education?.map((e: { school: string; degree: string; field: string; startDate: string; endDate: string }) => ({ ...e, id: newRowId() })) ?? f.education,
      }))
      toast.success(`Resume parsed! Found ${d.skills?.length ?? 0} skills, ${d.work_experience?.length ?? 0} jobs, ${d.education?.length ?? 0} education entries.`)
    } catch {
      toast.error("Failed to read resume")
    } finally {
      setParsing(false)
    }
  }

  async function extractTextFromPDF(file: File): Promise<string> {
    // Simple text extraction — read as text
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text ?? "")
      }
      reader.readAsText(file)
    })
  }

  function onResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return }
    setResumeFile(file)
    parseResume(file)
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">How would you like to build your profile?</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Choose a method — AI will auto-fill your details.</p>
        <div className="mt-8 flex flex-col gap-3">
          {methods.map((m) => {
            const selected = form.profileSetupMethod === m.id
            const Icon = m.icon
            return (
              <button key={m.id!} type="button"
                onClick={() => setForm((f) => ({ ...f, profileSetupMethod: m.id }))}
                className={cn("flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left font-medium transition-all", selected ? "bg-muted/40" : "border-border bg-card hover:bg-muted/30")}
                style={selected ? { borderColor: TP, color: TP } : { borderColor: "var(--border)" }}>
                <Icon className="size-5 shrink-0" />
                {m.label}
              </button>
            )
          })}
        </div>

        {/* LinkedIn input */}
        {form.profileSetupMethod === "linkedin" && (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Go to your LinkedIn profile → click <strong>About</strong> section → copy all the text and paste below.
            </p>
            <Textarea
              rows={6}
              placeholder="Paste your LinkedIn About / Summary section here..."
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
            />
            <Button
              type="button"
              onClick={parseLinkedIn}
              disabled={parsing || !linkedinText.trim()}
              style={{ backgroundColor: TP }}
              className="w-fit rounded-full text-white hover:opacity-90"
            >
              {parsing ? "Parsing..." : "✨ Auto-fill with AI"}
            </Button>
          </div>
        )}

        {/* Resume upload */}
        {form.profileSetupMethod === "resume" && (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Upload your resume PDF — AI will extract your title, skills, work history and education.</p>
            <Label className="cursor-pointer">
              <div className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors",
                resumeFile ? "border-emerald-500 bg-emerald-50/10" : "border-border hover:border-primary/50"
              )}>
                <Upload className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {parsing ? "Parsing resume..." : resumeFile ? `✅ ${resumeFile.name}` : "Click to upload PDF (max 5MB)"}
                </p>
              </div>
              <input type="file" accept=".pdf" className="hidden" onChange={onResumeChange} />
            </Label>
          </div>
        )}

        {form.profileSetupMethod === "manual" && (
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            You'll fill in your title, skills, bio, work history and education in the next steps.
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-border bg-gradient-to-br from-[#2563EB]/10 to-transparent p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: TP }}>Keep going</p>
        <blockquote className="mt-4 font-display text-xl font-medium leading-snug text-foreground">&ldquo;{MOTIVATION_QUOTE.text}&rdquo;</blockquote>
        <p className="mt-4 text-sm text-muted-foreground">— {MOTIVATION_QUOTE.author}</p>
      </aside>
    </div>
  )
}
