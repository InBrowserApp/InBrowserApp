import { computed } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePdfMetadataEditor } from './usePdfMetadataEditor'
import { formatMetadataDateForInput, type PdfMetadataInfo } from '../utils/pdfMetadata'

const hoisted = vi.hoisted(() => ({
  useObjectUrlMock: vi.fn(),
  readPdfMetadataMock: vi.fn(),
  writePdfMetadataMock: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: hoisted.useObjectUrlMock,
}))

vi.mock('../utils/pdfMetadata', async () => {
  const actual =
    await vi.importActual<typeof import('../utils/pdfMetadata')>('../utils/pdfMetadata')

  return {
    ...actual,
    readPdfMetadata: hoisted.readPdfMetadataMock,
    writePdfMetadata: hoisted.writePdfMetadataMock,
  }
})

const createInfo = (overrides?: Partial<PdfMetadataInfo>): PdfMetadataInfo => ({
  file: {
    name: 'sample.pdf',
    size: 100,
    type: 'application/pdf',
    lastModified: new Date('2024-02-01T00:00:00Z'),
  },
  document: {
    version: '1.7',
    pageCount: 2,
    encrypted: false,
  },
  metadata: {
    title: 'Original title',
    author: 'Original author',
    subject: undefined,
    keywords: undefined,
    creator: undefined,
    producer: undefined,
    creationDate: new Date('2024-01-01T00:00:00Z'),
    modificationDate: undefined,
  },
  ...overrides,
})

