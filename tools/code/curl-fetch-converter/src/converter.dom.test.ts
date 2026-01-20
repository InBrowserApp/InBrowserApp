import { describe, expect, it } from 'vitest'
import { convertCurlToFetch, convertFetchToCurl } from './converter'

describe('curl-fetch-converter', () => {
  it('converts curl to fetch with async/await wrapper', () => {
    const result = convertCurlToFetch("curl 'https://example.com'")

    expect(result.error).toBeUndefined()
    expect(result.output).toContain('async function run()')
    expect(result.output).toMatch(/const response = await fetch\(['"]https:\/\/example\.com['"]/)
  })

  it('converts fetch to curl with headers and JSON body', () => {
    const result = convertFetchToCurl(`fetch('https://api.example.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      },
      body: JSON.stringify({ message: 'Hello' })
    })`)

    expect(result.error).toBeUndefined()
    expect(result.output).toContain('curl')
    expect(result.output).toContain('-X POST')
    expect(result.output).toContain("-H 'Content-Type: application/json'")
    expect(result.output).toContain("-H 'Authorization: Bearer token'")
    expect(result.output).toMatch(/--data-raw '.*Hello.*'/)
  })

  it('reports an error when no fetch call is present', () => {
    const result = convertFetchToCurl('const url = "https://example.com"')

    expect(result.error).toBeTruthy()
  })
})
