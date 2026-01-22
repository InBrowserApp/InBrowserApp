import { describe, expect, it } from 'vitest'
import { DEFAULT_MONO_FONT, getBackgroundPreset, getThemeById, themes } from './themes'

describe('theme helpers', () => {
  it('resolves themes and presets with fallbacks', () => {
    expect(themes.length).toBeGreaterThan(0)
    expect(getThemeById('unknown').id).toBe(themes[0].id)
    expect(getBackgroundPreset('unknown').id).toBe('aurora')
  })

  it('exposes the default mono font stack', () => {
    expect(DEFAULT_MONO_FONT).toContain('JetBrains Mono')
  })
})
