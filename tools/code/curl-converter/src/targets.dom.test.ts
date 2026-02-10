import { describe, expect, it } from 'vitest'
import { defaultTargetId, getTargetConfig } from './targets'

describe('curl target configs', () => {
  it('exposes the default target config', () => {
    const config = getTargetConfig(defaultTargetId)

    expect(config).toBeDefined()
    expect(config?.id).toBe('javascript-fetch')
    expect(config?.label).toContain('fetch')
  })

  it('returns undefined for unknown target ids', () => {
    expect(getTargetConfig('missing-target')).toBeUndefined()
  })

  it('returns trimmed output when transform input has no fetch call', () => {
    const transform = getTargetConfig('javascript-fetch')?.transform

    expect(transform).toBeTypeOf('function')
    const transformed = transform?.("  const value = 'x'\n")
    expect(transformed).toBe("const value = 'x'")
  })

  it('wraps fetch calls with async run and keeps import lines', () => {
    const transform = getTargetConfig('javascript-fetch')?.transform

    const transformed = transform?.(
      "import fetch from 'node-fetch'\nfetch('https://a.example')\n  api.fetch('https://b.example');\nconsole.log('done')",
    )

    expect(transformed).toContain("import fetch from 'node-fetch'")
    expect(transformed).toContain('async function run()')
    expect(transformed).toContain("const response = await fetch('https://a.example')")
    expect(transformed).toContain("const response2 = await api.fetch('https://b.example')")
    expect(transformed).toContain("  console.log('done')")
    expect(transformed?.trim().endsWith('run()')).toBe(true)
  })

  it('keeps non-fetch lines when a fetch call is present', () => {
    const transform = getTargetConfig('javascript-fetch')?.transform

    const transformed = transform?.("const request = 'fetch()'\nfetch('https://example.com')")

    expect(transformed).toContain("const request = 'fetch()'")
    expect(transformed).toContain("const response = await fetch('https://example.com')")
  })
})
