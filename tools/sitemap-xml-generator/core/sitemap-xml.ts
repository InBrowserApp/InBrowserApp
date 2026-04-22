import type { SitemapGeneratorState } from "./sitemap-state"

type BuildSitemapResult =
  | Readonly<{
      state: "empty"
    }>
  | Readonly<{
      state: "success"
      xml: string
      entryCount: number
    }>
  | Readonly<{
      state: "error"
      errorCode:
        | "invalid-base-url"
        | "invalid-priority"
        | "invalid-sitemap-location"
        | "invalid-url-location"
      index?: number
    }>

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function isAbsoluteUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol.length > 0
  } catch {
    return false
  }
}

function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim()

  if (trimmed.length === 0) {
    return null
  }

  try {
    return new URL(trimmed)
  } catch {
    return null
  }
}

function normalizeLocation(
  location: string,
  baseUrl: string,
  autoJoin: boolean
) {
  const trimmed = location.trim()

  if (trimmed.length === 0) {
    return { state: "empty" } as const
  }

  if (isAbsoluteUrl(trimmed)) {
    return { state: "success", location: trimmed } as const
  }

  if (!autoJoin) {
    return { state: "error", errorCode: "invalid-location" } as const
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  if (!normalizedBaseUrl) {
    return { state: "error", errorCode: "invalid-base-url" } as const
  }

  try {
    return {
      state: "success",
      location: new URL(trimmed, normalizedBaseUrl).toString(),
    } as const
  } catch {
    return { state: "error", errorCode: "invalid-location" } as const
  }
}

function formatPriority(priority: string) {
  const trimmed = priority.trim()

  if (trimmed.length === 0) {
    return { state: "empty" } as const
  }

  const numericPriority = Number(trimmed)

  if (!Number.isFinite(numericPriority)) {
    return { state: "error" } as const
  }

  if (numericPriority < 0 || numericPriority > 1) {
    return { state: "error" } as const
  }

  return {
    state: "success",
    priority: numericPriority.toFixed(1),
  } as const
}

function buildUrlsetXml(input: SitemapGeneratorState): BuildSitemapResult {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>']
  const entryLines: string[] = []
  let entryCount = 0

  for (const [index, entry] of input.urlEntries.entries()) {
    const normalizedLocation = normalizeLocation(
      entry.loc,
      input.baseUrl,
      input.autoJoin
    )

    if (normalizedLocation.state === "empty") {
      continue
    }

    if (normalizedLocation.state === "error") {
      return {
        state: "error",
        errorCode:
          normalizedLocation.errorCode === "invalid-base-url"
            ? "invalid-base-url"
            : "invalid-url-location",
        index,
      }
    }

    const normalizedPriority = formatPriority(entry.priority)

    if (normalizedPriority.state === "error") {
      return {
        state: "error",
        errorCode: "invalid-priority",
        index,
      }
    }

    entryLines.push("  <url>")
    entryLines.push(`    <loc>${escapeXml(normalizedLocation.location)}</loc>`)

    if (entry.lastmod.trim().length > 0) {
      entryLines.push(
        `    <lastmod>${escapeXml(entry.lastmod.trim())}</lastmod>`
      )
    }

    if (entry.changefreq) {
      entryLines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
    }

    if (normalizedPriority.state === "success") {
      entryLines.push(`    <priority>${normalizedPriority.priority}</priority>`)
    }

    entryLines.push("  </url>")
    entryCount += 1
  }

  if (entryCount === 0) {
    return { state: "empty" }
  }

  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  lines.push(...entryLines)
  lines.push("</urlset>")

  return {
    state: "success",
    xml: lines.join("\n"),
    entryCount,
  }
}

function buildSitemapIndexXml(
  input: SitemapGeneratorState
): BuildSitemapResult {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>']
  const entryLines: string[] = []
  let entryCount = 0

  for (const [index, entry] of input.sitemapEntries.entries()) {
    const normalizedLocation = normalizeLocation(
      entry.loc,
      input.baseUrl,
      input.autoJoin
    )

    if (normalizedLocation.state === "empty") {
      continue
    }

    if (normalizedLocation.state === "error") {
      return {
        state: "error",
        errorCode:
          normalizedLocation.errorCode === "invalid-base-url"
            ? "invalid-base-url"
            : "invalid-sitemap-location",
        index,
      }
    }

    entryLines.push("  <sitemap>")
    entryLines.push(`    <loc>${escapeXml(normalizedLocation.location)}</loc>`)

    if (entry.lastmod.trim().length > 0) {
      entryLines.push(
        `    <lastmod>${escapeXml(entry.lastmod.trim())}</lastmod>`
      )
    }

    entryLines.push("  </sitemap>")
    entryCount += 1
  }

  if (entryCount === 0) {
    return { state: "empty" }
  }

  lines.push(
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  )
  lines.push(...entryLines)
  lines.push("</sitemapindex>")

  return {
    state: "success",
    xml: lines.join("\n"),
    entryCount,
  }
}

function buildSitemapXml(input: SitemapGeneratorState): BuildSitemapResult {
  return input.mode === "urlset"
    ? buildUrlsetXml(input)
    : buildSitemapIndexXml(input)
}

export { buildSitemapXml }
export type { BuildSitemapResult }
