import Link from "next/link"
import { Briefcase, Laptop, ArrowRight } from "lucide-react"
import { UpworkLogo } from "@/components/upwork-logo"

export default function SignupRolePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 md:px-8">
          <UpworkLogo />
        </div>
      </header>

      <main className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 md:py-24">
        <h1 className="text-balance text-center font-display text-4xl font-medium tracking-tight md:text-5xl">
          Welcome to Upwork
        </h1>
        <p className="mt-4 text-center text-base text-muted-foreground md:text-lg">
          Which describes you best?
        </p>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          <Link
            href="/signup/client"
            className="group flex flex-col items-center justify-between rounded-2xl border-2 border-border bg-background p-6 transition-all hover:border-primary hover:shadow-lg md:p-8"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-surface-mint to-surface-mint/40">
              <Briefcase className="size-20 stroke-[1.5] text-foreground" />
            </div>
            <div className="mt-6 flex w-full items-center justify-center gap-2">
              <span className="text-lg font-semibold">Client</span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">Post jobs and hire</p>
          </Link>

          <Link
            href="/signup/freelancer"
            className="group flex flex-col items-center justify-between rounded-2xl border-2 border-border bg-background p-6 transition-all hover:border-primary hover:shadow-lg md:p-8"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-surface-mint to-surface-mint/40">
              <Laptop className="size-20 stroke-[1.5] text-foreground" />
            </div>
            <div className="mt-6 flex w-full items-center justify-center gap-2">
              <span className="text-lg font-semibold">Freelancer</span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">Work and get paid</p>
          </Link>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  )
}
