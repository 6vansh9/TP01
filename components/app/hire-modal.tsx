"use client"

import { ShieldCheck, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Proposal } from "./proposal-card"

interface HireModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal: Proposal | null
  onConfirm: () => void
  isLoading?: boolean
}

function parseRate(rate: string): number {
  // Extract numeric value from rate string like "₹2,500" or "₹15,000"
  const match = rate.replace(/,/g, "").match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function HireModal({
  open,
  onOpenChange,
  proposal,
  onConfirm,
  isLoading = false,
}: HireModalProps) {
  if (!proposal) return null

  const amount = parseRate(proposal.proposedRate)
  const platformFee = amount * 0.1
  const totalCharged = amount + platformFee

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Hire</DialogTitle>
          <DialogDescription>
            Review the details below before proceeding with the hire.
          </DialogDescription>
        </DialogHeader>

        {/* Freelancer Info */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Avatar className="size-12">
            <AvatarImage src={proposal.freelancer.avatarUrl} alt={proposal.freelancer.name} />
            <AvatarFallback>
              {proposal.freelancer.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{proposal.freelancer.name}</p>
            <p className="text-sm text-muted-foreground truncate">{proposal.freelancer.title}</p>
          </div>
        </div>

        {/* Escrow Info */}
        <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">
              Secure Escrow Payment
            </p>
            <p className="mt-0.5 text-emerald-600 dark:text-emerald-400">
              Funds will be held securely until delivery is approved.
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Agreed Amount</span>
              <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee (10%)</span>
              <span className="font-medium text-foreground">{formatCurrency(platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-medium text-foreground">Total Charged</span>
              <span className="font-bold text-foreground">{formatCurrency(totalCharged)}</span>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <p>
            By proceeding, you agree to the TaskPay Terms of Service and authorize the payment.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm & Fund Escrow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
