import { describe, expect, it, vi } from 'vitest'
import type { CurlTargetConfig } from './targets'

const mockTarget: CurlTargetConfig = {
  id: 'mock',
  label: 'Mock',
  extension: '.txt',
  hljs: 'plaintext',
  convert: (curlCommand: string) => {
    if (curlCommand.includes('boom')) {
      throw new Error('Boom')
    }
    if (curlCommand.includes('raw')) {
      throw 'raw'
    }
    const payload = { echo: curlCommand } as unknown as string
    return [payload, [['WARN', 'Check input']]]
  },
}

vi.mock('./targets', () => ({
  getTargetConfig: (id: string) => (id === 'mock' ? mockTarget : undefined),
}))

import { convertCurlToTarget } from './converter'

describe('convertCurlToTarget error handling', () => {
  it('returns empty output for blank input', () => {
    const result = convertCurlToTarget('   ', 'mock')

    expect(result.output).toBe('')
    expect(result.warnings).toEqual([])
    expect(result.error).toBeUndefined()
  })

  it('stringifies non-string output and formats warnings', () => {
    const result = convertCurlToTarget('curl https://example.com', 'mock')

    expect(result.output).toBe(JSON.stringify({ echo: 'curl https://example.com' }, null, 2))
    expect(result.warnings).toEqual(['[WARN] Check input'])
    expect(result.error).toBeUndefined()
  })

  it('returns error messages from thrown exceptions', () => {
    const result = convertCurlToTarget('boom', 'mock')

    expect(result.output).toBe('')
    expect(result.warnings).toEqual([])
    expect(result.error).toBe('Boom')
  })

  it('uses fallback error for non-Error throws', () => {
    const result = convertCurlToTarget('raw', 'mock')

    expect(result.output).toBe('')
    expect(result.warnings).toEqual([])
    expect(result.error).toBe('Failed to parse cURL command.')
  })
})
