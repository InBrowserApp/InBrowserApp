import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  KSUID_EPOCH_SECONDS,
  KSUID_LENGTH,
  createKsuidBytes,
  encodeKsuid,
  generateKsuid,
  isValidKsuidUnixSeconds,
} from './ksuid'

describe('ksuid utils', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint8Array) => {
        buffer.fill(7)
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('validates KSUID unix seconds range', () => {
    expect(isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS)).toBe(true)
    expect(isValidKsuidUnixSeconds(KSUID_EPOCH_SECONDS - 1)).toBe(false)
    expect(isValidKsuidUnixSeconds(Number.NaN)).toBe(false)
  })

  it('encodes zero bytes to a padded KSUID', () => {
    const ksuid = generateKsuid(KSUID_EPOCH_SECONDS, new Uint8Array(16))
    expect(ksuid).toBe('0'.repeat(KSUID_LENGTH))
  })

  it('uses crypto when random bytes are not provided', () => {
    const ksuid = generateKsuid(KSUID_EPOCH_SECONDS)
    expect(ksuid).toHaveLength(KSUID_LENGTH)
    expect(ksuid).not.toBe('0'.repeat(KSUID_LENGTH))
  })

  it('throws for invalid random byte length', () => {
    expect(() => createKsuidBytes(KSUID_EPOCH_SECONDS, new Uint8Array(15))).toThrow()
  })

  it('throws for out-of-range timestamps', () => {
    expect(() => generateKsuid(KSUID_EPOCH_SECONDS - 1)).toThrow()
  })

  it('encodes provided bytes', () => {
    const bytes = createKsuidBytes(KSUID_EPOCH_SECONDS, new Uint8Array(16).fill(1))
    const ksuid = encodeKsuid(bytes)

    expect(ksuid).toHaveLength(KSUID_LENGTH)
  })

  it('rejects non-20 byte input for encoding', () => {
    expect(() => encodeKsuid(new Uint8Array(10))).toThrow()
  })
})
