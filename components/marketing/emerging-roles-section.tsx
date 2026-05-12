import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"

const emergingRoles = [
  { title: "AI Trainer", description: "Refines AI model outputs", change: 56 },
  { title: "Robotics Engineer", description: "Designs autonomous systems", change: 32 },
  { title: "Chatbot Developer", description: "Builds conversational experiences", change: 31 },
  { title: "Midjourney Artist", description: "Creates visuals through prompt design", change: 28 },
  { title: "API Developer", description: "Connects systems via scalable interfaces", change: 24 },
]

const resources = [
  { title: "How to become a chatbot developer and win work" },
  { title: "AI automation jobs to explore" },
  { title: "Learn to become an AI specialist" },
  { title: "High-Demand Careers in 2026 and How to Qualify" },
]

export function EmergingRolesSection() {
  return (
    <section className="bg-surface-dark py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Check out top-trending expertise clients want now
          </h2>
          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-full border-primary/40 bg-transparent text-primary hover:bg-primary/10"
          >
            <Link href="/skills">Explore in-demand skills</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Emerging Roles */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 backdrop-blur-sm ring-1 ring-primary/20 md:p-10">
            <h3 className="font-display text-2xl font-medium tracking-tight">Emerging Roles</h3>
            <div className="mt-8 flex flex-col gap-6">
              {emergingRoles.map((role) => (
                <div key={role.title} className="flex items-start justify-between gap-4 border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{role.title}</h4>
                    <p className="mt-1 text-sm text-white/70">{role.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-primary">
                    <TrendingUp className="size-4" />
                    <span className="text-sm font-semibold">+{role.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Helpful Resources */}
          <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-sm ring-1 ring-white/10 md:p-10">
            <h3 className="font-display text-2xl font-medium tracking-tight">Helpful resources</h3>
            <div className="mt-8 flex flex-col gap-4">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href="#"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <span className="text-balance text-sm font-medium text-white md:text-base">{resource.title}</span>
                  <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
