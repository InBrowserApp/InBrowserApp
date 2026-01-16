import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { NMessageProvider } from 'naive-ui'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'
import ImageToIcoConverterView from './ImageToIcoConverterView.vue'
import ImageUpload from './components/ImageUpload.vue'
import ConversionOptions from './components/ConversionOptions.vue'
import OutputSection from './components/OutputSection.vue'
import ErrorDisplay from './components/ErrorDisplay.vue'
import { convertImageToIco } from './utils/convert-image-to-ico'

let objectUrlValue = 'blob:mock'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source?: unknown) => {
      if (typeof source === 'function') {
        source()
      }
      return ref(objectUrlValue)
    },
  }
})

vi.mock('./utils/convert-image-to-ico', () => ({
  convertImageToIco: vi.fn(),
}))

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

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
      emits: ['update:value'],
      template: '<div />',
    })

  return {
    ...actual,
    useMessage: () => messageMock,
    NAlert: BaseStub,
    NButton: ButtonStub,
    NCheckbox: BaseStub,
    NCheckboxGroup: makeModelStub('NCheckboxGroup'),
    NColorPicker: makeModelStub('NColorPicker'),
    NFlex: BaseStub,
    NForm: BaseStub,
    NFormItem: BaseStub,
    NIcon: BaseStub,
    NImage: BaseStub,
    NInputNumber: makeModelStub('NInputNumber'),
    NP: BaseStub,
    NSlider: makeModelStub('NSlider'),
    NSpace: BaseStub,
    NSwitch: makeModelStub('NSwitch'),
    NText: BaseStub,
    NUpload: BaseStub,
    NUploadDragger: BaseStub,
  }
})

const mockedConvert = vi.mocked(convertImageToIco)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

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
    emits: ['update:value'],
    template: '<div />',
  })

const ImageUploadStub = defineComponent({
  name: 'ImageUpload',
  props: {
    file: Object,
  },
  emits: ['update:file'],
  template: '<div />',
})

const ConversionOptionsStub = defineComponent({
  name: 'ConversionOptions',
  props: {
    sizes: Array,
    padding: Number,
    backgroundEnabled: Boolean,
    backgroundColor: String,
    optimize: Boolean,
    isConverting: Boolean,
    canConvert: Boolean,
  },
  emits: [
    'convert',
    'update:sizes',
    'update:padding',
    'update:backgroundEnabled',
    'update:backgroundColor',
    'update:optimize',
  ],
  template: '<button @click="$emit(\'convert\')">convert</button>',
})

const OutputSectionStub = defineComponent({
  name: 'OutputSection',
  props: {
    blob: Object,
    fileName: String,
    sizes: Array,
  },
  template: '<div class="output">{{ fileName }}</div>',
})

const ErrorDisplayStub = defineComponent({
  name: 'ErrorDisplay',
  props: {
    error: String,
  },
  template: '<div class="error">{{ error }}</div>',
})

const ViewWithProvider = defineComponent({
  render() {
    return h(NMessageProvider, null, {
      default: () => h(ImageToIcoConverterView),
    })
  },
})

const mountView = () =>
  mount(ViewWithProvider, {
    global: {
      plugins: [i18n],
      stubs: {
        ToolDefaultPageLayout: BaseStub,
        ToolSection: BaseStub,
        ToolSectionHeader: BaseStub,
        NAlert: BaseStub,
        NButton: ButtonStub,
        NFlex: BaseStub,
        NText: BaseStub,
        ImageUpload: ImageUploadStub,
        ConversionOptions: ConversionOptionsStub,
        OutputSection: OutputSectionStub,
        ErrorDisplay: ErrorDisplayStub,
      },
    },
  })

