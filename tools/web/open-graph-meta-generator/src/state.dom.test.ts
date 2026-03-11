import { describe, expect, it } from 'vitest'
import { createDefaultState, createPresetState } from './state'

describe('open graph meta state presets', () => {
  it('uses the website preset by default', () => {
    const state = createDefaultState()

    expect(state.preset).toBe('website')
    expect(state.basic.title).toContain('InBrowser.App')
    expect(state.openGraph.type).toBe('website')
    expect(state.twitter.inheritFromOpenGraph).toBe(true)
  })

  it('creates article and product presets with expected defaults', () => {
    const article = createPresetState('article')
    const product = createPresetState('product')

    expect(article.showAdvanced).toBe(true)
    expect(article.openGraph.type).toBe('article')
    expect(article.article.tags).toContain('open graph')

    expect(product.preset).toBe('product')
    expect(product.openGraph.type).toBe('product')
    expect(product.twitter.site).toBe('@examplestore')
  })

  it('creates the minimal preset without prefilled page content', () => {
    const minimal = createPresetState('minimal')

    expect(minimal.basic.title).toBe('')
    expect(minimal.basic.description).toBe('')
    expect(minimal.openGraph.image.width).toBe('')
    expect(minimal.openGraph.image.height).toBe('')
  })
})
