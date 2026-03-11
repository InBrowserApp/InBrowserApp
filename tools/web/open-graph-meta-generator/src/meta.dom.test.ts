import { describe, expect, it } from 'vitest'
import {
  buildMetaEntries,
  buildMetaHtml,
  buildPreviewModel,
  renderMetaHtml,
  resolveEffectiveMeta,
} from './meta'
import { createPresetState } from './state'

describe('open graph meta helpers', () => {
  it('resolves effective twitter overrides and splits article tags', () => {
    const state = createPresetState('article')
    state.twitter.inheritFromOpenGraph = false
    state.twitter.title = 'Custom Twitter Title'
    state.twitter.description = 'Custom Twitter Description'
    state.twitter.imageUrl = 'https://example.com/custom-twitter-image.png'
    state.twitter.imageAlt = 'Custom twitter alt'

    const resolved = resolveEffectiveMeta(state)

    expect(resolved.twitterTitle).toBe('Custom Twitter Title')
    expect(resolved.twitterDescription).toBe('Custom Twitter Description')
    expect(resolved.twitterImageUrl).toBe('https://example.com/custom-twitter-image.png')
    expect(resolved.articleTags).toEqual(['open graph', 'twitter cards', 'social preview'])
  })

  it('builds article entries and skips image dimensions when no image is set', () => {
    const articleState = createPresetState('article')
    const articleEntries = buildMetaEntries(articleState)

    expect(articleEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'title', content: articleState.basic.title }),
        expect.objectContaining({ key: 'og:type', content: 'article' }),
        expect.objectContaining({ key: 'article:published_time' }),
        expect.objectContaining({ key: 'article:tag', content: 'open graph' }),
        expect.objectContaining({ key: 'twitter:card', content: 'summary_large_image' }),
      ]),
    )

    const minimalState = createPresetState('minimal')
    const minimalEntries = buildMetaEntries(minimalState)

    expect(
      minimalEntries.find((entry) => entry.type === 'meta' && entry.key === 'og:image:width'),
    ).toBeUndefined()
    expect(
      minimalEntries.find((entry) => entry.type === 'meta' && entry.key === 'og:image:height'),
    ).toBeUndefined()
  })

  it('renders escaped HTML and supports the convenience html builder', () => {
    const html = renderMetaHtml([
      { type: 'title', content: 'Fish & Chips <Sale>' },
      {
        type: 'meta',
        attribute: 'name',
        key: 'description',
        content: '5" display & more',
      },
      {
        type: 'link',
        rel: 'canonical',
        href: 'https://example.com/fish?sort=asc&view=grid',
      },
    ])

    expect(html).toContain('<title>Fish &amp; Chips &lt;Sale&gt;</title>')
    expect(html).toContain('content="5&quot; display &amp; more"')
    expect(html).toContain('href="https://example.com/fish?sort=asc&amp;view=grid"')

    const builtHtml = buildMetaHtml(createPresetState('website'))
    expect(builtHtml).toContain('og:title')
    expect(builtHtml).toContain('twitter:card')
  })

  it('builds truncated preview text and falls back when urls are invalid', () => {
    const state = createPresetState('website')
    state.basic.title = 'A'.repeat(90)
    state.basic.description = 'B'.repeat(220)
    state.basic.canonicalUrl = 'not-a-url'

    const preview = buildPreviewModel(state)

    expect(preview.title.endsWith('…')).toBe(true)
    expect(preview.description.endsWith('…')).toBe(true)
    expect(preview.domain).toBe('example.com')
  })
})
