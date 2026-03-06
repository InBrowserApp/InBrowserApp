export const PAGE_RANGE_ERROR = {
  InvalidToken: 'page-range-invalid-token',
  OutOfBounds: 'page-range-out-of-bounds',
  DescendingRange: 'page-range-descending-range',
  DuplicatePage: 'page-range-duplicate-page',
} as const

export type PageRangeErrorCode = (typeof PAGE_RANGE_ERROR)[keyof typeof PAGE_RANGE_ERROR]

const parseNumberToken = (value: string): number | null => {
  if (!/^\d+$/.test(value)) {
    return null
  }

  return Number.parseInt(value, 10)
}

const ensurePageInBounds = (page: number, maxPage: number): void => {
  if (!Number.isInteger(page) || page < 1 || page > maxPage) {
    throw new Error(PAGE_RANGE_ERROR.OutOfBounds)
  }
}

export const getAllPages = (maxPage: number): number[] =>
  Array.from({ length: maxPage }, (_, index) => index + 1)

export const parsePageSelection = (rawInput: string, maxPage: number): number[] => {
  const normalized = rawInput.trim()
  if (!normalized) {
    return getAllPages(maxPage)
  }

  const tokens = normalized.split(',').map((token) => token.trim())
  if (tokens.some((token) => token.length === 0)) {
    throw new Error(PAGE_RANGE_ERROR.InvalidToken)
  }

  const selectedPages: number[] = []
  const seenPages = new Set<number>()

  for (const token of tokens) {
    const simpleNumber = parseNumberToken(token)
    if (simpleNumber !== null) {
      ensurePageInBounds(simpleNumber, maxPage)

      if (seenPages.has(simpleNumber)) {
        throw new Error(PAGE_RANGE_ERROR.DuplicatePage)
      }

      seenPages.add(simpleNumber)
      selectedPages.push(simpleNumber)
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

    for (let page = startPage; page <= endPage; page += 1) {
      if (seenPages.has(page)) {
        throw new Error(PAGE_RANGE_ERROR.DuplicatePage)
      }

      seenPages.add(page)
      selectedPages.push(page)
    }
  }

  return selectedPages
}