const mountComponent = (
  component: Parameters<typeof mount>[0],
  props = {},
  stubs: Record<string, unknown> = {},
) =>
  mount(component, {
    props,
    global: {
      plugins: [i18n],
      stubs: {
        ToolSection: BaseStub,
        ToolSectionHeader: BaseStub,
        NAlert: BaseStub,
        NButton: ButtonStub,
        NCheckbox: BaseStub,
        NCheckboxGroup: BaseStub,
        NColorPicker: BaseStub,
        NFlex: BaseStub,
        NForm: BaseStub,
        NFormItem: BaseStub,
        NIcon: BaseStub,
        NImage: BaseStub,
        NInputNumber: BaseStub,
        NP: BaseStub,
        NSlider: BaseStub,
        NSpace: BaseStub,
        NSwitch: BaseStub,
        NText: BaseStub,
        NUpload: BaseStub,
        NUploadDragger: BaseStub,
        ...stubs,
      },
    },
  })

const createFile = (name: string, type = 'image/png') =>
  new File([new Uint8Array([1, 2, 3])], name, { type })

const unwrapValue = <T>(value: T | { value: T }) =>
  value && typeof value === 'object' && 'value' in value ? (value as { value: T }).value : value

beforeEach(() => {
  objectUrlValue = 'blob:mock'
  mockedConvert.mockReset()
  messageMock.success.mockReset()
  messageMock.error.mockReset()
})

describe('image-to-ico tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('image-to-ico')
    expect(toolInfo.path).toBe('/tools/image-to-ico')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('ICO')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('exports routes that match the tool path', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) {
      throw new Error('Missing route configuration')
    }

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

describe('ImageToIcoConverterView', () => {
  it('skips conversion when no file is selected', async () => {
    const wrapper = mountView()
    const vm = wrapper.findComponent(ImageToIcoConverterView).vm as { convertToIco: () => void }

    await vm.convertToIco()
    expect(mockedConvert).not.toHaveBeenCalled()
  })

  it('uses the default output name when no file is selected', () => {
    const wrapper = mountView()
    const vm = wrapper.findComponent(ImageToIcoConverterView).vm as {
      $: { setupState: { outputFileName: { value: string } } }
    }

    expect(unwrapValue(vm.$.setupState.outputFileName)).toBe('icon.ico')
  })

  it('handles output names for files without extensions', async () => {
    const wrapper = mountView()
    const vm = wrapper.findComponent(ImageToIcoConverterView).vm as {
      $: { setupState: { outputFileName: { value: string } } }
    }

    const upload = wrapper.findComponent(ImageUploadStub)

    upload.vm.$emit('update:file', createFile('icon'))
    await flushPromises()
    expect(unwrapValue(vm.$.setupState.outputFileName)).toBe('icon.ico')

    upload.vm.$emit('update:file', createFile(''))
    await flushPromises()
    expect(unwrapValue(vm.$.setupState.outputFileName)).toBe('icon.ico')
  })

  it('updates options via v-model bindings', async () => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    const options = wrapper.findComponent(ConversionOptionsStub)
    options.vm.$emit('update:sizes', [24, 16])
    options.vm.$emit('update:padding', 12)
    options.vm.$emit('update:backgroundEnabled', true)
    options.vm.$emit('update:backgroundColor', '#000000')
    options.vm.$emit('update:optimize', false)
    await flushPromises()

    const vm = wrapper.findComponent(ImageToIcoConverterView).vm as {
      $: { setupState: Record<string, unknown> }
    }
    const state = vm.$.setupState

    expect(unwrapValue(state.sizes as { value: number[] })).toEqual([24, 16])
    expect(unwrapValue(state.padding as { value: number })).toBe(12)
    expect(unwrapValue(state.backgroundEnabled as { value: boolean })).toBe(true)
    expect(unwrapValue(state.backgroundColor as { value: string })).toBe('#000000')
    expect(unwrapValue(state.optimize as { value: boolean })).toBe(false)
  })

  it('prevents conversion when no sizes are selected', async () => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    const vm = wrapper.findComponent(ImageToIcoConverterView).vm as {
      convertToIco: () => void
      $: { setupState: { sizes?: { value: number[] } } }
      sizes?: number[]
    }

    const sizesState = vm.$.setupState.sizes
    if (Array.isArray(sizesState)) {
      sizesState.splice(0, sizesState.length)
    } else if (sizesState?.value) {
      sizesState.value.splice(0, sizesState.value.length)
    } else {
      vm.sizes = []
    }

    await vm.convertToIco()
    await flushPromises()

    expect(wrapper.find('.error').text()).toContain('Select at least one size')
    expect(mockedConvert).not.toHaveBeenCalled()
  })

  it('converts an image and shows output', async () => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    const icoBlob = new Blob(['ico'], { type: 'image/x-icon' })
    mockedConvert.mockResolvedValueOnce(icoBlob)

    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()

    expect(mockedConvert).toHaveBeenCalledTimes(1)
    const call = mockedConvert.mock.calls[0]
    expect(call?.[0]).toBeInstanceOf(File)
    expect(call?.[0]?.name).toBe(file.name)
    expect(call?.[1]?.sizes).toEqual([256, 48, 32, 16])

    expect(wrapper.find('.output').exists()).toBe(true)
    expect(messageMock.success).toHaveBeenCalled()
  })

  it.each([
    ['INVALID_IMAGE', 'Failed to load the image'],
    ['CANVAS_CONTEXT_UNAVAILABLE', 'Canvas is not available'],
    ['INVALID_SIZE', 'ICO size must be 256x256'],
    ['NO_SIZES_SELECTED', 'Select at least one size'],
  ])('maps %s errors to messages', async (errorCode, expected) => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error(errorCode))

    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()

    expect(wrapper.find('.error').text()).toContain(expected)
  })

  it('shows a generic message for unknown errors', async () => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('BOOM'))

    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()

    expect(wrapper.find('.error').text()).toContain('Failed to generate ICO')
  })

  it('falls back to generic errors for non-error throws', async () => {
    const wrapper = mountView()
    const file = createFile('icon.png')

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedConvert.mockRejectedValueOnce('boom')

    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()

    expect(wrapper.find('.error').text()).toContain('Failed to generate ICO')
  })
})

