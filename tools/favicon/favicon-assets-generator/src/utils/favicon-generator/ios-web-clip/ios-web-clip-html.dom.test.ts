import { describe, expect, it } from 'vitest'
import { getHTMLCode } from './get-html-code'

describe('ios web clip html', () => {
  it('returns the apple touch icon link', () => {
    expect(getHTMLCode()).toContain('apple-touch-icon')
  })
})
