const MIME_TYPE_CATEGORIES = [
  "application",
  "audio",
  "font",
  "image",
  "message",
  "model",
  "multipart",
  "text",
  "video",
] as const

type MimeTypeCategory = (typeof MIME_TYPE_CATEGORIES)[number]
type MimeTypeCategoryLabel = MimeTypeCategory | "unknown"
type MimeTypeFilter = "all" | MimeTypeCategory
type MimeTypeEntry = Readonly<{
  mimeType: string
  category: MimeTypeCategoryLabel
  extensions: readonly string[]
  source?: string
  charset?: string
  compressible?: boolean
}>
type MimeDatabaseEntry = Readonly<{
  extensions?: readonly string[]
  source?: string
  charset?: string
  compressible?: boolean
}>
type MimeDatabase = Readonly<Record<string, MimeDatabaseEntry>>

function normalizeMimeTypeQuery(value: string) {
  return value.trim().toLowerCase()
}

function isMimeTypeCategory(value: string): value is MimeTypeCategory {
  return MIME_TYPE_CATEGORIES.includes(value as MimeTypeCategory)
}

function getMimeTypeCategory(mimeType: string): MimeTypeCategoryLabel {
  const [category = ""] = mimeType.split("/")

  return isMimeTypeCategory(category) ? category : "unknown"
}

function createMimeTypeEntries(
  database: MimeDatabase
): readonly MimeTypeEntry[] {
  return Object.entries(database)
    .map(([mimeType, entry]) => ({
      mimeType,
      category: getMimeTypeCategory(mimeType),
      extensions: entry.extensions ?? [],
      source: entry.source,
      charset: entry.charset,
      compressible: entry.compressible,
    }))
    .sort((left, right) => left.mimeType.localeCompare(right.mimeType))
}

function filterMimeTypeEntries(
  entries: readonly MimeTypeEntry[],
  searchQuery: string,
  filter: MimeTypeFilter
) {
  let filteredEntries = entries

  if (filter !== "all") {
    filteredEntries = filteredEntries.filter(
      (entry) => entry.category === filter
    )
  }

  const normalizedQuery = normalizeMimeTypeQuery(searchQuery)

  if (normalizedQuery === "") {
    return filteredEntries
  }

  return filteredEntries.filter((entry) => {
    return (
      entry.mimeType.toLowerCase().includes(normalizedQuery) ||
      entry.extensions.some((extension) =>
        extension.toLowerCase().includes(normalizedQuery)
      ) ||
      entry.source?.toLowerCase().includes(normalizedQuery) === true ||
      entry.charset?.toLowerCase().includes(normalizedQuery) === true
    )
  })
}

export {
  MIME_TYPE_CATEGORIES,
  createMimeTypeEntries,
  filterMimeTypeEntries,
  getMimeTypeCategory,
  isMimeTypeCategory,
  normalizeMimeTypeQuery,
}
export type {
  MimeTypeCategory,
  MimeTypeCategoryLabel,
  MimeTypeEntry,
  MimeTypeFilter,
}
