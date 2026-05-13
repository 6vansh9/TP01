"use client"

import { useState } from "react"
import Link from "next/link"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Calendar, 
  Clock, 
  IndianRupee, 
  MessageSquare, 
  ChevronRight,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Contract {
  id: string
  title: string
  client: {
    name: string
    avatar: string
    location: string
  }
  status: "active" | "paused" | "completed" | "ended"
  type: "hourly" | "fixed"
  rate?: number
  budget?: number
  hoursThisWeek?: number
  totalEarned: number
  startDate: string
  endDate?: string
  milestones?: {
    completed: number
    total: number
  }
  lastActivity: string
}

const contracts: Contract[] = [
  {
    id: "1",
    title: "E-commerce Website Development",
    client: {
      name: "TechStart Solutions",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "United States"
    },
    status: "active",
    type: "fixed",
    budget: 250000,
    totalEarned: 125000,
    startDate: "Mar 15, 2024",
    milestones: { completed: 2, total: 4 },
    lastActivity: "2 hours ago"
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    client: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Canada"
    },
    status: "active",
    type: "hourly",
    rate: 2500,
    hoursThisWeek: 12,
    totalEarned: 87500,
    startDate: "Feb 1, 2024",
    lastActivity: "1 day ago"
  },
  {
    id: "3",
    title: "Logo Design and Branding",
    client: {
      name: "Creative Agency",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "United Kingdom"
    },
    status: "paused",
    type: "fixed",
    budget: 50000,
    totalEarned: 25000,
    startDate: "Jan 20, 2024",
    milestones: { completed: 1, total: 2 },
    lastActivity: "1 week ago"
  },
  {
    id: "4",
    title: "API Integration Project",
    client: {
      name: "DataFlow Inc",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Germany"
    },
    status: "completed",
    type: "fixed",
    budget: 150000,
    totalEarned: 150000,
    startDate: "Dec 1, 2023",
    endDate: "Feb 28, 2024",
    milestones: { completed: 3, total: 3 },
    lastActivity: "2 months ago"
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function ContractCard({ contract }: { contract: Contract }) {
  const statusConfig = {
    active: { label: "Active", className: "bg-green-500/10 text-green-600 border-green-500/20" },
    paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    ended: { label: "Ended", className: "bg-muted text-muted-foreground border-border" },
  }

  const status = statusConfig[contract.status]

  return (
    <Link href={`/contract/${contract.id}`}>
      <Card className="transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Client Info */}
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={contract.client.avatar} alt={contract.client.name} />
                  <AvatarFallback>{contract.client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contract.client.name}</p>
                  <p className="text-xs text-muted-foreground">{contract.client.location}</p>
                </div>
              </div>

              {/* Contract Title */}
              <h3 className="mb-2 text-lg font-semibold">{contract.title}</h3>

              {/* Contract Details */}
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="size-4" />
                  {contract.type === "hourly" ? "Hourly" : "Fixed Price"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Started {contract.startDate}
                </span>
                {contract.type === "hourly" && contract.hoursThisWeek !== undefined && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {contract.hoursThisWeek} hrs this week
                  </span>
                )}
              </div>

              {/* Milestones or Rate */}
              {contract.milestones && (
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Milestones</span>
                    <span className="font-medium">{contract.milestones.completed} of {contract.milestones.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(contract.milestones.completed / contract.milestones.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Earnings */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {contract.type === "hourly" ? "Rate" : "Budget"}
                  </p>
                  <p className="font-semibold">
                    {contract.type === "hourly" 
                      ? `${formatCurrency(contract.rate || 0)}/hr`
                      : formatCurrency(contract.budget || 0)
                    }
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Earned</p>
                  <p className="font-semibold text-green-600">{formatCurrency(contract.totalEarned)}</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end gap-3">
              <Badge variant="outline" className={cn("border", status.className)}>
                {status.label}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-8">
                  <MessageSquare className="size-4" />
                </Button>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Active {contract.lastActivity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const activeContracts = contracts.filter(c => c.status === "active" || c.status === "paused")
  const completedContracts = contracts.filter(c => c.status === "completed" || c.status === "ended")

  const totalActive = activeContracts.length
  const totalEarned = contracts.reduce((sum, c) => sum + c.totalEarned, 0)

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Your Contracts</h1>
          <p className="text-muted-foreground">Manage your active and past contracts</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalActive}</p>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
                <IndianRupee className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
                <CheckCircle2 className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedContracts.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search contracts..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              Active
              <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                {activeContracts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              Completed
              <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                {completedContracts.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeContracts.length > 0 ? (
              activeContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No active contracts</h3>
                  <p className="mb-4 text-muted-foreground">Start finding work to get your first contract</p>
                  <Button asChild>
                    <Link href="/jobs">Find Work</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedContracts.length > 0 ? (
              completedContracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No completed contracts yet</h3>
                  <p className="text-muted-foreground">Your completed contracts will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
