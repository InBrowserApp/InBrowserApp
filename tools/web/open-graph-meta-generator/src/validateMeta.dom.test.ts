import { describe, expect, it } from 'vitest'
import { createPresetState } from './state'
import { validateMeta } from './validateMeta'

describe('validateMeta', () => {
  it('returns no diagnostics for a healthy website preset', () => {
    expect(validateMeta(createPresetState('website'))).toEqual([])
  })

  it('allows empty article timestamps without reporting datetime warnings', () => {
    const state = createPresetState('article')
    state.article.publishedTime = ''
    state.article.modifiedTime = ''

    const diagnostics = validateMeta(state)

    expect(
      diagnostics.find((diagnostic) => diagnostic.id === 'invalid-published-time'),
    ).toBeUndefined()
    expect(
      diagnostics.find((diagnostic) => diagnostic.id === 'invalid-modified-time'),
    ).toBeUndefined()
  })

  it('reports missing title, canonical url, and image problems', () => {
    const state = createPresetState('minimal')
    const diagnostics = validateMeta(state)

    expect(diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'missing-title', level: 'error' }),
        expect.objectContaining({ id: 'missing-description', level: 'warning' }),
        expect.objectContaining({ id: 'missing-canonical', level: 'warning' }),
        expect.objectContaining({ id: 'missing-image', level: 'warning' }),
      ]),
    )
  })

  it('reports invalid urls, dimensions, handles, and article datetimes', () => {
    const state = createPresetState('article')
    state.basic.title = 'T'.repeat(75)
    state.basic.description = 'D'.repeat(205)
    state.basic.canonicalUrl = '/relative'
    state.openGraph.url = 'bad-url'
    state.openGraph.image.url = 'bad-image'
    state.openGraph.image.alt = ''
    state.openGraph.image.width = 'wide'
    state.openGraph.image.height = '0'
    state.twitter.site = 'example'
    state.twitter.creator = 'writer'
    state.article.publishedTime = 'not-a-date'
    state.article.modifiedTime = 'still-not-a-date'

    const diagnostics = validateMeta(state)
    const ids = diagnostics.map((diagnostic) => diagnostic.id)

    expect(ids).toContain('title-length')
    expect(ids).toContain('description-length')
    expect(ids).toContain('invalid-canonical')
    expect(ids).toContain('invalid-og-url')
    expect(ids).toContain('invalid-image')
    expect(ids).toContain('missing-image-alt')
    expect(ids).toContain('invalid-image-size')
    expect(ids).toContain('twitter-site-format')
    expect(ids).toContain('twitter-creator-format')
    expect(ids).toContain('invalid-published-time')
    expect(ids).toContain('invalid-modified-time')
  })
})
