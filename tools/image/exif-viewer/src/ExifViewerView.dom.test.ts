import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import ExifViewerView from './ExifViewerView.vue'

const exifrMocks = vi.hoisted(() => ({
  parse: vi.fn(),
}))

vi.mock('exifr', () => ({
  parse: exifrMocks.parse,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: { info: { type: Object, required: true } },
  template: '<div class="layout"><slot /></div>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const ImageUploadStub = defineComponent({
  name: 'ImageUpload',
  props: { file: { type: Object, default: null } },
  emits: ['update:file'],
  template: '<div class="image-upload" />',
})

const ImagePreviewStub = defineComponent({
  name: 'ImagePreview',
  props: { file: { type: Object, required: true } },
  emits: ['clear'],
  template: '<div class="image-preview" />',
})

const ExifDataDisplayStub = defineComponent({
  name: 'ExifDataDisplay',
  props: {
    data: { type: Object, required: true },
    isLoading: { type: Boolean, required: true },
  },
  template: '<div class="exif-data-display" />',
})

const ExifActionsStub = defineComponent({
  name: 'ExifActions',
  props: { exifData: { type: Object, required: true } },
  template: '<div class="exif-actions" />',
})

const WhatIsExifStub = defineComponent({
  name: 'WhatIsExif',
  template: '<div class="what-is-exif" />',
})

const NAlertStub = defineComponent({
  name: 'NAlert',
  props: { title: { type: String, default: '' } },
  template: '<div class="n-alert"><slot /></div>',
})

const NEmptyStub = defineComponent({
  name: 'NEmpty',
  props: { description: { type: String, default: '' } },
  template: '<div class="n-empty">{{ description }}</div>',
})

const globalStubs = {
  ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
  ToolSection: ToolSectionStub,
  ImageUpload: ImageUploadStub,
  ImagePreview: ImagePreviewStub,
  ExifDataDisplay: ExifDataDisplayStub,
  ExifActions: ExifActionsStub,
  WhatIsExif: WhatIsExifStub,
  NAlert: NAlertStub,
  NEmpty: NEmptyStub,
}

describe('ExifViewerView', () => {
  beforeEach(() => {
    exifrMocks.parse.mockReset()
  })

  it('renders preview and data when metadata is present', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const exifData = { Make: 'Canon', latitude: 10, longitude: 20 }
    exifrMocks.parse.mockResolvedValue(exifData)

    const wrapper = mount(ExifViewerView, {
      global: {
        stubs: globalStubs,
      },
    })

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await nextTick()
    await flushPromises()
    await nextTick()

    expect(exifrMocks.parse).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        exif: true,
        gps: true,
        translateKeys: true,
      }),
    )

    const preview = wrapper.findComponent(ImagePreviewStub)
    expect(preview.exists()).toBe(true)
    const previewFile = preview.props('file') as File
    expect(previewFile.name).toBe('photo.jpg')

    const display = wrapper.findComponent(ExifDataDisplayStub)
    expect(display.exists()).toBe(true)
    expect(display.props('data')).toMatchObject(exifData)
    expect(display.props('isLoading')).toBe(false)

    const actions = wrapper.findComponent(ExifActionsStub)
    expect(actions.exists()).toBe(true)
    expect(actions.props('exifData')).toMatchObject(exifData)
  })

  it('shows empty state when metadata is missing', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    exifrMocks.parse.mockResolvedValue({})

    const wrapper = mount(ExifViewerView, {
      global: {
        stubs: globalStubs,
      },
    })

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await nextTick()
    await flushPromises()
    await nextTick()

    const empty = wrapper.find('.n-empty')
    expect(empty.exists()).toBe(true)
    expect(empty.text()).toContain('noExifData')
  })

  it('shows error alert when parsing fails', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    exifrMocks.parse.mockRejectedValue(new Error('boom'))

    const wrapper = mount(ExifViewerView, {
      global: {
        stubs: globalStubs,
      },
    })

    wrapper.findComponent(ImageUploadStub).vm.$emit('update:file', file)
    await nextTick()
    await flushPromises()
    await nextTick()

    const alert = wrapper.find('.n-alert')
    expect(alert.exists()).toBe(true)
    expect(wrapper.text()).toContain('boom')
  })
})
