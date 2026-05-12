import { MarketingNav } from "@/components/marketing/marketing-nav"
import { Hero } from "@/components/marketing/hero"
import { EmergingRolesSection } from "@/components/marketing/emerging-roles-section"
import { ValueProps } from "@/components/marketing/value-props"
import { Footer } from "@/components/marketing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNav />
      <Hero />
      <ValueProps />
      <EmergingRolesSection />
      <Footer />
    </main>
  )
}
