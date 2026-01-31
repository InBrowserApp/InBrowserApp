import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'
import ImageToWebpConverterView from './ImageToWebpConverterView.vue'
import ImageUpload from './components/ImageUpload.vue'
import ConversionOptions from './components/ConversionOptions.vue'
import ConversionResults from './components/ConversionResults.vue'
import type { WebpConversionResult } from './types'
import { convertImageToWebp } from './utils/convert-image-to-webp'
import { createWebpZip } from './utils/create-webp-zip'

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

vi.mock('./utils/convert-image-to-webp', () => ({
  convertImageToWebp: vi.fn(),
}))

vi.mock('./utils/create-webp-zip', () => ({
  createWebpZip: vi.fn(),
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
    template: `<component :is="tag || 'button'" :disabled="disabled" :href="href" :download="download" v-bind="$attrs" @click="$emit('click')"><slot name="icon" /><slot /></component>`,
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
    'quality',
    'method',
    'lossless',
    'advancedEnabled',
    'targetSize',
    'targetPsnr',
    'nearLossless',
    'alphaQuality',
    'snsStrength',
    'filterStrength',
    'filterSharpness',
    'filterType',
    'partitions',
    'segments',
    'passCount',
    'exactMode',
    'sharpYuvMode',
    'isConverting',
    'canConvert',
  ],
  emits: [
    'update:scale',
    'update:quality',
    'update:method',
    'update:lossless',
    'update:advancedEnabled',
    'update:targetSize',
    'update:targetPsnr',
    'update:nearLossless',
    'update:alphaQuality',
    'update:snsStrength',
    'update:filterStrength',
    'update:filterSharpness',
    'update:filterType',
    'update:partitions',
    'update:segments',
    'update:passCount',
    'update:exactMode',
    'update:sharpYuvMode',
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
    return h(ImageToWebpConverterView)
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

function createFile(name: string, type = 'image/png') {
  return new File(['data'], name, { type })
}

const mockedConvert = vi.mocked(convertImageToWebp)
const mockedZip = vi.mocked(createWebpZip)

beforeEach(() => {
  messageMock.success.mockClear()
  messageMock.error.mockClear()
  mockedConvert.mockReset()
  mockedZip.mockReset()
})

describe('tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('image-to-webp-converter')
    expect(toolInfo.path).toBe('/tools/image-to-webp-converter')
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

describe('ImageToWebpConverterView', () => {
  it('skips conversion when no files are selected', async () => {
    const wrapper = mountView()
    const vm = wrapper.findComponent(ImageToWebpConverterView).vm as unknown as {
      convertImages: () => void
    }

    await vm.convertImages()
    expect(mockedConvert).not.toHaveBeenCalled()
  })

  it('converts a single file without zipping', async () => {
    const wrapper = mountView()
    const file = createFile('photo.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', [file])
    await flushPromises()

    const result: WebpConversionResult = {
      file,
      blob: new Blob(['webp'], { type: 'image/webp' }),
      outputName: 'photo.webp',
      originalWidth: 100,
      originalHeight: 80,
      outputWidth: 100,
      outputHeight: 80,
    }

    mockedConvert.mockResolvedValueOnce(result)

    const viewVm = wrapper.findComponent(ImageToWebpConverterView).vm as unknown as {
      convertImages: () => Promise<void>
    }

    await viewVm.convertImages()
    await flushPromises()

    expect(mockedConvert).toHaveBeenCalledTimes(1)
    expect(mockedConvert).toHaveBeenCalledWith(
      file,
      { scale: 100, quality: 80, method: 4, lossless: false },
      'photo.webp',
    )
    expect(mockedZip).not.toHaveBeenCalled()

    const resultsProps = wrapper.findComponent(ConversionResultsStub).props('results') as
      | WebpConversionResult[]
      | undefined
    expect(resultsProps).toHaveLength(1)
    expect(messageMock.success).toHaveBeenCalled()
  })

  it('creates a zip when multiple files are converted', async () => {
    const wrapper = mountView()
    const files = [createFile('a.png'), createFile('b.png')]

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce({
      file: files[0]!,
      blob: new Blob(['a'], { type: 'image/webp' }),
      outputName: 'a.webp',
      originalWidth: 10,
      originalHeight: 10,
      outputWidth: 10,
      outputHeight: 10,
    })
    mockedConvert.mockResolvedValueOnce({
      file: files[1]!,
      blob: new Blob(['b'], { type: 'image/webp' }),
      outputName: 'b.webp',
      originalWidth: 20,
      originalHeight: 20,
      outputWidth: 20,
      outputHeight: 20,
    })
    mockedZip.mockResolvedValueOnce(new Blob(['zip']))

    const viewVm = wrapper.findComponent(ImageToWebpConverterView).vm as unknown as {
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
    const file = createFile('bad.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:files', [file])
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('INVALID_IMAGE'))

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load the image')
  })
})

describe('ImageUpload', () => {
  it('accepts a valid image file', () => {
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

    const file = createFile('icon.png')

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
    const file = createFile('photo.png')
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
  it('emits scale updates', () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        title: 'Options',
        scaleLabel: 'Scale',
        scaleHint: 'Hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        methodLabel: 'Method',
        methodHint: 'Method hint',
        losslessLabel: 'Lossless',
        advancedLabel: 'Advanced',
        targetSizeLabel: 'Target size',
        targetPsnrLabel: 'Target PSNR',
        nearLosslessLabel: 'Near lossless',
        alphaQualityLabel: 'Alpha quality',
        snsStrengthLabel: 'SNS strength',
        filterStrengthLabel: 'Filter strength',
        filterSharpnessLabel: 'Filter sharpness',
        filterTypeLabel: 'Filter type',
        partitionsLabel: 'Partitions',
        segmentsLabel: 'Segments',
        passLabel: 'Passes',
        exactLabel: 'Exact',
        useSharpYuvLabel: 'Sharp YUV',
        optionDefaultLabel: 'Default',
        optionOnLabel: 'On',
        optionOffLabel: 'Off',
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        scale: 100,
        quality: 80,
        method: 4,
        lossless: false,
        advancedEnabled: false,
        targetSize: null,
        targetPsnr: null,
        nearLossless: null,
        alphaQuality: null,
        snsStrength: null,
        filterStrength: null,
        filterSharpness: null,
        filterType: null,
        partitions: null,
        segments: null,
        passCount: null,
        exactMode: 'default',
        sharpYuvMode: 'default',
        minScale: 10,
        maxScale: 400,
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
      handleQualityUpdate: (value: number | null) => void
      handleMethodUpdate: (value: number | null) => void
      handleTargetSizeUpdate: (value: number | null) => void
      lossless: boolean
      advancedEnabled: boolean
      exactMode: 'default' | 'on' | 'off'
    }

    vm.handleScaleUpdate(80)
    expect(wrapper.emitted('update:scale')?.[0]).toEqual([80])
    vm.handleQualityUpdate(72)
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([72])
    vm.handleMethodUpdate(5)
    expect(wrapper.emitted('update:method')?.[0]).toEqual([5])
    vm.lossless = true
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
    vm.advancedEnabled = true
    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
    vm.handleTargetSizeUpdate(128)
    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([128])
    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([null])
    vm.exactMode = 'on'
    expect(wrapper.emitted('update:exactMode')?.[0]).toEqual(['on'])
  })
})

describe('ConversionResults', () => {
  it('shows download button for a single result', () => {
    const file = createFile('image.png')
    const results: WebpConversionResult[] = [
      {
        file,
        blob: new Blob(['webp'], { type: 'image/webp' }),
        outputName: 'image.webp',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
    ]

    const wrapper = mount(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '1',
        results,
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'webp.zip',
        downloadWebpLabel: 'Download WebP',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('download')).toBe('image.webp')
  })

  it('shows zip download for multiple results', () => {
    const file = createFile('image.png')
    const results: WebpConversionResult[] = [
      {
        file,
        blob: new Blob(['webp'], { type: 'image/webp' }),
        outputName: 'image.webp',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
      {
        file,
        blob: new Blob(['webp'], { type: 'image/webp' }),
        outputName: 'image-2.webp',
        originalWidth: 12,
        originalHeight: 12,
        outputWidth: 12,
        outputHeight: 12,
      },
    ]

    const wrapper = mount(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '2',
        results,
        zipBlob: new Blob(['zip']),
        isZipping: false,
        downloadZipName: 'webp.zip',
        downloadWebpLabel: 'Download WebP',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('download')).toBe('webp.zip')
  })
})
