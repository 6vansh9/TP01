"use client"

import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"
import {
  MapPin,
  Star,
  Clock,
  Briefcase,
  GraduationCap,
  Globe,
  MessageSquare,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock data for the freelancer profile
const freelancerData = {
  name: "Vansh A.",
  title: "Full-Stack Developer | React, Next.js, Node.js",
  avatar: "/avatar-vansh.jpg",
  isOnline: true,
  location: "Faridabad, India",
  memberSince: "Jan 2024",
  lastActive: "2 hours ago",
  rating: 4.9,
  reviewCount: 23,
  hourlyRate: 1250,
  responseTime: "Under 2 hours",
  profileCompleteness: 95,
  isAvailable: true,
  stats: {
    jobsCompleted: 47,
    totalEarnings: "3.2L",
    onTimeDelivery: 98,
    repeatHireRate: 72,
  },
  skills: [
    { name: "JavaScript", level: "Expert" },
    { name: "TypeScript", level: "Expert" },
    { name: "React.js", level: "Expert" },
    { name: "Next.js", level: "Expert" },
    { name: "Node.js", level: "Intermediate" },
    { name: "Python", level: "Intermediate" },
    { name: "Tailwind CSS", level: "Expert" },
    { name: "PostgreSQL", level: "Intermediate" },
    { name: "REST APIs", level: "Expert" },
    { name: "GraphQL", level: "Intermediate" },
  ],
  bio: `I am a Computer Science student with a solid foundation in full-stack development and automation. With hands-on experience building web features and optimizing applications using JavaScript and Python, I focus on delivering innovative solutions.

My expertise extends to React.js, Next.js, and Node.js, which I am eager to leverage in the fintech space. In addition to my technical skills, I hold multiple certifications from industry leaders, showcasing my commitment to continuous learning and professional growth.

If you seek a motivated developer who can blend creativity with technical proficiency to enhance your project, I would love to connect and explore how I can bring value to your team.`,
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" },
  ],
  portfolio: [
    {
      id: 1,
      title: "E-commerce Dashboard",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "AI Chat Application",
      category: "AI Integration",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Fintech Mobile App",
      category: "Mobile Design",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "SaaS Landing Page",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Restaurant Booking System",
      category: "Full-Stack",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Healthcare Portal",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    },
  ],
  workHistory: [
    {
      id: 1,
      clientName: "TechStart Inc.",
      jobTitle: "Build React Dashboard with Analytics",
      rating: 5,
      review:
        "Vansh delivered exceptional work on our analytics dashboard. His attention to detail and technical expertise made the project a success. Highly recommended!",
      date: "Mar 2024",
      amount: "₹45,000",
    },
    {
      id: 2,
      clientName: "FinanceFlow",
      jobTitle: "API Integration for Payment Gateway",
      rating: 5,
      review:
        "Great communication throughout the project. Vansh understood our requirements perfectly and delivered ahead of schedule.",
      date: "Feb 2024",
      amount: "₹32,000",
    },
    {
      id: 3,
      clientName: "HealthPlus",
      jobTitle: "Full-Stack Web Application Development",
      rating: 4,
      review: "Good work overall. Some minor revisions needed but Vansh was responsive and made the changes quickly.",
      date: "Jan 2024",
      amount: "₹78,000",
    },
  ],
  employment: [
    {
      id: 1,
      company: "Freelance Developer",
      role: "Full-Stack Developer",
      startDate: "2023",
      endDate: "Present",
    },
    {
      id: 2,
      company: "TechCorp Solutions",
      role: "Junior Developer (Intern)",
      startDate: "2022",
      endDate: "2023",
    },
  ],
  education: [
    {
      id: 1,
      institution: "Delhi University",
      degree: "B.Tech Computer Science",
      startDate: "2021",
      endDate: "2025",
    },
  ],
}

// Profile Completeness Ring Component
function CompletenessRing({ percentage }: { percentage: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex size-20 items-center justify-center">
      <svg className="size-20 -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-semibold">{percentage}%</span>
    </div>
  )
}

// Star Rating Component
function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "size-4",
              star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="font-semibold">{rating}</span>
      <span className="text-muted-foreground">({reviewCount} reviews)</span>
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 px-4 py-3">
      <span className="text-xl font-bold text-foreground">
        {value}
        {suffix}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// Portfolio Card Component
function PortfolioCard({ item }: { item: (typeof freelancerData.portfolio)[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={item.thumbnail}
        alt={item.title}
        width={400}
        height={300}
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        crossOrigin="anonymous"
      />
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <h4 className="text-center text-sm font-semibold text-white">{item.title}</h4>
        <Badge variant="secondary" className="mt-2">
          {item.category}
        </Badge>
        <Button size="sm" variant="secondary" className="mt-4">
          View Project
          <ExternalLink className="ml-1 size-3" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 group-hover:opacity-0 transition-opacity">
        <p className="text-sm font-medium text-white">{item.title}</p>
        <span className="text-xs text-white/70">{item.category}</span>
      </div>
    </div>
  )
}

// Work History Item Component
function WorkHistoryItem({ item }: { item: (typeof freelancerData.workHistory)[0] }) {
  return (
    <div className="relative border-l-2 border-border pl-6 pb-8 last:pb-0">
      <div className="absolute -left-[9px] top-0 size-4 rounded-full border-2 border-primary bg-background" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold">{item.jobTitle}</h4>
          <span className="text-sm text-muted-foreground">{item.date}</span>
        </div>
        <p className="text-sm text-muted-foreground">{item.clientName}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "size-3.5",
                star <= item.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-foreground/80">{item.review}</p>
        <div className="mt-1 inline-flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground blur-sm select-none">{item.amount}</span>
          <span className="text-xs text-muted-foreground">(Earnings hidden)</span>
        </div>
      </div>
    </div>
  )
}

// Timeline Item Component
function TimelineItem({
  title,
  subtitle,
  startDate,
  endDate,
  icon: Icon,
}: {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  icon: typeof Briefcase
}) {
  return (
    <div className="relative border-l-2 border-border pl-6 pb-6 last:pb-0">
      <div className="absolute -left-[13px] top-0 flex size-6 items-center justify-center rounded-full border-2 border-border bg-background">
        <Icon className="size-3 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground">
          {startDate} - {endDate}
        </p>
      </div>
    </div>
  )
}

export default function FreelancerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const [isAvailable, setIsAvailable] = useState(freelancerData.isAvailable)

  return (
    <div className="min-h-screen bg-muted/30">
      <AppNav />

      <main className="mx-auto max-w-[960px] px-4 py-8">
        {/* Top Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Left: Avatar and Info */}
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <Image
                    src={freelancerData.avatar}
                    alt={freelancerData.name}
                    width={96}
                    height={96}
                    className="size-24 rounded-full object-cover ring-4 ring-background"
                  />
                  {freelancerData.isOnline && (
                    <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{freelancerData.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">{freelancerData.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {freelancerData.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      Member since {freelancerData.memberSince}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4" />
                      Active {freelancerData.lastActive}
                    </span>
                  </div>
                  <div className="mt-4">
                    <StarRating rating={freelancerData.rating} reviewCount={freelancerData.reviewCount} />
                  </div>
                </div>
              </div>

              {/* Right: Completeness Ring */}
              <div className="flex flex-col items-center gap-2">
                <CompletenessRing percentage={freelancerData.profileCompleteness} />
                <span className="text-xs text-muted-foreground">Profile Complete</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Jobs Completed" value={freelancerData.stats.jobsCompleted} />
              <StatCard label="Total Earnings" value={`₹${freelancerData.stats.totalEarnings}`} />
              <StatCard label="On-Time Delivery" value={freelancerData.stats.onTimeDelivery} suffix="%" />
              <StatCard label="Repeat Hire Rate" value={freelancerData.stats.repeatHireRate} suffix="%" />
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="flex-1 sm:flex-none">
                Hire Me
              </Button>
              <Button size="lg" variant="outline" className="flex-1 sm:flex-none">
                <MessageSquare className="mr-2 size-4" />
                Message
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Left Column - Main Content */}
          <div className="flex flex-col gap-8">
            {/* Skills Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <h2 className="text-xl font-semibold">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {freelancerData.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                      skill.level === "Expert"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {skill.name}
                    <Badge
                      variant={skill.level === "Expert" ? "default" : "secondary"}
                      className="ml-1 text-[10px] px-1.5 py-0"
                    >
                      {skill.level}
                    </Badge>
                  </span>
                ))}
              </div>
            </section>

            {/* About Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <h2 className="text-xl font-semibold">About</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80 md:text-base">
                {freelancerData.bio.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <Separator className="my-6" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Languages</h3>
                <div className="mt-2 flex flex-wrap gap-3">
                  {freelancerData.languages.map((lang) => (
                    <span key={lang.name} className="inline-flex items-center gap-2 text-sm">
                      <Globe className="size-4 text-muted-foreground" />
                      {lang.name}
                      <span className="text-muted-foreground">({lang.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Portfolio Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Portfolio</h2>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all
                  <ChevronRight className="size-4" />
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {freelancerData.portfolio.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Work History Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
              <h2 className="text-xl font-semibold">Work History & Reviews</h2>
              <div className="mt-6">
                {freelancerData.workHistory.map((item) => (
                  <WorkHistoryItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Employment & Education Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h2 className="text-xl font-semibold">Employment & Education</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Employment</h3>
                  {freelancerData.employment.map((item) => (
                    <TimelineItem
                      key={item.id}
                      title={item.company}
                      subtitle={item.role}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      icon={Briefcase}
                    />
                  ))}
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Education</h3>
                  {freelancerData.education.map((item) => (
                    <TimelineItem
                      key={item.id}
                      title={item.institution}
                      subtitle={item.degree}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      icon={GraduationCap}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 flex flex-col gap-4">
              {/* Rate Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-center">
                  <span className="text-3xl font-bold">₹{freelancerData.hourlyRate}</span>
                  <span className="text-muted-foreground">/hr</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available for hire</span>
                  <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
                </div>
                {isAvailable && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-600">
                    <CheckCircle2 className="size-4" />
                    <span className="text-sm font-medium">Available Now</span>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response time</span>
                  <span className="font-medium">{freelancerData.responseTime}</span>
                </div>
                <Button className="mt-6 w-full" size="lg">
                  Hire Me
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-muted-foreground">Quick Stats</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jobs Completed</span>
                    <span className="font-semibold">{freelancerData.stats.jobsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">On-Time</span>
                    <span className="font-semibold">{freelancerData.stats.onTimeDelivery}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Repeat Clients</span>
                    <span className="font-semibold">{freelancerData.stats.repeatHireRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
