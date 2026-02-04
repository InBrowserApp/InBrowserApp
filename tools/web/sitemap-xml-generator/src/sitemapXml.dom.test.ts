import { describe, it, expect } from 'vitest'
import { buildSitemapIndex, buildUrlset } from './sitemapXml'
import type { SitemapState } from './sitemapState'

const createBaseState = (): SitemapState => ({
  mode: 'urlset',
  baseUrl: 'https://example.com',
  autoJoin: false,
  urls: [],
  sitemaps: [],
})

describe('sitemapXml', () => {
  it('builds a urlset with relative values when auto-join is off', () => {
    const state: SitemapState = {
      ...createBaseState(),
      autoJoin: false,
      urls: [
        {
          id: 'url-0',
          loc: ' /about ',
          lastmod: '2024-01-02',
          changefreq: 'daily',
          priority: 0.7,
          images: [],
          videos: [
            {
              thumbnailLoc: '/thumb.jpg',
              title: 'Intro',
              description: 'Intro video',
              contentLoc: '',
              playerLoc: '/player',
              duration: 90,
              publicationDate: '2024-01-01',
            },
          ],
          news: [],
        },
      ],
    }

    const output = buildUrlset(state)

    expect(output).toContain('<loc>/about</loc>')
    expect(output).toContain('<video:player_loc>/player</video:player_loc>')
  })

  it('returns empty output when sitemap index has no valid entries', () => {
    const state: SitemapState = {
      ...createBaseState(),
      mode: 'sitemapindex',
      sitemaps: [
        {
          id: 'sitemap-0',
          loc: '   ',
          lastmod: '',
        },
      ],
    }

    expect(buildSitemapIndex(state)).toBe('')
  })
})
