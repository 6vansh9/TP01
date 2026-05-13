/** ISO-ish codes for phone default; first entry is default country. */
export const COUNTRY_OPTIONS = [
  { code: "IN", label: "India", dial: "+91" },
  { code: "US", label: "United States", dial: "+1" },
  { code: "GB", label: "United Kingdom", dial: "+44" },
  { code: "CA", label: "Canada", dial: "+1" },
  { code: "AU", label: "Australia", dial: "+61" },
  { code: "DE", label: "Germany", dial: "+49" },
  { code: "FR", label: "France", dial: "+33" },
  { code: "SG", label: "Singapore", dial: "+65" },
  { code: "AE", label: "United Arab Emirates", dial: "+971" },
  { code: "JP", label: "Japan", dial: "+81" },
] as const

/** Unique dial codes for phone prefix dropdown (US/CA share +1). */
export const PHONE_PREFIXES = [
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "US / Canada (+1)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+33", label: "France (+33)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+81", label: "Japan (+81)" },
] as const

export const MOTIVATION_QUOTE = {
  text: "The best time to build your freelance career is now. A complete profile gets you hired up to 4× more often.",
  author: "TaskPay Talent Team",
}
