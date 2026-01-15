import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref<string | undefined>(undefined),
  }
})

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
    }),
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NCheckbox, NMessageProvider, NUpload } from 'naive-ui'
import SvgToImageConverterView from './SvgToImageConverterView.vue'

const Wrapper = {
  render() {
    return h(NMessageProvider, () => h(SvgToImageConverterView))
  },
}

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        inheritAttrs: false,
        props: ['info'],
        template: '<div><slot /></div>',
      },
    },
  },
}

const originalCreateObjectURL =
  typeof URL.createObjectURL === 'function' ? URL.createObjectURL : undefined
const originalRevokeObjectURL =
  typeof URL.revokeObjectURL === 'function' ? URL.revokeObjectURL : undefined
const originalToBlob =
  typeof HTMLCanvasElement.prototype.toBlob === 'function'
    ? HTMLCanvasElement.prototype.toBlob
    : undefined

let createObjectURLSpy: ReturnType<typeof vi.fn> | null = null
let revokeObjectURLSpy: ReturnType<typeof vi.fn> | null = null
let getContextSpy: ReturnType<typeof vi.fn> | null = null
let toBlobSpy: ReturnType<typeof vi.fn> | null = null
let contextMock: {
  fillStyle: string
  fillRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
} | null = null

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  set src(_value: string) {
    this.onload?.()
  }
}

const mountWrapper = () => mount(Wrapper, mountOptions)

type OutputFormat = 'png' | 'jpeg' | 'webp'

type SvgDimensions = { width: number; height: number }

type UploadFileLike = { name: string; type: string; text: () => Promise<unknown> }

type UploadPayload = {
  file: { file?: File | UploadFileLike }
  fileList: Array<{ file?: File | UploadFileLike }>
}

type SvgToImageConverterVm = {
  parseSvgLength: (value: string | null) => number | null
  parseViewBox: (value: string | null) => SvgDimensions | null
  getSvgDimensions: (value: string) => SvgDimensions
  buildSvgDataUrl: (value: string) => string
  handleBeforeUpload: (payload: UploadPayload) => Promise<boolean>
  handleClearFile: () => void
  setOriginalDimensions: (dimensions: SvgDimensions) => void
  handleWidthUpdate: (value: number | null) => void
  handleHeightUpdate: (value: number | null) => void
  handleKeepAspectToggle: (value: boolean) => void
  resetToOriginal: () => void
  handleFormatUpdate: (value: OutputFormat) => void
  handleQualityUpdate: (value: number) => void
  handleBackgroundToggle: (value: boolean) => void
  handleBackgroundChange: (value: string) => void
  resolveOutputSize: () => SvgDimensions
  convertSvg: () => Promise<void>
  downloadOutput: () => void
  loadSvgImage: (value: string) => Promise<HTMLImageElement>
  formatOptions: Array<{ label: string; value: OutputFormat }>
  aspectRatio: number
  outputExtension: string
  outputMimeType: string
  outputFileName: string
  originalSizeLabel: string
  outputSizeLabel: string
  originalDimensionsLabel: string
  outputDimensionsLabel: string
  showQuality: boolean
  originalFile: File | null
  svgText: string
  svgDimensions: SvgDimensions | null
  outputBlob: Blob | null
  outputDimensions: SvgDimensions | null
  error: string
  format: OutputFormat
  width: number
  height: number
  keepAspect: boolean
  useBackground: boolean
  backgroundColor: string
  quality: number
  outputPreviewUrl: string
}

const getVm = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(SvgToImageConverterView).vm as unknown as SvgToImageConverterVm

const createSvgFile = (
  content = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"></svg>',
  name = 'sample.svg',
  type = 'image/svg+xml',
) => new File([content], name, { type })

