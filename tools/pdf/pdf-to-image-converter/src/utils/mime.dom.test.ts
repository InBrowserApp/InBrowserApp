import { describe, expect, it } from 'vitest'
import { getExtension, getMimeType, shouldUseQuality } from './mime'

describe('mime utilities', () => {
  it('returns mime type for each format', () => {
    expect(getMimeType('png')).toBe('image/png')
    expect(getMimeType('jpeg')).toBe('image/jpeg')
    expect(getMimeType('webp')).toBe('image/webp')
  })

  it('returns extension for each format', () => {
    expect(getExtension('png')).toBe('png')
    expect(getExtension('jpeg')).toBe('jpg')
    expect(getExtension('webp')).toBe('webp')
  })

  it('indicates whether quality should be applied', () => {
    expect(shouldUseQuality('png')).toBe(false)
    expect(shouldUseQuality('jpeg')).toBe(true)
    expect(shouldUseQuality('webp')).toBe(true)
  })
})