describe('ImageUpload', () => {
  it('accepts a valid image file', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })
    const file = createFile('icon.png', 'image/png')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    const result = vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    expect(result).toBe(false)
    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
  })

  it('ignores uploads with no file payload', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    const result = vm.handleBeforeUpload({ file: {}, fileList: [] })
    expect(result).toBe(false)
    expect(wrapper.emitted('update:file')).toBeFalsy()
  })

  it('rejects multiple uploads', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })
    const file = createFile('icon.png', 'image/png')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    vm.handleBeforeUpload({ file: { file }, fileList: [{ file }, { file }] })
    expect(wrapper.emitted('update:file')).toBeFalsy()
    expect(messageMock.error).toHaveBeenCalled()
  })

  it('rejects invalid file types', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })
    const file = createFile('icon.pdf', 'application/pdf')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    expect(wrapper.emitted('update:file')).toBeFalsy()
    expect(messageMock.error).toHaveBeenCalled()
  })

  it('rejects files without extensions when the mime type is missing', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })
    const file = createFile('', '')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    expect(wrapper.emitted('update:file')).toBeFalsy()
    expect(messageMock.error).toHaveBeenCalled()
  })

  it('accepts valid extensions when the mime type is missing', () => {
    const wrapper = mountComponent(ImageUpload, { file: null })
    const file = createFile('icon.svg', '')

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: {
        file: { file?: File }
        fileList: Array<{ file?: File }>
      }) => boolean
    }

    vm.handleBeforeUpload({ file: { file }, fileList: [{ file }] })
    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
  })

  it('falls back to an empty preview when the object URL is missing', () => {
    objectUrlValue = ''

    const file = createFile('icon.png', 'image/png')
    const wrapper = mountComponent(ImageUpload, { file })
    expect(wrapper.exists()).toBe(true)
  })

  it('clears the file selection', () => {
    const file = createFile('icon.png', 'image/png')
    const wrapper = mountComponent(ImageUpload, { file })

    const vm = wrapper.vm as unknown as { handleClearFile: () => void }
    vm.handleClearFile()

    expect(wrapper.emitted('update:file')?.[0]).toEqual([null])
  })
})

