import { describe, expect, it } from 'vitest'
import { isDemoPreviewImageUrl, resolvePreviewImageSrc } from './demoImages'

describe('demo preview image helpers', () => {
  it('recognizes demo preview urls by filename', () => {
    expect(isDemoPreviewImageUrl('https://example.com/assets/open-graph-preview-demo.svg')).toBe(
      true,
    )
    expect(isDemoPreviewImageUrl('https://example.com/assets/custom-card.png')).toBe(false)
  })

  it('swaps demo preview urls for the bundled asset and preserves custom urls', () => {
    expect(
      resolvePreviewImageSrc('https://example.com/assets/open-graph-preview-demo.svg'),
    ).toContain('open-graph-preview-demo.svg')
    expect(resolvePreviewImageSrc('https://example.com/assets/custom-card.png')).toBe(
      'https://example.com/assets/custom-card.png',
    )
  })
})
