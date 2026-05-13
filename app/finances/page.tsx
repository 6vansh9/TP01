"use client"

import { useState } from "react"
import Link from "next/link"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Clock,
  Download,
  PiggyBank,
  ChevronRight,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  type: "earning" | "withdrawal" | "fee" | "refund"
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "processing"
  client?: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "earning",
    description: "Milestone payment - E-commerce Website",
    amount: 62500,
    date: "May 10, 2024",
    status: "completed",
    client: "TechStart Solutions"
  },
  {
    id: "2",
    type: "fee",
    description: "Service fee (10%)",
    amount: -6250,
    date: "May 10, 2024",
    status: "completed"
  },
  {
    id: "3",
    type: "withdrawal",
    description: "Withdrawal to HDFC Bank ****4532",
    amount: -50000,
    date: "May 8, 2024",
    status: "completed"
  },
  {
    id: "4",
    type: "earning",
    description: "Hourly payment - Mobile App Design",
    amount: 30000,
    date: "May 5, 2024",
    status: "completed",
    client: "Sarah Johnson"
  },
  {
    id: "5",
    type: "fee",
    description: "Service fee (10%)",
    amount: -3000,
    date: "May 5, 2024",
    status: "completed"
  },
  {
    id: "6",
    type: "earning",
    description: "Milestone payment - Logo Design",
    amount: 25000,
    date: "May 1, 2024",
    status: "completed",
    client: "Creative Agency"
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const typeConfig = {
    earning: { 
      icon: ArrowDownLeft, 
      iconClass: "text-green-600 bg-green-500/10",
      amountClass: "text-green-600"
    },
    withdrawal: { 
      icon: ArrowUpRight, 
      iconClass: "text-blue-600 bg-blue-500/10",
      amountClass: "text-foreground"
    },
    fee: { 
      icon: CreditCard, 
      iconClass: "text-orange-600 bg-orange-500/10",
      amountClass: "text-muted-foreground"
    },
    refund: { 
      icon: ArrowDownLeft, 
      iconClass: "text-purple-600 bg-purple-500/10",
      amountClass: "text-purple-600"
    },
  }

  const config = typeConfig[transaction.type]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <div className={cn("flex size-10 items-center justify-center rounded-full", config.iconClass)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{transaction.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{transaction.date}</span>
          {transaction.client && (
            <>
              <span>·</span>
              <span>{transaction.client}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className={cn("font-semibold", config.amountClass)}>
          {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
      </div>
    </div>
  )
}

export default function FinancesPage() {
  const [timePeriod, setTimePeriod] = useState("this-month")

  // Calculate stats
  const availableBalance = 108250
  const pendingBalance = 62500
  const totalEarnedThisMonth = 117500
  const totalWithdrawn = 50000
  const serviceFees = 9250

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Financial Overview</h1>
            <p className="text-muted-foreground">Track your earnings, withdrawals, and payment history</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="size-5 text-primary" />
                </div>
                <Button variant="default" size="sm" asChild>
                  <Link href="/finances/withdraw">Withdraw</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-yellow-500/10">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold">{formatCurrency(pendingBalance)}</p>
              <p className="mt-1 text-xs text-muted-foreground">In escrow</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  +23%
                  <TrendingUp className="size-3" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Earned This Month</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalEarnedThisMonth)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                <PiggyBank className="size-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Withdrawn</p>
              <p className="text-3xl font-bold">{formatCurrency(totalWithdrawn)}</p>
              <p className="mt-1 text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link href="/finances/earnings">
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
                  <IndianRupee className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Billings & Earnings</p>
                  <p className="text-sm text-muted-foreground">View detailed earnings</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/finances/transactions">
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
                  <CreditCard className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Transactions</p>
                  <p className="text-sm text-muted-foreground">Full transaction history</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/finances/withdraw">
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/10">
                  <Building2 className="size-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Payment Methods</p>
                  <p className="text-sm text-muted-foreground">Manage bank accounts</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/finances/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Earnings</span>
                <span className="font-semibold">{formatCurrency(totalEarnedThisMonth + serviceFees)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service Fees (10%)</span>
                <span className="font-semibold text-orange-600">-{formatCurrency(serviceFees)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Net Earnings</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(totalEarnedThisMonth)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Available</span>
                <span className="font-semibold">May 15, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-green-600">{formatCurrency(62500)}</span>
              </div>
              <div className="h-px bg-border" />
              <p className="text-sm text-muted-foreground">
                Funds from completed milestones will be available for withdrawal after the 5-day security period.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