describe('usePdfMetadataEditor', () => {
  beforeEach(() => {
    hoisted.readPdfMetadataMock.mockReset()
    hoisted.writePdfMetadataMock.mockReset()
    hoisted.useObjectUrlMock.mockReset()
    hoisted.useObjectUrlMock.mockImplementation((blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock-url' : undefined)),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads metadata and initializes field state', async () => {
    const info = createInfo()
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(info)

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    expect(editor.info.value).toEqual(info)
    expect(editor.fields.title.mode).toBe('preserve')
    expect(editor.fields.title.value).toBe('Original title')
    expect(editor.fields.creationDate.value).toBe(
      formatMetadataDateForInput(info.metadata.creationDate),
    )
    expect(editor.canGenerate.value).toBe(false)
    expect(hoisted.useObjectUrlMock).toHaveBeenCalled()
  })

  it('resets state when upload fails and when file is cleared', async () => {
    const file = new File(['pdf'], 'broken.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockRejectedValueOnce(new Error('Boom'))

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    expect(editor.info.value).toBeNull()
    expect(editor.errorMessage.value).toBe('Boom')

    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())
    await editor.handleUpload(file)
    editor.clearFile()

    expect(editor.file.value).toBeNull()
    expect(editor.info.value).toBeNull()
    expect(editor.fields.title.value).toBe('')
    expect(editor.resultUrl.value).toBeUndefined()
  })

  it('uses fallback messages for non-Error upload and save failures', async () => {
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockRejectedValueOnce('bad-read')

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    expect(editor.errorMessage.value).toBe('Failed to read PDF metadata.')

    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())
    hoisted.writePdfMetadataMock.mockRejectedValueOnce('bad-save')
    await editor.handleUpload(file)
    editor.setFieldMode('title', 'set')
    editor.setFieldValue('title', 'Updated title')
    await editor.generate()

    expect(editor.errorMessage.value).toBe('Failed to save PDF metadata.')
  })

  it('tracks meaningful changes and validation errors', async () => {
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    editor.setFieldMode('title', 'set')
    editor.setFieldValue('title', 'Original title')
    expect(editor.hasChanges.value).toBe(false)

    editor.setFieldValue('title', '   ')
    expect(editor.validationFieldKeys.value).toEqual(['title'])
    expect(editor.canGenerate.value).toBe(false)

    editor.setFieldValue('title', 'Updated title')
    editor.setFieldMode('creationDate', 'set')
    editor.setFieldValue('creationDate', 'not-a-date')
    expect(editor.validationFieldKeys.value).toEqual(['creationDate'])

    editor.setFieldValue('creationDate', '2024-02-03T04:05')
    expect(editor.validationFieldKeys.value).toEqual([])
    expect(editor.hasChanges.value).toBe(true)
    expect(editor.changeSummary.value.map((item) => item.key)).toEqual(['title', 'creationDate'])
  })

  it('handles clear all and restore behavior', async () => {
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    editor.clearAllFields()
    expect(editor.changeSummary.value).toEqual([
      { key: 'title', action: 'clear' },
      { key: 'author', action: 'clear' },
      { key: 'creationDate', action: 'clear' },
    ])

    editor.restoreField('title')
    expect(editor.changeSummary.value).toEqual([
      { key: 'author', action: 'clear' },
      { key: 'creationDate', action: 'clear' },
    ])
  })

  it('tracks date-only changes without originals and falls back to a default filename base', async () => {
    const file = new File(['pdf'], '.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(
      createInfo({
        file: {
          name: '.pdf',
          size: 100,
          type: 'application/pdf',
          lastModified: new Date('2024-02-01T00:00:00Z'),
        },
        metadata: {
          title: undefined,
          author: 'Original author',
          subject: undefined,
          keywords: undefined,
          creator: undefined,
          producer: undefined,
          creationDate: undefined,
          modificationDate: undefined,
        },
      }),
    )
    hoisted.writePdfMetadataMock.mockResolvedValue(
      new Blob(['updated'], { type: 'application/pdf' }),
    )

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    editor.setFieldMode('creationDate', 'set')
    expect(editor.hasChanges.value).toBe(false)

    editor.setFieldValue('creationDate', '2024-02-03T04:05')
    expect(editor.hasChanges.value).toBe(true)

    await editor.generate()
    expect(editor.resultFilename.value).toBe('metadata-metadata.pdf')

    editor.clearFile()
    editor.clearAllFields()
    expect(editor.changeSummary.value).toEqual([])
  })

  it('saves metadata and exposes a download result', async () => {
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())
    hoisted.writePdfMetadataMock.mockResolvedValue(
      new Blob(['updated'], { type: 'application/pdf' }),
    )

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    editor.setFieldMode('title', 'set')
    editor.setFieldValue('title', 'Updated title')

    await editor.generate()

    expect(hoisted.writePdfMetadataMock).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        title: { mode: 'set', value: 'Updated title' },
        author: { mode: 'preserve', value: 'Original author' },
      }),
    )
    expect(editor.resultFilename.value).toBe('sample-metadata.pdf')
    expect(editor.resultUrl.value).toBe('blob:mock-url')
    expect(editor.errorMessage.value).toBe('')
  })

  it('blocks generation for encrypted files and reports save failures', async () => {
    const file = new File(['pdf'], 'locked.pdf', { type: 'application/pdf' })
    hoisted.readPdfMetadataMock.mockResolvedValue(
      createInfo({
        document: {
          version: '1.7',
          pageCount: 2,
          encrypted: true,
        },
      }),
    )

    const editor = usePdfMetadataEditor()
    await editor.handleUpload(file)

    expect(editor.canGenerate.value).toBe(false)
    await editor.generate()
    expect(hoisted.writePdfMetadataMock).not.toHaveBeenCalled()

    hoisted.readPdfMetadataMock.mockResolvedValue(createInfo())
    hoisted.writePdfMetadataMock.mockRejectedValueOnce(new Error('Save failed'))
    await editor.handleUpload(file)
    editor.setFieldMode('title', 'set')
    editor.setFieldValue('title', 'Updated title')
    await editor.generate()

    expect(editor.errorMessage.value).toBe('Save failed')
    expect(editor.resultUrl.value).toBeUndefined()
  })
})
