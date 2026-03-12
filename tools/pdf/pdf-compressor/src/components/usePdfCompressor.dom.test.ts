import { computed, isProxy, nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PRESET_OPTIONS, usePdfCompressor } from './usePdfCompressor'
import { PDF_ERROR } from '../pdf-errors'

const { inspectPdfMock, compressPdfWithWorkerMock } = vi.hoisted(() => ({
  inspectPdfMock: vi.fn(),
  compressPdfWithWorkerMock: vi.fn(),
}))

vi.mock('../inspect-pdf', () => ({
  inspectPdf: (...args: unknown[]) => inspectPdfMock(...args),
}))

vi.mock('../compress-pdf', () => ({
  compressPdfWithWorker: (...args: unknown[]) => compressPdfWithWorkerMock(...args),
}))

vi.mock('@vueuse/core', async () => ({
  computed,
  useObjectUrl: (blobRef: { value: Blob | null }) =>
    computed(() => (blobRef.value ? 'blob:mock' : undefined)),
}))

describe('usePdfCompressor', () => {
  beforeEach(() => {
    inspectPdfMock.mockReset()
    compressPdfWithWorkerMock.mockReset()
  })

  it('starts with balanced preset defaults', () => {
    const state = usePdfCompressor()

    expect(state.preset.value).toBe('balanced')
    expect(state.options.value).toEqual({
      ...PRESET_OPTIONS.balanced,
      linearize: false,
    })
    expect(state.canCompress.value).toBe(false)
    expect(state.resultFilename.value).toBe('compressed.pdf')
  })

  it('loads valid pdf files and exposes derived state', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 4 })

    const state = usePdfCompressor()
    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    await state.handleUpload(file)

    expect(state.file.value).toBe(file)
    expect(state.pageCount.value).toBe(4)
    expect(state.canCompress.value).toBe(true)
    expect(state.resultFilename.value).toBe('sample-compressed.pdf')
  })

  it('falls back to a default base name when the uploaded file name is only .pdf', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 1 })

    const state = usePdfCompressor()
    await state.handleUpload(new File(['pdf'], '.pdf', { type: 'application/pdf' }))

    expect(state.resultFilename.value).toBe('compressed-compressed.pdf')
  })

  it('stores file inspection errors', async () => {
    inspectPdfMock.mockRejectedValue(new Error(PDF_ERROR.Encrypted))

    const state = usePdfCompressor()
    await state.handleUpload(new File(['pdf'], 'locked.pdf', { type: 'application/pdf' }))

    expect(state.file.value).toBeNull()
    expect(state.fileErrorCode.value).toBe(PDF_ERROR.Encrypted)
    expect(state.canCompress.value).toBe(false)
  })

  it('falls back to invalid-pdf when inspection throws a non-Error value', async () => {
    inspectPdfMock.mockRejectedValue('bad-pdf')

    const state = usePdfCompressor()
    await state.handleUpload(new File(['pdf'], 'broken.pdf', { type: 'application/pdf' }))

    expect(state.fileErrorCode.value).toBe(PDF_ERROR.Invalid)
  })

  it('updates options from preset while preserving linearize and clearing results', async () => {
    const state = usePdfCompressor()
    state.resultBlob.value = new Blob(['old'])
    state.compressionErrorCode.value = PDF_ERROR.CompressionFailed
    state.options.value.linearize = true

    state.preset.value = 'max-lossless'
    await nextTick()

    expect(state.options.value).toEqual({
      ...PRESET_OPTIONS['max-lossless'],
      linearize: true,
    })
    expect(state.resultBlob.value).toBeNull()
    expect(state.compressionErrorCode.value).toBe('')
  })

  it('compresses a file and detects when size is not reduced', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 1 })
    compressPdfWithWorkerMock.mockResolvedValue(new Blob(['1234567890']))

    const state = usePdfCompressor()
    const file = new File(['12345'], 'notes.pdf', { type: 'application/pdf' })
    await state.handleUpload(file)
    state.preset.value = 'max-lossless'
    await nextTick()
    state.options.value.linearize = true

    await state.compress()

    expect(compressPdfWithWorkerMock).toHaveBeenCalledWith(file, {
      compressStreams: true,
      recompressFlate: true,
      compressionLevel: 9,
      objectStreams: 'generate',
      linearize: true,
    })
    expect(isProxy(compressPdfWithWorkerMock.mock.calls[0]?.[1])).toBe(false)
    expect(state.hasResult.value).toBe(true)
    expect(state.resultUrl.value).toBe('blob:mock')
    expect(state.noReduction.value).toBe(true)
  })

  it('maps worker and generic compression failures', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 2 })

    const state = usePdfCompressor()
    await state.handleUpload(new File(['pdf'], 'worker.pdf', { type: 'application/pdf' }))

    compressPdfWithWorkerMock.mockRejectedValueOnce(new Error(PDF_ERROR.WorkerUnsupported))
    await state.compress()
    expect(state.compressionErrorCode.value).toBe(PDF_ERROR.WorkerUnsupported)

    compressPdfWithWorkerMock.mockRejectedValueOnce(new Error('boom'))
    await state.compress()
    expect(state.compressionErrorCode.value).toBe(PDF_ERROR.CompressionFailed)
  })

  it('returns an early failure result when compression cannot start', async () => {
    const state = usePdfCompressor()

    await expect(state.compress()).resolves.toEqual({ success: false })
    expect(compressPdfWithWorkerMock).not.toHaveBeenCalled()
  })

  it('clears file and result state', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 3 })
    compressPdfWithWorkerMock.mockResolvedValue(new Blob(['ok']))

    const state = usePdfCompressor()
    await state.handleUpload(new File(['pdf'], 'clear.pdf', { type: 'application/pdf' }))
    await state.compress()
    state.clearFile()

    expect(state.file.value).toBeNull()
    expect(state.pageCount.value).toBeNull()
    expect(state.hasResult.value).toBe(false)
    expect(state.resultFilename.value).toBe('compressed.pdf')
  })
})
