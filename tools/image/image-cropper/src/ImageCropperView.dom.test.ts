import { beforeEach, describe, expect, it, vi } from 'vitest'

const { loadImageSourceMock, cropImageMock, successMock, errorMock } = vi.hoisted(() => ({
  loadImageSourceMock: vi.fn(),
  cropImageMock: vi.fn(),
  successMock: vi.fn(),
  errorMock: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NAlert = defineComponent({
    name: 'NAlert',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      return () => h('div', { 'data-alert-title': props.title }, slots.default?.())
    },
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    setup(_, { slots }) {
      return () => h('div', { class: 'grid-stub' }, slots.default?.())
    },
  })

  const NGi = defineComponent({
    name: 'NGi',
    setup(_, { slots }) {
      return () => h('div', { class: 'gi-stub' }, slots.default?.())
    },
  })

  return {
    NAlert,
    NGi,
    NGrid,
    useMessage: () => ({
      success: successMock,
      error: errorMock,
    }),
  }
})

vi.mock('./utils/load-image', () => ({
  loadImageSource: (...args: unknown[]) => loadImageSourceMock(...args),
}))

vi.mock('./utils/crop-image', () => ({
  cropImage: (...args: unknown[]) => cropImageMock(...args),
}))

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: { name: 'ToolDefaultPageLayout', template: '<div><slot /></div>' },
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
}))

import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ImageCropperView from './ImageCropperView.vue'
import type { CropRect, CropResult, ExportOptions, ImageSource } from './types'
import * as toolInfo from './info'

const source: ImageSource = {
  file: new File(['image'], 'portrait.png', { type: 'image/png' }),
  width: 800,
  height: 600,
  mimeType: 'image/png',
  extension: 'png',
  hasAlpha: true,
}

const croppedResult: CropResult = {
  blob: new Blob(['cropped'], { type: 'image/png' }),
  outputName: 'portrait.cropped.png',
  outputWidth: 400,
  outputHeight: 300,
  outputMimeType: 'image/png',
  cropWidth: 400,
  cropHeight: 300,
}

const layoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-tool-id': (props.info as typeof toolInfo).toolID }, slots.default?.())
  },
})

const sectionStub = defineComponent({
  name: 'ToolSection',
  setup(_, { slots }) {
    return () => h('section', slots.default?.())
  },
})

