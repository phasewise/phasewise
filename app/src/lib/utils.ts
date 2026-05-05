import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalize free-text place names to title case at display time so
// "FRESNO", "fresno", and "Fresno" all render the same. Doesn't mutate
// the stored value — operators can type however they want.
export function toTitleCase(s: string | null | undefined): string {
  if (!s) return ""
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ")
}

// Format phone numbers for display. Accepts whatever the user typed
// (digits, dashes, spaces, parentheses) and returns a normalized
// display: "(559) 555-1234" for US 10-digit, "+1 (559) 555-1234"
// when a leading country code is present. Returns the original
// string for anything that doesn't fit those shapes (international,
// extensions, partial numbers — the user sees what they typed).
export function formatPhone(value: string | null | undefined): string {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return value
}

// Progressive formatter for phone inputs — call on every keystroke.
// Strips non-digits, then re-renders the digits into a standard
// US-style mask as the user types. Backspace works naturally because
// each render is computed fresh from the digit count.
//   typed "5"          → "5"
//   typed "5591"       → "(559) 1"
//   typed "5591234567" → "(559) 123-4567"
//   typed "15591234567"→ "+1 (559) 123-4567"
// Anything past 11 digits is treated as a country code longer than 1
// (e.g., "+44 (775) 123-4567" for a 10+1 international number).
export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 0) return ""
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  // 11+ digits: split off everything before the last 10 as country code.
  const cc = digits.slice(0, digits.length - 10)
  const rest = digits.slice(-10)
  return `+${cc} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`
}
