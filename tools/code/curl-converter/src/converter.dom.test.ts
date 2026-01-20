import { describe, expect, it } from 'vitest'
import { convertCurlToTarget } from './converter'

describe('curl-converter', () => {
  it('converts curl to javascript fetch with async/await wrapper', () => {
    const result = convertCurlToTarget("curl 'https://example.com'", 'javascript-fetch')

    expect(result.error).toBeUndefined()
    expect(result.output).toContain('async function run()')
    expect(result.output).toMatch(/const response = await fetch\(['"]https:\/\/example\.com['"]/)
  })

  it('converts curl to python requests', () => {
    const result = convertCurlToTarget("curl 'https://example.com'", 'python-requests')

    expect(result.error).toBeUndefined()
    expect(result.output).toContain('requests')
  })

  it('returns an error for an unknown target', () => {
    const result = convertCurlToTarget("curl 'https://example.com'", 'unknown-target')

    expect(result.error).toBeTruthy()
  })
})