describe('ConversionOptions', () => {
  it('emits convert when the button is clicked', async () => {
    const wrapper = mountComponent(ConversionOptions, {
      sizes: [16, 32],
      padding: 0,
      backgroundEnabled: false,
      backgroundColor: '#ffffff',
      optimize: true,
      isConverting: false,
      canConvert: true,
      'onUpdate:sizes': () => undefined,
      'onUpdate:padding': () => undefined,
      'onUpdate:backgroundEnabled': () => undefined,
      'onUpdate:backgroundColor': () => undefined,
      'onUpdate:optimize': () => undefined,
    })

    wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')

    expect(wrapper.emitted('convert')).toBeTruthy()
  })

  it('updates v-model values and renders conditional hints', async () => {
    const updateSizes = vi.fn()
    const updatePadding = vi.fn()
    const updateBackgroundEnabled = vi.fn()
    const updateBackgroundColor = vi.fn()
    const updateOptimize = vi.fn()

    const wrapper = mountComponent(
      ConversionOptions,
      {
        sizes: [],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: true,
        isConverting: false,
        canConvert: false,
        'onUpdate:sizes': updateSizes,
        'onUpdate:padding': updatePadding,
        'onUpdate:backgroundEnabled': updateBackgroundEnabled,
        'onUpdate:backgroundColor': updateBackgroundColor,
        'onUpdate:optimize': updateOptimize,
      },
      {
        NCheckboxGroup: makeModelStub('NCheckboxGroup'),
        NSlider: makeModelStub('NSlider'),
        NInputNumber: makeModelStub('NInputNumber'),
        NSwitch: makeModelStub('NSwitch'),
        NColorPicker: makeModelStub('NColorPicker'),
      },
    )

    expect(wrapper.text()).toContain('Select at least one size')
    expect(wrapper.findComponent({ name: 'NColorPicker' }).exists()).toBe(false)

    wrapper.findComponent({ name: 'NCheckboxGroup' }).vm.$emit('update:value', [16, 32])
    expect(updateSizes).toHaveBeenCalledWith([16, 32])

    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 12)
    expect(updatePadding).toHaveBeenCalledWith(12)

    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 18)
    expect(updatePadding).toHaveBeenCalledWith(18)

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    switches[0]?.vm.$emit('update:value', true)
    expect(updateBackgroundEnabled).toHaveBeenCalledWith(true)

    await wrapper.setProps({ backgroundEnabled: true })
    expect(wrapper.findComponent({ name: 'NColorPicker' }).exists()).toBe(true)

    wrapper.findComponent({ name: 'NColorPicker' }).vm.$emit('update:value', '#000000')
    expect(updateBackgroundColor).toHaveBeenCalledWith('#000000')

    switches[1]?.vm.$emit('update:value', false)
    expect(updateOptimize).toHaveBeenCalledWith(false)
  })
})

describe('OutputSection', () => {
  it('renders output details and download link', () => {
    const blob = new Blob(['ico'], { type: 'image/x-icon' })
    const wrapper = mountComponent(OutputSection, {
      blob,
      fileName: 'icon.ico',
      sizes: [32, 16],
    })

    expect(wrapper.text()).toContain('32x32')
    expect(wrapper.text()).toContain('16x16')

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('blob:mock')
    expect(link.attributes('download')).toBe('icon.ico')
  })

  it('falls back to an empty href when no object URL is available', () => {
    objectUrlValue = ''
    const blob = new Blob(['ico'], { type: 'image/x-icon' })
    const wrapper = mountComponent(OutputSection, {
      blob,
      fileName: 'icon.ico',
      sizes: [32],
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('')
  })
})

describe('ErrorDisplay', () => {
  it('renders the error content', () => {
    const wrapper = mountComponent(ErrorDisplay, { error: 'Boom' })
    expect(wrapper.text()).toContain('Boom')
  })

  it('renders nothing when there is no error', () => {
    const wrapper = mountComponent(ErrorDisplay, { error: '' })
    expect(wrapper.text()).toBe('')
  })
})
