/**
 * Default project type taxonomy. Used as a fallback when an org hasn't
 * customized their list yet. Once a firm visits /settings/project-types
 * and saves a list (even an empty one), Organization.projectTypes
 * overrides this.
 */
export const DEFAULT_PROJECT_TYPES: ReadonlyArray<string> = [
  "Residential",
  "Commercial",
  "Public",
  "Entry Monument",
  "Mixed Use",
  "Park",
  "Streetscape",
];

/**
 * Coerce whatever's in Organization.projectTypes (Json | null) into a
 * clean string[]. Filters out duplicates and empty strings. Falls back
 * to the default list if null/empty/malformed.
 */
export function resolveProjectTypes(stored: unknown): string[] {
  if (Array.isArray(stored)) {
    const clean = stored
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);
    // Dedupe, preserve order.
    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of clean) {
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
    return out.length > 0 ? out : [...DEFAULT_PROJECT_TYPES];
  }
  return [...DEFAULT_PROJECT_TYPES];
}
