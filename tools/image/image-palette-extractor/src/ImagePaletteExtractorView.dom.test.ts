import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import ImagePaletteExtractorView from './ImagePaletteExtractorView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'
import { extractPalette } from '@utils/image'
import { loadImageData } from './utils/palette-extractor'

vi.mock('@utils/image', () => ({
  extractPalette: vi.fn(),
}))

vi.mock('./utils/palette-extractor', () => ({
  QUALITY_PRESETS: {
    fast: { maxDimension: 100, targetSamples: 4 },
    balanced: { maxDimension: 100, targetSamples: 4 },
    precise: { maxDimension: 100, targetSamples: 4 },
  },
  loadImageData: vi.fn(),
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
  emits: ['update:options'],
  template: '<div />',
})

const PaletteResultsStub = defineComponent({
  name: 'PaletteResults',
  props: ['colors', 'dominant', 'totalPixels', 'fileName', 'isLoading'],
  template: '<div data-test="results" />',
})

const baseOptions = {
  colorCount: 8,
  quality: 'balanced',
  sortBy: 'dominance',
  ignoreTransparent: true,
}

const makeImageData = () =>
  typeof ImageData !== 'undefined'
    ? new ImageData(new Uint8ClampedArray([10, 20, 30, 255]), 1, 1)
    : ({ data: new Uint8ClampedArray([10, 20, 30, 255]), width: 1, height: 1 } as ImageData)

const originalCreateImageBitmap = globalThis.createImageBitmap
const originalGetContext = HTMLCanvasElement.prototype.getContext

describe('ImagePaletteExtractorView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    vi.mocked(loadImageData).mockReset()
    vi.mocked(extractPalette).mockReset()
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
    const imageData = makeImageData()
    vi.mocked(loadImageData).mockResolvedValue({ imageData, width: 10, height: 10 })
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
    expect(wrapper.findComponent(PaletteControlsStub).exists()).toBe(true)
    const results = wrapper.findComponent(PaletteResultsStub)
    const colors = results.props('colors') as { hex: string }[]
    expect(colors).toHaveLength(1)
    expect(colors[0]?.hex).toBe('#0A141E')
  })

  it('sorts swatches based on options', async () => {
    const imageData = makeImageData()
    vi.mocked(loadImageData).mockResolvedValue({ imageData, width: 10, height: 10 })
    const extractPaletteMock = vi.mocked(extractPalette)
    extractPaletteMock.mockReturnValue({
      colors: [
        { r: 0, g: 0, b: 80, count: 1 },
        { r: 255, g: 0, b: 0, count: 2 },
        { r: 180, g: 255, b: 180, count: 3 },
      ],
      totalPixels: 6,
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

    const file = new File(['data'], 'sort.png', { type: 'image/png' })
    const input = wrapper.findComponent(ImageInputStub)
    input.vm.$emit('update:file', file)

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    let colors = wrapper.findComponent(PaletteResultsStub).props('colors') as { hex: string }[]
    expect(colors.map((color) => color.hex)).toEqual(['#B4FFB4', '#FF0000', '#000050'])

    const controls = wrapper.findComponent(PaletteControlsStub)
    controls.vm.$emit('update:options', { ...baseOptions, sortBy: 'hue' })

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    colors = wrapper.findComponent(PaletteResultsStub).props('colors') as { hex: string }[]
    expect(colors.map((color) => color.hex)).toEqual(['#FF0000', '#B4FFB4', '#000050'])

    controls.vm.$emit('update:options', { ...baseOptions, sortBy: 'lightness' })

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    colors = wrapper.findComponent(PaletteResultsStub).props('colors') as { hex: string }[]
    expect(colors.map((color) => color.hex)).toEqual(['#000050', '#FF0000', '#B4FFB4'])
  })

  it('resets when the file is cleared before debounce runs', async () => {
    const imageData = makeImageData()
    vi.mocked(loadImageData).mockResolvedValue({ imageData, width: 10, height: 10 })
    const extractPaletteMock = vi.mocked(extractPalette)

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
    const input = wrapper.findComponent(ImageInputStub)
    input.vm.$emit('update:file', file)
    await nextTick()

    input.vm.$emit('update:file', null)
    await nextTick()

    vi.runAllTimers()
    await flushPromises()

    expect(extractPaletteMock).not.toHaveBeenCalled()
    expect(wrapper.findComponent(PaletteResultsStub).exists()).toBe(false)
  })

  it('shows an error when no visible pixels are found', async () => {
    const imageData = makeImageData()
    vi.mocked(loadImageData).mockResolvedValue({ imageData, width: 10, height: 10 })
    vi.mocked(extractPalette).mockReturnValue({ colors: [], totalPixels: 0 })

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

    const file = new File(['data'], 'empty.png', { type: 'image/png' })
    wrapper.findComponent(ImageInputStub).vm.$emit('update:file', file)

    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('No visible pixels found')
  })

  it('ignores stale extractions when the file changes mid-load', async () => {
    const imageData = makeImageData()
    let resolveFirst:
      | ((value: { imageData: ImageData; width: number; height: number }) => void)
      | undefined
    vi.mocked(loadImageData)
      .mockImplementationOnce(
        () =>
          new Promise<{ imageData: ImageData; width: number; height: number }>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockResolvedValueOnce({ imageData, width: 10, height: 10 })
    vi.mocked(extractPalette).mockReturnValue({
      colors: [{ r: 10, g: 10, b: 10, count: 1 }],
      totalPixels: 1,
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

    const input = wrapper.findComponent(ImageInputStub)
    input.vm.$emit('update:file', new File(['a'], 'first.png', { type: 'image/png' }))
    await nextTick()
    vi.runAllTimers()

    input.vm.$emit('update:file', new File(['b'], 'second.png', { type: 'image/png' }))
    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    if (resolveFirst) {
      resolveFirst({ imageData, width: 10, height: 10 })
    }
    await flushPromises()

    expect(vi.mocked(loadImageData)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(extractPalette)).toHaveBeenCalledTimes(1)
  })

  it('ignores stale loading errors when a newer extraction succeeds', async () => {
    const imageData = makeImageData()
    let rejectFirst: ((reason?: unknown) => void) | undefined

    vi.mocked(loadImageData)
      .mockImplementationOnce(
        () =>
          new Promise<{ imageData: ImageData; width: number; height: number }>(
            (_resolve, reject) => {
              rejectFirst = reject
            },
          ),
      )
      .mockResolvedValueOnce({ imageData, width: 10, height: 10 })

    vi.mocked(extractPalette).mockReturnValue({
      colors: [{ r: 20, g: 20, b: 20, count: 1 }],
      totalPixels: 1,
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

    const input = wrapper.findComponent(ImageInputStub)
    input.vm.$emit('update:file', new File(['a'], 'first.png', { type: 'image/png' }))
    await nextTick()
    vi.runAllTimers()

    input.vm.$emit('update:file', new File(['b'], 'second.png', { type: 'image/png' }))
    await nextTick()
    vi.runAllTimers()
    await flushPromises()

    rejectFirst?.(new Error('stale-load-failed'))
    await flushPromises()

    expect(wrapper.text()).not.toContain('Failed to load the image')
    expect(vi.mocked(extractPalette)).toHaveBeenCalledTimes(1)
  })

  it('shows an error when loading fails', async () => {
    vi.mocked(loadImageData).mockRejectedValue(new Error('load-failed'))

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
