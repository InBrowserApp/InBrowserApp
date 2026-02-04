import { describe, it, expect } from 'vitest'
import { createImageEntry, createNewsEntry, createVideoEntry, defaultState } from './sitemapState'

describe('sitemapState', () => {
  it('creates empty extension entries', () => {
    expect(createImageEntry()).toEqual({
      loc: '',
      title: '',
      caption: '',
      license: '',
    })

    expect(createVideoEntry()).toEqual({
      thumbnailLoc: '',
      title: '',
      description: '',
      contentLoc: '',
      playerLoc: '',
      duration: null,
      publicationDate: '',
    })

    expect(createNewsEntry()).toEqual({
      publicationName: '',
      publicationLanguage: '',
      title: '',
      publicationDate: '',
      keywords: '',
    })
  })

  it('builds a default state snapshot', () => {
    const state = defaultState()

    expect(state.mode).toBe('urlset')
    expect(state.baseUrl).toBe('https://example.com')
    expect(state.autoJoin).toBe(true)
    expect(state.urls).toHaveLength(1)
    expect(state.urls[0]?.loc).toBe('/')
    expect(state.urls[0]?.changefreq).toBe('weekly')
    expect(state.urls[0]?.priority).toBe(1)
    expect(state.sitemaps).toHaveLength(1)
    expect(state.sitemaps[0]?.loc).toBe('/sitemap.xml')
  })
})
