import { toolStaticPaths } from "@workspace/tool-registry"

import type { SiteLanguage } from "./site"
import type { AlternateLink } from "./site"

import {
  DEFAULT_SITE_LANGUAGE,
  SITE_URL,
  SUPPORTED_SITE_LANGUAGES,
  getAlternateLinks,
  getCanonicalUrl,
  isSupportedSiteLanguage,
  resolveLocalizedAssetLanguage,
} from "./site"

type PageSeo = Readonly<{
  title: string
  description: string
  canonicalUrl: string
  alternateLinks: readonly AlternateLink[]
}>

type SitemapEntry = Readonly<{
  loc: string
  alternates: readonly AlternateLink[]
}>

function createPageSeo(options: {
  title: string
  description: string
  pathname: string
  language: SiteLanguage
  availableLanguages?: readonly SiteLanguage[]
}) {
  return {
    alternateLinks: getAlternateLinks(
      options.pathname,
      options.availableLanguages ?? SUPPORTED_SITE_LANGUAGES
    ),
    canonicalUrl: getCanonicalUrl(options.pathname, options.language),
    description: options.description,
    title: options.title,
  } as const satisfies PageSeo
}

function getSitemapEntries() {
  const entries: SitemapEntry[] = [
    {
      alternates: getAlternateLinks("/", SUPPORTED_SITE_LANGUAGES),
      loc: getCanonicalUrl("/", DEFAULT_SITE_LANGUAGE),
    },
    {
      alternates: getAlternateLinks("/tools", SUPPORTED_SITE_LANGUAGES),
      loc: getCanonicalUrl("/tools", DEFAULT_SITE_LANGUAGE),
    },
  ]

  const toolLanguagesBySlug = new Map<string, SiteLanguage[]>()

  for (const { language, slug } of toolStaticPaths) {
    if (!isSupportedSiteLanguage(language)) {
      continue
    }

    const existingLanguages = toolLanguagesBySlug.get(slug) ?? []

    if (!existingLanguages.includes(language)) {
      existingLanguages.push(language)
      existingLanguages.sort((left, right) => left.localeCompare(right))
      toolLanguagesBySlug.set(slug, existingLanguages)
    }
  }

  for (const [slug, languages] of toolLanguagesBySlug.entries()) {
    const canonicalLanguage = resolveLocalizedAssetLanguage(
      DEFAULT_SITE_LANGUAGE,
      languages,
      DEFAULT_SITE_LANGUAGE
    )

    entries.push({
      alternates: getAlternateLinks(`/tools/${slug}`, languages),
      loc: getCanonicalUrl(`/tools/${slug}`, canonicalLanguage),
    })
  }

  return entries
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function buildSitemapXml(entries: readonly SitemapEntry[]) {
  const urls = entries
    .map(
      (entry) => `<url>
  <loc>${escapeXml(entry.loc)}</loc>
${entry.alternates
  .map(
    (alternate) =>
      `  <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hrefLang)}" href="${escapeXml(alternate.href)}" />`
  )
  .join("\n")}
</url>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

export { SITE_URL, buildSitemapXml, createPageSeo, getSitemapEntries }
export type { PageSeo, SitemapEntry }
