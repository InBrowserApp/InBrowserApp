import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const { loadMock } = vi.hoisted(() => ({
  loadMock: vi.fn(),
}))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: loadMock,
  },
}))

import { inspectPdf, isPdfFile } from './inspect-pdf'

describe('inspect-pdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('recognizes pdf file names and returns page metadata', async () => {
    loadMock.mockResolvedValue({
      getPages: () => [
        { getRotation: () => ({ angle: 0 }) },
        { getRotation: () => ({ angle: 90 }) },
        { getRotation: () => ({ angle: -90 }) },
      ],
    })

    expect(isPdfFile(new File(['x'], 'demo.pdf', { type: 'application/pdf' }))).toBe(true)
    expect(isPdfFile(new File(['x'], 'demo.txt', { type: 'text/plain' }))).toBe(false)

    await expect(
      inspectPdf(new File(['x'], 'demo.pdf', { type: 'application/pdf' })),
    ).resolves.toEqual({
      pageCount: 3,
      pageRotations: [0, 90, 270],
    })
  })

  it('maps encrypted and invalid pdf errors', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))
    await expect(
      inspectPdf(new File(['x'], 'encrypted.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Encrypted)

    loadMock.mockRejectedValueOnce(new Error('broken'))
    await expect(
      inspectPdf(new File(['x'], 'broken.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow(PDF_ERROR.Invalid)
  })
})
