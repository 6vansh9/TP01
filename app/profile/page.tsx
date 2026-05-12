"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Pencil,
  MapPin,
  Share2,
  BadgeCheck,
  ChevronRight,
  Link2,
  Plus,
  X,
  Briefcase,
  Sparkles,
} from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function EditButton({ label }: { label: string }) {
  return (
    <button
      aria-label={label}
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/5"
    >
      <Pencil className="size-3.5" />
    </button>
  )
}

function AddButton({ label }: { label: string }) {
  return (
    <button
      aria-label={label}
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/5"
    >
      <Plus className="size-4" />
    </button>
  )
}

export default function ProfilePage() {
  const [portfolioTab, setPortfolioTab] = useState<"Published" | "Drafts">("Published")
  const [showUpgradeCard, setShowUpgradeCard] = useState(true)

  return (
    <div className="min-h-screen bg-muted/30">
      <AppNav />

      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-background">
          {/* Header */}
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:p-10">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <Image
                  src="/avatar-vansh.jpg"
                  alt="Vansh A."
                  width={120}
                  height={120}
                  className="size-24 rounded-full object-cover md:size-32"
                />
                <span className="absolute right-1 top-1 size-4 rounded-full bg-primary ring-4 ring-background" />
                <button
                  className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-primary/40 bg-background text-primary hover:bg-primary/5"
                  aria-label="Edit avatar"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Vansh A.</h1>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <BadgeCheck className="size-4" />
                    Verify your identity
                  </Link>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  Faridabad, India — 2:34 am local time
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
                  See public view
                </Button>
                <Button className="rounded-full">Profile settings</Button>
              </div>
              <button className="inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground md:self-end">
                Share
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-8 border-t border-border p-6 md:grid-cols-[320px_minmax(0,1fr)] md:gap-12 md:p-10">
            {/* Left rail */}
            <aside className="flex flex-col gap-6">
              {/* View profile */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">View profile</h2>
                  <EditButton label="Edit profile" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      Draft
                    </span>
                    <span className="text-sm font-medium">UX/UI Design</span>
                  </div>
                  <Link
                    href="#"
                    className="mt-2 flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm font-medium hover:bg-muted/70"
                  >
                    All work
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>

              {/* Upgrade card */}
              {showUpgradeCard && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-mint to-surface-mint/40 p-5">
                  <button
                    onClick={() => setShowUpgradeCard(false)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    aria-label="Dismiss"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-foreground" />
                    <h3 className="text-sm font-semibold">Upgrade to Freelancer Plus</h3>
                  </div>
                  <div className="mt-3 rounded-lg bg-background/70 p-3">
                    <p className="text-xs leading-relaxed">
                      Improve your chances of getting hired with proposal insights, profile customizations, and more
                      perks.
                    </p>
                    <Link
                      href="#"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Subscribe now →
                    </Link>
                  </div>
                </div>
              )}

              {/* Promote with ads */}
              <div>
                <h3 className="text-base font-semibold">Promote with ads</h3>
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Availability badge</p>
                      <p className="text-xs text-muted-foreground">Off</p>
                    </div>
                    <EditButton label="Edit availability" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Boost your profile</p>
                      <p className="text-xs text-muted-foreground">Off</p>
                    </div>
                    <EditButton label="Edit boost" />
                  </div>
                </div>
              </div>

              {/* Connects */}
              <div>
                <h3 className="text-base font-semibold">Connects: 0</h3>
                <Button
                  variant="outline"
                  className="mt-3 w-full rounded-full border-primary text-primary hover:bg-primary/5"
                >
                  Buy Connects
                </Button>
                <Link href="#" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                  View details
                </Link>
              </div>
            </aside>

            {/* Right column */}
            <div className="flex flex-col gap-10">
              {/* Title + rate */}
              <div className="flex items-start justify-between gap-4 border-b border-border pb-8">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-balance text-2xl font-semibold leading-tight md:text-3xl">
                      Other - Software Development | Node.js, Next.js, Computer Science
                    </h2>
                  </div>
                  <EditButton label="Edit title" />
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  <div className="text-right">
                    <p className="text-xl font-semibold md:text-2xl">$15.00/hr</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <EditButton label="Edit rate" />
                    <button
                      className="flex size-8 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/5"
                      aria-label="Copy link"
                    >
                      <Link2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex items-start justify-between gap-4 border-b border-border pb-8">
                <p className="flex-1 text-pretty text-sm leading-relaxed text-foreground/80 md:text-base">
                  I am a Computer Science student with a solid foundation in full-stack development and automation.
                  With hands-on experience building web features and optimizing applications using JavaScript and
                  Python, I focus on delivering innovative solutions. My expertise extends to React.js, Next.js, and
                  Node.js, which I am eager to leverage in the fintech space. In addition to my technical skills, I
                  hold multiple certifications from industry leaders, showcasing my commitment to continuous learning
                  and professional growth. If you seek a motivated developer who can blend creativity with technical
                  proficiency to enhance your project, I would love to connect and explore how I can bring…{" "}
                  <button className="font-semibold underline-offset-4 hover:underline">more</button>
                </p>
                <EditButton label="Edit bio" />
              </div>

              {/* Portfolio */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Portfolio</h2>
                  <AddButton label="Add portfolio item" />
                </div>
                <div className="mt-5 flex items-center gap-1 border-b border-border">
                  {(["Published", "Drafts"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPortfolioTab(t)}
                      className={cn(
                        "relative px-4 py-3 text-sm font-medium transition-colors",
                        portfolioTab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t}
                      {portfolioTab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
                    <Briefcase className="size-8 text-accent-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">Showcase your work</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Talent who add portfolios to their profile are 5x more likely to be invited to a job.
                  </p>
                  <Button className="mt-5 rounded-full">Add a portfolio</Button>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Skills</h2>
                  <EditButton label="Edit skills" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React.js",
                    "Next.js",
                    "Node.js",
                    "Python",
                    "Tailwind CSS",
                    "PostgreSQL",
                    "REST APIs",
                    "Web Development",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work history */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Work history</h2>
                </div>
                <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No work history yet</p>
                  <p className="mt-1 max-w-md text-xs text-muted-foreground">
                    Once you start working on Upwork, your completed jobs and reviews will appear here.
                  </p>
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Certifications</h2>
                  <AddButton label="Add certification" />
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-border p-5">
                    <div>
                      <h3 className="text-base font-semibold">Meta Front-End Developer Professional Certificate</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Issued by Meta · 2024</p>
                    </div>
                    <EditButton label="Edit certification" />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-border p-5">
                    <div>
                      <h3 className="text-base font-semibold">Google Data Analytics</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Issued by Google · 2023</p>
                    </div>
                    <EditButton label="Edit certification" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
