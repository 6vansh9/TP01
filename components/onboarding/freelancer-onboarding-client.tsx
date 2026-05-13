"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UpworkLogo } from "@/components/upwork-logo"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { createInitialOnboardingForm } from "@/lib/onboarding/initial-form"
import { submitFreelancerOnboarding } from "@/lib/onboarding/submit-to-supabase"
import { canAdvanceFromStep } from "@/lib/onboarding/step-validation"
import type { FreelancerOnboardingForm } from "@/lib/onboarding/types"
import {
  StepExperienceLevel,
  StepGoals,
  StepProfileMethod,
  StepWorkPreference,
} from "@/components/onboarding/step-views-1"
import {
  StepBioOverview,
  StepEducation,
  StepHourlyRate,
  StepLanguages,
  StepPhotoLocation,
  StepReviewSummary,
  StepWorkExperience,
  type ProfilePreviewSeed,
} from "@/components/onboarding/step-views-2"

const TP = "#2563EB"

function stepTitle(step: number): string {
  if (step === 11) return "Review"
  return `Step ${step} of 10`
}

export function FreelancerOnboardingClient({ preview }: { preview: ProfilePreviewSeed }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FreelancerOnboardingForm>(createInitialOnboardingForm)
  const [submitting, setSubmitting] = useState(false)

  const progressPct = step >= 11 ? 100 : (step / 10) * 100

  const goForward = useCallback(() => {
    if (!canAdvanceFromStep(step, form)) {
      toast.error("Please complete this step before continuing.")
      return
    }
    setDir(1)
    setStep((s) => Math.min(11, s + 1))
  }, [step, form])

  const goBack = useCallback(() => {
    setDir(-1)
    setStep((s) => Math.max(1, s - 1))
  }, [])

  const skipStep = useCallback(() => {
    setDir(1)
    setStep((s) => Math.min(11, s + 1))
  }, [])

  async function handlePublish() {
    for (let s = 1; s <= 10; s++) {
      if (!canAdvanceFromStep(s, form)) {
        toast.error(`Please complete step ${s} before publishing.`)
        return
      }
    }
    setSubmitting(true)
    try {
      let supabase
      try {
        supabase = createSupabaseBrowserClient()
      } catch {
        toast.error("Missing Supabase environment variables.")
        return
      }
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()
      if (userErr || !user) {
        toast.error("You need to be signed in to publish your profile.")
        router.push("/login?next=/onboarding")
        return
      }
      const { error } = await submitFreelancerOnboarding(supabase, user.id, form)
      if (error) {
        toast.error(error.message || "Could not save profile. Check Supabase columns and RLS.")
        return
      }
      toast.success("Profile published!")
      router.push("/dashboard/freelancer")
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <StepExperienceLevel form={form} setForm={setForm} />
      case 2:
        return <StepGoals form={form} setForm={setForm} />
      case 3:
        return <StepWorkPreference form={form} setForm={setForm} />
      case 4:
        return <StepProfileMethod form={form} setForm={setForm} />
      case 5:
        return <StepWorkExperience form={form} setForm={setForm} />
      case 6:
        return <StepEducation form={form} setForm={setForm} />
      case 7:
        return <StepLanguages form={form} setForm={setForm} />
      case 8:
        return <StepBioOverview form={form} setForm={setForm} preview={preview} step={step} />
      case 9:
        return <StepHourlyRate form={form} setForm={setForm} />
      case 10:
        return <StepPhotoLocation form={form} setForm={setForm} />
      case 11:
        return <StepReviewSummary form={form} preview={preview} />
      default:
        return null
    }
  }

  function primaryLabel(): string {
    if (step === 5) return "Next, add your education"
    if (step === 6) return "Next, add skills"
    if (step === 7) return "Next, write an overview"
    if (step === 8) return "Next, set your rate"
    if (step === 9) return "Next, add your photo and location"
    if (step === 10) return "Review your profile"
    if (step === 11) return "Submit & Publish Profile"
    return "Continue"
  }

  function onPrimary() {
    if (step === 11) {
      void handlePublish()
      return
    }
    goForward()
  }

  return (
    <div className="taskpay-onboarding min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:h-16 md:px-8">
          <Link href="/" className="opacity-90 hover:opacity-100">
            <UpworkLogo />
          </Link>
          <span className="text-sm font-medium text-muted-foreground">{stepTitle(step)}</span>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 pb-3 md:px-8">
          <div className="flex items-center gap-3">
            <Progress value={progressPct} className="h-2 flex-1 bg-[#2563EB]/15 [&>[data-slot=progress-indicator]]:bg-[#2563EB]" />
            <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
              {Math.min(step, 10)}/10
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex items-center gap-3">
          {step > 1 && (
            <Button type="button" variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={goBack}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pb-32"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-end gap-3">
          {(step === 5 || step === 6) && (
            <Button type="button" variant="ghost" className="mr-auto text-muted-foreground" onClick={skipStep}>
              Skip for now
            </Button>
          )}
          <Button
            type="button"
            onClick={onPrimary}
            disabled={submitting}
            className="min-w-[200px] rounded-full px-8 font-semibold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: TP }}
          >
            {submitting ? "Publishing…" : primaryLabel()}
          </Button>
        </div>
      </footer>
    </div>
  )
}
