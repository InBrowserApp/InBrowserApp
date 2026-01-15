import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ColorPickerTool from './ColorPickerTool.vue'
import type { UploadFileInfo } from 'naive-ui'
import { nextTick } from 'vue'

const originalResizeObserver = globalThis.ResizeObserver
const originalEyeDropper = (globalThis as typeof globalThis & { EyeDropper?: unknown }).EyeDropper
const originalImage = globalThis.Image

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

type ExposedMethods = {
  handleBeforeUpload: (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => boolean
  handleCanvasClick: (event: MouseEvent) => void
  handleScreenPick: () => Promise<void>
}

const createUploadInfo = (file?: File): UploadFileInfo => ({
  id: file?.name ?? 'file',
  name: file?.name ?? 'file',
  status: 'pending',
  file,
  type: file?.type ?? 'image/png',
})

function getVm(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as ExposedMethods
}

const CopyToClipboardButtonStub = {
  template: '<button />',
}

function mountTool() {
  return mount(ColorPickerTool, {
    global: {
      stubs: {
        CopyToClipboardButton: CopyToClipboardButtonStub,
      },
    },
  })
}

beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = MockResizeObserver as typeof ResizeObserver
  }
})

afterAll(() => {
  if (originalResizeObserver) {
    globalThis.ResizeObserver = originalResizeObserver
  } else {
    delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver
  }
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  if (originalEyeDropper) {
    ;(globalThis as typeof globalThis & { EyeDropper?: unknown }).EyeDropper = originalEyeDropper
  } else {
    delete (globalThis as { EyeDropper?: unknown }).EyeDropper
  }
  globalThis.Image = originalImage
  vi.restoreAllMocks()
})

describe('ColorPickerTool', () => {
  it('renders output fields without alpha when disabled', () => {
    localStorage.setItem('tools:color-picker:show-alpha', 'false')
    const wrapper = mountTool()

    expect(wrapper.text()).toContain('RGB')
    expect(wrapper.text()).not.toContain('RGBA')
  })

  it('handles unsupported screen picker', async () => {
    delete (globalThis as typeof globalThis & { EyeDropper?: unknown }).EyeDropper
    const wrapper = mountTool()
    const vm = getVm(wrapper)

    await vm.handleScreenPick()

    expect(wrapper.text()).toContain('Screen color picking is not supported in this browser.')
    const button = wrapper
      .findAll('button')
      .find((item) => item.text().trim() === 'Pick Screen Color')
    expect(button?.attributes('disabled')).toBeDefined()
  })

  it('picks a screen color when EyeDropper is available', async () => {
    class MockEyeDropper {
      open = vi.fn().mockResolvedValue({ sRGBHex: '#112233' })
    }
    ;(globalThis as typeof globalThis & { EyeDropper?: unknown }).EyeDropper = MockEyeDropper

    const wrapper = mountTool()
    const button = wrapper
      .findAll('button')
      .find((item) => item.text().trim() === 'Pick Screen Color')

    await button?.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('#112233FF')
    expect(wrapper.text()).toContain('Source: Screen')
  })

  it('ignores EyeDropper abort errors', async () => {
    class AbortEyeDropper {
      open = vi.fn().mockRejectedValue({ name: 'AbortError' })
    }
    ;(globalThis as typeof globalThis & { EyeDropper?: unknown }).EyeDropper = AbortEyeDropper

    const wrapper = mountTool()
    const vm = getVm(wrapper)

    await vm.handleScreenPick()

    expect(wrapper.text()).toContain('Picked Color')
  })

  it('skips upload when no file is provided', () => {
    const wrapper = mountTool()
    const vm = getVm(wrapper)

    const result = vm.handleBeforeUpload({
      file: createUploadInfo(undefined),
      fileList: [],
    })

    expect(result).toBe(false)
  })

  it('reports image errors when canvas is missing', async () => {
    class ImmediateImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 100
      naturalHeight = 80

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = ImmediateImage as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:instant')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const wrapper = mountTool()
    const vm = getVm(wrapper)

    const file = new File(['data'], 'instant.png', { type: 'image/png' })
    vm.handleBeforeUpload({
      file: createUploadInfo(file),
      fileList: [createUploadInfo(file)],
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load the image.')
  })

  it('reports image errors when canvas context is unavailable', async () => {
    class DelayedImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 120
      naturalHeight = 90

      set src(_value: string) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    globalThis.Image = DelayedImage as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:ctx-null')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const wrapper = mountTool()
    const vm = getVm(wrapper)

    const file = new File(['data'], 'ctx-null.png', { type: 'image/png' })
    vm.handleBeforeUpload({
      file: createUploadInfo(file),
      fileList: [createUploadInfo(file)],
    })

    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Failed to load the image.')
  })

  it('reports image load failures', async () => {
    class ErrorImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 120
      naturalHeight = 90

      set src(_value: string) {
        setTimeout(() => this.onerror?.(), 0)
      }
    }

    globalThis.Image = ErrorImage as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:error')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const wrapper = mountTool()
    const vm = getVm(wrapper)

    const file = new File(['data'], 'error.png', { type: 'image/png' })
    vm.handleBeforeUpload({
      file: createUploadInfo(file),
      fileList: [createUploadInfo(file)],
    })

    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Failed to load the image.')
  })

  it('samples a pixel from the uploaded image', async () => {
    class AsyncImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 200
      naturalHeight = 100

      set src(_value: string) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    const context = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([17, 34, 51, 128]) })),
    }

    globalThis.Image = AsyncImage as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:success')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    )

    const wrapper = mountTool()
    const vm = getVm(wrapper)

    vm.handleCanvasClick(new MouseEvent('click'))

    const file = new File(['data'], 'success.png', { type: 'image/png' })
    vm.handleBeforeUpload({
      file: createUploadInfo(file),
      fileList: [createUploadInfo(file)],
    })

    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()

    const canvas = wrapper.find('canvas').element as HTMLCanvasElement
    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        right: 100,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect

    await wrapper.find('canvas').trigger('click', { clientX: 10, clientY: 10 })

    expect(context.getImageData).toHaveBeenCalled()
    expect(wrapper.text()).toContain('#11223380')
    expect(wrapper.text()).toContain('Source: Image')
  })
})
