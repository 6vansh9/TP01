"use client"

import { useState } from "react"
import {
  ChevronDown,
  UserPlus,
  Inbox,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProposalCard, ProposalCardSkeleton, type Proposal } from "@/components/app/proposal-card"
import { HireModal } from "@/components/app/hire-modal"

// Mock data
const mockProposals: Proposal[] = [
  {
    id: "1",
    freelancer: {
      id: "f1",
      name: "Priya Sharma",
      title: "Full Stack Developer | React & Node.js Expert",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      isOnline: true,
      rating: 4.9,
      reviewCount: 127,
      isTopRated: true,
    },
    proposedRate: "₹22,000",
    deliveryTime: "7 days",
    coverLetter: "Hi! I am excited to apply for this project. With over 5 years of experience in full-stack development, I have successfully delivered more than 50 projects similar to yours. I specialize in React.js, Next.js, Node.js, and MongoDB. I noticed you need a scalable e-commerce platform, and I have built several high-traffic e-commerce sites that handle thousands of daily transactions. I would love to discuss your specific requirements and share my portfolio. Looking forward to collaborating with you!",
    skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "AWS"],
    matchingSkills: ["React", "Next.js", "Node.js", "TypeScript"],
    isShortlisted: false,
  },
  {
    id: "2",
    freelancer: {
      id: "f2",
      name: "Rahul Verma",
      title: "Senior Software Engineer",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      isOnline: false,
      rating: 4.7,
      reviewCount: 89,
      isTopRated: false,
    },
    proposedRate: "₹18,500",
    deliveryTime: "10 days",
    coverLetter: "Hello! I have reviewed your project requirements carefully. I am a senior software engineer with expertise in building modern web applications. I can deliver a clean, maintainable codebase with comprehensive documentation. My approach focuses on writing scalable code that can grow with your business needs.",
    skills: ["React", "Vue.js", "Python", "PostgreSQL", "Docker"],
    matchingSkills: ["React"],
    isShortlisted: true,
  },
  {
    id: "3",
    freelancer: {
      id: "f3",
      name: "Ananya Patel",
      title: "UI/UX Designer & Frontend Developer",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      isOnline: true,
      rating: 5.0,
      reviewCount: 64,
      isTopRated: true,
    },
    proposedRate: "₹25,000",
    deliveryTime: "5 days",
    coverLetter: "Hi there! I am a passionate UI/UX designer and frontend developer with a keen eye for detail. I believe great design is not just about aesthetics but also about creating intuitive user experiences. I would love to bring your vision to life with pixel-perfect designs and smooth animations.",
    skills: ["Figma", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
    matchingSkills: ["React", "Next.js", "Tailwind CSS"],
    isShortlisted: true,
  },
  {
    id: "4",
    freelancer: {
      id: "f4",
      name: "Vikram Singh",
      title: "Backend Developer | API Specialist",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      isOnline: false,
      rating: 4.5,
      reviewCount: 42,
      isTopRated: false,
    },
    proposedRate: "₹15,000",
    deliveryTime: "14 days",
    coverLetter: "I am interested in your project. I have experience building robust backend systems and RESTful APIs. I can help you build a scalable architecture that meets your requirements.",
    skills: ["Node.js", "Express", "PostgreSQL", "Redis", "GraphQL"],
    matchingSkills: ["Node.js"],
    isShortlisted: false,
  },
  {
    id: "5",
    freelancer: {
      id: "f5",
      name: "Meera Krishnan",
      title: "Full Stack Developer | E-commerce Expert",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      isOnline: true,
      rating: 4.8,
      reviewCount: 156,
      isTopRated: true,
    },
    proposedRate: "₹28,000",
    deliveryTime: "6 days",
    coverLetter: "Namaste! With 7+ years in e-commerce development, I have built platforms processing millions in revenue. I understand the nuances of payment integration, inventory management, and user experience optimization. Let me help you create a store that converts visitors into loyal customers.",
    skills: ["React", "Next.js", "Node.js", "Stripe", "Shopify", "TypeScript"],
    matchingSkills: ["React", "Next.js", "Node.js", "TypeScript"],
    isShortlisted: false,
  },
]

const availableSkills = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Tailwind CSS",
  "GraphQL",
]

