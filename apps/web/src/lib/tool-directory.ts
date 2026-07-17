import type { ToolSearchIndexEntry } from "@workspace/tool-registry"

type ToolCategoryCount = Readonly<{
  category: string
  count: number
}>

/** Icon identifiers (see ToolIcon) shown on the home category tiles. */
const CATEGORY_ICONS: Readonly<Record<string, string>> = {
  crypto: "lock",
  developer: "wrench",
  image: "image",
  json: "braces",
  misc: "layout-grid",
  network: "network",
  pdf: "file-text",
  random: "sparkles",
  text: "case-sensitive",
  time: "clock3",
  web: "globe",
}

/** Curated slugs for the home "Popular tools" card grid. */
const FEATURED_TOOL_SLUGS = [
  "json-formatter",
  "qr-code-generator",
  "uuid-v4-generator",
  "base64-encoder-decoder",
  "unix-timestamp-converter",
  "random-password-generator",
] as const

/** Curated slugs for the quick links under the home hero search. */
const POPULAR_TOOL_SLUGS = [
  "json-formatter",
  "uuid-v4-generator",
  "base64-encoder-decoder",
  "unix-timestamp-converter",
] as const

/**
 * Aggregates tool counts per manifest category, ordered by count
 * (descending) with ties broken alphabetically for a stable order.
 */
function countToolsByCategory(
  entries: readonly ToolSearchIndexEntry[]
): readonly ToolCategoryCount[] {
  const counts = new Map<string, number>()

  for (const entry of entries) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort(
      (left, right) =>
        right.count - left.count || left.category.localeCompare(right.category)
    )
}

function getCategoryLabel(
  labels: Readonly<Record<string, string>> | undefined,
  category: string
) {
  return labels?.[category] ?? category
}

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? "wrench"
}

function findToolsBySlugs(
  entries: readonly ToolSearchIndexEntry[],
  slugs: readonly string[]
) {
  return slugs
    .map((slug) => entries.find((entry) => entry.slug === slug))
    .filter((entry): entry is ToolSearchIndexEntry => entry !== undefined)
}

function resolveEntryLocale(entry: ToolSearchIndexEntry, language: string) {
  return (
    entry.locales[language] ??
    entry.locales.en ??
    Object.values(entry.locales)[0] ?? {
      description: "",
      name: entry.slug,
    }
  )
}

export {
  FEATURED_TOOL_SLUGS,
  POPULAR_TOOL_SLUGS,
  countToolsByCategory,
  findToolsBySlugs,
  getCategoryIcon,
  getCategoryLabel,
  resolveEntryLocale,
}
export type { ToolCategoryCount }
