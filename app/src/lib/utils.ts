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
