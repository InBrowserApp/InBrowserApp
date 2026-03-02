import { beforeEach, describe, expect, it, vi } from 'vitest'
import { inspectPdf, isPdfFile } from './inspect-pdf'
import { PDF_ERROR } from './pdf-errors'

const loadMock = vi.fn()

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: (...args: unknown[]) => loadMock(...args),
  },
}))

describe('inspect-pdf', () => {
  beforeEach(() => {
    loadMock.mockReset()
  })

  it('accepts PDF mime type or extension', () => {
    expect(isPdfFile(new File([''], 'a.pdf', { type: 'application/pdf' }))).toBe(true)
    expect(isPdfFile(new File([''], 'a.PDF', { type: 'application/octet-stream' }))).toBe(true)
    expect(isPdfFile(new File([''], 'a.txt', { type: 'text/plain' }))).toBe(false)
  })

  it('returns page count for valid PDF', async () => {
    loadMock.mockResolvedValue({
      getPageCount: () => 12,
    })

    const file = new File(['dummy'], 'sample.pdf', { type: 'application/pdf' })

    await expect(inspectPdf(file)).resolves.toEqual({ pageCount: 12 })
    expect(loadMock).toHaveBeenCalledTimes(1)
  })

  it('maps encrypted PDF error', async () => {
    const error = new Error('encrypted')
    error.name = 'EncryptedPDFError'
    loadMock.mockRejectedValue(error)

    const file = new File(['dummy'], 'enc.pdf', { type: 'application/pdf' })

    await expect(inspectPdf(file)).rejects.toThrow(PDF_ERROR.Encrypted)
  })

  it('maps invalid PDF error', async () => {
    loadMock.mockRejectedValue(new Error('broken'))

    const file = new File(['dummy'], 'broken.pdf', { type: 'application/pdf' })

    await expect(inspectPdf(file)).rejects.toThrow(PDF_ERROR.Invalid)
  })
})
