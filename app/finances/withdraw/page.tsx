"use client"

import { useState } from "react"
import Link from "next/link"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  IndianRupee, 
  Building2, 
  CreditCard, 
  Plus,
  Check,
  AlertCircle,
  ArrowLeft,
  Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentMethod {
  id: string
  type: "bank" | "upi" | "paypal"
  name: string
  details: string
  isDefault: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "bank",
    name: "HDFC Bank",
    details: "Savings Account ****4532",
    isDefault: true
  },
  {
    id: "2",
    type: "upi",
    name: "UPI",
    details: "vansh@okhdfc",
    isDefault: false
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id)
  const [isLoading, setIsLoading] = useState(false)

  const availableBalance = 108250
  const minWithdrawal = 1000

  const handleWithdraw = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Would redirect to success page
  }

  const parsedAmount = parseFloat(amount) || 0
  const isValidAmount = parsedAmount >= minWithdrawal && parsedAmount <= availableBalance

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/finances" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Financial Overview
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Withdraw Earnings</h1>
          <p className="text-muted-foreground">Transfer your available balance to your bank account</p>
        </div>

        {/* Available Balance Card */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(availableBalance)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Amount to Withdraw</CardTitle>
            <CardDescription>Minimum withdrawal is {formatCurrency(minWithdrawal)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <IndianRupee className="size-5 text-muted-foreground" />
              </div>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-2xl font-semibold"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[10000, 25000, 50000, availableBalance].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={cn(
                    parsedAmount === quickAmount && "border-primary bg-primary/5"
                  )}
                >
                  {quickAmount === availableBalance ? "Max" : formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>

            {amount && !isValidAmount && (
              <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {parsedAmount < minWithdrawal 
                  ? `Minimum withdrawal is ${formatCurrency(minWithdrawal)}`
                  : `Maximum withdrawal is ${formatCurrency(availableBalance)}`
                }
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Withdraw To</CardTitle>
            <CardDescription>Select your payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover:border-primary/50",
                      selectedMethod === method.id && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value={method.id} className="sr-only" />
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      method.type === "bank" ? "bg-blue-500/10" : "bg-purple-500/10"
                    )}>
                      {method.type === "bank" ? (
                        <Building2 className="size-5 text-blue-600" />
                      ) : (
                        <CreditCard className="size-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.name}</p>
                        {method.isDefault && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <Check className="size-5 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </RadioGroup>

            <Button variant="outline" className="mt-4 w-full gap-2">
              <Plus className="size-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Summary */}
        {parsedAmount > 0 && isValidAmount && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Withdrawal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(parsedAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium">You will receive</span>
                <span className="text-lg font-bold">{formatCurrency(parsedAmount)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated arrival: 1-3 business days
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={!isValidAmount || isLoading}
          onClick={handleWithdraw}
        >
          {isLoading ? (
            <>
              <svg className="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>Withdraw {isValidAmount ? formatCurrency(parsedAmount) : ""}</>
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By withdrawing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">Payment Policy</Link>
        </p>
      </main>
    </div>
  )
}
