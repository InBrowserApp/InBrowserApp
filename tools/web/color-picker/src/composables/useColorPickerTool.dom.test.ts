import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useColorPickerTool } from './useColorPickerTool'

let dropZoneOptions: {
  onDrop: (files: File[] | null) => void
  onEnter: (files: File[] | null, event?: DragEvent | null) => void
  onOver: (files: File[] | null, event?: DragEvent | null) => void
  onLeave: () => void
  checkValidity: (items: DataTransferItemList) => boolean
} | null = null
let isOverDropZone = ref(false)
let canvasWrapperWidth = ref(0)

const originalImage = globalThis.Image
const originalEyeDropper = (globalThis as { EyeDropper?: unknown }).EyeDropper

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useDropZone: (_target: unknown, options: typeof dropZoneOptions) => {
      dropZoneOptions = options
      return { isOverDropZone }
    },
    useElementSize: () => ({ width: canvasWrapperWidth }),
    useStorage: (_key: string, defaultValue: unknown) => ref(defaultValue),
  }
})

const messages = {
  imageError: () => 'image-error',
}

const mountTool = () =>
  mount(
    defineComponent({
      setup() {
        return useColorPickerTool(messages)
      },
      render() {
        return h('div')
      },
    }),
  )

beforeEach(() => {
  dropZoneOptions = null
  isOverDropZone = ref(false)
  canvasWrapperWidth = ref(0)
})

afterEach(() => {
  globalThis.Image = originalImage
  if (originalEyeDropper) {
    ;(globalThis as { EyeDropper?: unknown }).EyeDropper = originalEyeDropper
  } else {
    delete (globalThis as { EyeDropper?: unknown }).EyeDropper
  }
  vi.restoreAllMocks()
})

describe('useColorPickerTool', () => {
  it('scales tall images and guards canvas clicks', async () => {
    canvasWrapperWidth.value = 100

    class TallImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 200
      naturalHeight = 1200

      set src(_value: string) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    globalThis.Image = TallImage as typeof Image
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:tall')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const wrapper = mountTool()
    const api = (wrapper.vm.$ as unknown as { setupState: unknown }).setupState as unknown as {
      canvasStyle: { width: string; height: string }
      handleCanvasReady: (value: HTMLCanvasElement | null) => void
      handleFilePick: (file: File | null) => boolean
      handleCanvasClick: (event: MouseEvent) => void
    }

    const canvas = document.createElement('canvas')
    const context = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([0, 0, 0, 255]) })),
    }
    const contextSpy = vi
      .spyOn(canvas, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D)
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

    api.handleCanvasReady(canvas)
    api.handleFilePick(new File(['data'], 'tall.png', { type: 'image/png' }))

    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()

    expect(api.canvasStyle).toEqual({ width: '70px', height: '420px' })

    api.handleCanvasReady(null)
    api.handleCanvasClick(new MouseEvent('click'))

    api.handleCanvasReady(canvas)
    contextSpy.mockReturnValue(null)
    api.handleCanvasClick(new MouseEvent('click'))

    contextSpy.mockReturnValue(context as unknown as CanvasRenderingContext2D)
    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect
    api.handleCanvasClick(new MouseEvent('click'))

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
    context.getImageData.mockReturnValue({ data: new Uint8ClampedArray([]) })
    api.handleCanvasClick(new MouseEvent('click', { clientX: 10, clientY: 10 }))
  })

  it('handles file inputs and drop zone events', () => {
    class IdleImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      naturalWidth = 10
      naturalHeight = 10

      set src(_value: string) {}
    }

    globalThis.Image = IdleImage as typeof Image

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:idle')
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const wrapper = mountTool()
    const api = (wrapper.vm.$ as unknown as { setupState: unknown }).setupState as unknown as {
      dropOverlayActive: boolean
      handleImagePick: () => void
      handleFileInputReady: (value: HTMLInputElement | null) => void
      handleFileChange: (event: Event) => void
    }

    expect(dropZoneOptions).not.toBeNull()
    const options = dropZoneOptions!

    const input = document.createElement('input')
    const clickSpy = vi.spyOn(input, 'click')
    api.handleFileInputReady(input)
    api.handleImagePick()
    expect(clickSpy).toHaveBeenCalled()

    const file = new File(['data'], 'sample.tiff', { type: 'application/octet-stream' })
    const changeInput = document.createElement('input')
    Object.defineProperty(changeInput, 'files', { value: [file] })
    changeInput.value = 'filled'
    api.handleFileChange({ target: changeInput } as unknown as Event)
    expect(changeInput.value).toBe('')

    options.onEnter([], { dataTransfer: { types: ['Files'] } } as unknown as DragEvent)
    expect(api.dropOverlayActive).toBe(true)

    options.onLeave()
    expect(api.dropOverlayActive).toBe(false)

    options.onOver([], { dataTransfer: { types: ['Files'] } } as unknown as DragEvent)
    expect(api.dropOverlayActive).toBe(true)

    options.onEnter([], undefined)

    options.onDrop([null as unknown as File, file])
    options.onDrop([new File(['text'], 'notes.txt', { type: 'text/plain' })])
    options.onDrop(null)

    api.handleFileChange({ target: null } as unknown as Event)

    options.onOver([], { dataTransfer: { types: ['Files'] } } as unknown as DragEvent)
    expect(api.dropOverlayActive).toBe(true)

    const itemsWithNull = [
      { kind: 'string', getAsFile: () => null },
      { kind: 'file', getAsFile: () => null },
    ] as unknown as DataTransferItemList
    expect(options.checkValidity(itemsWithNull)).toBe(true)

    const imageFile = new File(['image'], 'pick.png', { type: 'image/png' })
    const itemsWithImage = [
      { kind: 'file', getAsFile: () => imageFile },
    ] as unknown as DataTransferItemList
    expect(options.checkValidity(itemsWithImage)).toBe(true)

    const textFile = new File(['text'], 'notes.txt', { type: 'text/plain' })
    const itemsWithTextFile = [
      { kind: 'file', getAsFile: () => textFile },
    ] as unknown as DataTransferItemList
    expect(options.checkValidity(itemsWithTextFile)).toBe(false)

    const itemsNoFiles = [
      { kind: 'string', getAsFile: () => null },
    ] as unknown as DataTransferItemList
    expect(options.checkValidity(itemsNoFiles)).toBe(false)

    wrapper.unmount()
    expect(revokeSpy).toHaveBeenCalled()
  })

  it('ignores invalid eyedropper output', async () => {
    class BadEyeDropper {
      open = vi.fn().mockResolvedValue({ sRGBHex: '#zzzzzz' })
    }
    ;(globalThis as { EyeDropper?: unknown }).EyeDropper = BadEyeDropper

    const wrapper = mountTool()
    const api = (wrapper.vm.$ as unknown as { setupState: unknown }).setupState as unknown as {
      handleScreenPick: () => Promise<void>
      pickedSource: string | null
    }

    await api.handleScreenPick()

    expect(api.pickedSource).toBeNull()
  })

  it('swallows non-abort eyedropper errors', async () => {
    class BrokenEyeDropper {
      open = vi.fn().mockRejectedValue(new Error('boom'))
    }
    ;(globalThis as { EyeDropper?: unknown }).EyeDropper = BrokenEyeDropper

    const wrapper = mountTool()
    const api = (wrapper.vm.$ as unknown as { setupState: unknown }).setupState as unknown as {
      handleScreenPick: () => Promise<void>
      pickedSource: string | null
    }

    await api.handleScreenPick()

    expect(api.pickedSource).toBeNull()
  })
})
