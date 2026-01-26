import { describe, expect, it } from 'vitest'
import { DEFAULT_MONO_FONT, getBackgroundPreset, getThemeById, themes } from './themes'

describe('theme helpers', () => {
  it('resolves themes and presets with fallbacks', () => {
    expect(themes.length).toBeGreaterThan(0)
    const fallbackTheme = themes[0] ?? getThemeById('nebula')
    expect(getThemeById('unknown').id).toBe(fallbackTheme.id)
    expect(getBackgroundPreset('unknown').id).toBe('aurora')
  })

  it('exposes the default mono font stack', () => {
    expect(DEFAULT_MONO_FONT).toContain('JetBrains Mono')
  })
})
