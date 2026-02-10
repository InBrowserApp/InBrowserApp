import { describe, expect, it } from 'vitest'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

describe('pdf-errors', () => {
  it('exposes stable error codes', () => {
    expect(PDF_ERROR.Encrypted).toBe('encrypted-pdf')
    expect(PDF_ERROR.Invalid).toBe('invalid-pdf')
    expect(PDF_ERROR.MergeFailed).toBe('merge-failed')
    expect(PDF_ERROR.WorkerUnsupported).toBe('worker-not-supported')
  })

  it('detects encrypted pdf errors', () => {
    const encrypted = new Error('x')
    encrypted.name = 'EncryptedPDFError'

    expect(isEncryptedPdfError(encrypted)).toBe(true)
    expect(isEncryptedPdfError(new Error('x'))).toBe(false)
    expect(isEncryptedPdfError('oops')).toBe(false)
  })
})
