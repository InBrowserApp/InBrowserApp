import { defineComponent, nextTick, type PropType } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WatermarkFontFamily, WatermarkMode, WatermarkPosition } from '../types'

const { loadPdfDocumentMock } = vi.hoisted(() => ({
  loadPdfDocumentMock: vi.fn(),
}))

vi.mock('../utils/pdfjs', () => ({
  loadPdfDocument: loadPdfDocumentMock,
}))

import { usePdfWatermarkPreview } from './usePdfWatermarkPreview'

type PreviewHarnessProps = {
  file: File | null
  pageCount: number
  rangeInput: string
  rangeErrorCode: string
  mode: WatermarkMode
  text: string
  fontFamily: WatermarkFontFamily
  fontSize: number
  color: string
  opacity: number
  rotation: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  imageFile: File | null
  imageScale: number
}

type CanvasContextMock = {
  canvas: HTMLCanvasElement
  clearRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
  fillText: ReturnType<typeof vi.fn>
  save: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  translate: ReturnType<typeof vi.fn>
  rotate: ReturnType<typeof vi.fn>
  font: string
  fillStyle: string
  textBaseline: CanvasTextBaseline
  globalAlpha: number
}

type PdfPageMock = {
  getViewport: ReturnType<typeof vi.fn>
  render: ReturnType<typeof vi.fn>
}

type PdfDocumentMock = {
  getPage: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
}

const createCanvasContextMock = (canvas: HTMLCanvasElement): CanvasContextMock => ({
  canvas,
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fillText: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  font: '',
  fillStyle: '',
  textBaseline: 'alphabetic',
  globalAlpha: 1,
})

const createPdfPageMock = (width = 200, height = 320): PdfPageMock => ({
  getViewport: vi.fn(({ scale }: { scale: number }) => ({
    width: width * scale,
    height: height * scale,
  })),
  render: vi.fn(() => ({
    promise: Promise.resolve(),
  })),
})

const createPdfDocumentMock = (): {
  document: PdfDocumentMock
  loadingTaskDestroy: ReturnType<typeof vi.fn>
  pages: Map<number, PdfPageMock>
} => {
  const pages = new Map<number, PdfPageMock>()
  for (let page = 1; page <= 8; page += 1) {
    pages.set(page, createPdfPageMock())
  }

  return {
    pages,
    loadingTaskDestroy: vi.fn(),
    document: {
      getPage: vi.fn(async (pageNumber: number) => pages.get(pageNumber) ?? createPdfPageMock()),
      destroy: vi.fn(),
    },
  }
}

const createDeferred = <T>() => {
  let resolve: (value: T) => void = () => undefined
  let reject: (error?: unknown) => void = () => undefined
  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  return { promise, resolve, reject }
}

const createProps = (overrides: Partial<PreviewHarnessProps> = {}): PreviewHarnessProps => ({
  file: new File(['pdf'], 'source.pdf', { type: 'application/pdf' }),
  pageCount: 6,
  rangeInput: '',
  rangeErrorCode: '',
  mode: 'text',
  text: 'CONFIDENTIAL',
  fontFamily: 'sans-serif',
  fontSize: 48,
  color: '#000000',
  opacity: 18,
  rotation: -35,
  position: 'center',
  offsetX: 0,
  offsetY: 0,
  imageFile: null,
  imageScale: 25,
  ...overrides,
})