beforeEach(() => {
  if (originalCreateObjectURL) {
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock') as unknown as ReturnType<typeof vi.fn>
  } else {
    createObjectURLSpy = vi.fn(() => 'blob:mock')
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURLSpy,
      writable: true,
    })
  }

  if (originalRevokeObjectURL) {
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {}) as unknown as ReturnType<typeof vi.fn>
  } else {
    revokeObjectURLSpy = vi.fn()
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURLSpy, writable: true })
  }

  vi.stubGlobal('Image', MockImage)

  contextMock = {
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  }

  getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(contextMock as unknown as CanvasRenderingContext2D) as unknown as ReturnType<
    typeof vi.fn
  >

  if (originalToBlob) {
    toBlobSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((callback: BlobCallback, type?: string) => {
        callback(new Blob(['ok'], { type: type || 'image/png' }))
      }) as unknown as ReturnType<typeof vi.fn>
  } else {
    const toBlobSpyFn = vi.fn() as unknown as (...args: unknown[]) => void
    toBlobSpy = toBlobSpyFn as unknown as ReturnType<typeof vi.fn>
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: BlobCallback, type?: string, quality?: number) => {
        toBlobSpyFn(callback, type, quality)
        callback(new Blob(['ok'], { type: type || 'image/png' }))
      },
      writable: true,
    })
  }
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()

  if (!originalToBlob) {
    delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
  }

  if (!originalCreateObjectURL) {
    delete (URL as { createObjectURL?: unknown }).createObjectURL
  }

  if (!originalRevokeObjectURL) {
    delete (URL as { revokeObjectURL?: unknown }).revokeObjectURL
  }
})

