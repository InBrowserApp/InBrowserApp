import { parseNftUrl } from "./urls"
import type { Item } from "./batch"

export type IdFormat = "decimal" | "hex"
const maxId = (1n << 256n) - 1n
const maxRange = 500n

export function expandUriPattern(
  input: string,
  start: string,
  end: string,
  format: IdFormat
): { items: Item[] } | { error: "invalidPattern" | "invalidRange" } {
  const template = input.trim()
  const example = parseNftUrl(template.replaceAll("{id}", "1"))
  if (!template.includes("{id}") || !example || example.protocol === "data:") {
    return { error: "invalidPattern" }
  }

  const firstText = start.trim()
  const lastText = end.trim()
  if (!/^\d{1,78}$/.test(firstText) || !/^\d{1,78}$/.test(lastText)) {
    return { error: "invalidRange" }
  }

  const first = BigInt(firstText)
  const last = BigInt(lastText)
  if (last > maxId || last < first || last - first >= maxRange) {
    return { error: "invalidRange" }
  }

  const items: Item[] = []
  for (let id = first; id <= last; id++) {
    const tokenId =
      format === "hex" ? id.toString(16).padStart(64, "0") : undefined
    const token = tokenId ?? id.toString().padStart(firstText.length, "0")
    items.push({ source: template.replaceAll("{id}", token), tokenId })
  }
  return { items }
}
