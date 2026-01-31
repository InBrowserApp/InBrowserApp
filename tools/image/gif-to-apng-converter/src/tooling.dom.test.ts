import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'
import GifToApngConverterView from './GifToApngConverterView.vue'
import ImageUpload from './components/ImageUpload.vue'
import ConversionOptions from './components/ConversionOptions.vue'
import type { GifToApngResult } from './types'
import { convertGifToApng } from './utils/convert-gif-to-apng'
import { createApngZip } from './utils/create-apng-zip'

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

const objectUrlValue = 'blob:mock'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref(objectUrlValue),
  }
})

vi.mock('./utils/convert-gif-to-apng', () => ({
  convertGifToApng: vi.fn(),
}))

vi.mock('./utils/create-apng-zip', () => ({
  createApngZip: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    inheritAttrs: false,
    template: '<div><slot /></div>',
  })

  const ButtonStub = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    props: {
      disabled: Boolean,
      tag: String,
      href: String,
      download: String,
      loading: Boolean,
    },
    emits: ['click'],
    template:
      '<component :is="tag || \'button\'" :disabled="disabled" :href="href" :download="download" v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot /></component>',
  })

  const makeModelStub = (name: string) =>
    defineComponent({
      name,
      props: {
        value: {
          type: [Array, Number, Boolean, String],
          default: undefined,
        },
      },
      emits: ['update:value', 'update:checked'],
      template: '<div />',
    })

  return {
    ...actual,
    useMessage: () => messageMock,
    NAlert: BaseStub,
    NButton: ButtonStub,
    NCard: BaseStub,
    NCollapseTransition: BaseStub,
    NFlex: BaseStub,
    NFormItemGi: BaseStub,
    NGi: BaseStub,
    NGrid: BaseStub,
    NIcon: BaseStub,
    NInputNumber: makeModelStub('NInputNumber'),
    NSelect: makeModelStub('NSelect'),
    NSwitch: makeModelStub('NSwitch'),
    NP: BaseStub,
    NText: BaseStub,
    NUpload: BaseStub,
    NUploadDragger: BaseStub,
  }
})

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div><slot /></div>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<header><slot /></header>',
})

const ImageUploadStub = defineComponent({
  name: 'ImageUpload',
  props: ['files'],
  emits: ['update:files'],
  template: '<div />',
})

const ConversionOptionsStub = defineComponent({
  name: 'ConversionOptions',
  props: [
    'scale',
    'speed',
    'loopMode',
    'loopCount',
    'optimize',
    'optimizeLevel',
    'isConverting',
    'canConvert',
  ],
  emits: [
    'update:scale',
    'update:speed',
    'update:loopMode',
    'update:loopCount',
    'update:optimize',
    'update:optimizeLevel',
    'convert',
  ],
  template: '<button @click="$emit(\'convert\')">convert</button>',
})

const ConversionResultsStub = defineComponent({
  name: 'ConversionResults',
  props: ['results', 'zipBlob'],
  template: '<div class="results">{{ results?.length }}</div>',
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const ViewWithProvider = defineComponent({
  render() {
    return h(GifToApngConverterView)
  },
})

function mountView() {
  return mount(ViewWithProvider, {
    global: {
      plugins: [i18n],
      stubs: {
        ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
        ImageUpload: ImageUploadStub,
        ConversionOptions: ConversionOptionsStub,
        ConversionResults: ConversionResultsStub,
      },
    },
  })
}

function createFile(name: string, type = 'image/gif') {
  return new File(['data'], name, { type })
}

const mockedConvert = vi.mocked(convertGifToApng)
const mockedZip = vi.mocked(createApngZip)

beforeEach(() => {
  messageMock.success.mockClear()
  messageMock.error.mockClear()
  mockedConvert.mockReset()
  mockedZip.mockReset()
})

describe('tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('gif-to-apng-converter')
    expect(toolInfo.path).toBe('/tools/gif-to-apng-converter')
    expect(toolInfo.features).toContain('offline')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('exports routes that match the tool path', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) throw new Error('Missing route configuration')

    expect(route.name).toBe(toolInfo.toolID)
    expect(route.path).toBe(toolInfo.path)
    expect(route.component).toBeTruthy()

    if (typeof route.component !== 'function') {
      throw new Error('Expected a lazy component loader')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexToolInfo.toolID).toBe(toolInfo.toolID)
  })
})

