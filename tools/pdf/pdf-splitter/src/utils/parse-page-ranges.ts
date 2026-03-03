export const PAGE_RANGE_ERROR = {
  Empty: 'page-range-empty',
  InvalidToken: 'page-range-invalid-token',
  OutOfBounds: 'page-range-out-of-bounds',
  DescendingRange: 'page-range-descending-range',
  DuplicatePage: 'page-range-duplicate-page',
} as const

export type PageRangeErrorCode = (typeof PAGE_RANGE_ERROR)[keyof typeof PAGE_RANGE_ERROR]

export type ParsedPageRanges = {
  segments: number[][]
  pagesInOrder: number[]
}

const ensurePageInBounds = (page: number, maxPage: number): void => {
  if (!Number.isInteger(page) || page < 1 || page > maxPage) {
    throw new Error(PAGE_RANGE_ERROR.OutOfBounds)
  }
}

const parseNumberToken = (value: string): number | null => {
  if (!/^\d+$/.test(value)) {
    return null
  }

  return Number.parseInt(value, 10)
}

export const parsePageRanges = (rawInput: string, maxPage: number): ParsedPageRanges => {
  const normalized = rawInput.trim()
  if (!normalized) {
    throw new Error(PAGE_RANGE_ERROR.Empty)
  }

  const tokens = normalized
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    throw new Error(PAGE_RANGE_ERROR.Empty)
  }

  const segments: number[][] = []
  const pagesInOrder: number[] = []
  const seenPages = new Set<number>()

  for (const token of tokens) {
    const simpleNumber = parseNumberToken(token)
    if (simpleNumber !== null) {
      ensurePageInBounds(simpleNumber, maxPage)

      if (seenPages.has(simpleNumber)) {
        throw new Error(PAGE_RANGE_ERROR.DuplicatePage)
      }

      seenPages.add(simpleNumber)
      pagesInOrder.push(simpleNumber)
      segments.push([simpleNumber])
      continue
    }

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/)
    if (!rangeMatch) {
      throw new Error(PAGE_RANGE_ERROR.InvalidToken)
    }

    const startPage = Number.parseInt(rangeMatch[1] ?? '', 10)
    const endPage = Number.parseInt(rangeMatch[2] ?? '', 10)

    ensurePageInBounds(startPage, maxPage)
    ensurePageInBounds(endPage, maxPage)

    if (startPage > endPage) {
      throw new Error(PAGE_RANGE_ERROR.DescendingRange)
    }

    const segment: number[] = []
    for (let page = startPage; page <= endPage; page += 1) {
      if (seenPages.has(page)) {
        throw new Error(PAGE_RANGE_ERROR.DuplicatePage)
      }

      seenPages.add(page)
      segment.push(page)
      pagesInOrder.push(page)
    }

    segments.push(segment)
  }

  if (pagesInOrder.length === 0) {
    throw new Error(PAGE_RANGE_ERROR.Empty)
  }

  return {
    segments,
    pagesInOrder,
  }
}

const dedupeAndSortPages = (pages: number[]): number[] => {
  return [...new Set(pages)].sort((left, right) => left - right)
}

export const formatPagesToRanges = (pages: number[]): string => {
  const normalizedPages = dedupeAndSortPages(pages)

  const firstPage = normalizedPages[0]
  if (firstPage === undefined) {
    return ''
  }

  const chunks: string[] = []
  let start = firstPage
  let previous = firstPage

  for (let index = 1; index < normalizedPages.length; index += 1) {
    const current = normalizedPages[index]
    if (current === undefined) {
      continue
    }

    if (current === previous + 1) {
      previous = current
      continue
    }

    if (start === previous) {
      chunks.push(`${start}`)
    } else {
      chunks.push(`${start}-${previous}`)
    }

    start = current
    previous = current
  }

  if (start === previous) {
    chunks.push(`${start}`)
  } else {
    chunks.push(`${start}-${previous}`)
  }

  return chunks.join(',')
}
