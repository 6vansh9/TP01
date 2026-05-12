"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const trendingSkills = [
  { name: "Open AI", change: -71, dir: "down" as const },
  { name: "Bland AI", change: 318, dir: "up" as const },
  { name: "AI Video", change: 285, dir: "up" as const },
  { name: "Higgsfield", change: 18350, dir: "up" as const },
  { name: "AEO", change: 2684, dir: "up" as const },
  { name: "Base44", change: 1690, dir: "up" as const },
  { name: "AI UGC", change: 1138, dir: "up" as const },
  { name: "Claude", change: 438, dir: "up" as const },
]

export function Hero() {
  const [mode, setMode] = useState<"hire" | "work">("hire")

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[680px] w-full md:h-[760px]">
        {/* Background images */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
            mode === "hire" ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: "url('/hero-hire.jpg')" }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
            mode === "work" ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: "url('/hero-work.jpg')" }}
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-4 pt-10 md:px-8 md:pt-16">
          {/* Hire/Work toggle */}
          <div className="inline-flex w-fit items-center rounded-full bg-white/15 p-1 backdrop-blur-md ring-1 ring-white/20">
            <button
              onClick={() => setMode("hire")}
              className={cn(
                "rounded-full px-7 py-2 text-sm font-medium transition-all",
                mode === "hire" ? "bg-foreground text-background" : "text-white hover:bg-white/10",
              )}
            >
              Hire
            </button>
            <button
              onClick={() => setMode("work")}
              className={cn(
                "rounded-full px-7 py-2 text-sm font-medium transition-all",
                mode === "work" ? "bg-foreground text-background" : "text-white hover:bg-white/10",
              )}
            >
              Work
            </button>
          </div>

          {/* Headline */}
          <div className="mt-12 max-w-2xl text-balance md:mt-16">
            {mode === "hire" ? (
              <>
                <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl">
                  Grow at the speed of your ambition
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
                  Hire experts who use AI to amplify their skills and impact — turning complex work into results
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl">
                  The future of work is yours
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
                  The freelance platform designed for the highly-skilled, highly-ambitious, and AI-fluent
                </p>
              </>
            )}
          </div>

          {/* Search / CTA */}
          <div className="mt-10 max-w-2xl">
            {mode === "hire" ? (
              <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-2xl">
                <input
                  type="text"
                  placeholder="I need help automating workflows"
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground md:text-base"
                />
                <Button className="rounded-full bg-primary px-6 font-medium">Find talent</Button>
              </div>
            ) : (
              <Button asChild size="lg" className="rounded-full bg-primary px-8 py-6 text-base font-medium">
                <Link href="/find-work">Find opportunities</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Trending skills ticker */}
      <div className="border-y border-border bg-background py-4">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 md:px-8">
          <div className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Trending skills
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track flex w-max items-center gap-3">
              {[...trendingSkills, ...trendingSkills].map((skill, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-4 py-1.5 text-sm"
                >
                  <span className="font-medium">{skill.name}</span>
                  {skill.dir === "up" ? (
                    <TrendingUp className="size-3.5 text-primary" />
                  ) : (
                    <TrendingDown className="size-3.5 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      skill.dir === "up" ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {skill.dir === "up" ? "+" : ""}
                    {skill.change}%
                  </span>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