const uploadStub = defineComponent({
  name: 'ImageCropUpload',
  props: {
    file: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:file'],
  setup(props) {
    return () =>
      h('div', {
        'data-upload-width': props.width == null ? '' : String(props.width),
        'data-upload-height': props.height == null ? '' : String(props.height),
      })
  },
})

const presetStub = defineComponent({
  name: 'CropPresetBar',
  props: {
    presetId: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:presetId'],
  setup(props) {
    return () => h('div', { 'data-preset-id': props.presetId })
  },
})

const workspaceStub = defineComponent({
  name: 'CropWorkspace',
  props: {
    source: {
      type: Object,
      required: true,
    },
    cropRect: {
      type: Object,
      required: true,
    },
    ratio: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:cropRect'],
  setup(props) {
    return () =>
      h('div', {
        'data-ratio': props.ratio == null ? 'free' : String(props.ratio),
      })
  },
})

const settingsStub = defineComponent({
  name: 'CropSettingsPanel',
  props: {
    exportOptions: {
      type: Object,
      required: true,
    },
    cropWidth: {
      type: Number,
      required: true,
    },
    cropHeight: {
      type: Number,
      required: true,
    },
    sourceMimeType: {
      type: String,
      required: true,
    },
    sourceHasAlpha: {
      type: Boolean,
      required: true,
    },
    isProcessing: {
      type: Boolean,
      required: true,
    },
    canCrop: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:exportOptions', 'crop'],
  setup(props) {
    return () =>
      h('div', {
        'data-crop-width': String(props.cropWidth),
        'data-crop-height': String(props.cropHeight),
        'data-can-crop': String(props.canCrop),
      })
  },
})

const resultStub = defineComponent({
  name: 'CropResultPanel',
  props: {
    originalFile: {
      type: Object,
      required: true,
    },
    result: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return () => h('div', { 'data-output-name': (props.result as CropResult).outputName })
  },
})

function mountView() {
  return mount(ImageCropperView, {
    global: {
      stubs: {
        ToolDefaultPageLayout: layoutStub,
        ToolSection: sectionStub,
        ImageCropUpload: uploadStub,
        CropPresetBar: presetStub,
        CropWorkspace: workspaceStub,
        CropSettingsPanel: settingsStub,
        CropResultPanel: resultStub,
      },
    },
  })
}

beforeEach(() => {
  loadImageSourceMock.mockReset()
  cropImageMock.mockReset()
  successMock.mockReset()
  errorMock.mockReset()
})

describe('ImageCropperView', () => {
  it('loads a selected image and renders the crop workflow', async () => {
    loadImageSourceMock.mockResolvedValue(source)
    const wrapper = mountView()

    expect(wrapper.attributes('data-tool-id')).toBe('image-cropper')
    expect(wrapper.findComponent(workspaceStub).exists()).toBe(false)

    const selectedFile = new File(['image'], 'portrait.png', { type: 'image/png' })
    wrapper.getComponent(uploadStub).vm.$emit('update:file', selectedFile)
    await flushPromises()

    expect(loadImageSourceMock).toHaveBeenCalledWith(selectedFile)
    expect(wrapper.getComponent(uploadStub).attributes('data-upload-width')).toBe('800')
    expect(wrapper.getComponent(uploadStub).attributes('data-upload-height')).toBe('600')
    expect(wrapper.getComponent(workspaceStub).attributes('data-ratio')).toBe('free')
    expect(wrapper.getComponent(settingsStub).attributes('data-crop-width')).toBe('704')
    expect(wrapper.getComponent(settingsStub).attributes('data-crop-height')).toBe('528')
  })

  it('updates preset ratio, crops successfully, and clears results when the crop changes', async () => {
    loadImageSourceMock.mockResolvedValue(source)
    cropImageMock.mockResolvedValue(croppedResult)

    const wrapper = mountView()
    const selectedFile = new File(['image'], 'portrait.png', { type: 'image/png' })

    wrapper.getComponent(uploadStub).vm.$emit('update:file', selectedFile)
    await flushPromises()

    wrapper.getComponent(presetStub).vm.$emit('update:presetId', '1:1')
    await flushPromises()
    expect(wrapper.getComponent(workspaceStub).attributes('data-ratio')).toBe('1')

    const nextExportOptions: ExportOptions = {
      format: 'jpeg',
      quality: 80,
      background: '#eeeeee',
      targetWidth: 300,
      targetHeight: 300,
    }
    wrapper.getComponent(settingsStub).vm.$emit('update:exportOptions', nextExportOptions)
    await flushPromises()

    wrapper.getComponent(settingsStub).vm.$emit('crop')
    await flushPromises()

    expect(cropImageMock).toHaveBeenCalledWith(
      source,
      expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
      nextExportOptions,
    )
    expect(successMock).toHaveBeenCalledWith('Image cropped successfully.')
    expect(wrapper.getComponent(resultStub).attributes('data-output-name')).toBe(
      'portrait.cropped.png',
    )

    const nextRect: CropRect = { x: 0.2, y: 0.15, width: 0.4, height: 0.5 }
    wrapper.getComponent(workspaceStub).vm.$emit('update:cropRect', nextRect)
    await flushPromises()

    expect(wrapper.findComponent(resultStub).exists()).toBe(false)
  })

  it('shows a localized warning when image loading fails', async () => {
    loadImageSourceMock.mockRejectedValue(new Error('INVALID_IMAGE'))
    const wrapper = mountView()

    wrapper
      .getComponent(uploadStub)
      .vm.$emit('update:file', new File(['bad'], 'broken.png', { type: 'image/png' }))
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read this image file. Please choose another image.')
    expect(wrapper.findComponent(workspaceStub).exists()).toBe(false)
  })

  it('clears the workflow when the selected file is removed', async () => {
    loadImageSourceMock.mockResolvedValue(source)
    cropImageMock.mockResolvedValue(croppedResult)

    const wrapper = mountView()
    wrapper
      .getComponent(uploadStub)
      .vm.$emit('update:file', new File(['image'], 'portrait.png', { type: 'image/png' }))
    await flushPromises()

    wrapper.getComponent(settingsStub).vm.$emit('crop')
    await flushPromises()
    expect(wrapper.findComponent(resultStub).exists()).toBe(true)

    wrapper.getComponent(uploadStub).vm.$emit('update:file', null)
    await flushPromises()

    expect(wrapper.findComponent(workspaceStub).exists()).toBe(false)
    expect(wrapper.findComponent(settingsStub).exists()).toBe(false)
    expect(wrapper.findComponent(resultStub).exists()).toBe(false)
  })

  it('shows crop errors and forwards them to the message API', async () => {
    loadImageSourceMock.mockResolvedValue(source)
    cropImageMock.mockRejectedValue(new Error('OUTPUT_TOO_LARGE'))

    const wrapper = mountView()
    wrapper
      .getComponent(uploadStub)
      .vm.$emit('update:file', new File(['image'], 'portrait.png', { type: 'image/png' }))
    await flushPromises()

    wrapper.getComponent(settingsStub).vm.$emit('crop')
    await flushPromises()

    expect(wrapper.text()).toContain(
      'This export is too large for the browser. Reduce the crop size or output size and try again.',
    )
    expect(errorMock).toHaveBeenCalledWith(
      'This export is too large for the browser. Reduce the crop size or output size and try again.',
    )
    expect(wrapper.findComponent(resultStub).exists()).toBe(false)
  })

  it('maps canvas and unknown crop errors to localized messages', async () => {
    loadImageSourceMock.mockResolvedValue(source)
    const wrapper = mountView()

    wrapper
      .getComponent(uploadStub)
      .vm.$emit('update:file', new File(['image'], 'portrait.png', { type: 'image/png' }))
    await flushPromises()

    cropImageMock.mockRejectedValueOnce(new Error('CANVAS_UNAVAILABLE'))
    wrapper.getComponent(settingsStub).vm.$emit('crop')
    await flushPromises()
    expect(wrapper.text()).toContain('Canvas is not available in this browser.')

    cropImageMock.mockRejectedValueOnce(new Error('WHATEVER'))
    wrapper.getComponent(settingsStub).vm.$emit('crop')
    await flushPromises()
    expect(wrapper.text()).toContain('Failed to crop the image. Please try again.')
  })
})
