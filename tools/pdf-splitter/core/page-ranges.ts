const PAGE_RANGE_ERROR = {
  DescendingRange: "page-range-descending-range",
  DuplicatePage: "page-range-duplicate-page",
  Empty: "page-range-empty",
  InvalidToken: "page-range-invalid-token",
  OutOfBounds: "page-range-out-of-bounds",
} as const

type PageRangeErrorCode =
  (typeof PAGE_RANGE_ERROR)[keyof typeof PAGE_RANGE_ERROR]

type ParsedPageRanges = Readonly<{
  pagesInOrder: readonly number[]
  segments: readonly (readonly number[])[]
}>

function createPageRangeError(code: PageRangeErrorCode) {
  return new Error(code)
}

function parseNumberToken(value: string) {
  return /^\d+$/.test(value) ? Number.parseInt(value, 10) : null
}

function ensurePageInBounds(page: number, maxPage: number) {
  if (!Number.isInteger(page) || page < 1 || page > maxPage) {
    throw createPageRangeError(PAGE_RANGE_ERROR.OutOfBounds)
  }
}

function parsePageRanges(rawInput: string, maxPage: number): ParsedPageRanges {
  const normalized = rawInput.trim()

  if (!normalized) {
    throw createPageRangeError(PAGE_RANGE_ERROR.Empty)
  }

  if (!Number.isInteger(maxPage) || maxPage < 1) {
    throw createPageRangeError(PAGE_RANGE_ERROR.OutOfBounds)
  }

  const tokens = normalized
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    throw createPageRangeError(PAGE_RANGE_ERROR.Empty)
  }

  const segments: number[][] = []
  const pagesInOrder: number[] = []
  const seenPages = new Set<number>()

  for (const token of tokens) {
    const simpleNumber = parseNumberToken(token)

    if (simpleNumber !== null) {
      ensureUniquePage(simpleNumber, maxPage, seenPages)
      pagesInOrder.push(simpleNumber)
      segments.push([simpleNumber])
      continue
    }

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/)

    if (!rangeMatch) {
      throw createPageRangeError(PAGE_RANGE_ERROR.InvalidToken)
    }

    const startPage = Number.parseInt(rangeMatch[1]!, 10)
    const endPage = Number.parseInt(rangeMatch[2]!, 10)

    ensurePageInBounds(startPage, maxPage)
    ensurePageInBounds(endPage, maxPage)

    if (startPage > endPage) {
      throw createPageRangeError(PAGE_RANGE_ERROR.DescendingRange)
    }

    const segment: number[] = []

    for (let page = startPage; page <= endPage; page += 1) {
      ensureUniquePage(page, maxPage, seenPages)
      segment.push(page)
      pagesInOrder.push(page)
    }

    segments.push(segment)
  }

  return { pagesInOrder, segments }
}

function ensureUniquePage(
  page: number,
  maxPage: number,
  seenPages: Set<number>
) {
  ensurePageInBounds(page, maxPage)

  if (seenPages.has(page)) {
    throw createPageRangeError(PAGE_RANGE_ERROR.DuplicatePage)
  }

  seenPages.add(page)
}

function formatPagesToRanges(pages: readonly number[]) {
  const normalizedPages = [...new Set(pages)]
    .filter((page) => Number.isInteger(page) && page > 0)
    .sort((left, right) => left - right)

  const firstPage = normalizedPages[0]

  if (firstPage === undefined) {
    return ""
  }

  const chunks: string[] = []
  let start = firstPage
  let previous = firstPage

  for (let index = 1; index < normalizedPages.length; index += 1) {
    const current = normalizedPages[index]!

    if (current === previous + 1) {
      previous = current
      continue
    }

    chunks.push(formatRangeChunk(start, previous))
    start = current
    previous = current
  }

  chunks.push(formatRangeChunk(start, previous))

  return chunks.join(",")
}

function formatRangeChunk(start: number, end: number) {
  return start === end ? String(start) : `${start}-${end}`
}

function createPageList(pageCount: number) {
  const normalizedCount = Math.max(0, Math.floor(pageCount))

  return Array.from({ length: normalizedCount }, (_, index) => index + 1)
}

function createOddPageList(pageCount: number) {
  return createPageList(pageCount).filter((page) => page % 2 === 1)
}

function createEvenPageList(pageCount: number) {
  return createPageList(pageCount).filter((page) => page % 2 === 0)
}

export {
  PAGE_RANGE_ERROR,
  createEvenPageList,
  createOddPageList,
  createPageList,
  formatPagesToRanges,
  parsePageRanges,
}
