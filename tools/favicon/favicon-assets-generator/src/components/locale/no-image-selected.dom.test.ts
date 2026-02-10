import { describe, expect, it } from 'vitest'
import { messages } from './no-image-selected'

describe('no-image-selected locale', () => {
  it('includes default translations', () => {
    expect(messages.en.noImageSelected).toContain('image')
    expect(typeof messages['zh-CN'].noImageSelected).toBe('string')
  })
})
