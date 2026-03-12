import { computed, defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'
import { PAGE_RANGE_ERROR } from '../utils/page-range'

const inspectPdfMock = vi.fn(async (_file: File) => ({ pageCount: 6 }))
vi.mock('../inspect-pdf', () => ({
  inspectPdf: (file: File) => inspectPdfMock(file),
  isPdfFile: (file: File) =>
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
}))

const applyWatermarkWithWorkerMock = vi.fn(
  async (_payload: unknown): Promise<unknown> => ({
    ok: true,
    result: {
      file: {
        name: 'output.pdf',
        blob: new Blob(['ok'], { type: 'application/pdf' }),
      },
    },
  }),
)

vi.mock('../apply-watermark', () => ({
  applyWatermarkWithWorker: (payload: unknown) => applyWatermarkWithWorkerMock(payload),
}))

const { normalizeWatermarkImageFileMock } = vi.hoisted(() => ({
  normalizeWatermarkImageFileMock: vi.fn(async (file: File) => file),
}))

vi.mock('../utils/watermark-content', () => ({
  isSupportedWatermarkImageFile: (file: File) =>
    file.type.toLowerCase().startsWith('image/') ||
    /\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp)$/i.test(file.name),
  normalizeWatermarkImageFile: (file: File) => normalizeWatermarkImageFileMock(file),
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (target: { value: Blob | null }) =>
    computed(() => (target.value ? 'blob:mock-result' : null)),
}))

import { usePdfWatermarkAdder } from './usePdfWatermarkAdder'

const Harness = defineComponent({
  setup() {
    return usePdfWatermarkAdder()
  },
  template: '<div />',
})

const flushAll = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return {
    promise,
    resolve,
    reject,
  }
}

type ActionResult = {
  success: boolean
  errorCode?: string
}

type WatermarkAdderHarnessVm = {
  file: File | null
  pageCount: number
  mode: 'text' | 'image'
  layoutMode: 'single' | 'tile'
  text: string
  fontFamily: 'sans-serif' | 'serif' | 'monospace'
  fontSize: number
  color: string
  opacity: number
  rotation: number
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  offsetX: number
  offsetY: number
  tileGapX: number
  tileGapY: number
  imageScale: number
  imageFile: File | null
  fileErrorCode: string
  imageErrorCode: string
  rangeErrorCode: string
  generateErrorCode: string
  resultFilename: string
  resultUrl: string | null
  canGenerate: boolean
  hasResult: boolean
  rangeInput: string
  setRangeInput(value: string): ActionResult
  setMode(value: 'text' | 'image'): void
  setLayoutMode(value: 'single' | 'tile'): void
  setText(value: string): void
  setTextPreset(value: string): void
  setFontFamily(value: 'sans-serif' | 'serif' | 'monospace'): void
  setFontSize(value: number | null): void
  setColor(value: string): void
  setOpacity(value: number | null): void
  setRotation(value: number | null): void
  setPosition(value: WatermarkAdderHarnessVm['position']): void
  setOffsetX(value: number | null): void
  setOffsetY(value: number | null): void
  setTileGapX(value: number | null): void
  setTileGapY(value: number | null): void
  applyTilePreset(value: 'sparse' | 'medium' | 'dense'): void
  setImageScale(value: number | null): void
  clearFile(): void
  clearImage(): void
  handleUpload(file: File): Promise<ActionResult>
  handleImageUpload(file: File): Promise<ActionResult>
  generate(): Promise<ActionResult>
}

const getVm = (wrapper: ReturnType<typeof mount>) =>
  wrapper.vm as unknown as WatermarkAdderHarnessVm

