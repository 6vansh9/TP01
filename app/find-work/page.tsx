"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Pause } from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { JobCard, type Job } from "@/components/app/job-card"
import { FindWorkRail } from "@/components/app/find-work-rail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const jobs: Job[] = [
  {
    id: "1",
    title: "AI Powered Dashboard Feature – Full-Stack (React/Node.js)",
    postedAt: "6 minutes ago",
    proposals: "Less than 5",
    type: "Fixed-price",
    level: "Intermediate",
    budget: "$10",
    description:
      "We have a small internal dashboard (React + Node.js) displaying customer feedback. We need one AI-powered feature – budget $10 fixed. Task: Add a \"Summarize with AI\" button next to each feedback item. Clicking it calls a new Node.js endpoint that uses OpenAI GPT-3.5-turbo and returns a 1-sentence summary, shown below the feedback. Requirements: Frontend: React button + API call + display summary (no page reload).",
    skills: ["React", "Node.js", "MongoDB", "API", "JavaScript", "API Integration", "Web Application"],
    paymentVerified: true,
    rating: 5,
    spend: "$100+",
    country: "Pakistan",
  },
  {
    id: "2",
    title: "React Architect Senior Dev",
    postedAt: "yesterday",
    proposals: "20 to 50",
    type: "Hourly",
    level: "Expert",
    hourlyRange: "$3-$8",
    duration: "More than 6 months, 30+ hrs/week",
    description:
      "Looking for an experienced React Architect / Senior Frontend Developer to design and build a high-quality React application using modern technologies such as React 19, TypeScript, Next.js, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand/Redux Toolkit, React Hook Form, Zod, Storybook, and Playwright. The work will be done remotely. Need someone who can write clean, scalable code.",
    skills: ["React", "TypeScript", "Visualization"],
    paymentVerified: true,
    rating: 5,
    spend: "$100K+",
    country: "United States",
  },
  {
    id: "3",
    title: "React App OTP Issue Fix",
    postedAt: "yesterday",
    proposals: "10 to 15",
    type: "Fixed-price",
    level: "Intermediate",
    budget: "$10",
    description:
      "We are seeking a skilled freelancer to resolve an OTP issue in our React application. The task involves identifying and fixing the problem that prevents OTPs from being sent to users. The ideal candidate should have experience with React and authentication systems. This is a part-time project with a short duration, expected to be completed in less than a month.",
    skills: ["React", "Authentication", "JavaScript", "Node.js"],
    paymentVerified: true,
    rating: 4.9,
    spend: "$1K+",
    country: "Germany",
  },
  {
    id: "4",
    title: "Build a Next.js 16 landing page with shadcn/ui and Tailwind v4",
    postedAt: "2 hours ago",
    proposals: "5 to 10",
    type: "Fixed-price",
    level: "Intermediate",
    budget: "$250",
    description:
      "We need a polished marketing landing page for our SaaS product built with the latest Next.js (App Router), Tailwind CSS v4, and shadcn/ui components. Should include hero, features, pricing, testimonials, FAQ, and footer sections. Mobile-first responsive design is a must.",
    skills: ["Next.js", "Tailwind CSS", "shadcn/ui", "TypeScript", "Landing Page"],
    paymentVerified: true,
    rating: 4.8,
    spend: "$10K+",
    country: "Canada",
  },
  {
    id: "5",
    title: "Senior Backend Engineer – Node.js, PostgreSQL, AWS",
    postedAt: "3 hours ago",
    proposals: "Less than 5",
    type: "Hourly",
    level: "Expert",
    hourlyRange: "$40-$80",
    duration: "More than 6 months, 30+ hrs/week",
    description:
      "Series A startup looking for a senior backend engineer to lead our API platform. You'll work on scaling our Node.js services, designing schemas in PostgreSQL, and deploying to AWS using Terraform. Must have 5+ years of experience with distributed systems.",
    skills: ["Node.js", "PostgreSQL", "AWS", "TypeScript", "Terraform", "Docker"],
    paymentVerified: true,
    rating: 5,
    spend: "$50K+",
    country: "United Kingdom",
  },
]

const tabs = ["Best Matches", "Most Recent", "Saved Jobs"] as const

export default function FindWorkPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Best Matches")

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main feed */}
          <div className="min-w-0">
            {/* Promo banner */}
            <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 text-white md:p-10">
              <div className="max-w-md">
                <p className="text-sm font-medium uppercase tracking-wider text-primary">Freelancer Plus</p>
                <h2 className="mt-2 font-display text-2xl font-medium leading-tight md:text-3xl">
                  Get personalized insights and full access to powerful AI.
                </h2>
                <Button className="mt-6 rounded-full bg-primary px-6">Try it now</Button>
              </div>
              <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="flex size-32 items-center justify-center rounded-full bg-white/5">
                  <span className="text-5xl">💪</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                  <Pause className="size-3.5 fill-current" />
                </button>
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-white" />
                  <div className="h-1 flex-1 rounded-full bg-white/30" />
                  <div className="h-1 flex-1 rounded-full bg-white/30" />
                  <div className="h-1 flex-1 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mt-6">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3">
                <Search className="size-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for jobs"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Title */}
            <div className="mt-8 flex flex-col gap-2">
              <h1 className="font-display text-3xl font-medium tracking-tight">Jobs you might like</h1>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-primary text-primary hover:bg-primary/5"
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Browse jobs that match your experience to a client&apos;s hiring preferences. Ordered by most relevant.
            </p>

            <div className="mt-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <FindWorkRail />
        </div>
      </main>
    </div>
  )
}