describe('SvgToImageConverterView', () => {
  it('renders the upload prompt', () => {
    const wrapper = mountWrapper()
    expect(wrapper.text()).toContain('Click or drag')
  })

  it('parses svg helpers and dimensions', () => {
    const wrapper = mountWrapper()
    const vm = getVm(wrapper)

    expect(vm.parseSvgLength(null)).toBeNull()
    expect(vm.parseSvgLength('')).toBeNull()
    expect(vm.parseSvgLength('25%')).toBeNull()
    expect(vm.parseSvgLength('abc')).toBeNull()
    expect(vm.parseSvgLength('0')).toBeNull()
    expect(vm.parseSvgLength('12px')).toBe(12)

    expect(vm.parseViewBox(null)).toBeNull()
    expect(vm.parseViewBox('0 0 1')).toBeNull()
    expect(vm.parseViewBox('0 0 a b')).toBeNull()
    expect(vm.parseViewBox('0 0 -10 20')).toBeNull()
    expect(vm.parseViewBox('0 0 10 20')).toEqual({ width: 10, height: 20 })

    expect(() => vm.getSvgDimensions('<svg')).toThrow()
    expect(() => vm.getSvgDimensions('<div></div>')).toThrow()

    expect(vm.getSvgDimensions('<svg viewBox="0 0 100 200"></svg>')).toEqual({
      width: 100,
      height: 200,
    })
    expect(vm.getSvgDimensions('<svg width="150" viewBox="0 0 300 600"></svg>')).toEqual({
      width: 150,
      height: 300,
    })
    expect(vm.getSvgDimensions('<svg height="200" viewBox="0 0 400 100"></svg>')).toEqual({
      width: 800,
      height: 200,
    })
    expect(vm.getSvgDimensions('<svg width="20" height="30"></svg>')).toEqual({
      width: 20,
      height: 30,
    })
    expect(vm.getSvgDimensions('<svg></svg>')).toEqual({ width: 512, height: 512 })

    expect(vm.buildSvgDataUrl('<svg></svg>')).toContain('data:image/svg+xml')
  })

  it('handles upload validation and reset', async () => {
    const wrapper = mountWrapper()
    const vm = getVm(wrapper)

    await vm.handleBeforeUpload({ file: { file: undefined }, fileList: [] })
    expect(vm.originalFile).toBeNull()

    const invalidFile = createSvgFile('not svg', 'file.txt', 'text/plain')
    await vm.handleBeforeUpload({
      file: { file: invalidFile },
      fileList: [{ file: invalidFile }, { file: invalidFile }],
    })
    expect(vm.originalFile).toBeNull()

    await vm.handleBeforeUpload({ file: { file: invalidFile }, fileList: [{ file: invalidFile }] })
    expect(vm.originalFile).toBeNull()

    const failingFile = {
      name: 'bad.svg',
      type: 'image/svg+xml',
      text: () => Promise.reject(new Error('read fail')),
    }

    await vm.handleBeforeUpload({ file: { file: failingFile }, fileList: [{ file: failingFile }] })
    expect(vm.error).toContain('read fail')

    const weirdFile = {
      name: 'weird.svg',
      type: 'image/svg+xml',
      text: () => Promise.reject('nope'),
    }

    await vm.handleBeforeUpload({ file: { file: weirdFile }, fileList: [{ file: weirdFile }] })
    expect(vm.error).toContain('Failed to read SVG file')

    const invalidSvg = createSvgFile('<div></div>')
    await vm.handleBeforeUpload({ file: { file: invalidSvg }, fileList: [{ file: invalidSvg }] })
    expect(vm.error).toContain('Invalid SVG')

    const file = createSvgFile()
    await vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    expect(vm.originalFile?.name).toBe('sample.svg')
    expect(vm.width).toBe(40)
    expect(vm.height).toBe(20)

    vm.handleClearFile()
    expect(vm.originalFile).toBeNull()
    expect(vm.width).toBe(0)
    expect(vm.height).toBe(0)
    expect(vm.error).toBe('')
  })

  it('updates size, format settings, and computed values', async () => {
    const wrapper = mountWrapper()
    const vm = getVm(wrapper)

    expect(vm.formatOptions).toHaveLength(3)
    expect(vm.aspectRatio).toBe(1)

    vm.setOriginalDimensions({ width: 100, height: 50 })
    expect(vm.width).toBe(100)
    expect(vm.height).toBe(50)
    expect(vm.aspectRatio).toBe(2)
    expect(vm.originalDimensionsLabel).not.toBe('')

    vm.handleWidthUpdate(null)
    vm.handleWidthUpdate(200)
    expect(vm.height).toBe(100)

    vm.handleHeightUpdate(75)
    expect(vm.width).toBe(150)

    vm.handleHeightUpdate(null)

    vm.keepAspect = false
    vm.handleWidthUpdate(160)
    expect(vm.height).toBe(75)
    vm.handleHeightUpdate(80)
    expect(vm.width).toBe(160)

    vm.width = 0
    vm.handleKeepAspectToggle(true)
    expect(vm.keepAspect).toBe(true)
    expect(vm.width).toBeGreaterThan(0)

    vm.handleKeepAspectToggle(false)
    expect(vm.keepAspect).toBe(false)

    vm.resetToOriginal()
    expect(vm.width).toBe(100)
    expect(vm.height).toBe(50)

    vm.svgDimensions = null
    expect(vm.originalDimensionsLabel).toBe('')
    vm.resetToOriginal()
    vm.handleKeepAspectToggle(true)

    vm.handleFormatUpdate('jpeg')
    expect(vm.outputExtension).toBe('jpg')
    expect(vm.outputMimeType).toBe('image/jpeg')
    expect(vm.showQuality).toBe(true)

    vm.handleFormatUpdate('webp')
    expect(vm.outputMimeType).toBe('image/webp')

    vm.handleFormatUpdate('png')
    expect(vm.showQuality).toBe(false)

    vm.handleQualityUpdate(75)
    expect(vm.quality).toBe(75)

    vm.handleBackgroundToggle(true)
    expect(vm.useBackground).toBe(true)

    vm.handleBackgroundChange('#ff00ff')
    expect(vm.backgroundColor).toBe('#ff00ff')

    vm.originalFile = createSvgFile('<svg></svg>', 'icon.svg')
    vm.handleFormatUpdate('jpeg')
    expect(vm.outputFileName).toContain('icon.jpg')
    expect(vm.originalSizeLabel).not.toBe('')

    vm.outputDimensions = { width: 10, height: 20 }
    expect(vm.outputDimensionsLabel).toContain('10')
    expect(vm.outputDimensionsLabel).toContain('20')

    vm.outputDimensions = null
    expect(vm.outputDimensionsLabel).toBe('')

    vm.outputBlob = new Blob(['ok'])
    expect(vm.outputSizeLabel).not.toBe('')

    vm.outputBlob = null
    expect(vm.outputSizeLabel).toBe('')

    vm.originalFile = null
    expect(vm.outputFileName).toContain('converted')
    expect(vm.originalSizeLabel).toBe('')

    vm.svgDimensions = null
    vm.width = 0
    vm.height = 0
    expect(vm.resolveOutputSize()).toEqual({ width: 512, height: 512 })

    vm.svgText = '<svg width="40" height="20"></svg>'
    vm.handleFormatUpdate('png')
    await flushPromises()

    const backgroundCheckbox = wrapper
      .findAllComponents(NCheckbox)
      .find((checkbox) => checkbox.text().includes('Fill background'))

    expect(backgroundCheckbox).toBeTruthy()
    await backgroundCheckbox!.vm.$emit('update:checked', false)
  })

  it('converts svg with error and success paths', async () => {
    const wrapper = mountWrapper()
    const vm = getVm(wrapper)

    await vm.convertSvg()
    expect(vm.outputBlob).toBeNull()

    vm.svgText = '<svg width="40" height="20"></svg>'
    vm.setOriginalDimensions({ width: 40, height: 20 })
    vm.originalFile = createSvgFile()

    getContextSpy?.mockReturnValueOnce(null)
    await vm.convertSvg()
    expect(vm.error).toContain('Canvas')

    getContextSpy?.mockImplementationOnce(() => {
      throw 'boom'
    })
    await vm.convertSvg()
    expect(vm.error).toBe('Failed to convert SVG')

    toBlobSpy?.mockImplementationOnce((callback: BlobCallback) => {
      callback(null)
    })
    await vm.convertSvg()
    expect(vm.error).toBe('Failed to convert SVG')

    getContextSpy?.mockReturnValue(contextMock as unknown as CanvasRenderingContext2D)
    vm.handleFormatUpdate('png')
    vm.handleBackgroundToggle(false)
    contextMock?.fillRect.mockClear()
    await vm.convertSvg()
    expect(contextMock?.fillRect).not.toHaveBeenCalled()
    expect(vm.outputBlob).toBeTruthy()

    vm.handleBackgroundToggle(true)
    contextMock?.fillRect.mockClear()
    await vm.convertSvg()
    expect(contextMock?.fillRect).toHaveBeenCalled()

    vm.handleFormatUpdate('jpeg')
    contextMock?.fillRect.mockClear()
    toBlobSpy?.mockClear()
    await vm.convertSvg()
    expect(contextMock?.fillRect).toHaveBeenCalled()

    const toBlobCalls = toBlobSpy?.mock.calls ?? []
    const lastToBlobCall = toBlobCalls[toBlobCalls.length - 1]
    expect(lastToBlobCall?.[1]).toBe('image/jpeg')
    expect(lastToBlobCall?.[2]).toBeCloseTo(0.92, 2)
  })

  it('handles download output and load failures', async () => {
    const wrapper = mountWrapper()
    const vm = getVm(wrapper)

    vm.downloadOutput()

    class ErrorImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      set src(_value: string) {
        this.onerror?.()
      }
    }

    vi.stubGlobal('Image', ErrorImage)
    await expect(vm.loadSvgImage('<svg></svg>')).rejects.toThrow('Failed to load SVG image')

    vm.outputBlob = new Blob(['ok'])
    vm.outputDimensions = { width: 40, height: 20 }
    vm.originalFile = createSvgFile()
    vm.setOriginalDimensions({ width: 40, height: 20 })
    await flushPromises()
    const outputText = wrapper.text()
    expect(outputText).toContain('Original')
    expect(outputText).toContain('Output')
    expect(outputText).toContain('Dimensions:')
    expect(outputText).toContain('File size:')
    expect(outputText).toContain('sample.png')
    expect(vm.outputFileName).toContain('sample.png')

    vm.outputPreviewUrl = 'blob:preview'
    createObjectURLSpy?.mockClear()
    revokeObjectURLSpy?.mockClear()
    vm.downloadOutput()
    expect(createObjectURLSpy).not.toHaveBeenCalled()
    expect(revokeObjectURLSpy).not.toHaveBeenCalled()

    vm.outputPreviewUrl = ''
    createObjectURLSpy?.mockClear()
    revokeObjectURLSpy?.mockClear()
    vm.downloadOutput()
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalled()

    vm.outputBlob = null
    vm.downloadOutput()
  })

  it('converts an SVG file to output through upload', async () => {
    const wrapper = mountWrapper()
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"></svg>'
    const file = new File([svg], 'sample.svg', { type: 'image/svg+xml' })

    const upload = wrapper.findComponent(NUpload)
    await upload.vm.$emit('before-upload', { file: { file }, fileList: [{ file }] })
    await flushPromises()

    const buttons = wrapper.findAll('button')
    const convertButton = buttons.find((button) => button.text().includes('Convert'))

    expect(convertButton).toBeTruthy()
    await convertButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Download')
  })
})
