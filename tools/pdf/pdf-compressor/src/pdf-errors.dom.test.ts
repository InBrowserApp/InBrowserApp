import { describe, expect, it } from 'vitest'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

describe('pdf-errors', () => {
  it('exposes stable error codes', () => {
    expect(PDF_ERROR).toEqual({
      Encrypted: 'encrypted-pdf',
      Invalid: 'invalid-pdf',
      CompressionFailed: 'compression-failed',
      WorkerUnsupported: 'worker-not-supported',
    })
  })

  it('detects encrypted pdf-lib errors', () => {
    const encrypted = new Error('boom')
    encrypted.name = 'EncryptedPDFError'

    expect(isEncryptedPdfError(encrypted)).toBe(true)
    expect(isEncryptedPdfError(new Error('plain'))).toBe(false)
  })
})
