export type Mode = 'urlset' | 'sitemapindex'

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export type ImageEntry = {
  loc: string
  title: string
  caption: string
  license: string
}

export type VideoEntry = {
  thumbnailLoc: string
  title: string
  description: string
  contentLoc: string
  playerLoc: string
  duration: number | null
  publicationDate: string
}

export type NewsEntry = {
  publicationName: string
  publicationLanguage: string
  title: string
  publicationDate: string
  keywords: string
}

export type UrlEntry = {
  id: string
  loc: string
  lastmod: string
  changefreq: Changefreq | null
  priority: number | null
  images: ImageEntry[]
  videos: VideoEntry[]
  news: NewsEntry[]
}

export type SitemapEntry = {
  id: string
  loc: string
  lastmod: string
}

export type SitemapState = {
  mode: Mode
  baseUrl: string
  autoJoin: boolean
  urls: UrlEntry[]
  sitemaps: SitemapEntry[]
}

export type NormalizedUrlEntry = {
  loc: string
  lastmod: string
  changefreq: Changefreq | null
  priority: number | null
  images: ImageEntry[]
  videos: VideoEntry[]
  news: NewsEntry[]
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const createUrlEntry = (overrides: Partial<UrlEntry> = {}): UrlEntry => ({
  id: createId(),
  loc: '',
  lastmod: '',
  changefreq: null,
  priority: null,
  images: [],
  videos: [],
  news: [],
  ...overrides,
})

export const createSitemapEntry = (overrides: Partial<SitemapEntry> = {}): SitemapEntry => ({
  id: createId(),
  loc: '',
  lastmod: '',
  ...overrides,
})

export const createImageEntry = (): ImageEntry => ({ loc: '', title: '', caption: '', license: '' })

export const createVideoEntry = (): VideoEntry => ({
  thumbnailLoc: '',
  title: '',
  description: '',
  contentLoc: '',
  playerLoc: '',
  duration: null,
  publicationDate: '',
})

export const createNewsEntry = (): NewsEntry => ({
  publicationName: '',
  publicationLanguage: '',
  title: '',
  publicationDate: '',
  keywords: '',
})

export const defaultState = (): SitemapState => ({
  mode: 'urlset',
  baseUrl: 'https://example.com',
  autoJoin: true,
  urls: [
    createUrlEntry({
      loc: '/',
      lastmod: '2024-01-15',
      changefreq: 'weekly',
      priority: 1,
    }),
  ],
  sitemaps: [createSitemapEntry({ loc: '/sitemap.xml' })],
})

export const changefreqOptions = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
].map((value) => ({ label: value, value }))
