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

  it('accepts PDF mime types and extensions', () => {
    expect(isPdfFile(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))).toBe(true)
    expect(isPdfFile(new File(['pdf'], 'sample.PDF', { type: 'application/octet-stream' }))).toBe(
      true,
    )
    expect(isPdfFile(new File(['text'], 'sample.txt', { type: 'text/plain' }))).toBe(false)
  })

  it('returns the page count for valid documents', async () => {
    loadMock.mockResolvedValue({
      getPageCount: () => 7,
    })

    await expect(
      inspectPdf(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })),
    ).resolves.toEqual({
      pageCount: 7,
    })
  })

  it('maps encrypted document failures', async () => {
    const error = new Error('encrypted')
    error.name = 'EncryptedPDFError'
    loadMock.mockRejectedValueOnce(error)

    await expect(
      inspectPdf(new File(['pdf'], 'locked.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Encrypted)
  })

  it('maps other load failures to invalid pdf', async () => {
    loadMock.mockRejectedValueOnce(new Error('broken'))

    await expect(
      inspectPdf(new File(['pdf'], 'broken.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Invalid)
  })
})
