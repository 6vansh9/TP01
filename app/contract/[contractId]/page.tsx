"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeftRight,
  Calendar,
  Check,
  ChevronLeft,
  Download,
  File,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Shield,
  Smile,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Types
type MilestoneStatus = "completed" | "in_progress" | "pending"

interface Milestone {
  id: string
  name: string
  amount: number
  dueDate: string
  status: MilestoneStatus
  description?: string
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isOwn: boolean
}

interface SharedFile {
  id: string
  name: string
  type: "pdf" | "image" | "doc" | "other"
  size: string
  uploadedAt: string
  uploadedBy: string
}

// Mock data
const contractData = {
  id: "contract-001",
  jobTitle: "E-commerce Website Redesign",
  totalValue: 25000,
  startDate: "April 15, 2026",
  deadline: "May 30, 2026",
  status: "in_progress" as const,
  client: {
    id: "client-001",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    initials: "PS",
  },
  freelancer: {
    id: "freelancer-001",
    name: "Vansh Aggarwal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    initials: "VA",
    isOnline: true,
  },
}

const initialMilestones: Milestone[] = [
  {
    id: "m1",
    name: "Design Mockups",
    amount: 8000,
    dueDate: "April 25, 2026",
    status: "completed",
    description: "Complete UI/UX design mockups for all pages",
  },
  {
    id: "m2",
    name: "Frontend Development",
    amount: 12000,
    dueDate: "May 15, 2026",
    status: "in_progress",
    description: "Build responsive frontend with React/Next.js",
  },
  {
    id: "m3",
    name: "Testing & Handoff",
    amount: 5000,
    dueDate: "May 30, 2026",
    status: "pending",
    description: "QA testing, bug fixes, and final delivery",
  },
]

const initialMessages: Message[] = [
  {
    id: "msg1",
    senderId: "client-001",
    text: "Hi Vansh! How is the frontend development going?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    isOwn: false,
  },
  {
    id: "msg2",
    senderId: "freelancer-001",
    text: "Hey Priya! It's going great. I've completed the homepage and product listing pages. Working on the checkout flow now.",
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    isOwn: true,
  },
  {
    id: "msg3",
    senderId: "client-001",
    text: "That sounds excellent! Can you share a preview link?",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: "msg4",
    senderId: "freelancer-001",
    text: "Of course! Here's the staging URL: https://staging.example.com. Let me know if you have any feedback.",
    timestamp: new Date(Date.now() - 1800000),
    isOwn: true,
  },
]

const sharedFiles: SharedFile[] = [
  {
    id: "f1",
    name: "design-mockups-v2.fig",
    type: "other",
    size: "4.2 MB",
    uploadedAt: "April 20, 2026",
    uploadedBy: "Vansh A.",
  },
  {
    id: "f2",
    name: "brand-guidelines.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadedAt: "April 16, 2026",
    uploadedBy: "Priya S.",
  },
  {
    id: "f3",
    name: "product-images.zip",
    type: "other",
    size: "24.5 MB",
    uploadedAt: "April 18, 2026",
    uploadedBy: "Priya S.",
  },
]

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format time
function formatMessageTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Milestone status badge component
function MilestoneStatusBadge({ status }: { status: MilestoneStatus }) {
  if (status === "completed") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <Check className="mr-1 size-3" />
        Completed
      </Badge>
    )
  }
  if (status === "in_progress") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <Loader2 className="mr-1 size-3 animate-spin" />
        In Progress
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Pending
    </Badge>
  )
}

// Milestone action button
function MilestoneActionButton({
  status,
  onAction,
  isLoading,
}: {
  status: MilestoneStatus
  onAction: () => void
  isLoading: boolean
}) {
  if (status === "completed") {
    return (
      <Button variant="outline" size="sm" disabled className="text-emerald-600">
        <Check className="mr-1 size-3" />
        Approved
      </Button>
    )
  }
  if (status === "in_progress") {
    return (
      <Button size="sm" onClick={onAction} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-1 size-3 animate-spin" />
        ) : null}
        Mark Delivered
      </Button>
    )
  }
  return (
    <Button variant="outline" size="sm" disabled>
      Awaiting
    </Button>
  )
}

// File icon component
function FileIcon({ type }: { type: SharedFile["type"] }) {
  switch (type) {
    case "pdf":
      return <FileText className="size-4 text-red-500" />
    case "image":
      return <ImageIcon className="size-4 text-blue-500" />
    case "doc":
      return <FileText className="size-4 text-blue-600" />
    default:
      return <File className="size-4 text-muted-foreground" />
  }
}

