import { MarketingNav } from "@/components/marketing/marketing-nav"
import { Hero } from "@/components/marketing/hero"
import { HomeMarketStats } from "@/components/marketing/home-market-stats"
import { FeaturedFreelancersSection } from "@/components/marketing/featured-freelancers"
import { EmergingRolesSection } from "@/components/marketing/emerging-roles-section"
import { ValueProps } from "@/components/marketing/value-props"
import { Footer } from "@/components/marketing/footer"
import { getHomePageData } from "@/lib/data/home-page"

export const revalidate = 60

export default async function HomePage() {
  const { stats, featuredFreelancers, live } = await getHomePageData()

  return (
    <main className="min-h-screen bg-background">
      <MarketingNav />
      <Hero />
      <HomeMarketStats stats={stats} live={live} />
      <FeaturedFreelancersSection freelancers={featuredFreelancers} live={live} />
      <ValueProps />
      <EmergingRolesSection />
      <Footer />
    </main>
  )
}
