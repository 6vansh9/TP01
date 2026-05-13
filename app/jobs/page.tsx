"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { JobsFiltersSidebar } from "@/components/app/jobs-filters-sidebar"
import {
  JobListingCard,
  JobListingCardSkeleton,
  type JobListing,
} from "@/components/app/job-listing-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const jobs: JobListing[] = [
  {
    id: "1",
    title: "AI Powered Dashboard Feature - Full-Stack Developer Needed",
    postedAt: "6 minutes ago",
    location: "Mumbai, India",
    verified: true,
    description:
      "We have a small internal dashboard displaying customer feedback. We need one AI-powered feature. Task: Add a Summarize with AI button next to each feedback item that calls a Node.js endpoint using OpenAI GPT-3.5-turbo.",
    skills: ["React", "Node.js", "MongoDB", "OpenAI API", "TypeScript"],
    budget: "₹25,000",
    projectType: "Fixed Price",
    skillMatch: 87,
    proposalCount: 14,
    isLive: true,
  },
  {
    id: "2",
    title: "React Architect for Enterprise SaaS Application",
    postedAt: "2 hours ago",
    location: "Bangalore, India",
    verified: true,
    description:
      "Looking for an experienced React Architect to design and build a high-quality enterprise application using React 19, TypeScript, Next.js, Tailwind CSS, and TanStack Query. The work will be remote with flexible hours.",
    skills: ["React", "TypeScript", "Next.js", "Architecture", "Tailwind CSS"],
    budget: "₹3,000 - ₹5,000/hr",
    projectType: "Hourly",
    skillMatch: 92,
    proposalCount: 23,
    isLive: true,
  },
  {
    id: "3",
    title: "E-commerce Mobile App with Payment Integration",
    postedAt: "5 hours ago",
    location: "Delhi, India",
    verified: false,
    description:
      "Need a React Native developer to build an e-commerce mobile app with Razorpay and UPI payment integration. The app should have product listings, cart functionality, order tracking, and push notifications.",
    skills: ["React Native", "Razorpay", "Firebase", "Redux", "TypeScript"],
    budget: "₹75,000",
    projectType: "Fixed Price",
    skillMatch: 74,
    proposalCount: 31,
    isLive: false,
  },
  {
    id: "4",
    title: "WordPress Website Redesign with WooCommerce",
    postedAt: "1 day ago",
    location: "Pune, India",
    verified: true,
    description:
      "Complete redesign of our existing WordPress website. Need modern UI/UX, WooCommerce integration for 500+ products, SEO optimization, and mobile responsiveness. Experience with Elementor preferred.",
    skills: ["WordPress", "WooCommerce", "Elementor", "SEO", "PHP"],
    budget: "₹40,000",
    projectType: "Fixed Price",
    proposalCount: 45,
    isLive: false,
  },
  {
    id: "5",
    title: "Python Data Pipeline Developer for Analytics Platform",
    postedAt: "2 days ago",
    location: "Hyderabad, India",
    verified: true,
    description:
      "Build scalable data pipelines using Python, Apache Airflow, and AWS services. Process large datasets from multiple sources and create ETL workflows. Experience with data warehousing required.",
    skills: ["Python", "Apache Airflow", "AWS", "PostgreSQL", "Data Engineering"],
    budget: "₹2,500 - ₹4,000/hr",
    projectType: "Hourly",
    skillMatch: 65,
    proposalCount: 12,
    isLive: true,
  },
  {
    id: "6",
    title: "UI/UX Designer for Fintech Mobile Application",
    postedAt: "3 days ago",
    location: "Chennai, India",
    verified: true,
    description:
      "Design complete UI/UX for a fintech mobile app including user flows, wireframes, and high-fidelity mockups in Figma. Focus on intuitive onboarding, dashboard, and transaction screens.",
    skills: ["Figma", "UI Design", "UX Research", "Mobile Design", "Prototyping"],
    budget: "₹50,000",
    projectType: "Fixed Price",
    proposalCount: 67,
    isLive: false,
  },
  {
    id: "7",
    title: "Content Writer for Tech Blog - AI and Machine Learning",
    postedAt: "4 days ago",
    location: "Remote, India",
    verified: false,
    description:
      "Looking for a technical content writer to create engaging blog posts about AI, ML, and data science topics. Must be able to explain complex concepts in simple terms. SEO knowledge is a plus.",
    skills: ["Technical Writing", "AI/ML", "SEO", "Content Strategy", "Research"],
    budget: "₹15,000",
    projectType: "Fixed Price",
    proposalCount: 89,
    isLive: false,
  },
  {
    id: "8",
    title: "DevOps Engineer for Kubernetes Migration",
    postedAt: "5 days ago",
    location: "Gurgaon, India",
    verified: true,
    description:
      "Migrate our existing Docker-based infrastructure to Kubernetes on AWS EKS. Set up CI/CD pipelines, monitoring, and auto-scaling. Experience with Terraform and GitOps required.",
    skills: ["Kubernetes", "AWS EKS", "Terraform", "Docker", "CI/CD"],
    budget: "₹4,000 - ₹6,000/hr",
    projectType: "Hourly",
    skillMatch: 78,
    proposalCount: 8,
    isLive: true,
  },
]

export default function JobsPage() {
  const [sortBy, setSortBy] = useState("relevance")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const totalJobs = 1240

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters (Desktop) */}
          <div className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-24">
              <h2 className="mb-6 text-lg font-semibold">Filters</h2>
              <JobsFiltersSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg font-medium">
                <span className="text-2xl font-bold text-foreground">
                  {totalJobs.toLocaleString("en-IN")}
                </span>{" "}
                <span className="text-muted-foreground">jobs found</span>
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="mr-2 size-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <JobsFiltersSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                    <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="mt-6 flex flex-col gap-4">
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <JobListingCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                jobs.map((job) => <JobListingCard key={job.id} job={job} />)
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">124</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
