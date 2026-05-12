import Link from "next/link"
import { cn } from "@/lib/utils"

interface UpworkLogoProps {
  className?: string
  href?: string
  invert?: boolean
}

export function UpworkLogo({ className, href = "/", invert = false }: UpworkLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-2xl font-bold tracking-tight",
        invert ? "text-background" : "text-foreground",
        className,
      )}
      aria-label="Upwork home"
    >
      <span className="font-display">upwork</span>
      <span className="relative -ml-0.5 -mt-2 inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
    </Link>
  )
}