const PreviewHarness = defineComponent({
  props: {
    file: {
      type: Object as PropType<File | null>,
      default: null,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    rangeInput: {
      type: String,
      required: true,
    },
    rangeErrorCode: {
      type: String,
      required: true,
    },
    mode: {
      type: String as PropType<WatermarkMode>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    fontFamily: {
      type: String as PropType<WatermarkFontFamily>,
      required: true,
    },
    fontSize: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    opacity: {
      type: Number,
      required: true,
    },
    rotation: {
      type: Number,
      required: true,
    },
    position: {
      type: String as PropType<WatermarkPosition>,
      required: true,
    },
    offsetX: {
      type: Number,
      required: true,
    },
    offsetY: {
      type: Number,
      required: true,
    },
    imageFile: {
      type: Object as PropType<File | null>,
      default: null,
    },
    imageScale: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return usePdfWatermarkPreview(props)
  },
  template: `
    <div>
      <canvas ref="previewCanvasRef" data-test="preview-page-canvas" />
      <output data-test="preview-page">{{ previewPage }}</output>
      <output data-test="preview-total">{{ totalPreviewPages }}</output>
      <output data-test="preview-rendering">{{ String(isRenderingPage) }}</output>
      <output data-test="preview-error">{{ String(hasPreviewError) }}</output>
    </div>
  `,
})

const PreviewHarnessWithoutCanvas = defineComponent({
  props: PreviewHarness.props,
  setup(props: Parameters<typeof usePdfWatermarkPreview>[0]) {
    return usePdfWatermarkPreview(props)
  },
  template: '<div data-test="preview-without-canvas" />',
})

const flushAll = async () => {
  await flushPromises()
  await nextTick()
  await flushPromises()
}

describe('usePdfWatermarkPreview', () => {
  const originalCreateImageBitmap = globalThis.createImageBitmap
  const originalImage = globalThis.Image
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>
  let getContextSpy: ReturnType<typeof vi.spyOn>
  let contexts: CanvasContextMock[]

  beforeEach(() => {
    vi.clearAllMocks()
    contexts = []

    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function (this: HTMLCanvasElement) {
        const context = createCanvasContextMock(this)
        contexts.push(context)
        return context as unknown as CanvasRenderingContext2D
      })

    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview-image')
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    globalThis.createImageBitmap = originalCreateImageBitmap
    globalThis.Image = originalImage
  })

  afterEach(() => {
    getContextSpy.mockRestore()
    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()

    if (originalCreateImageBitmap) {
      globalThis.createImageBitmap = originalCreateImageBitmap
    } else {
      delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap
    }

    globalThis.Image = originalImage
  })

  it('renders text watermark for selected pages and clamps preview navigation', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        rangeInput: '2,4',
        text: '  TOP SECRET  \n  internal  ',
        fontFamily: 'serif',
        fontSize: 24,
        color: '#3A5',
        opacity: 25,
      }),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      previewPage: number
      totalPreviewPages: number
      hasPreviewError: boolean
      setPreviewPage: (value: number) => void
    }

    expect(loadPdfDocumentMock).toHaveBeenCalledOnce()
    expect(vm.totalPreviewPages).toBe(2)
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(2)
    expect(vm.hasPreviewError).toBe(false)

    const watermarkContext = contexts.find((context) => context.fillText.mock.calls.length > 0)
    expect(watermarkContext?.fillText.mock.calls.map(([line]) => line)).toEqual([
      'TOP SECRET',
      'internal',
    ])
    expect(watermarkContext?.fillStyle).toBe('rgba(51, 170, 85, 0.25)')
    expect(watermarkContext?.font).toContain('Times New Roman')

    vm.setPreviewPage(99)
    await flushAll()

    expect(vm.previewPage).toBe(2)
    expect(pdfDocumentMock.document.getPage).toHaveBeenLastCalledWith(4)

    vm.setPreviewPage(Number.NaN)
    expect(vm.previewPage).toBe(2)
  })

  it('falls back to all pages when the range is invalid or flagged as invalid', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        pageCount: 3,
        rangeInput: '1-',
      }),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      previewPage: number
      totalPreviewPages: number
      setPreviewPage: (value: number) => void
    }

    expect(vm.totalPreviewPages).toBe(3)
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(1)

    vm.setPreviewPage(3)
    await flushAll()
    expect(pdfDocumentMock.document.getPage).toHaveBeenLastCalledWith(3)

    await wrapper.setProps({
      rangeErrorCode: 'page-range-invalid-token',
    })
    await flushAll()

    expect(vm.previewPage).toBe(1)
    expect(vm.totalPreviewPages).toBe(3)
    expect(pdfDocumentMock.document.getPage).toHaveBeenLastCalledWith(1)
  })

  it('treats missing page metadata as a single preview page and skips blank text watermarks', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        pageCount: 0,
        text: '   \n   ',
      }),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      totalPreviewPages: number
      hasPreviewError: boolean
    }

    expect(vm.totalPreviewPages).toBe(1)
    expect(vm.hasPreviewError).toBe(false)
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(1)
    expect(contexts.some((context) => context.fillText.mock.calls.length > 0)).toBe(false)
  })

  it('returns without error when no visible preview canvas is mounted', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarnessWithoutCanvas, {
      props: createProps(),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(vm.hasPreviewError).toBe(false)
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(1)
  })

  it('clears the visible canvas and destroys the preview document when the file is removed', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps(),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      previewPage: number
      totalPreviewPages: number
      setPreviewPage: (value: number) => void
    }

    vm.setPreviewPage(4)
    await flushAll()
    expect(vm.previewPage).toBe(4)

    await wrapper.setProps({
      file: null,
      pageCount: 0,
    })
    await flushAll()

    const canvas = wrapper.get('[data-test="preview-page-canvas"]').element as HTMLCanvasElement
    expect(canvas.width).toBe(0)
    expect(canvas.height).toBe(0)
    expect(vm.previewPage).toBe(1)
    expect(vm.totalPreviewPages).toBe(1)
    expect(pdfDocumentMock.document.destroy).toHaveBeenCalled()
    expect(pdfDocumentMock.loadingTaskDestroy).toHaveBeenCalled()
  })

  it('normalizes full hex colors and falls back to black for invalid values', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        color: '#336699',
        opacity: 120,
      }),
    })

    await flushAll()

    const fullHexContext = [...contexts]
      .reverse()
      .find((context) => context.fillText.mock.calls.length > 0)
    expect(fullHexContext?.fillStyle).toBe('rgba(51, 102, 153, 1)')

    await wrapper.setProps({
      color: 'invalid-color',
    })
    await flushAll()

    const fallbackContext = [...contexts]
      .reverse()
      .find((context) => context.fillText.mock.calls.length > 0)
    expect(fallbackContext?.fillStyle).toBe('rgba(0, 0, 0, 1)')
  })

  it('renders image watermarks with createImageBitmap and reuses the cached image', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    const firstBitmap = {
      width: 400,
      height: 200,
      close: vi.fn(),
    }
    const secondBitmap = {
      width: 300,
      height: 150,
      close: vi.fn(),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })
    globalThis.createImageBitmap = vi
      .fn()
      .mockResolvedValueOnce(firstBitmap)
      .mockResolvedValueOnce(secondBitmap)

    const firstImageFile = new File(['png'], 'logo-a.png', { type: 'image/png' })
    const secondImageFile = new File(['png'], 'logo-b.png', { type: 'image/png' })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        mode: 'image',
        imageFile: firstImageFile,
        opacity: 55,
        rotation: 15,
        imageScale: 25,
      }),
    })

    await flushAll()

    expect(globalThis.createImageBitmap).toHaveBeenCalledOnce()
    expect(
      contexts.some((context) =>
        context.drawImage.mock.calls.some(
          ([image, x, y, width, height]) =>
            image === firstBitmap && x === 0 && y === -75 && width === 150 && height === 75,
        ),
      ),
    ).toBe(true)
    expect(contexts.some((context) => context.globalAlpha === 0.55)).toBe(true)

    await wrapper.setProps({
      opacity: 60,
    })
    await flushAll()

    expect(globalThis.createImageBitmap).toHaveBeenCalledOnce()

    await wrapper.setProps({
      imageFile: secondImageFile,
    })
    await flushAll()

    expect(firstBitmap.close).toHaveBeenCalledOnce()
    expect(globalThis.createImageBitmap).toHaveBeenCalledTimes(2)

    wrapper.unmount()
    await flushAll()

    expect(secondBitmap.close).toHaveBeenCalledOnce()
  })

  it('skips image watermark drawing when image mode has no image file', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        mode: 'image',
        imageFile: null,
      }),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(vm.hasPreviewError).toBe(false)
    expect(
      contexts.every((context) => context.drawImage.mock.calls.every((call) => call.length <= 3)),
    ).toBe(true)
  })

  it('falls back to HTMLImageElement loading when createImageBitmap is unavailable', async () => {
    class FakeImage {
      onload: ((event: Event) => void) | null = null
      onerror: ((event: Event) => void) | null = null
      naturalWidth = 320
      naturalHeight = 160

      set src(_value: string) {
        queueMicrotask(() => this.onload?.(new Event('load')))
      }
    }

    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap
    globalThis.Image = FakeImage as unknown as typeof Image

    const imageFile = new File(['jpg'], 'badge.jpg', { type: 'image/jpeg' })
    mount(PreviewHarness, {
      props: createProps({
        mode: 'image',
        imageFile,
        imageScale: 30,
      }),
    })

    await flushAll()

    expect(createObjectURLSpy).toHaveBeenCalledWith(imageFile)
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:preview-image')
    expect(
      contexts.some((context) =>
        context.drawImage.mock.calls.some(([image]) => image instanceof FakeImage),
      ),
    ).toBe(true)
  })

  it('ignores stale image draws when a newer render sequence starts before the image resolves', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    const deferredBitmap = createDeferred<{ width: number; height: number; close: () => void }>()
    const sharedBitmap = {
      width: 300,
      height: 150,
      close: vi.fn(),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })
    globalThis.createImageBitmap = vi.fn().mockReturnValueOnce(deferredBitmap.promise)

    const imageFile = new File(['png'], 'logo.png', { type: 'image/png' })
    const wrapper = mount(PreviewHarness, {
      props: createProps({
        mode: 'image',
        imageFile,
      }),
    })

    await flushPromises()
    await wrapper.setProps({
      opacity: 42,
    })

    deferredBitmap.resolve(sharedBitmap)
    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(globalThis.createImageBitmap).toHaveBeenCalledOnce()
    expect(vm.hasPreviewError).toBe(false)
    expect(
      contexts.some((context) =>
        context.drawImage.mock.calls.some(([image]) => image === sharedBitmap),
      ),
    ).toBe(true)
  })

  it('skips zero-sized preview images without failing the preview', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    const zeroBitmap = {
      width: 0,
      height: 120,
      close: vi.fn(),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })
    globalThis.createImageBitmap = vi.fn().mockResolvedValue(zeroBitmap)

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        mode: 'image',
        imageFile: new File(['png'], 'empty.png', { type: 'image/png' }),
      }),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(vm.hasPreviewError).toBe(false)
    expect(
      contexts.some((context) =>
        context.drawImage.mock.calls.some(([image]) => image === zeroBitmap),
      ),
    ).toBe(false)
  })

  it('ignores stale page renders when the preview page changes mid-render', async () => {
    const firstRender = createDeferred<void>()
    const firstPage = {
      getViewport: vi.fn(({ scale }: { scale: number }) => ({
        width: 200 * scale,
        height: 320 * scale,
      })),
      render: vi.fn(() => ({
        promise: firstRender.promise,
      })),
    }
    const secondPage = createPdfPageMock()
    const document = {
      getPage: vi.fn(async (pageNumber: number) => (pageNumber === 1 ? firstPage : secondPage)),
      destroy: vi.fn(),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(document),
      destroy: vi.fn(),
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        pageCount: 2,
        rangeInput: '1,2',
      }),
    })

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      previewPage: number
      hasPreviewError: boolean
      setPreviewPage: (value: number) => void
    }

    vm.setPreviewPage(2)
    await flushAll()

    firstRender.resolve()
    await flushAll()

    expect(document.getPage).toHaveBeenCalledWith(1)
    expect(document.getPage).toHaveBeenCalledWith(2)
    expect(vm.previewPage).toBe(2)
    expect(vm.hasPreviewError).toBe(false)
  })

  it('returns early after document loading when a newer render sequence starts', async () => {
    const loadingDocument = createPdfDocumentMock()
    const deferredDocument = createDeferred<PdfDocumentMock>()

    loadPdfDocumentMock.mockReturnValue({
      promise: deferredDocument.promise,
      destroy: loadingDocument.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        text: 'first pass',
      }),
    })

    await flushPromises()
    await wrapper.setProps({
      text: 'second pass',
    })

    deferredDocument.resolve(loadingDocument.document)
    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(loadingDocument.document.getPage).toHaveBeenCalledTimes(1)
    expect(vm.hasPreviewError).toBe(false)
  })

  it('clamps out-of-range preview pages before rendering', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        pageCount: 2,
        rangeInput: '1,2',
      }),
    })

    await flushAll()
    ;(wrapper.vm as unknown as { previewPage: number }).previewPage = 99
    await wrapper.setProps({
      opacity: 19,
    })
    await flushAll()

    const vm = wrapper.vm as unknown as {
      previewPage: number
      hasPreviewError: boolean
    }

    expect(vm.previewPage).toBe(2)
    expect(vm.hasPreviewError).toBe(false)
    expect(pdfDocumentMock.document.getPage).toHaveBeenLastCalledWith(2)
  })

  it('returns early after getPage resolves when a newer render sequence starts', async () => {
    const deferredPage = createDeferred<PdfPageMock>()
    const firstPage = createPdfPageMock()
    const secondPage = createPdfPageMock()
    const document = {
      getPage: vi.fn(async (pageNumber: number) =>
        pageNumber === 1 && document.getPage.mock.calls.length === 1
          ? deferredPage.promise
          : secondPage,
      ),
      destroy: vi.fn(),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(document),
      destroy: vi.fn(),
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps(),
    })

    await flushPromises()
    await wrapper.setProps({
      rotation: 10,
    })

    deferredPage.resolve(firstPage)
    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(document.getPage).toHaveBeenCalledTimes(2)
    expect(vm.hasPreviewError).toBe(false)
  })

  it('ignores stale document loads when a newer file replaces the current render', async () => {
    const firstDocument = {
      destroy: vi.fn(),
    }
    const secondPdfDocumentMock = createPdfDocumentMock()
    const firstLoad = createDeferred<PdfDocumentMock>()
    const firstLoadingTaskDestroy = vi.fn()

    loadPdfDocumentMock
      .mockReturnValueOnce({
        promise: firstLoad.promise,
        destroy: firstLoadingTaskDestroy,
      })
      .mockReturnValueOnce({
        promise: Promise.resolve(secondPdfDocumentMock.document),
        destroy: secondPdfDocumentMock.loadingTaskDestroy,
      })

    const wrapper = mount(PreviewHarness, {
      props: createProps({
        file: new File(['first'], 'first.pdf', { type: 'application/pdf' }),
      }),
    })

    await flushPromises()

    await wrapper.setProps({
      file: new File(['second'], 'second.pdf', { type: 'application/pdf' }),
    })

    firstLoad.resolve(firstDocument as PdfDocumentMock)
    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(firstDocument.destroy).toHaveBeenCalled()
    expect(firstLoadingTaskDestroy).toHaveBeenCalled()
    expect(secondPdfDocumentMock.document.getPage).toHaveBeenCalledWith(1)
    expect(vm.hasPreviewError).toBe(false)
  })

  it('shows a preview error when the rendered page canvas context is unavailable', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    let contextCallCount = 0

    getContextSpy.mockRestore()
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function (this: HTMLCanvasElement) {
        contextCallCount += 1
        if (contextCallCount === 1) {
          return null
        }

        const context = createCanvasContextMock(this)
        contexts.push(context)
        return context as unknown as CanvasRenderingContext2D
      })

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps(),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }

    expect(vm.hasPreviewError).toBe(true)
  })

  it('shows a preview error when the visible canvas context is unavailable', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    let contextCallCount = 0

    getContextSpy.mockRestore()
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function (this: HTMLCanvasElement) {
        contextCallCount += 1
        if (contextCallCount === 2) {
          return null
        }

        const context = createCanvasContextMock(this)
        contexts.push(context)
        return context as unknown as CanvasRenderingContext2D
      })

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: pdfDocumentMock.loadingTaskDestroy,
    })

    const wrapper = mount(PreviewHarness, {
      props: createProps(),
    })

    await flushAll()

    const vm = wrapper.vm as unknown as {
      hasPreviewError: boolean
    }
    const canvas = wrapper.get('[data-test="preview-page-canvas"]').element as HTMLCanvasElement

    expect(vm.hasPreviewError).toBe(true)
    expect(canvas.width).toBe(0)
    expect(canvas.height).toBe(0)
  })
})
