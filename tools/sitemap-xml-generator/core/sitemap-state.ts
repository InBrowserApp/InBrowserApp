const CHANGE_FREQUENCIES = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const

type SitemapMode = "urlset" | "sitemapindex"
type ChangeFrequency = (typeof CHANGE_FREQUENCIES)[number]

type UrlEntryInput = Readonly<{
  id: string
  loc: string
  lastmod: string
  changefreq: ChangeFrequency | ""
  priority: string
}>

type SitemapEntryInput = Readonly<{
  id: string
  loc: string
  lastmod: string
}>

type SitemapGeneratorState = Readonly<{
  mode: SitemapMode
  baseUrl: string
  autoJoin: boolean
  urlEntries: readonly UrlEntryInput[]
  sitemapEntries: readonly SitemapEntryInput[]
}>

type SitemapPresetKey = "standard" | "content" | "index"

function createId() {
  return `sitemap-${Math.random().toString(16).slice(2, 10)}`
}

function createUrlEntryInput(
  overrides: Partial<UrlEntryInput> = {}
): UrlEntryInput {
  return {
    id: createId(),
    loc: "",
    lastmod: "",
    changefreq: "",
    priority: "",
    ...overrides,
  }
}

function createSitemapEntryInput(
  overrides: Partial<SitemapEntryInput> = {}
): SitemapEntryInput {
  return {
    id: createId(),
    loc: "",
    lastmod: "",
    ...overrides,
  }
}

function createPresetState(preset: SitemapPresetKey): SitemapGeneratorState {
  if (preset === "content") {
    return {
      mode: "urlset",
      baseUrl: "https://example.com",
      autoJoin: true,
      urlEntries: [
        createUrlEntryInput({
          loc: "/blog",
          lastmod: "2026-04-01",
          changefreq: "daily",
          priority: "0.8",
        }),
        createUrlEntryInput({
          loc: "/blog/launch-notes",
          lastmod: "2026-04-18",
          changefreq: "weekly",
          priority: "0.7",
        }),
        createUrlEntryInput({
          loc: "/changelog",
          lastmod: "2026-04-20",
          changefreq: "daily",
          priority: "0.6",
        }),
      ],
      sitemapEntries: [createSitemapEntryInput({ loc: "/sitemap.xml" })],
    }
  }

  if (preset === "index") {
    return {
      mode: "sitemapindex",
      baseUrl: "https://example.com",
      autoJoin: true,
      urlEntries: [createUrlEntryInput({ loc: "/" })],
      sitemapEntries: [
        createSitemapEntryInput({
          loc: "/sitemaps/pages.xml",
          lastmod: "2026-04-20",
        }),
        createSitemapEntryInput({
          loc: "/sitemaps/blog.xml",
          lastmod: "2026-04-20",
        }),
      ],
    }
  }

  return {
    mode: "urlset",
    baseUrl: "https://example.com",
    autoJoin: true,
    urlEntries: [
      createUrlEntryInput({
        loc: "/",
        lastmod: "2026-04-20",
        changefreq: "daily",
        priority: "1.0",
      }),
      createUrlEntryInput({
        loc: "/about",
        lastmod: "2026-04-14",
        changefreq: "monthly",
        priority: "0.6",
      }),
      createUrlEntryInput({
        loc: "/pricing",
        lastmod: "2026-04-18",
        changefreq: "weekly",
        priority: "0.8",
      }),
    ],
    sitemapEntries: [createSitemapEntryInput({ loc: "/sitemap.xml" })],
  }
}

const DEFAULT_SITEMAP_GENERATOR_STATE = createPresetState("standard")

export {
  CHANGE_FREQUENCIES,
  DEFAULT_SITEMAP_GENERATOR_STATE,
  createPresetState,
  createSitemapEntryInput,
  createUrlEntryInput,
}
export type {
  ChangeFrequency,
  SitemapEntryInput,
  SitemapGeneratorState,
  SitemapMode,
  SitemapPresetKey,
  UrlEntryInput,
}
