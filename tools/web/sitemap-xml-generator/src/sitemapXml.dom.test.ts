import { describe, expect, it } from 'vitest'
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

  it('normalizes auto-joined entries and omits optional url tags when empty', () => {
    const state: SitemapState = {
      ...createBaseState(),
      autoJoin: true,
      baseUrl: 'https://example.com/',
      urls: [
        {
          id: 'url-0',
          loc: 'about',
          lastmod: '',
          changefreq: null,
          priority: null,
          images: [
            {
              loc: 'images/hero.jpg',
              title: '',
              caption: '',
              license: '',
            },
          ],
          videos: [
            {
              thumbnailLoc: 'thumbs/intro.jpg',
              title: 'Player only',
              description: 'Uses only player URL',
              contentLoc: '',
              playerLoc: 'player',
              duration: Number.NaN,
              publicationDate: '',
            },
            {
              thumbnailLoc: 'thumbs/content.jpg',
              title: 'Content only',
              description: 'Uses only content URL',
              contentLoc: 'videos/content.mp4',
              playerLoc: '',
              duration: 13.2,
              publicationDate: '2024-02-01',
            },
          ],
          news: [
            {
              publicationName: 'Example News',
              publicationLanguage: 'en',
              title: 'Launch update',
              publicationDate: '2024-01-25',
              keywords: '',
            },
          ],
        },
      ],
    }

    const output = buildUrlset(state)

    expect(output).toContain('<loc>https://example.com/about</loc>')
    expect(output).toContain('<image:loc>https://example.com/images/hero.jpg</image:loc>')
    expect(output).toContain('<video:player_loc>https://example.com/player</video:player_loc>')
    expect(output).toContain(
      '<video:content_loc>https://example.com/videos/content.mp4</video:content_loc>',
    )
    expect(output).toContain('<video:duration>13</video:duration>')
    expect(output).not.toContain('<video:duration>NaN</video:duration>')
    expect(output).not.toContain('<priority>')
    expect(output).not.toContain('<changefreq>')
    expect(output).not.toContain('<lastmod>')
    expect(output).not.toContain('<news:keywords>')
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

  it('builds sitemap index entries without forcing lastmod tags', () => {
    const state: SitemapState = {
      ...createBaseState(),
      mode: 'sitemapindex',
      autoJoin: true,
      baseUrl: 'https://example.com/',
      sitemaps: [
        {
          id: 'sitemap-0',
          loc: 'sitemap-1.xml',
          lastmod: '',
        },
        {
          id: 'sitemap-1',
          loc: '/sitemap-2.xml',
          lastmod: '2024-01-20',
        },
      ],
    }

    const output = buildSitemapIndex(state)

    expect(output).toContain('<loc>https://example.com/sitemap-1.xml</loc>')
    expect(output).toContain('<loc>https://example.com/sitemap-2.xml</loc>')
    expect(output).toContain('<lastmod>2024-01-20</lastmod>')
    expect(output).not.toContain('<lastmod></lastmod>')
  })
})
