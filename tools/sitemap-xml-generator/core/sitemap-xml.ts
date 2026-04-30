import type { SitemapGeneratorState } from "./sitemap-state"
import {
  escapeXml,
  formatLastmod,
  formatPriority,
  normalizeLocation,
} from "./sitemap-format"

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
        | "invalid-lastmod"
        | "invalid-priority"
        | "invalid-sitemap-location"
        | "invalid-url-location"
      index?: number
    }>

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

    const normalizedLastmod = formatLastmod(entry.lastmod)

    if (normalizedLastmod.state === "error") {
      return {
        state: "error",
        errorCode: "invalid-lastmod",
        index,
      }
    }

    entryLines.push("  <url>")
    entryLines.push(`    <loc>${escapeXml(normalizedLocation.location)}</loc>`)

    if (normalizedLastmod.state === "success") {
      entryLines.push(
        `    <lastmod>${escapeXml(normalizedLastmod.lastmod)}</lastmod>`
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

    const normalizedLastmod = formatLastmod(entry.lastmod)

    if (normalizedLastmod.state === "error") {
      return {
        state: "error",
        errorCode: "invalid-lastmod",
        index,
      }
    }

    entryLines.push("  <sitemap>")
    entryLines.push(`    <loc>${escapeXml(normalizedLocation.location)}</loc>`)

    if (normalizedLastmod.state === "success") {
      entryLines.push(
        `    <lastmod>${escapeXml(normalizedLastmod.lastmod)}</lastmod>`
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
