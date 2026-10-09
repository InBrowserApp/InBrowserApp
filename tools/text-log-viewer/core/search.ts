import { floorIndex, type TextIndex } from "./text-index"
import type { Match } from "../types"
export async function find(
  index: TextIndex,
  query: string,
  from: number,
  direction: 1 | -1,
  cancelled: () => boolean
): Promise<Match | null> {
  if (!query) return null
  const table = new Uint32Array(query.length)
  for (let i = 1, j = 0; i < query.length; i++) {
    while (j && query[i] !== query[j]) j = table[j - 1]!
    if (query[i] === query[j]) j++
    table[i] = j
  }
  let matched = 0,
    offset = 0,
    first = -1,
    last = -1,
    previous = -1
  const result = (at: number, wrapped: boolean): Match => ({
    offset: at,
    length: query.length,
    line: floorIndex(index.lines, at) + 1,
    wrapped,
  })
  for (let chunk = 0; chunk < index.chunks.length; chunk++) {
    if (chunk % 16 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
      if (cancelled()) throw new DOMException("Cancelled", "AbortError")
    }
    const text = index.chunks[chunk]!
    for (let i = 0; i < text.length; i++, offset++) {
      while (matched && text[i] !== query[matched])
        matched = table[matched - 1]!
      if (text[i] === query[matched]) matched++
      if (matched !== query.length) continue
      const at = offset - query.length + 1
      if (first < 0) first = at
      last = at
      if (direction === 1 && at >= from) return result(at, false)
      if (at <= from) previous = at
      matched = table[matched - 1]!
    }
  }
  if (first < 0) return null
  return direction === 1
    ? result(first, true)
    : result(previous < 0 ? last : previous, previous < 0)
}
