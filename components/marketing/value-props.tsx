import { ShieldCheck, Sparkles, Wallet, Users2 } from "lucide-react"

const features = [
  {
    icon: Users2,
    title: "Proof of quality",
    description: "Check any pro's work samples, client reviews, and identity verification.",
  },
  {
    icon: Sparkles,
    title: "No cost until you hire",
    description: "Interview potential fits for your job, negotiate rates, and only pay for work you approve.",
  },
  {
    icon: Wallet,
    title: "Safe and secure",
    description: "Focus on your work knowing we help protect your data and privacy. We're here with 24/7 support.",
  },
  {
    icon: ShieldCheck,
    title: "Need help? We're here",
    description: "Real help from real people — get support when you need it from our trust and safety team.",
  },
]

export function ValueProps() {
  return (
    <section className="border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Why Upwork</p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
            Up the ante with Upwork
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
