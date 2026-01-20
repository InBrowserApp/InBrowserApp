import { afterEach, describe, expect, it, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { extractPdfInfo } from './extractPdfInfo'

describe('extractPdfInfo', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('extracts metadata and page count', async () => {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.setTitle('Test Title')
    pdfDoc.setAuthor('Test Author')
    pdfDoc.setSubject('Test Subject')
    pdfDoc.setKeywords(['alpha beta'])
    pdfDoc.setCreator('Test Creator')
    pdfDoc.setProducer('Test Producer')
    pdfDoc.setCreationDate(new Date('2024-01-01T00:00:00Z'))
    pdfDoc.setModificationDate(new Date('2024-01-02T00:00:00Z'))
    pdfDoc.addPage()
    pdfDoc.addPage()

    const bytes = await pdfDoc.save()
    const file = new File([bytes], 'sample.pdf', {
      type: 'application/pdf',
      lastModified: Date.parse('2024-02-01T00:00:00Z'),
    })

    const info = await extractPdfInfo(file)

    expect(info.file.name).toBe('sample.pdf')
    expect(info.file.type).toBe('application/pdf')
    expect(info.document.pageCount).toBe(2)
    expect(info.document.encrypted).toBe(false)
    expect(info.document.version).toMatch(/\d+\.\d+/)
    expect(info.metadata.title).toBe('Test Title')
    expect(info.metadata.author).toBe('Test Author')
    expect(info.metadata.subject).toBe('Test Subject')
    expect(info.metadata.keywords).toEqual(['alpha beta'])
    expect(info.metadata.creator).toBe('Test Creator')
    expect(info.metadata.producer).toContain('pdf-lib')
    expect(info.metadata.creationDate).toBeInstanceOf(Date)
    expect(info.metadata.modificationDate).toBeInstanceOf(Date)
    expect(info.file.lastModified?.toISOString()).toBe('2024-02-01T00:00:00.000Z')
  })

  it('marks encrypted PDFs', async () => {
    const file = new File(
      [new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])],
      'secret.pdf',
      {
        type: 'application/pdf',
      },
    )

    vi.spyOn(PDFDocument, 'load').mockRejectedValueOnce(
      Object.assign(new Error('Encrypted'), { name: 'EncryptedPDFError' }),
    )

    const info = await extractPdfInfo(file)

    expect(info.document.encrypted).toBe(true)
  })

  it('throws for invalid PDFs', async () => {
    const file = new File([new Uint8Array([0x00, 0x01, 0x02])], 'broken.pdf', {
      type: 'application/pdf',
    })

    vi.spyOn(PDFDocument, 'load').mockRejectedValueOnce(new Error('Bad PDF'))

    await expect(extractPdfInfo(file)).rejects.toThrow('Bad PDF')
  })
})
