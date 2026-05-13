import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Freelancer dashboard — TaskPay",
}

export default function FreelancerDashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[960px] px-4 py-16 md:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Freelancer dashboard</h1>
      <p className="mt-3 text-muted-foreground">
        Your TaskPay profile is live. Job discovery and contracts will show up here as you build them out.
      </p>
      <Button asChild className="mt-8 rounded-full" variant="outline">
        <Link href="/find-work">Browse jobs</Link>
      </Button>
    </main>
  )
}
