import {
  CHANGE_FREQUENCIES,
  DEFAULT_SITEMAP_GENERATOR_STATE,
  createSitemapEntryInput,
  createUrlEntryInput,
  type SitemapEntryInput,
  type SitemapGeneratorState,
  type UrlEntryInput,
} from "../core/sitemap-state"

function normalizeUrlEntries(value: unknown): readonly UrlEntryInput[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SITEMAP_GENERATOR_STATE.urlEntries
  }

  const entries = value
    .filter((entry) => typeof entry === "object" && entry !== null)
    .map((entry) =>
      createUrlEntryInput({
        loc: typeof entry.loc === "string" ? entry.loc : "",
        lastmod: typeof entry.lastmod === "string" ? entry.lastmod : "",
        changefreq:
          typeof entry.changefreq === "string" &&
          CHANGE_FREQUENCIES.includes(
            entry.changefreq as (typeof CHANGE_FREQUENCIES)[number]
          )
            ? entry.changefreq
            : "",
        priority: typeof entry.priority === "string" ? entry.priority : "",
      })
    )

  return entries.length > 0
    ? entries
    : DEFAULT_SITEMAP_GENERATOR_STATE.urlEntries
}

function normalizeSitemapEntries(value: unknown): readonly SitemapEntryInput[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SITEMAP_GENERATOR_STATE.sitemapEntries
  }

  const entries = value
    .filter((entry) => typeof entry === "object" && entry !== null)
    .map((entry) =>
      createSitemapEntryInput({
        loc: typeof entry.loc === "string" ? entry.loc : "",
        lastmod: typeof entry.lastmod === "string" ? entry.lastmod : "",
      })
    )

  return entries.length > 0
    ? entries
    : DEFAULT_SITEMAP_GENERATOR_STATE.sitemapEntries
}

function parseStoredGeneratorState(
  value: string | null
): SitemapGeneratorState {
  if (value === null) {
    return DEFAULT_SITEMAP_GENERATOR_STATE
  }

  try {
    const parsed = JSON.parse(value)

    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_SITEMAP_GENERATOR_STATE
    }

    return {
      mode:
        parsed.mode === "sitemapindex" || parsed.mode === "urlset"
          ? parsed.mode
          : DEFAULT_SITEMAP_GENERATOR_STATE.mode,
      baseUrl:
        typeof parsed.baseUrl === "string"
          ? parsed.baseUrl
          : DEFAULT_SITEMAP_GENERATOR_STATE.baseUrl,
      autoJoin:
        typeof parsed.autoJoin === "boolean"
          ? parsed.autoJoin
          : DEFAULT_SITEMAP_GENERATOR_STATE.autoJoin,
      urlEntries: normalizeUrlEntries(parsed.urlEntries),
      sitemapEntries: normalizeSitemapEntries(parsed.sitemapEntries),
    }
  } catch {
    return DEFAULT_SITEMAP_GENERATOR_STATE
  }
}

export { parseStoredGeneratorState }
