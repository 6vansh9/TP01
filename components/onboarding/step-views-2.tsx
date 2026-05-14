"use client"
import { createBrowserClient } from "@supabase/ssr"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Calendar, Plus, Star, Trash2 } from "lucide-react"
import Cropper, { type Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { COUNTRY_OPTIONS, PHONE_PREFIXES } from "@/lib/onboarding/constants"
import { getCroppedImageBlob } from "@/lib/onboarding/crop-image"
import { newRowId } from "@/lib/onboarding/initial-form"
import type {
  EducationEntry,
  FreelancerOnboardingForm,
  WorkExperienceEntry,
  SUGGESTED_SKILLS,
} from "@/lib/onboarding/types"
import { GOAL_LABELS, PROFICIENCY_OPTIONS, SUGGESTED_SKILLS,
} from "@/lib/onboarding/types"
import {
  experienceLevelLabel,
  profileMethodLabel,
  workPreferenceLabel,
} from "@/lib/onboarding/display-labels"

const TP = "#2563EB"

type SetForm = React.Dispatch<React.SetStateAction<FreelancerOnboardingForm>>

export type ProfilePreviewSeed = {
  full_name: string | null
  avatar_url: string | null
  rating: number | null
  review_count: number | null
  jobs_completed: number | null
  hourly_rate: number | null
}

function ProfilePreviewCard({
  preview,
  form,
  step,
}: {
  preview: ProfilePreviewSeed
  form: FreelancerOnboardingForm
  step: number
}) {
  const displayRate = useMemo(() => {
    if (step >= 9 && form.hourlyRate) {
      const n = Number.parseFloat(form.hourlyRate)
      if (Number.isFinite(n)) return `₹${n.toLocaleString("en-IN")}/hr`
    }
    if (preview.hourly_rate != null) return `₹${Number(preview.hourly_rate).toLocaleString("en-IN")}/hr`
    return "Set your rate"
  }, [form.hourlyRate, preview.hourly_rate, step])

  const avatarSrc = form.avatarPreviewUrl || preview.avatar_url
  const name = preview.full_name || "Your name"
  const rating = preview.rating ?? 0
  const reviews = preview.review_count ?? 0
  const jobs = preview.jobs_completed ?? 0

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client preview</p>
      <div className="mt-4 flex gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
          {avatarSrc ? (
            <Image src={avatarSrc} alt="" fill className="object-cover" sizes="64px" unoptimized />
          ) : (
            <div className="flex size-full items-center justify-center text-lg font-semibold text-muted-foreground">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {rating > 0 ? rating.toFixed(1) : "New"}
            </span>
            <span>·</span>
            <span>{reviews} reviews</span>
            <span>·</span>
            <span>{jobs} jobs</span>
          </div>
          <p className="mt-2 text-sm font-medium" style={{ color: TP }}>
            {displayRate}
          </p>
        </div>
      </div>
      <div className="mt-4 max-h-[220px] overflow-y-auto rounded-lg border border-border bg-muted/20 p-3 text-sm leading-relaxed text-foreground/90">
        {form.bio.trim() ? form.bio : <span className="text-muted-foreground">Your overview will appear here…</span>}
      </div>
    </div>
  )
}

export function StepWorkExperience({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<WorkExperienceEntry>>({})

  function save() {
    if (!draft.company?.trim() || !draft.title?.trim()) return
    const entry: WorkExperienceEntry = {
      id: newRowId(),
      company: draft.company!.trim(),
      title: draft.title!.trim(),
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
      description: draft.description || "",
    }
    setForm((f) => ({ ...f, workExperience: [...f.workExperience, entry] }))
    setDraft({})
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">Add your work experience</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Stand out with relevant roles — you can edit later.</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-10 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/[0.04] py-14 text-center transition-colors hover:bg-emerald-500/[0.08]"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <Plus className="size-7" strokeWidth={2.5} />
        </div>
        <span className="text-base font-semibold text-emerald-800 dark:text-emerald-200">Add experience</span>
      </button>
      {form.workExperience.length > 0 && (
        <ul className="mt-6 space-y-3">
          {form.workExperience.map((w) => (
            <li key={w.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-semibold">{w.title}</p>
                <p className="text-sm text-muted-foreground">{w.company}</p>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
                onClick={() => setForm((f) => ({ ...f, workExperience: f.workExperience.filter((x) => x.id !== w.id) }))}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add experience</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label>Company</Label>
              <Input value={draft.company || ""} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={draft.title || ""} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label>Start</Label>
                <Input type="month" value={draft.startDate || ""} onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>End</Label>
                <Input type="month" value={draft.endDate || ""} onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea rows={3} value={draft.description || ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} style={{ backgroundColor: TP }} className="text-white hover:opacity-90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function StepEducation({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<EducationEntry>>({})

  function save() {
    if (!draft.school?.trim() || !draft.degree?.trim()) return
    const entry: EducationEntry = {
      id: newRowId(),
      school: draft.school!.trim(),
      degree: draft.degree!.trim(),
      field: draft.field || "",
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
    }
    setForm((f) => ({ ...f, education: [...f.education, entry] }))
    setDraft({})
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">Add your education</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Clients trust profiles that show your background.</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-10 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/[0.04] py-14 text-center transition-colors hover:bg-emerald-500/[0.08]"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <Plus className="size-7" strokeWidth={2.5} />
        </div>
        <span className="text-base font-semibold text-emerald-800 dark:text-emerald-200">Add education</span>
      </button>
      {form.education.length > 0 && (
        <ul className="mt-6 space-y-3">
          {form.education.map((ed) => (
            <li key={ed.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-semibold">{ed.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {ed.school}
                  {ed.field ? ` · ${ed.field}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
                onClick={() => setForm((f) => ({ ...f, education: f.education.filter((x) => x.id !== ed.id) }))}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add education</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label>School</Label>
              <Input value={draft.school || ""} onChange={(e) => setDraft((d) => ({ ...d, school: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Degree</Label>
              <Input value={draft.degree || ""} onChange={(e) => setDraft((d) => ({ ...d, degree: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Field of study</Label>
              <Input value={draft.field || ""} onChange={(e) => setDraft((d) => ({ ...d, field: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label>Start</Label>
                <Input type="month" value={draft.startDate || ""} onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>End</Label>
                <Input type="month" value={draft.endDate || ""} onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} style={{ backgroundColor: TP }} className="text-white hover:opacity-90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function StepLanguages({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  function updateRow(id: string, patch: Partial<(typeof form.languages)[0]>) {
    setForm((f) => ({
      ...f,
      languages: f.languages.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }))
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">What languages do you speak?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">English is included by default.</p>
      <div className="mt-10 space-y-6">
        {form.languages.map((row) => (
          <div key={row.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 gap-2">
                <Label>Language</Label>
                <Input value={row.name} onChange={(e) => updateRow(row.id, { name: e.target.value })} />
              </div>
              <div className="grid flex-[1.4] gap-2">
                <Label>My level is</Label>
                <Select value={row.proficiency} onValueChange={(v) => updateRow(row.id, { proficiency: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.languages.length > 1 && row.name !== "English" && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive"
                onClick={() => setForm((f) => ({ ...f, languages: f.languages.filter((l) => l.id !== row.id) }))}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setForm((f) => ({ ...f, languages: [...f.languages, { id: newRowId(), name: "", proficiency: "" }] }))}
        >
          + Add a language
        </Button>
      </div>
    </div>
  )
}

export function StepBioOverview({
  form,
  setForm,
  preview,
  step,
}: {
  form: FreelancerOnboardingForm
  setForm: SetForm
  preview: ProfilePreviewSeed
  step: number
}) {
  const len = form.bio.trim().length
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">Write an overview of your expertise</h1>
        <p className="mt-2 text-sm text-muted-foreground">Minimum 100 characters. Clients read this first.</p>
        <Textarea
          className="mt-6 min-h-[220px] text-base"
          placeholder="Highlight your strengths, industries, tools, and the outcomes you deliver…"
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
        />
        <p className={cn("mt-2 text-sm", len >= 100 ? "text-emerald-600" : "text-muted-foreground")}>
          {len} / 100 minimum
        </p>
      </div>
      <ProfilePreviewCard preview={preview} form={form} step={step} />
    </div>
  )
}

export function StepHourlyRate({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const rate = Number.parseFloat(form.hourlyRate)
  const valid = Number.isFinite(rate) && rate > 0
  const fee = valid ? rate * 0.1 : 0
  const youGet = valid ? rate - fee : 0

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">Set your hourly rate</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">You can change this anytime. Shown to clients in INR.</p>
      <div className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-2">
          <Label>Hourly rate</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              className="pl-8"
              inputMode="decimal"
              placeholder="800"
              value={form.hourlyRate}
              onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value.replace(/[^\d.]/g, "") }))}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/hr</span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label className="text-muted-foreground">Service fee (10%)</Label>
          <Input className="bg-muted text-muted-foreground" readOnly value={valid ? `₹${fee.toFixed(2)}` : "—"} />
        </div>
        <div className="grid gap-2">
          <Label className="text-muted-foreground">You&apos;ll get</Label>
          <Input className="bg-muted font-medium text-foreground" readOnly value={valid ? `₹${youGet.toFixed(2)}/hr` : "—"} />
        </div>
      </div>
    </div>
  )
}

type CropModalProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  imageSrc: string
  onComplete: (file: File, previewUrl: string) => void
}

export function AvatarCropModal({ open, onOpenChange, imageSrc, onComplete }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setZoom(1)
      setCrop({ x: 0, y: 0 })
      setCroppedAreaPixels(null)
    }
  }, [open, imageSrc])

  async function apply() {
    if (!croppedAreaPixels) return
    if (croppedAreaPixels.width < 250 || croppedAreaPixels.height < 250) {
      alert("Crop area must be at least 250×250 pixels. Zoom out to include more of the image.")
      return
    }
    setBusy(true)
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, "image/webp")
      const file = new File([blob], "avatar.webp", { type: "image/webp" })
      const previewUrl = URL.createObjectURL(blob)
      onComplete(file, previewUrl)
      onOpenChange(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Adjust your photo</DialogTitle>
        </DialogHeader>
        <div className="relative h-[280px] w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>
        <div className="space-y-2 border-t border-border px-6 py-4">
          <Label className="text-xs">Zoom</Label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={busy} onClick={apply} style={{ backgroundColor: TP }} className="text-white hover:opacity-90">
            {busy ? "Saving…" : "Use photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function StepPhotoLocation({
  form,
  setForm,
}: {
  form: FreelancerOnboardingForm
  setForm: SetForm
}) {
  const [cropOpen, setCropOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("Max file size is 5 MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new window.Image()
      img.onload = () => {
        if (img.naturalWidth < 250 || img.naturalHeight < 250) {
          alert("Image must be at least 250×250 pixels.")
          return
        }
        setCropSrc(src)
        setCropOpen(true)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function onCropped(file: File, previewUrl: string) {
    if (form.avatarPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.avatarPreviewUrl)
    setForm((f) => ({ ...f, avatarFile: file, avatarPreviewUrl: previewUrl }))
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">Photo & location</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Clients hire people they trust. Add a clear headshot.</p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="relative size-32 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
          {form.avatarPreviewUrl ? (
            <Image src={form.avatarPreviewUrl} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">No photo</div>
          )}
        </div>
        <Label className="cursor-pointer">
          <span
            className="inline-flex rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: TP }}
          >
            Upload photo
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPickFile} />
        </Label>
        <p className="text-center text-xs text-muted-foreground">250×250 min · 5 MB max · JPG, PNG, or WebP</p>
      </div>
      {cropSrc && (
        <AvatarCropModal
          open={cropOpen}
          onOpenChange={(v) => {
            setCropOpen(v)
            if (!v) setCropSrc(null)
          }}
          imageSrc={cropSrc}
          onComplete={onCropped}
        />
      )}

      <div className="mt-10 space-y-4">
        <div className="grid gap-2">
          <Label>Date of birth</Label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Country</Label>
          <Select value={form.address.country} onValueChange={(v) => setForm((f) => ({ ...f, address: { ...f.address, country: v } }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Street address</Label>
          <Input value={form.address.street} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>City</Label>
            <Input value={form.address.city} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
          </div>
          <div className="grid gap-2">
            <Label>State / Region</Label>
            <Input value={form.address.state} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>ZIP / Postal code</Label>
          <Input value={form.address.zip} onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, zip: e.target.value } }))} />
        </div>
        <div className="grid gap-2">
          <Label>Phone</Label>
          <div className="flex gap-2">
            <Select
              value={form.phoneCountryCode}
              onValueChange={(v) => setForm((f) => ({ ...f, phoneCountryCode: v }))}
            >
              <SelectTrigger className="w-[120px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHONE_PREFIXES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              placeholder="9876543210"
              inputMode="numeric"
              value={form.phoneLocal}
              onChange={(e) => setForm((f) => ({ ...f, phoneLocal: e.target.value.replace(/[^\d]/g, "") }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function StepReviewSummary({
  form,
  preview,
}: {
  form: FreelancerOnboardingForm
  preview: ProfilePreviewSeed
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">Review your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Make sure everything looks right before you go live.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Experience</dt>
            <dd className="text-right font-medium">{experienceLevelLabel(form.experienceLevel)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Goals</dt>
            <dd className="max-w-[60%] text-right font-medium">
              {form.goals.map((g) => GOAL_LABELS[g]).join(", ")}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Work style</dt>
            <dd className="text-right font-medium">{workPreferenceLabel(form.workPreference)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Contract-to-hire</dt>
            <dd className="text-right font-medium">{form.openToContractToHire ? "Yes" : "No"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Profile method</dt>
            <dd className="text-right font-medium">{profileMethodLabel(form.profileSetupMethod)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Work history</dt>
            <dd className="text-right font-medium">{form.workExperience.length} entries</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Education</dt>
            <dd className="text-right font-medium">{form.education.length} entries</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Languages</dt>
            <dd className="text-right font-medium">{form.languages.map((l) => l.name).join(", ")}</dd>
          </div>
          <div className="border-b border-border pb-3">
            <dt className="text-muted-foreground">Overview</dt>
            <dd className="mt-2 whitespace-pre-wrap break-words text-foreground/90">{form.bio}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Hourly rate</dt>
            <dd className="text-right font-medium">₹{form.hourlyRate}/hr</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Location</dt>
            <dd className="max-w-[60%] text-right font-medium">
              {[form.address.city, form.address.state, form.address.country].filter(Boolean).join(", ")}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="text-right font-medium">
              {form.phoneCountryCode} {form.phoneLocal}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Date of birth</dt>
            <dd className="text-right font-medium">{form.dob}</dd>
          </div>
        </dl>
      </div>
      <ProfilePreviewCard preview={preview} form={form} step={11} />
    </div>
  )
}

export function StepTitleSkills({ form, setForm }: { form: FreelancerOnboardingForm; setForm: SetForm }) {
  const [input, setInput] = useState("")

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (!trimmed || form.skills.includes(trimmed)) return
    setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }))
    setInput("")
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(input)
    }
  }

  const suggestions = SUGGESTED_SKILLS.filter(
    (s) => !form.skills.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 8)

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-center font-display text-2xl font-semibold md:text-3xl">
        Add your title & skills
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Your title is the first thing clients see. Skills help you get found.
      </p>

      <div className="mt-10 space-y-6">
        <div className="grid gap-2">
          <Label>Professional title</Label>
          <Input
            placeholder="e.g. Full-Stack Developer | React & Node.js"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">Keep it specific — "React Developer" beats "Software Engineer"</p>
        </div>

        <div className="grid gap-2">
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
                  ×
                </button>
              </span>
            ))}
            {form.skills.length === 0 && (
              <span className="text-sm text-muted-foreground">Add at least 3 skills…</span>
            )}
          </div>
          <Input
            placeholder="Type a skill and press Enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12"
          />
          {input && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
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
      </div>
    </div>
  )
}

// ─── Step: Phone Verification ───────────────────────────────────────────────
export function StepPhoneVerification({
  form, setForm,
}: {
  form: FreelancerOnboardingForm
  setForm: React.Dispatch<React.SetStateAction<FreelancerOnboardingForm>>
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const existingPhone = `${form.phoneCountryCode}${form.phoneLocal}`.replace(/\s+/g, "")
  const [phone, setPhone] = useState(form.phone || existingPhone || "")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(form.phone_verified ?? false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const hasPhone = phone.length > 7

  useEffect(() => {
    if (hasPhone && !sent && !verified) {
      // Auto-send OTP on mount if phone already known
      const autoSend = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ phone })
        setLoading(false)
        if (error) { setError(error.message); return }
        setSent(true)
      }
      autoSend()
    }
  }, [])

  // Auto-send OTP if phone already collected from step 11
  useEffect(() => {
    if (hasPhone && !sent && !verified) {
      sendOtp()
    }
  }, [])

  async function sendOtp() {
    setError("")
    if (!phone.match(/^\+[1-9]\d{7,14}$/)) {
      setError("Enter a valid phone number with country code e.g. +91XXXXXXXXXX")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  async function verifyOtp() {
    setError("")
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" })
    setLoading(false)
    if (error) { setError(error.message); return }
    setVerified(true)
    setForm(f => ({ ...f, phone, phone_verified: true }))
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#2563EB]">Verification</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight">Verify your phone number</h2>
      <p className="mt-3 text-muted-foreground">We'll send a one-time code to confirm your number.</p>

      {verified ? (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="size-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
          <div>
            <p className="font-semibold text-green-800">Phone verified!</p>
            <p className="text-sm text-green-600">{phone}</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {!hasPhone && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                disabled={sent}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-muted"
              />
            </div>
          )}
          {hasPhone && !sent && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">{phone}</span>
              <button onClick={() => setPhone("")} className="ml-auto text-xs text-muted-foreground hover:underline">Change</button>
            </div>
          )}
          {!sent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="8-digit code"
                  maxLength={8}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 6}
                  className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
                <button onClick={() => { setSent(false); setOtp("") }} className="text-sm text-muted-foreground hover:underline">
                  Change number
                </button>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  )
}

// ─── Step: .edu Verification ─────────────────────────────────────────────────
export function StepEduVerification({
  form, setForm,
}: {
  form: FreelancerOnboardingForm
  setForm: React.Dispatch<React.SetStateAction<FreelancerOnboardingForm>>
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [eduEmail, setEduEmail] = useState(form.edu_email ?? "")
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(form.edu_verified ?? false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [polling, setPolling] = useState(false)

  async function sendVerification() {
    setError("")
    if (!eduEmail.toLowerCase().endsWith(".edu")) {
      setError("Only .edu email addresses are accepted.")
      return
    }
    setLoading(true)
    // Save edu_email to profile immediately
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({ edu_email: eduEmail }).eq("id", user.id)
    }
    // Send OTP to edu email
    const { error } = await supabase.auth.signInWithOtp({
      email: eduEmail,
      options: { 
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/onboarding`,
      }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
    setForm(f => ({ ...f, edu_email: eduEmail }))
    // Magic link flow — user clicks link in email, callback marks edu_verified
  }

  const [eduOtp, setEduOtp] = useState("")

  async function verifyEduOtp() {
    setError("")
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email: eduEmail,
      token: eduOtp,
      type: "email"
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    // Mark edu_verified in profiles
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({ edu_verified: true, edu_email: eduEmail }).eq("id", user.id)
    }
    setVerified(true)
    setForm(f => ({ ...f, edu_email: eduEmail, edu_verified: true }))
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#2563EB]">Student Verification</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight">Verify your college email</h2>
      <p className="mt-3 text-muted-foreground">
        Use your college-issued <span className="font-semibold">.edu</span> email to earn a{" "}
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">🎓 Student Verified</span>{" "}
        badge on your profile.
      </p>

      {verified ? (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">🎓</div>
            <div>
              <p className="font-semibold text-blue-800">Student Verified!</p>
              <p className="text-sm text-blue-600">{eduEmail}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">The 🎓 Student Verified badge will appear on your public profile and proposals.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">College email address</label>
            <input
              type="email"
              value={eduEmail}
              onChange={e => setEduEmail(e.target.value)}
              placeholder="you@university.edu"
              disabled={sent}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-muted"
            />
          </div>
          {!sent ? (
            <button
              onClick={sendVerification}
              disabled={loading}
              className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Your verification code was sent to <strong>{eduEmail}</strong>. Check your inbox.</p>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Enter code</label>
                <input
                  type="text"
                  value={eduOtp}
                  onChange={e => setEduOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={verifyEduOtp}
                  disabled={loading || eduOtp.length < 6}
                  className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
                <button onClick={() => { setSent(false); setEduOtp("") }} className="text-sm text-muted-foreground hover:underline">
                  Change email
                </button>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={() => setForm(f => ({ ...f, edu_email: "", edu_verified: false }))}
            className="text-sm text-muted-foreground hover:underline"
          >
            Skip — I don't have a .edu email
          </button>
        </div>
      )}
    </div>
  )
}
