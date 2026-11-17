import type { Entry } from "../types"

export type StatusFilter = "all" | "failed" | "redirects"
export type SortOrder = "start" | "slowest" | "largest"

export function isFailure(entry: Entry) {
  return entry.status === 0 || entry.status >= 400
}

export function selectEntries(
  entries: readonly Entry[],
  search: string,
  status: StatusFilter,
  sort: SortOrder
) {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const result = entries.filter((item) => {
    if (status === "failed" && !isFailure(item)) return false
    if (status === "redirects" && (item.status < 300 || item.status >= 400))
      return false
    const haystack =
      `${item.url} ${item.method} ${item.status} ${item.mimeType}`.toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
  return result.sort((a, b) => {
    if (sort === "slowest")
      return (b.duration ?? -1) - (a.duration ?? -1) || a.id - b.id
    if (sort === "largest")
      return (b.transferSize ?? -1) - (a.transferSize ?? -1) || a.id - b.id
    return a.started - b.started || a.id - b.id
  })
}

export function requestName(url: string): string {
  try {
    const parsed = new URL(url)
    return (
      parsed.pathname.split("/").filter(Boolean).pop() || parsed.hostname || url
    )
  } catch {
    return url
  }
}

const numberFormatters = new Map<string, Intl.NumberFormat>()

function formatNumber(
  value: number,
  lang: string,
  maximumFractionDigits: number
) {
  const key = `${lang}:${maximumFractionDigits}`
  let formatter = numberFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(lang, { maximumFractionDigits })
    numberFormatters.set(key, formatter)
  }
  return formatter.format(value)
}

export function formatTime(
  value: number | null,
  lang: string,
  unknown: string
) {
  if (value === null) return unknown
  return `${formatNumber(value >= 1000 ? value / 1000 : value, lang, value >= 1000 ? 2 : 1)}\u00a0${value >= 1000 ? "s" : "ms"}`
}

export function formatBytes(
  value: number | null,
  lang: string,
  unknown: string
) {
  if (value === null) return unknown
  const unit = value >= 1024 * 1024 ? 2 : value >= 1024 ? 1 : 0
  return `${formatNumber(value / 1024 ** unit, lang, unit ? 1 : 0)}\u00a0${["B", "KiB", "MiB"][unit]}`
}
