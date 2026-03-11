import { afterEach, describe, expect, it, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  formatMetadataDateForInput,
  parseMetadataDateInput,
  readPdfMetadata,
  writePdfMetadata,
} from './pdfMetadata'

const toBlobBytes = (bytes: Uint8Array) => bytes as Uint8Array<ArrayBuffer>

const createPdfFile = async (name = 'sample.pdf'): Promise<File> => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle('Original title')
  pdfDoc.setAuthor('Original author')
  pdfDoc.setSubject('Original subject')
  pdfDoc.setKeywords(['alpha, beta'])
  pdfDoc.setCreator('Original creator')
  pdfDoc.setProducer('Original producer')
  pdfDoc.setCreationDate(new Date('2024-01-01T00:00:00Z'))
  pdfDoc.setModificationDate(new Date('2024-01-02T00:00:00Z'))
  pdfDoc.addPage()

  const bytes = await pdfDoc.save()
  return new File([toBlobBytes(bytes)], name, {
    type: 'application/pdf',
    lastModified: Date.parse('2024-02-01T00:00:00Z'),
  })
}

describe('pdfMetadata utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads metadata and document details', async () => {
    const file = await createPdfFile()

    const info = await readPdfMetadata(file)

    expect(info.file.name).toBe('sample.pdf')
    expect(info.file.type).toBe('application/pdf')
    expect(info.file.lastModified?.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    expect(info.document.pageCount).toBe(1)
    expect(info.document.encrypted).toBe(false)
    expect(info.document.version).toMatch(/\d+\.\d+/)
    expect(info.metadata.title).toBe('Original title')
    expect(info.metadata.author).toBe('Original author')
    expect(info.metadata.subject).toBe('Original subject')
    expect(info.metadata.keywords).toBe('alpha, beta')
    expect(info.metadata.creator).toBe('Original creator')
    expect(info.metadata.producer).toBe('Original producer')
    expect(info.metadata.creationDate).toBeInstanceOf(Date)
    expect(info.metadata.modificationDate).toBeInstanceOf(Date)
  })

  it('marks encrypted PDFs without throwing', async () => {
    const file = new File(
      [toBlobBytes(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]))],
      'secret.pdf',
      {
        type: 'application/pdf',
      },
    )

    vi.spyOn(PDFDocument, 'load').mockRejectedValueOnce(
      Object.assign(new Error('Encrypted'), { name: 'EncryptedPDFError' }),
    )

    const info = await readPdfMetadata(file)

    expect(info.document.encrypted).toBe(true)
    expect(info.metadata.title).toBeUndefined()
  })

  it('throws for invalid PDF input', async () => {
    const file = new File([toBlobBytes(new Uint8Array([0x00, 0x01, 0x02]))], 'broken.pdf', {
      type: 'application/pdf',
    })

    vi.spyOn(PDFDocument, 'load').mockRejectedValueOnce(new Error('Bad PDF'))

    await expect(readPdfMetadata(file)).rejects.toThrow('Bad PDF')
  })

  it('falls back to default file metadata values when type and lastModified are missing', async () => {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.addPage()

    const bytes = await pdfDoc.save()
    const file = {
      name: 'fallback.pdf',
      size: bytes.length,
      type: '',
      lastModified: 0,
      arrayBuffer: async () =>
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    } as unknown as File

    const info = await readPdfMetadata(file)

    expect(info.file.type).toBe('application/pdf')
    expect(info.file.lastModified).toBeUndefined()
  })

  it('formats and parses date input values', () => {
    expect(formatMetadataDateForInput(new Date('2024-03-04T05:06:07Z'))).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    )
    expect(formatMetadataDateForInput(new Date('invalid'))).toBe('')
    expect(parseMetadataDateInput('')).toBeUndefined()
    expect(parseMetadataDateInput('not-a-date')).toBeUndefined()
    expect(parseMetadataDateInput('2024-03-04T05:06')).toBeInstanceOf(Date)
  })

  it('writes updated metadata and clears removed fields', async () => {
    const file = await createPdfFile('updated.pdf')

    const output = await writePdfMetadata(file, {
      title: { mode: 'set', value: 'Updated title' },
      author: { mode: 'clear' },
      subject: { mode: 'preserve' },
      keywords: { mode: 'set', value: 'gamma delta' },
      creator: { mode: 'set', value: 'Updated creator' },
      producer: { mode: 'clear' },
      creationDate: { mode: 'clear' },
      modificationDate: { mode: 'set', value: new Date('2024-05-06T07:08:00Z') },
    })

    const pdfDoc = await PDFDocument.load(await output.arrayBuffer(), { updateMetadata: false })

    expect(pdfDoc.getTitle()).toBe('Updated title')
    expect(pdfDoc.getAuthor()).toBeUndefined()
    expect(pdfDoc.getSubject()).toBe('Original subject')
    expect(pdfDoc.getKeywords()).toBe('gamma delta')
    expect(pdfDoc.getCreator()).toBe('Updated creator')
    expect(pdfDoc.getProducer()).toBeUndefined()
    expect(pdfDoc.getCreationDate()).toBeUndefined()
    expect(pdfDoc.getModificationDate()?.toISOString()).toBe('2024-05-06T07:08:00.000Z')
  })

  it('writes producer and creation date updates while preserving modification date', async () => {
    const file = await createPdfFile('preserved.pdf')

    const output = await writePdfMetadata(file, {
      title: { mode: 'preserve' },
      author: { mode: 'set', value: 'Updated author' },
      subject: { mode: 'set', value: 'Updated subject' },
      keywords: { mode: 'preserve' },
      creator: { mode: 'preserve' },
      producer: { mode: 'set', value: 'Updated producer' },
      creationDate: { mode: 'set', value: new Date('2024-06-07T08:09:00Z') },
      modificationDate: { mode: 'preserve' },
    })

    const pdfDoc = await PDFDocument.load(await output.arrayBuffer(), { updateMetadata: false })

    expect(pdfDoc.getAuthor()).toBe('Updated author')
    expect(pdfDoc.getSubject()).toBe('Updated subject')
    expect(pdfDoc.getProducer()).toBe('Updated producer')
    expect(pdfDoc.getCreationDate()?.toISOString()).toBe('2024-06-07T08:09:00.000Z')
    expect(pdfDoc.getModificationDate()?.toISOString()).toBe('2024-01-02T00:00:00.000Z')
  })

  it('throws when required set values are missing', async () => {
    const file = await createPdfFile('missing.pdf')

    await expect(
      writePdfMetadata(file, {
        title: { mode: 'set', value: '   ' },
        author: { mode: 'preserve' },
        subject: { mode: 'preserve' },
        keywords: { mode: 'preserve' },
        creator: { mode: 'preserve' },
        producer: { mode: 'preserve' },
        creationDate: { mode: 'preserve' },
        modificationDate: { mode: 'preserve' },
      }),
    ).rejects.toThrow('Missing value for title')

    await expect(
      writePdfMetadata(file, {
        title: { mode: 'preserve' },
        author: { mode: 'preserve' },
        subject: { mode: 'preserve' },
        keywords: { mode: 'preserve' },
        creator: { mode: 'preserve' },
        producer: { mode: 'preserve' },
        creationDate: { mode: 'set', value: undefined },
        modificationDate: { mode: 'preserve' },
      }),
    ).rejects.toThrow('Missing value for creationDate')
  })
})
