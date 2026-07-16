import type { ToolSearchIndexEntry } from "@workspace/tool-registry"

import type { SiteLanguage } from "./site"

const TOOLS_PER_PAGE = 24

type ToolDirectoryEntry = Readonly<{
  slug: string
  icon: string
  name: string
  description: string
}>

type ToolDirectoryPage = Readonly<{
  entries: readonly ToolDirectoryEntry[]
  end: number
  pageCount: number
  pageNumber: number
  start: number
  total: number
}>

function createLocalizedToolEntries(
  entries: readonly ToolSearchIndexEntry[],
  language: SiteLanguage
) {
  return [...entries]
    .sort((left, right) => {
      const leftName = left.locales.en?.name ?? left.slug
      const rightName = right.locales.en?.name ?? right.slug

      return (
        leftName.localeCompare(rightName, "en") ||
        left.slug.localeCompare(right.slug, "en")
      )
    })
    .map((entry) => {
      const locale =
        entry.locales[language] ??
        entry.locales.en ??
        Object.values(entry.locales)[0]

      return {
        description: locale?.description ?? "",
        icon: entry.icon,
        name: locale?.name ?? entry.slug,
        slug: entry.slug,
      } satisfies ToolDirectoryEntry
    })
}

function getPageCount(total: number, pageSize = TOOLS_PER_PAGE) {
  if (!Number.isInteger(total) || total < 0) {
    throw new RangeError("Tool total must be a non-negative integer.")
  }

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError("Page size must be a positive integer.")
  }

  return Math.max(1, Math.ceil(total / pageSize))
}

function paginateToolEntries(
  entries: readonly ToolDirectoryEntry[],
  pageNumber: number,
  pageSize = TOOLS_PER_PAGE
): ToolDirectoryPage {
  const pageCount = getPageCount(entries.length, pageSize)

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > pageCount
  ) {
    throw new RangeError(`Page ${pageNumber} is outside 1-${pageCount}.`)
  }

  const startIndex = (pageNumber - 1) * pageSize
  const pageEntries = entries.slice(startIndex, startIndex + pageSize)

  return {
    end: pageEntries.length === 0 ? 0 : startIndex + pageEntries.length,
    entries: pageEntries,
    pageCount,
    pageNumber,
    start: pageEntries.length === 0 ? 0 : startIndex + 1,
    total: entries.length,
  }
}

function getToolsPagePath(pageNumber: number) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw new RangeError("Page number must be a positive integer.")
  }

  return pageNumber === 1 ? "/tools" : `/tools/page/${pageNumber}`
}

function getLocalizedToolsPagePath(basePath: string, pageNumber: number) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw new RangeError("Page number must be a positive integer.")
  }

  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`

  return pageNumber === 1
    ? normalizedBasePath
    : `${normalizedBasePath}page/${pageNumber}/`
}

function getPaginationItems(pageNumber: number, pageCount: number) {
  if (
    !Number.isInteger(pageNumber) ||
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    pageNumber < 1 ||
    pageNumber > pageCount
  ) {
    throw new RangeError("Pagination state is invalid.")
  }

  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const visiblePages = new Set([
    1,
    pageCount,
    pageNumber - 1,
    pageNumber,
    pageNumber + 1,
  ])

  if (pageNumber <= 3) {
    visiblePages.add(2)
    visiblePages.add(3)
  }

  if (pageNumber >= pageCount - 2) {
    visiblePages.add(pageCount - 2)
    visiblePages.add(pageCount - 1)
  }

  const pages = [...visiblePages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((left, right) => left - right)
  const items: Array<number | null> = []

  for (const page of pages) {
    const previousPage = items.at(-1)

    if (typeof previousPage === "number" && page - previousPage > 1) {
      items.push(null)
    }

    items.push(page)
  }

  return items
}

export {
  TOOLS_PER_PAGE,
  createLocalizedToolEntries,
  getLocalizedToolsPagePath,
  getPageCount,
  getPaginationItems,
  getToolsPagePath,
  paginateToolEntries,
}
export type { ToolDirectoryEntry, ToolDirectoryPage }
