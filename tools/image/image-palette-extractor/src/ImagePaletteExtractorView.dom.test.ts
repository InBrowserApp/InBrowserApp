import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import ImagePaletteExtractorView from './ImagePaletteExtractorView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'
import { extractPalette } from '@utils/image'

vi.mock('@utils/image', () => ({
  extractPalette: vi.fn(),
}))

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const NAlertStub = {
  template: '<div><slot /></div>',
  props: ['title'],
}

const ImageInputStub = defineComponent({
  name: 'ImageInput',
  props: ['file', 'dimensions'],
  emits: ['update:file'],
  template: '<div />',
})

const PaletteControlsStub = defineComponent({
  name: 'PaletteControls',
  props: ['options', 'isLoading'],
  template: '<div />',
})

const PaletteResultsStub = defineComponent({
  name: 'PaletteResults',
  props: ['colors', 'dominant', 'totalPixels', 'fileName', 'isLoading'],
  template: '<div data-test="results" />',
})

const originalCreateImageBitmap = globalThis.createImageBitmap
const originalGetContext = HTMLCanvasElement.prototype.getContext

describe('ImagePaletteExtractorView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    globalThis.createImageBitmap = vi.fn().mockResolvedValue({
      width: 10,
      height: 10,
      close: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    if (originalCreateImageBitmap) {
      globalThis.createImageBitmap = originalCreateImageBitmap
    } else {
      delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap
    }
    HTMLCanvasElement.prototype.getContext = originalGetContext
    vi.restoreAllMocks()
  })

  it('exposes tool metadata and routes', () => {
    expect(info.toolID).toBe('image-palette-extractor')
    expect(info.path).toBe('/tools/image-palette-extractor')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
  })

  it('extracts palette when a file is provided', async () => {
    const imageData =
      typeof ImageData !== 'undefined'
        ? new ImageData(new Uint8ClampedArray([10, 20, 30, 255]), 1, 1)
        : ({ data: new Uint8ClampedArray([10, 20, 30, 255]), width: 1, height: 1 } as ImageData)

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => imageData),
    })

    const extractPaletteMock = vi.mocked(extractPalette)
    extractPaletteMock.mockReturnValue({
      colors: [{ r: 10, g: 20, b: 30, count: 4 }],
      totalPixels: 4,
    })

    const wrapper = mount(ImagePaletteExtractorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ToolSection: ToolSectionStub,
          NAlert: NAlertStub,
          ImageInput: ImageInputStub,
          PaletteControls: PaletteControlsStub,
          PaletteResults: PaletteResultsStub,
        },
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    wrapper.findComponent(ImageInputStub).vm.$emit('update:file', file)

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    expect(extractPaletteMock).toHaveBeenCalled()
    const results = wrapper.findComponent(PaletteResultsStub)
    const colors = results.props('colors') as { hex: string }[]
    expect(colors).toHaveLength(1)
    expect(colors[0]?.hex).toBe('#0A141E')
  })

  it('shows an error when the canvas context is missing', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    const wrapper = mount(ImagePaletteExtractorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ToolSection: ToolSectionStub,
          NAlert: NAlertStub,
          ImageInput: ImageInputStub,
          PaletteControls: PaletteControlsStub,
          PaletteResults: PaletteResultsStub,
        },
      },
    })

    const file = new File(['data'], 'broken.png', { type: 'image/png' })
    wrapper.findComponent(ImageInputStub).vm.$emit('update:file', file)

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load the image')
  })
})
