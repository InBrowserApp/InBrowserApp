function parsePages(input: string, count: number): number[] {
  if (!input.trim()) return Array.from({ length: count }, (_, i) => i + 1)
  const pages = new Set<number>()
  for (const token of input.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!match) throw new Error("rangeInvalid")
    const start = Number(match[1])
    const end = Number(match[2] ?? match[1])
    if (
      start < 1 ||
      end > count ||
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end)
    )
      throw new Error("rangeBounds")
    if (end < start) throw new Error("rangeInvalid")
    for (let page = start; page <= end; page++) {
      if (pages.has(page)) throw new Error("rangeDuplicate")
      pages.add(page)
    }
  }
  return [...pages]
}

export { parsePages }
