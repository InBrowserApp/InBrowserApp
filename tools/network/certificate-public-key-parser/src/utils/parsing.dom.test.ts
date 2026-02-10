import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  base64ToArrayBuffer,
  computeFingerprints,
  extractPemBlocks,
  formatGeneralName,
  formatHexString,
  isBase64Input,
  isCertificateLabel,
} from './parsing'

let digestSpy: ReturnType<typeof vi.spyOn> | null = null

beforeEach(() => {
  const digestMock = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
  try {
    digestSpy = vi.spyOn(globalThis.crypto.subtle, 'digest').mockImplementation(digestMock)
  } catch {
    vi.stubGlobal('crypto', { subtle: { digest: digestMock } })
  }
})

afterEach(() => {
  digestSpy?.mockRestore()
  digestSpy = null
  vi.unstubAllGlobals()
})

describe('certificate parser utilities', () => {
  it('formats general names', () => {
    expect(formatGeneralName('dns', 'example.com')).toBe('DNS: example.com')
    expect(formatGeneralName('custom', 'value')).toBe('custom: value')
  })

  it('extracts PEM blocks and skips invalid content', () => {
    const input = [
      '-----BEGIN CERTIFICATE-----\nAQ==\n-----END CERTIFICATE-----',
      '-----BEGIN CERTIFICATE-----\n!!!!\n-----END CERTIFICATE-----',
      '-----BEGIN CERTIFICATE-----\n\n-----END CERTIFICATE-----',
    ].join('\n')

    const blocks = extractPemBlocks(input)
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.label).toBe('CERTIFICATE')
    expect(Array.from(new Uint8Array(blocks[0]!.der))).toEqual([1])
  })

  it('detects certificate labels', () => {
    expect(isCertificateLabel('CERTIFICATE')).toBe(true)
    expect(isCertificateLabel('CERTIFICATE REQUEST')).toBe(false)
  })

  it('validates base64 input', () => {
    expect(isBase64Input('AQ==')).toBe(true)
    expect(isBase64Input('not-base64')).toBe(false)
    expect(isBase64Input('')).toBe(false)
  })

  it('converts base64 to ArrayBuffer', () => {
    const buffer = base64ToArrayBuffer('AQID')
    expect(Array.from(new Uint8Array(buffer))).toEqual([1, 2, 3])
  })

  it('formats hex strings', () => {
    expect(formatHexString('0x0a0b')).toBe('0A:0B')
    expect(formatHexString('zz')).toBe('zz')
    expect(formatHexString('a')).toBe('A')
  })

  it('computes fingerprints', async () => {
    const result = await computeFingerprints(new Uint8Array([9]).buffer)
    expect(result.sha1).toBe('01:02:03')
    expect(result.sha256).toBe('01:02:03')
  })
})