describe('GifToApngConverterView', () => {
  it('skips conversion when no files are selected', async () => {
    const wrapper = mountView()
    const vm = wrapper.findComponent(GifToApngConverterView).vm as unknown as {
      convertImages: () => void
    }

    await vm.convertImages()
    expect(mockedConvert).not.toHaveBeenCalled()
  })

  it('converts a single file without zipping', async () => {
    const wrapper = mountView()
    const file = createFile('demo.gif')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', [file])
    await flushPromises()

    const result: GifToApngResult = {
      file,
      blob: new Blob(['apng'], { type: 'image/png' }),
      outputName: 'demo.png',
      originalWidth: 120,
      originalHeight: 90,
      outputWidth: 120,
      outputHeight: 90,
    }

    mockedConvert.mockResolvedValueOnce(result)

    const viewVm = wrapper.findComponent(GifToApngConverterView).vm as unknown as {
      convertImages: () => Promise<void>
    }

    await viewVm.convertImages()
    await flushPromises()

    expect(mockedConvert).toHaveBeenCalledTimes(1)
    expect(mockedConvert).toHaveBeenCalledWith(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: true,
        optimizeLevel: 2,
      },
      'demo.png',
    )
    expect(mockedZip).not.toHaveBeenCalled()

    const resultsProps = wrapper.findComponent(ConversionResultsStub).props('results') as
      | GifToApngResult[]
      | undefined
    expect(resultsProps).toHaveLength(1)
    expect(messageMock.success).toHaveBeenCalled()
  })

  it('creates a zip when multiple files are converted', async () => {
    const wrapper = mountView()
    const files = [createFile('a.gif'), createFile('b.gif')]

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce({
      file: files[0]!,
      blob: new Blob(['a'], { type: 'image/png' }),
      outputName: 'a.png',
      originalWidth: 10,
      originalHeight: 10,
      outputWidth: 10,
      outputHeight: 10,
    })
    mockedConvert.mockResolvedValueOnce({
      file: files[1]!,
      blob: new Blob(['b'], { type: 'image/png' }),
      outputName: 'b.png',
      originalWidth: 20,
      originalHeight: 20,
      outputWidth: 20,
      outputHeight: 20,
    })
    mockedZip.mockResolvedValueOnce(new Blob(['zip']))

    const viewVm = wrapper.findComponent(GifToApngConverterView).vm as unknown as {
      convertImages: () => Promise<void>
    }

    await viewVm.convertImages()
    await flushPromises()

    expect(mockedZip).toHaveBeenCalledTimes(1)
    const zipBlob = wrapper.findComponent(ConversionResultsStub).props('zipBlob') as Blob | null
    expect(zipBlob).toBeInstanceOf(Blob)
  })

  it('shows an error when conversion fails', async () => {
    const wrapper = mountView()
    const file = createFile('bad.gif')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', [file])
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('INVALID_GIF'))

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid GIF')
  })
})

describe('ImageUpload', () => {
  it('accepts a valid gif file', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        files: [],
        title: 'Upload',
        dragDropText: 'Drag',
        supportText: 'Support',
        selectedCountLabel: '1',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear',
        invalidTypeMessage: 'Invalid',
        duplicateMessage: 'Duplicate',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const file = createFile('demo.gif')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: { file: { file?: File } }) => boolean
    }

    const result = vm.handleBeforeUpload({ file: { file } })
    expect(result).toBe(false)
    expect(wrapper.emitted('update:files')?.[0]?.[0]).toEqual([file])
  })

  it('rejects invalid file types', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        files: [],
        title: 'Upload',
        dragDropText: 'Drag',
        supportText: 'Support',
        selectedCountLabel: '1',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear',
        invalidTypeMessage: 'Invalid',
        duplicateMessage: 'Duplicate',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const file = createFile('doc.pdf', 'application/pdf')
    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: { file: { file?: File } }) => boolean
    }

    vm.handleBeforeUpload({ file: { file } })
    expect(wrapper.emitted('update:files')).toBeFalsy()
    expect(messageMock.error).toHaveBeenCalledWith('Invalid')
  })

  it('prevents duplicate files', () => {
    const file = createFile('demo.gif')
    const wrapper = mount(ImageUpload, {
      props: {
        files: [file],
        title: 'Upload',
        dragDropText: 'Drag',
        supportText: 'Support',
        selectedCountLabel: '1',
        removeLabel: 'Remove',
        clearAllLabel: 'Clear',
        invalidTypeMessage: 'Invalid',
        duplicateMessage: 'Duplicate',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: { file: { file?: File } }) => boolean
    }

    vm.handleBeforeUpload({ file: { file } })
    expect(wrapper.emitted('update:files')).toBeFalsy()
    expect(messageMock.error).toHaveBeenCalledWith('Duplicate')
  })
})

describe('ConversionOptions', () => {
  it('emits option updates', () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        title: 'Options',
        scaleLabel: 'Scale',
        scaleHint: 'Hint',
        speedLabel: 'Speed',
        speedHint: 'Speed hint',
        loopLabel: 'Loop',
        loopHint: 'Loop hint',
        loopCountLabel: 'Loop count',
        loopInheritLabel: 'Follow GIF',
        loopInfiniteLabel: 'Infinite',
        loopCustomLabel: 'Custom',
        optimizeLabel: 'Optimize',
        optimizeLevelLabel: 'Level',
        optimizeHint: 'Hint',
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: null,
        optimize: true,
        optimizeLevel: 2,
        minScale: 10,
        maxScale: 400,
        minSpeed: 0.25,
        maxSpeed: 4,
        isConverting: false,
        canConvert: true,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      handleScaleUpdate: (value: number | null) => void
      handleSpeedUpdate: (value: number | null) => void
      handleOptimizeLevelUpdate: (value: number | null) => void
      loopMode: 'inherit' | 'infinite' | 'custom'
      loopCount: number | null
      optimize: boolean
    }

    vm.handleScaleUpdate(120)
    vm.handleSpeedUpdate(2)
    vm.loopMode = 'custom'
    vm.loopCount = 3
    vm.optimize = false
    vm.handleOptimizeLevelUpdate(4)

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([120])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:loopMode')?.[0]).toEqual(['custom'])
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:optimize')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:optimizeLevel')?.[0]).toEqual([4])
  })
})
