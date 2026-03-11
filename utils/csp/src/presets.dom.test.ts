import { describe, expect, it } from 'vitest'
import { cspPresetDefinitions, getPresetPolicy } from './presets'

describe('csp presets', () => {
  it('exposes the expected preset ids', () => {
    expect(cspPresetDefinitions.map((preset) => preset.id)).toEqual([
      'strict-starter',
      'spa-starter',
      'legacy-relaxed',
      'report-only-audit',
    ])
  })

  it('returns a preset policy by id', () => {
    expect(getPresetPolicy('strict-starter')).toContain("default-src 'self'")
    expect(getPresetPolicy('report-only-audit')).toContain('report-uri')
  })
})