describe('usePdfWatermarkAdder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    inspectPdfMock.mockResolvedValue({ pageCount: 6 })
    applyWatermarkWithWorkerMock.mockResolvedValue({
      ok: true,
      result: {
        file: {
          name: 'output.pdf',
          blob: new Blob(['ok'], { type: 'application/pdf' }),
        },
      },
    })
    normalizeWatermarkImageFileMock.mockImplementation(async (file: File) => {
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
        return file
      }

      return new File(['png'], file.name.replace(/\.[^.]+$/u, '.png'), {
        type: 'image/png',
      })
    })
  })

  it('loads pdf and initializes state', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    const result = await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()

    expect(result.success).toBe(true)
    expect(vm.file?.name).toBe('sample.pdf')
    expect(vm.pageCount).toBe(6)
    expect(vm.mode).toBe('text')
    expect(vm.layoutMode).toBe('single')
    expect(vm.text).toBe('CONFIDENTIAL')
    expect(vm.canGenerate).toBe(true)
  })

  it('rejects non-pdf upload', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    const result = await vm.handleUpload(new File(['x'], 'a.txt', { type: 'text/plain' }))

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PDF_ERROR.Invalid)
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Invalid)
    expect(vm.file).toBe(null)
  })

  it('validates page range input', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    const result = vm.setRangeInput('1-')

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PAGE_RANGE_ERROR.InvalidToken)
    expect(vm.rangeErrorCode).toBe(PAGE_RANGE_ERROR.InvalidToken)
    expect(vm.canGenerate).toBe(false)
  })

  it('keeps range validation relaxed before a file is loaded and sanitizes numeric settings', () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    expect(vm.setRangeInput('1-3').success).toBe(true)
    expect(vm.rangeErrorCode).toBe('')

    vm.setFontSize(null)
    vm.setFontSize(999)
    vm.setColor('')
    vm.setOpacity(-4)
    vm.setOpacity(999)
    vm.setRotation(999)
    vm.setOffsetX(9999)
    vm.setOffsetY(-9999)
    vm.setTileGapX(-5)
    vm.setTileGapY(999)
    vm.setImageScale(1)

    expect(vm.fontSize).toBe(240)
    expect(vm.color).toBe('#000000')
    expect(vm.opacity).toBe(100)
    expect(vm.rotation).toBe(180)
    expect(vm.offsetX).toBe(2000)
    expect(vm.offsetY).toBe(-2000)
    expect(vm.tileGapX).toBe(0)
    expect(vm.tileGapY).toBe(200)
    expect(vm.imageScale).toBe(5)
  })

  it('switches layout mode and applies tile presets', () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    vm.setLayoutMode('tile')
    vm.applyTilePreset('sparse')

    expect(vm.layoutMode).toBe('tile')
    expect(vm.tileGapX).toBe(120)
    expect(vm.tileGapY).toBe(100)
  })

  it('generates a text watermarked pdf', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    vm.setText('TOP SECRET')
    vm.setFontFamily('monospace')
    vm.setFontSize(64)
    vm.setColor('#336699')
    vm.setOpacity(22)
    vm.setRotation(-40)
    vm.setPosition('bottom-right')
    vm.setOffsetX(12)
    vm.setOffsetY(-8)

    const result = await vm.generate()

    expect(result.success).toBe(true)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('output.pdf')
    expect(vm.resultUrl).toBe('blob:mock-result')
    expect(applyWatermarkWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'text',
        layoutMode: 'single',
        text: 'TOP SECRET',
        fontFamily: 'monospace',
        fontSize: 64,
        color: '#336699',
        opacity: 22,
        rotation: -40,
        position: 'bottom-right',
        offsetX: 12,
        offsetY: -8,
        tileGapX: 70,
        tileGapY: 60,
        pages: [1, 2, 3, 4, 5, 6],
        outputFileName: 'sample-watermarked.pdf',
      }),
    )
  })

  it('supports image mode and image validation', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    vm.setMode('image')

    const invalidResult = await vm.handleImageUpload(
      new File(['txt'], 'badge.txt', { type: 'text/plain' }),
    )
    expect(invalidResult.success).toBe(false)
    expect(vm.imageErrorCode).toBe(PDF_ERROR.InvalidImage)

    const validResult = await vm.handleImageUpload(
      new File(['webp'], 'logo.webp', { type: 'image/webp' }),
    )
    expect(validResult.success).toBe(true)
    expect(vm.imageFile?.name).toBe('logo.png')
    expect(vm.imageFile?.type).toBe('image/png')

    vm.setLayoutMode('tile')
    vm.applyTilePreset('dense')
    vm.setImageScale(35)
    const result = await vm.generate()

    expect(result.success).toBe(true)
    expect(applyWatermarkWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'image',
        layoutMode: 'tile',
        tileGapX: 30,
        tileGapY: 20,
        imageScale: 35,
        imageFile: expect.objectContaining({ name: 'logo.png' }),
      }),
    )
  })

  it('surfaces image conversion failures as invalid images', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    vm.setMode('image')
    normalizeWatermarkImageFileMock.mockRejectedValueOnce(new Error('watermark-image-load-failed'))

    const result = await vm.handleImageUpload(new File(['gif'], 'badge.gif', { type: 'image/gif' }))

    expect(result).toEqual({
      success: false,
      errorCode: PDF_ERROR.InvalidImage,
    })
    expect(vm.imageErrorCode).toBe(PDF_ERROR.InvalidImage)
  })

  it('returns early when generation prerequisites are missing', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await expect(vm.generate()).resolves.toEqual({
      success: false,
      errorCode: PDF_ERROR.Invalid,
    })

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    vm.setText('   ')

    await expect(vm.generate()).resolves.toEqual({
      success: false,
      errorCode: PDF_ERROR.ApplyFailed,
    })

    vm.setMode('image')
    await expect(vm.generate()).resolves.toEqual({
      success: false,
      errorCode: PDF_ERROR.InvalidImage,
    })
  })

  it('maps worker error responses and thrown errors during generation', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))

    applyWatermarkWithWorkerMock.mockResolvedValueOnce({
      ok: false,
      code: PDF_ERROR.InvalidImage,
    })
    const errorResult = await vm.generate()
    expect(errorResult).toEqual({
      success: false,
      errorCode: PDF_ERROR.InvalidImage,
    })
    expect(vm.generateErrorCode).toBe(PDF_ERROR.InvalidImage)

    applyWatermarkWithWorkerMock.mockRejectedValueOnce(new Error(PDF_ERROR.ApplyFailed))
    const thrownResult = await vm.generate()
    expect(thrownResult).toEqual({
      success: false,
      errorCode: PDF_ERROR.ApplyFailed,
    })
    expect(vm.generateErrorCode).toBe(PDF_ERROR.ApplyFailed)
  })

  it('returns range validation errors from generate', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    vm.setRangeInput('9')

    await expect(vm.generate()).resolves.toEqual({
      success: false,
      errorCode: PAGE_RANGE_ERROR.OutOfBounds,
    })
  })

  it('preserves current file when replacement upload fails', async () => {
    inspectPdfMock
      .mockResolvedValueOnce({ pageCount: 6 })
      .mockRejectedValueOnce(new Error(PDF_ERROR.Invalid))

    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    const result = await vm.handleUpload(
      new File(['bad'], 'broken.pdf', { type: 'application/pdf' }),
    )

    expect(result.success).toBe(false)
    expect(vm.file?.name).toBe('sample.pdf')
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Invalid)
  })

  it('keeps only the latest upload result when uploads overlap', async () => {
    const firstUpload = createDeferred<{ pageCount: number }>()
    const secondUpload = createDeferred<{ pageCount: number }>()

    inspectPdfMock
      .mockImplementationOnce(() => firstUpload.promise)
      .mockImplementationOnce(() => secondUpload.promise)

    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    const firstPromise = vm.handleUpload(new File(['x'], 'first.pdf', { type: 'application/pdf' }))
    const secondPromise = vm.handleUpload(
      new File(['x'], 'second.pdf', { type: 'application/pdf' }),
    )

    firstUpload.resolve({ pageCount: 2 })
    secondUpload.resolve({ pageCount: 6 })

    await expect(firstPromise).resolves.toEqual({ success: false })
    await expect(secondPromise).resolves.toEqual({ success: true })
    expect(vm.file?.name).toBe('second.pdf')
    expect(vm.pageCount).toBe(6)
  })

  it('ignores stale upload failures when a newer upload succeeds', async () => {
    const firstUpload = createDeferred<{ pageCount: number }>()

    inspectPdfMock
      .mockImplementationOnce(() => firstUpload.promise)
      .mockResolvedValueOnce({ pageCount: 4 })

    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    const firstPromise = vm.handleUpload(new File(['x'], 'first.pdf', { type: 'application/pdf' }))
    const secondPromise = vm.handleUpload(
      new File(['x'], 'second.pdf', { type: 'application/pdf' }),
    )

    firstUpload.reject(new Error(PDF_ERROR.Invalid))

    await expect(firstPromise).resolves.toEqual({ success: false })
    await expect(secondPromise).resolves.toEqual({ success: true })
    expect(vm.file?.name).toBe('second.pdf')
    expect(vm.fileErrorCode).toBe('')
  })

  it('ignores stale generation results when a newer generation starts', async () => {
    const firstGeneration = createDeferred<{
      ok: true
      result: { file: { name: string; blob: Blob } }
    }>()
    const secondGeneration = createDeferred<{
      ok: true
      result: { file: { name: string; blob: Blob } }
    }>()

    applyWatermarkWithWorkerMock
      .mockImplementationOnce(() => firstGeneration.promise)
      .mockImplementationOnce(() => secondGeneration.promise)

    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))

    const firstPromise = vm.generate()
    const secondPromise = vm.generate()

    firstGeneration.resolve({
      ok: true,
      result: {
        file: {
          name: 'first.pdf',
          blob: new Blob(['first'], { type: 'application/pdf' }),
        },
      },
    })
    secondGeneration.resolve({
      ok: true,
      result: {
        file: {
          name: 'second.pdf',
          blob: new Blob(['second'], { type: 'application/pdf' }),
        },
      },
    })

    await expect(firstPromise).resolves.toEqual({ success: false })
    await expect(secondPromise).resolves.toEqual({ success: true })
    expect(vm.resultFilename).toBe('second.pdf')
  })

  it('ignores stale generation failures when a newer generation succeeds', async () => {
    const firstGeneration = createDeferred<never>()

    applyWatermarkWithWorkerMock
      .mockImplementationOnce(() => firstGeneration.promise)
      .mockResolvedValueOnce({
        ok: true,
        result: {
          file: {
            name: 'fresh.pdf',
            blob: new Blob(['fresh'], { type: 'application/pdf' }),
          },
        },
      })

    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))

    const firstPromise = vm.generate()
    const secondPromise = vm.generate()

    firstGeneration.reject(new Error(PDF_ERROR.ApplyFailed))

    await expect(firstPromise).resolves.toEqual({ success: false })
    await expect(secondPromise).resolves.toEqual({ success: true })
    expect(vm.resultFilename).toBe('fresh.pdf')
    expect(vm.generateErrorCode).toBe('')
  })

  it('clears current file and result state', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    await vm.generate()

    vm.clearFile()

    expect(vm.file).toBe(null)
    expect(vm.pageCount).toBe(0)
    expect(vm.rangeInput).toBe('')
    expect(vm.hasResult).toBe(false)
  })

  it('clears image selection and preserves the last file base name fallback', async () => {
    const wrapper = mount(Harness)
    const vm = getVm(wrapper)

    await vm.handleUpload(new File(['x'], '   ', { type: 'application/pdf' }))
    await vm.handleImageUpload(new File(['png'], 'logo.png', { type: 'image/png' }))

    vm.clearImage()

    expect(vm.imageFile).toBe(null)
    expect(vm.imageErrorCode).toBe('')

    await vm.generate()
    expect(applyWatermarkWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        outputFileName: 'watermarked.pdf',
      }),
    )
  })
})
