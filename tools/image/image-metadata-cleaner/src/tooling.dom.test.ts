import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { NMessageProvider } from 'naive-ui'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'
import ImageMetadataCleanerView from './ImageMetadataCleanerView.vue'
import ImageUpload from './components/ImageUpload.vue'
import ImagePreview from './components/ImagePreview.vue'
import { stripImageMetadata } from '@utils/image'

vi.mock('@utils/image', () => ({
  stripImageMetadata: vi.fn(),
}))

const mockedStrip = vi.mocked(stripImageMetadata)

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
  props: {
    disabled: Boolean,
  },
  emits: ['click'],
  template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
})

const StatisticStub = defineComponent({
  name: 'NStatistic',
  props: {
    value: [String, Number],
    label: String,
  },
  template: '<div><slot />{{ value }}</div>',
})

const ImageUploadStub = defineComponent({
  name: 'ImageUpload',
  props: {
    file: Object,
  },
  emits: ['update:file'],
  template: '<div />',
})

const ImagePreviewStub = defineComponent({
  name: 'ImagePreview',
  props: {
    file: Object,
  },
  emits: ['clear'],
  template: '<div />',
})

const ViewWithProvider = defineComponent({
  render() {
    return h(NMessageProvider, null, {
      default: () => h(ImageMetadataCleanerView),
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
        NGrid: BaseStub,
        NGridItem: BaseStub,
        NIcon: BaseStub,
        NStatistic: StatisticStub,
        NText: BaseStub,
        ImageUpload: ImageUploadStub,
        ImagePreview: ImagePreviewStub,
      },
    },
  })

const createFile = (name: string, type = '') =>
  new File([new Uint8Array([1, 2, 3, 4])], name, { type })

let createObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null
let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null

beforeEach(() => {
  mockedStrip.mockReset()

  const url = URL as Partial<typeof URL>
  if (!url.createObjectURL) {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      writable: true,
    })
  }
  createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')

  if (!url.revokeObjectURL) {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(() => undefined),
      writable: true,
    })
  }
  revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
})

afterEach(() => {
  createObjectUrlSpy?.mockRestore()
  revokeObjectUrlSpy?.mockRestore()
  createObjectUrlSpy = null
  revokeObjectUrlSpy = null
})

describe('image metadata cleaner tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('image-metadata-cleaner')
    expect(toolInfo.path).toBe('/tools/image-metadata-cleaner')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('EXIF')
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

describe('ImageMetadataCleanerView', () => {
  it('cleans metadata for supported formats and allows download', async () => {
    const wrapper = mountView()

    const file = createFile('photo.jpg')
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedStrip
      .mockReturnValueOnce({
        cleaned: new Uint8Array([1, 2]),
        removedBytes: 2,
        format: 'jpeg',
      })
      .mockReturnValueOnce({
        cleaned: new Uint8Array([1, 2]),
        removedBytes: 2,
        format: 'png',
      })
      .mockReturnValueOnce({
        cleaned: new Uint8Array([1, 2]),
        removedBytes: 2,
        format: 'webp',
      })

    const cleanButton = wrapper.findAll('button')[0]
    if (!cleanButton) {
      throw new Error('Missing clean metadata button')
    }

    await cleanButton.trigger('click')
    await flushPromises()

    await cleanButton.trigger('click')
    await flushPromises()

    await cleanButton.trigger('click')
    await flushPromises()

    expect(mockedStrip).toHaveBeenCalledTimes(3)
    expect(wrapper.text()).toContain('Download cleaned image')

    const downloadButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Download cleaned image'))
    if (!downloadButton) {
      throw new Error('Missing download button')
    }

    await downloadButton.trigger('click')
    expect(URL.createObjectURL).toHaveBeenCalled()

    wrapper.findComponent(ImagePreviewStub).vm.$emit('clear')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Download cleaned image')
  })

  it('shows an unsupported format message', async () => {
    const wrapper = mountView()

    const file = createFile('photo.bin')
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedStrip.mockImplementation(() => {
      throw new Error('Unsupported image format')
    })

    const cleanButton = wrapper.findAll('button')[0]
    if (!cleanButton) {
      throw new Error('Missing clean metadata button')
    }

    await cleanButton.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Unsupported format')
  })

  it('falls back to a generic error message for non-error throws', async () => {
    const wrapper = mountView()

    const file = createFile('photo.bin')
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedStrip.mockImplementation(() => {
      throw 'boom'
    })

    const cleanButton = wrapper.findAll('button')[0]
    if (!cleanButton) {
      throw new Error('Missing clean metadata button')
    }

    await cleanButton.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to clean metadata')
  })

  it('surfaces generic error messages', async () => {
    const wrapper = mountView()

    const file = createFile('photo.bin')
    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    mockedStrip.mockImplementation(() => {
      throw new Error('Boom')
    })

    const cleanButton = wrapper.findAll('button')[0]
    if (!cleanButton) {
      throw new Error('Missing clean metadata button')
    }

    await cleanButton.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Boom')
  })
})

describe('ImageUpload', () => {
  it('emits the selected file', async () => {
    const file = createFile('photo.jpg', 'image/jpeg')

    const wrapper = mount(ImageUpload, {
      props: { file: null },
      global: {
        plugins: [i18n],
        stubs: {
          NUpload: BaseStub,
          NUploadDragger: BaseStub,
          NIcon: BaseStub,
          NText: BaseStub,
          NP: BaseStub,
          ToolSection: BaseStub,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (data: { file: { file?: File } | null; fileList: unknown[] }) => boolean
    }
    vm.handleBeforeUpload({ file: { file }, fileList: [] })

    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
  })
})

describe('ImagePreview', () => {
  it('renders the file info and emits clear', async () => {
    const file = createFile('photo.jpg', 'image/jpeg')

    const wrapper = mount(ImagePreview, {
      props: { file },
      global: {
        plugins: [i18n],
        stubs: {
          NImage: BaseStub,
          NFlex: BaseStub,
          NText: BaseStub,
          NButton: ButtonStub,
          NIcon: BaseStub,
          ToolSection: BaseStub,
        },
      },
    })

    expect(wrapper.text()).toContain('photo.jpg')

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})