export default function ProposalsInboxPage() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("best-match")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [hireModalOpen, setHireModalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter proposals based on tab and skills
  const filteredProposals = proposals.filter((p) => {
    // Tab filter
    if (activeTab === "shortlisted" && !p.isShortlisted) return false
    if (activeTab === "messaged") return false // Mock: no messaged proposals
    if (activeTab === "hired") return false // Mock: no hired proposals

    // Skill filter
    if (selectedSkills.length > 0) {
      const hasMatchingSkill = selectedSkills.some((skill) =>
        p.skills.includes(skill)
      )
      if (!hasMatchingSkill) return false
    }

    return true
  })

  // Sort proposals
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sortBy) {
      case "lowest-price":
        return parseInt(a.proposedRate.replace(/[^\d]/g, "")) - parseInt(b.proposedRate.replace(/[^\d]/g, ""))
      case "highest-rated":
        return b.freelancer.rating - a.freelancer.rating
      case "most-recent":
        return 0 // Would sort by date in real app
      default: // best-match
        return b.matchingSkills.length - a.matchingSkills.length
    }
  })

  const shortlistedCount = proposals.filter((p) => p.isShortlisted).length

  const handleShortlist = (id: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isShortlisted: !p.isShortlisted } : p
      )
    )
  }

  const handleMessage = (id: string) => {
    // Navigate to messages
    console.log("Message freelancer:", id)
  }

  const handleViewProfile = (freelancerId: string) => {
    // Navigate to profile
    console.log("View profile:", freelancerId)
  }

  const handleHire = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    setHireModalOpen(true)
  }

  const handleConfirmHire = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setHireModalOpen(false)
      // Would trigger Stripe checkout here
      console.log("Hired:", selectedProposal?.freelancer.name)
    }, 1500)
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              E-Commerce Platform Development
            </h1>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
              Open
            </Badge>
          </div>

          {/* Sub-stats */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium text-foreground">{proposals.length} Proposals</span>
            </span>
            <span className="size-1 rounded-full bg-border" />
            <span>Budget: <span className="font-medium text-foreground">₹25,000</span> Fixed</span>
            <span className="size-1 rounded-full bg-border" />
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              Posted 3 days ago
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-lg bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              All Proposals ({proposals.length})
            </TabsTrigger>
            <TabsTrigger
              value="shortlisted"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Shortlisted ({shortlistedCount})
            </TabsTrigger>
            <TabsTrigger
              value="messaged"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Messaged (2)
            </TabsTrigger>
            <TabsTrigger
              value="hired"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Hired (0)
            </TabsTrigger>
          </TabsList>

          {/* Filter/Sort Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best-match">Best Match</SelectItem>
                <SelectItem value="lowest-price">Lowest Price</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="most-recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  Filter by Skills
                  {selectedSkills.length > 0 && (
                    <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                      {selectedSkills.length}
                    </Badge>
                  )}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {availableSkills.map((skill) => (
                  <DropdownMenuCheckboxItem
                    key={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  >
                    {skill}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="ml-auto gap-1.5">
              <UserPlus className="size-4" />
              Invite Freelancer
            </Button>
          </div>

          {/* Proposal Lists */}
          <TabsContent value="all" className="mt-6 space-y-4">
            {sortedProposals.length > 0 ? (
              sortedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onShortlist={handleShortlist}
                  onMessage={handleMessage}
                  onViewProfile={handleViewProfile}
                  onHire={handleHire}
                />
              ))
            ) : (
              <EmptyState
                title="No proposals match your filters"
                description="Try adjusting your filter criteria to see more proposals."
              />
            )}
          </TabsContent>

          <TabsContent value="shortlisted" className="mt-6 space-y-4">
            {sortedProposals.length > 0 ? (
              sortedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onShortlist={handleShortlist}
                  onMessage={handleMessage}
                  onViewProfile={handleViewProfile}
                  onHire={handleHire}
                />
              ))
            ) : (
              <EmptyState
                title="You haven&apos;t shortlisted anyone yet"
                description="Browse proposals and shortlist the freelancers you&apos;re interested in."
              />
            )}
          </TabsContent>

          <TabsContent value="messaged" className="mt-6">
            <EmptyState
              title="No messages yet"
              description="Start a conversation with freelancers to discuss your project."
            />
          </TabsContent>

          <TabsContent value="hired" className="mt-6">
            <EmptyState
              title="No hires yet"
              description="Once you hire a freelancer, they will appear here."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Hire Modal */}
      <HireModal
        open={hireModalOpen}
        onOpenChange={setHireModalOpen}
        proposal={selectedProposal}
        onConfirm={handleConfirmHire}
        isLoading={isLoading}
      />
    </div>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

// Loading state component for streaming
export function ProposalsInboxSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-64 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />

        {/* Filter Bar Skeleton */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-9 w-44 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
          <div className="ml-auto h-9 w-36 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Proposal Cards Skeleton */}
        <div className="mt-6 space-y-4">
          <ProposalCardSkeleton />
          <ProposalCardSkeleton />
          <ProposalCardSkeleton />
        </div>
      </div>
    </div>
  )
}