export default function ContractWorkspacePage() {
  const [milestones, setMilestones] = useState(initialMilestones)
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [loadingMilestone, setLoadingMilestone] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping((prev) => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Handle milestone action
  const handleMilestoneAction = async (milestoneId: string) => {
    setLoadingMilestone(milestoneId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId && m.status === "in_progress") {
          return { ...m, status: "completed" as MilestoneStatus }
        }
        if (m.status === "pending") {
          const prevMilestone = prev.find((pm) => pm.id === milestoneId)
          if (prevMilestone?.status === "in_progress") {
            const pendingIndex = prev.findIndex((pm) => pm.status === "pending")
            if (prev.indexOf(m) === pendingIndex) {
              return { ...m, status: "in_progress" as MilestoneStatus }
            }
          }
        }
        return m
      })
    )
    setLoadingMilestone(null)
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "freelancer-001",
      text: newMessage,
      timestamp: new Date(),
      isOwn: true,
    }
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file upload here
  }

  // Check if all milestones are deliverable
  const allMilestonesComplete = milestones.every((m) => m.status === "completed")
  const hasInProgressMilestone = milestones.some((m) => m.status === "in_progress")

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top navigation */}
      <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
        <Link
          href="/contracts"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to Contracts
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm font-medium">{contractData.jobTitle}</span>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Contract details & milestones (60%) */}
        <div className="flex w-full flex-col overflow-y-auto border-r lg:w-[60%]">
          <div className="flex-1 space-y-6 p-4 lg:p-6">
            {/* Contract header card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-semibold">{contractData.jobTitle}</h1>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-blue-500" />
                        In Progress
                      </Badge>
                    </div>

                    {/* Client & Freelancer avatars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-10 border-2 border-background shadow-sm">
                          <AvatarImage src={contractData.client.avatar} />
                          <AvatarFallback>{contractData.client.initials}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{contractData.client.name}</p>
                          <p className="text-xs text-muted-foreground">Client</p>
                        </div>
                      </div>
                      <ArrowLeftRight className="size-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="size-10 border-2 border-background shadow-sm">
                            <AvatarImage src={contractData.freelancer.avatar} />
                            <AvatarFallback>{contractData.freelancer.initials}</AvatarFallback>
                          </Avatar>
                          {contractData.freelancer.isOnline && (
                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
                          )}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{contractData.freelancer.name}</p>
                          <p className="text-xs text-muted-foreground">Freelancer</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract stats */}
                  <div className="flex flex-wrap gap-4 text-sm sm:flex-col sm:items-end sm:gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Contract Value:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(contractData.totalValue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-4" />
                      <span>
                        {contractData.startDate} — {contractData.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestone tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Milestone Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Timeline line */}
                      {index < milestones.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5",
                            milestone.status === "completed"
                              ? "bg-emerald-500"
                              : "bg-border"
                          )}
                        />
                      )}

                      {/* Timeline dot */}
                      <div
                        className={cn(
                          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                          milestone.status === "completed" &&
                            "border-emerald-500 bg-emerald-500 text-white",
                          milestone.status === "in_progress" &&
                            "border-blue-500 bg-blue-50",
                          milestone.status === "pending" &&
                            "border-border bg-muted"
                        )}
                      >
                        {milestone.status === "completed" ? (
                          <Check className="size-4" />
                        ) : milestone.status === "in_progress" ? (
                          <Loader2 className="size-4 animate-spin text-blue-500" />
                        ) : (
                          <span className="size-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>

                      {/* Milestone content */}
                      <div
                        className={cn(
                          "flex flex-1 flex-col gap-3 rounded-lg border p-4 transition-all duration-300",
                          milestone.status === "in_progress" &&
                            "border-blue-200 bg-blue-50/50",
                          milestone.status === "completed" &&
                            "border-emerald-200 bg-emerald-50/30"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{milestone.name}</h3>
                            {milestone.description && (
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <MilestoneStatusBadge status={milestone.status} />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold text-primary">
                              {formatCurrency(milestone.amount)}
                            </span>
                            <span className="text-muted-foreground">
                              Due: {milestone.dueDate}
                            </span>
                          </div>
                          <MilestoneActionButton
                            status={milestone.status}
                            onAction={() => handleMilestoneAction(milestone.id)}
                            isLoading={loadingMilestone === milestone.id}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Escrow status */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {formatCurrency(contractData.totalValue)} held in escrow
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Funds release automatically upon milestone approval
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File sharing section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shared Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and drop area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  )}
                >
                  <Upload className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or{" "}
                    <button className="font-medium text-primary hover:underline">
                      browse
                    </button>
                  </p>
                </div>

                {/* File list */}
                <div className="space-y-2">
                  {sharedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <FileIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} · Uploaded by {file.uploadedBy} · {file.uploadedAt}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating action button */}
          {allMilestonesComplete && (
            <div className="sticky bottom-0 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Button className="w-full" size="lg">
                <Check className="mr-2 size-4" />
                All Milestones Completed — Close Contract
              </Button>
            </div>
          )}
        </div>

        {/* Right panel - Chat (40%) */}
        <div className="hidden w-[40%] flex-col lg:flex">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b p-4">
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage src={contractData.client.avatar} />
                <AvatarFallback>{contractData.client.initials}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div>
              <p className="font-medium">{contractData.client.name}</p>
              <p className="text-xs text-emerald-600">Online</p>
            </div>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.isOwn
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        message.isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Smile className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="size-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
