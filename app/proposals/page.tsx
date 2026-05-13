"use client"

import { useState } from "react"
import Link from "next/link"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  IndianRupee, 
  ChevronRight,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Send,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Proposal {
  id: string
  jobTitle: string
  client: string
  status: "pending" | "viewed" | "shortlisted" | "accepted" | "declined" | "withdrawn"
  submittedDate: string
  proposedRate: number
  rateType: "hourly" | "fixed"
  coverLetterPreview: string
  clientViewed: boolean
  lastActivity: string
}

const proposals: Proposal[] = [
  {
    id: "1",
    jobTitle: "Full-Stack Developer for SaaS Platform",
    client: "TechVentures Inc",
    status: "shortlisted",
    submittedDate: "May 10, 2024",
    proposedRate: 3500,
    rateType: "hourly",
    coverLetterPreview: "I am excited to apply for this position. With 4+ years of experience in React and Node.js...",
    clientViewed: true,
    lastActivity: "2 hours ago"
  },
  {
    id: "2",
    jobTitle: "Mobile App UI/UX Redesign",
    client: "StartupXYZ",
    status: "viewed",
    submittedDate: "May 8, 2024",
    proposedRate: 150000,
    rateType: "fixed",
    coverLetterPreview: "I would love to help redesign your mobile application. My portfolio includes...",
    clientViewed: true,
    lastActivity: "1 day ago"
  },
  {
    id: "3",
    jobTitle: "E-commerce Website Development",
    client: "Fashion Brand Co",
    status: "pending",
    submittedDate: "May 12, 2024",
    proposedRate: 200000,
    rateType: "fixed",
    coverLetterPreview: "I specialize in e-commerce development with expertise in Shopify and custom solutions...",
    clientViewed: false,
    lastActivity: "Just now"
  },
  {
    id: "4",
    jobTitle: "API Integration Project",
    client: "DataFlow Systems",
    status: "accepted",
    submittedDate: "May 1, 2024",
    proposedRate: 2500,
    rateType: "hourly",
    coverLetterPreview: "With extensive experience in API development and integration...",
    clientViewed: true,
    lastActivity: "3 days ago"
  },
  {
    id: "5",
    jobTitle: "WordPress Website Maintenance",
    client: "Local Business",
    status: "declined",
    submittedDate: "Apr 28, 2024",
    proposedRate: 50000,
    rateType: "fixed",
    coverLetterPreview: "I can help maintain and update your WordPress website...",
    clientViewed: true,
    lastActivity: "1 week ago"
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const statusConfig = {
    pending: { 
      label: "Pending", 
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      icon: Clock
    },
    viewed: { 
      label: "Viewed", 
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Eye
    },
    shortlisted: { 
      label: "Shortlisted", 
      className: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: CheckCircle2
    },
    accepted: { 
      label: "Accepted", 
      className: "bg-primary/10 text-primary border-primary/20",
      icon: CheckCircle2
    },
    declined: { 
      label: "Declined", 
      className: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: XCircle
    },
    withdrawn: { 
      label: "Withdrawn", 
      className: "bg-muted text-muted-foreground border-border",
      icon: XCircle
    },
  }

  const status = statusConfig[proposal.status]
  const StatusIcon = status.icon

  return (
    <Card className="transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Job Title */}
            <h3 className="mb-1 text-lg font-semibold">{proposal.jobTitle}</h3>
            <p className="mb-3 text-sm text-muted-foreground">{proposal.client}</p>

            {/* Cover Letter Preview */}
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {proposal.coverLetterPreview}
            </p>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IndianRupee className="size-4" />
                {proposal.rateType === "hourly" 
                  ? `${formatCurrency(proposal.proposedRate)}/hr`
                  : formatCurrency(proposal.proposedRate)
                }
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="size-4" />
                Submitted {proposal.submittedDate}
              </span>
              {proposal.clientViewed && (
                <span className="flex items-center gap-1 text-blue-600">
                  <Eye className="size-4" />
                  Client viewed
                </span>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-end gap-3">
            <Badge variant="outline" className={cn("border gap-1", status.className)}>
              <StatusIcon className="size-3" />
              {status.label}
            </Badge>
            
            <div className="flex items-center gap-2">
              {proposal.status === "accepted" && (
                <Button size="sm" asChild>
                  <Link href={`/contract/${proposal.id}`}>View Contract</Link>
                </Button>
              )}
              {(proposal.status === "pending" || proposal.status === "viewed" || proposal.status === "shortlisted") && (
                <>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MessageSquare className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">Withdraw</Button>
                </>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">{proposal.lastActivity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProposalsPage() {
  const activeProposals = proposals.filter(p => 
    p.status === "pending" || p.status === "viewed" || p.status === "shortlisted"
  )
  const acceptedProposals = proposals.filter(p => p.status === "accepted")
  const archivedProposals = proposals.filter(p => 
    p.status === "declined" || p.status === "withdrawn"
  )

  const connectsRemaining = 48

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Proposals & Offers</h1>
            <p className="text-muted-foreground">Track the status of your submitted proposals</p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Send className="size-4 text-primary" />
                <span className="text-sm">
                  <span className="font-semibold">{connectsRemaining}</span> Connects
                </span>
              </div>
            </Card>
            <Button asChild>
              <Link href="/jobs">Find Work</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500/10">
                <FileText className="size-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProposals.length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                <Eye className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{proposals.filter(p => p.clientViewed).length}</p>
                <p className="text-xs text-muted-foreground">Viewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{acceptedProposals.length}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <XCircle className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{archivedProposals.length}</p>
                <p className="text-xs text-muted-foreground">Archived</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              Active
              <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                {activeProposals.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              Offers
              <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                {acceptedProposals.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              Archived
              <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                {archivedProposals.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeProposals.length > 0 ? (
              activeProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No active proposals</h3>
                  <p className="mb-4 text-muted-foreground">Start submitting proposals to find your next project</p>
                  <Button asChild>
                    <Link href="/jobs">Find Work</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            {acceptedProposals.length > 0 ? (
              acceptedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No offers yet</h3>
                  <p className="text-muted-foreground">Accepted proposals will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {archivedProposals.length > 0 ? (
              archivedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No archived proposals</h3>
                  <p className="text-muted-foreground">Declined or withdrawn proposals will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
