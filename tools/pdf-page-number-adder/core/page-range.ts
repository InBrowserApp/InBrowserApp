const PAGE_RANGE_ERROR = {
  DescendingRange: "page-range-descending-range",
  DuplicatePage: "page-range-duplicate-page",
  InvalidToken: "page-range-invalid-token",
  OutOfBounds: "page-range-out-of-bounds",
} as const

type PageRangeErrorCode =
  (typeof PAGE_RANGE_ERROR)[keyof typeof PAGE_RANGE_ERROR]

function parseNumberToken(value: string) {
  return /^\d+$/.test(value) ? Number.parseInt(value, 10) : null
}

function ensurePageInBounds(page: number, maxPage: number) {
  if (!Number.isInteger(page) || page < 1 || page > maxPage) {
    throw new Error(PAGE_RANGE_ERROR.OutOfBounds)
  }
}

function getAllPages(maxPage: number) {
  return Array.from({ length: Math.max(0, maxPage) }, (_, index) => index + 1)
}

function parsePageSelection(rawInput: string, maxPage: number) {
  const normalized = rawInput.trim()

  if (!normalized) {
    return getAllPages(maxPage)
  }

  const selectedPages: number[] = []
  const seenPages = new Set<number>()
  const tokens = normalized.split(",").map((token) => token.trim())

  if (tokens.some((token) => token.length === 0)) {
    throw new Error(PAGE_RANGE_ERROR.InvalidToken)
  }

  for (const token of tokens) {
    const page = parseNumberToken(token)

    if (page !== null) {
      appendPage(selectedPages, seenPages, page, maxPage)
      continue
    }

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/)

    if (!rangeMatch) {
      throw new Error(PAGE_RANGE_ERROR.InvalidToken)
    }

    const startPage = Number.parseInt(rangeMatch[1]!, 10)
    const endPage = Number.parseInt(rangeMatch[2]!, 10)

    ensurePageInBounds(startPage, maxPage)
    ensurePageInBounds(endPage, maxPage)

    if (startPage > endPage) {
      throw new Error(PAGE_RANGE_ERROR.DescendingRange)
    }

    for (let nextPage = startPage; nextPage <= endPage; nextPage += 1) {
      appendPage(selectedPages, seenPages, nextPage, maxPage)
    }
  }

  return selectedPages
}

function appendPage(
  selectedPages: number[],
  seenPages: Set<number>,
  page: number,
  maxPage: number
) {
  ensurePageInBounds(page, maxPage)

  if (seenPages.has(page)) {
    throw new Error(PAGE_RANGE_ERROR.DuplicatePage)
  }

  seenPages.add(page)
  selectedPages.push(page)
}

export { PAGE_RANGE_ERROR, getAllPages, parsePageSelection }
export type { PageRangeErrorCode }
