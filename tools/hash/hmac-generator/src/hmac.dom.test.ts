import { describe, it, expect } from 'vitest'
import { generateHmac } from './hmac'
import type { HmacAlgorithm } from './types'

const algorithms: HmacAlgorithm[] = [
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
  'MD5',
  'SHA-224',
  'SHA3-256',
  'SHA3-384',
  'SHA3-512',
  'RIPEMD-160',
]

describe('generateHmac', () => {
  it.each(algorithms)('generates HMAC for %s using string and blob inputs', async (algorithm) => {
    const textBuffer = await generateHmac('hello', 'secret', algorithm)
    expect(textBuffer).toBeInstanceOf(ArrayBuffer)
    expect(textBuffer.byteLength).toBeGreaterThan(0)

    const blobBuffer = await generateHmac(new Blob(['hello']), 'secret', algorithm)
    expect(blobBuffer).toBeInstanceOf(ArrayBuffer)
    expect(blobBuffer.byteLength).toBeGreaterThan(0)
  })

  it('throws for unsupported algorithms', async () => {
    await expect(generateHmac('hello', 'secret', 'BAD' as HmacAlgorithm)).rejects.toThrow(
      'Unsupported algorithm',
    )
  })
})
