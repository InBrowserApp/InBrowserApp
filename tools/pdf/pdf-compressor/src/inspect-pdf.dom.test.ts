import { beforeEach, describe, expect, it, vi } from 'vitest'
import { inspectPdf } from './inspect-pdf'
import { PDF_ERROR } from './pdf-errors'

const { loadMock, getPageCountMock } = vi.hoisted(() => ({
  loadMock: vi.fn(),
  getPageCountMock: vi.fn(),
}))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: loadMock,
  },
}))

describe('inspectPdf', () => {
  beforeEach(() => {
    loadMock.mockReset()
    getPageCountMock.mockReset()
  })

  it('returns page count for a valid pdf', async () => {
    loadMock.mockResolvedValue({ getPageCount: getPageCountMock })
    getPageCountMock.mockReturnValue(7)

    await expect(
      inspectPdf(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })),
    ).resolves.toEqual({ pageCount: 7 })
  })

  it('maps encrypted errors', async () => {
    const error = new Error('encrypted')
    error.name = 'EncryptedPDFError'
    loadMock.mockRejectedValue(error)

    await expect(
      inspectPdf(new File(['pdf'], 'secret.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Encrypted)
  })

  it('maps invalid pdf errors', async () => {
    loadMock.mockRejectedValue(new Error('invalid'))

    await expect(
      inspectPdf(new File(['bad'], 'bad.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Invalid)
  })
})
