"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, Plus, X } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { AppNav } from "@/components/app/app-nav"

const TP = "#2563EB"
const TOTAL_STEPS = 3

const CATEGORIES = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Writing & Translation",
  "Admin & Customer Support",
  "Finance & Accounting",
  "Legal",
  "Engineering & Architecture",
  "Other",
]

const DURATIONS = [
  "Less than 1 month",
  "1-3 months",
  "3-6 months",
  "More than 6 months",
  "Ongoing",
]

const SUGGESTED_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "PHP",
  "UI/UX Design", "Graphic Design", "Figma", "Adobe Photoshop",
  "Digital Marketing", "SEO", "Content Writing", "Copywriting",
  "Data Entry", "Virtual Assistant", "Customer Service",
  "Accounting", "Bookkeeping", "Financial Analysis",
]

type JobForm = {
  title: string
  description: string
  skills: string[]
  category: string
  job_type: "hourly" | "fixed"
  budget_min: string
  budget_max: string
  duration: string
  level: "entry" | "intermediate" | "expert"
}

function stepTitle(step: number): string {
  if (step === TOTAL_STEPS + 1) return "Review"
  return `Step ${step} of ${TOTAL_STEPS}`
}

export default function PostJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [improving, setImproving] = useState(false)
  const [form, setForm] = useState<JobForm>({
    title: "",
    description: "",
    skills: [],
    category: "",
    job_type: "hourly",
    budget_min: "",
    budget_max: "",
    duration: "",
    level: "intermediate",
  })
  const [skillInput, setSkillInput] = useState("")

  const progressPct = step >= TOTAL_STEPS + 1 ? 100 : (step / TOTAL_STEPS) * 100

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (!trimmed || form.skills.includes(trimmed)) return
    setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }))
    setSkillInput("")
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  async function handleImproveDescription() {
    if (!form.title || !form.description) {
      toast.error("Please enter a title and description first.")
      return
    }

    setImproving(true)
    try {
      const response = await fetch("/api/improve-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, description: form.description }),
      })

      if (!response.ok) {
        throw new Error("Failed to improve description")
      }

      const data = await response.json()
      setForm((f) => ({ ...f, title: data.title, description: data.description }))
      toast.success("Description improved!")
    } catch (err) {
      toast.error("Could not improve description. Please try again.")
    } finally {
      setImproving(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      
      if (userErr || !user) {
        toast.error("You need to be signed in to post a job.")
        router.push("/login?next=/post-job")
        return
      }

      const { error } = await supabase.from("jobs").insert({
        client_id: user.id,
        title: form.title,
        description: form.description,
        skills: form.skills,
        category: form.category,
        job_type: form.job_type,
        budget_min: form.budget_min ? Number.parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? Number.parseFloat(form.budget_max) : null,
        duration: form.duration,
        level: form.level,
        status: "open",
      })

      if (error) {
        toast.error(error.message || "Could not post job.")
        return
      }

      toast.success("Job posted successfully!")
      router.push("/dashboard/client")
      router.refresh()
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Tell us about your job</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with a clear title and detailed description to attract the right talent.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior React Developer for E-commerce Platform"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Job description</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImproveDescription}
                    disabled={improving}
                    className="gap-2"
                  >
                    <Sparkles className="size-4" />
                    {improving ? "Improving..." : "Improve with AI"}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the project, responsibilities, requirements, and what you're looking for in a freelancer..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={8}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Job details</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Add skills, category, budget, and other details to help freelancers understand your needs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 p-3 min-h-[48px]">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-primary/60 hover:text-primary"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  {form.skills.length === 0 && (
                    <span className="text-sm text-muted-foreground">Add relevant skills…</span>
                  )}
                </div>
                <Input
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="h-12"
                />
                {skillInput && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTED_SKILLS
                      .filter((s) => !form.skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase()))
                      .slice(0, 8)
                      .map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:bg-muted"
                        >
                          + {s}
                        </button>
                      ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <p className="w-full text-xs text-muted-foreground">Suggestions:</p>
                  {SUGGESTED_SKILLS.filter((s) => !form.skills.includes(s)).slice(0, 10).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:bg-muted"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Project type</Label>
                <Select value={form.job_type} onValueChange={(v: "hourly" | "fixed") => setForm((f) => ({ ...f, job_type: v }))}>
                  <SelectTrigger id="job_type" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="fixed">Fixed price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Minimum budget</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    placeholder="0"
                    value={form.budget_min}
                    onChange={(e) => setForm((f) => ({ ...f, budget_min: e.target.value }))}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Maximum budget</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    placeholder="0"
                    value={form.budget_max}
                    onChange={(e) => setForm((f) => ({ ...f, budget_max: e.target.value }))}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Project duration</Label>
                <Select value={form.duration} onValueChange={(v) => setForm((f) => ({ ...f, duration: v }))}>
                  <SelectTrigger id="duration" className="h-12">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Experience level</Label>
                <Select value={form.level} onValueChange={(v: "entry" | "intermediate" | "expert") => setForm((f) => ({ ...f, level: v }))}>
                  <SelectTrigger id="level" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Review your job</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Review the details below before posting your job.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div>
                <h2 className="text-lg font-semibold">{form.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{form.description}</p>
              </div>

              <div className="grid gap-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm font-medium">{form.category || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project type</span>
                  <span className="text-sm font-medium capitalize">{form.job_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <span className="text-sm font-medium">
                    {form.budget_min || form.budget_max 
                      ? `${form.budget_min || "$0"} - ${form.budget_max || "$0"}`
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{form.duration || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Experience level</span>
                  <span className="text-sm font-medium capitalize">{form.level}</span>
                </div>
              </div>

              {form.skills.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  function canAdvance() {
    if (step === 1) {
      return form.title.trim().length > 0 && form.description.trim().length > 0
    }
    if (step === 2) {
      return form.category.length > 0
    }
    return true
  }

  function primaryLabel(): string {
    if (step === 1) return "Next: Job details"
    if (step === 2) return "Next: Review"
    if (step === 3) return "Post Job"
    return "Continue"
  }

  function onPrimary() {
    if (step === 3) {
      handleSubmit()
      return
    }
    if (canAdvance()) {
      setStep((s) => s + 1)
    } else {
      toast.error("Please complete the required fields.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <AppNav />
      
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={() => step > 1 ? setStep((s) => s - 1) : router.back()}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Progress value={progressPct} className="h-2 flex-1 bg-[#2563EB]/15 [&>[data-slot=progress-indicator]]:bg-[#2563EB]" />
            <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
              {step}/{TOTAL_STEPS}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-muted-foreground">{stepTitle(step)}</p>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={onPrimary}
            disabled={submitting || improving}
            className="min-w-[200px] rounded-full px-8 font-semibold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: TP }}
          >
            {submitting ? "Posting..." : primaryLabel()}
          </Button>
        </div>
      </main>
    </div>
  )
}
