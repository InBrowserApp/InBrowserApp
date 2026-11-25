import { getAlternateSearchName } from "@workspace/tool-registry/search-name"
import type {
  ToolSearchIndexEntry,
  ToolSearchSuggestionEntry,
} from "@workspace/tool-registry"

type ToolCategoryCount = Readonly<{
  category: string
  count: number
}>

type CategorizedTool = Pick<
  ToolSearchIndexEntry,
  "category" | "secondaryCategories"
>

type DirectoryToolEntry = ToolSearchSuggestionEntry &
  Readonly<{
    icon: string
    description: string
  }>

/** Icon identifiers (see ToolIcon) shown on the home category tiles. */
const CATEGORY_ICONS: Readonly<Record<string, string>> = {
  "3d-cad": "box",
  audio: "audio-lines",
  crypto: "lock",
  developer: "wrench",
  diagram: "workflow",
  document: "file-text",
  ebook: "book-open",
  geo: "map",
  image: "image",
  ipfs: "box",
  json: "braces",
  misc: "layout-grid",
  network: "network",
  pdf: "file-text",
  random: "sparkles",
  spreadsheet: "table-2",
  text: "case-sensitive",
  time: "clock3",
  video: "video",
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

function getToolCategories({ category, secondaryCategories }: CategorizedTool) {
  return [category, ...(secondaryCategories ?? [])]
}

/**
 * Aggregates tool counts per primary and secondary category, ordered by count
 * (descending) with ties broken alphabetically for a stable order.
 */
function countToolsByCategory(
  entries: readonly CategorizedTool[]
): readonly ToolCategoryCount[] {
  const counts = new Map<string, number>()

  for (const entry of entries) {
    for (const category of getToolCategories(entry)) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
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

function toDirectoryEntries(
  entries: readonly ToolSearchIndexEntry[],
  language: string
): readonly DirectoryToolEntry[] {
  return entries.map((entry) => {
    const locale = resolveEntryLocale(entry, language)

    return {
      slug: entry.slug,
      category: entry.category,
      icon: entry.icon,
      ...locale,
      alternateName: getAlternateSearchName(entry, language, locale.name),
    }
  })
}

type SearchSuggestionEntry = ToolSearchSuggestionEntry

export {
  FEATURED_TOOL_SLUGS,
  POPULAR_TOOL_SLUGS,
  countToolsByCategory,
  findToolsBySlugs,
  getCategoryIcon,
  getCategoryLabel,
  getToolCategories,
  resolveEntryLocale,
  toDirectoryEntries,
}
export type { DirectoryToolEntry, SearchSuggestionEntry, ToolCategoryCount }
