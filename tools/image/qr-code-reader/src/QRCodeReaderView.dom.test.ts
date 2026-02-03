import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import QRCodeReaderView from './QRCodeReaderView.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NTabs: defineComponent({
      name: 'NTabs',
      props: { value: { type: String, default: '' } },
      emits: ['update:value'],
      template: '<div class="tabs"><slot /></div>',
    }),
    NTabPane: defineComponent({
      name: 'NTabPane',
      props: { name: { type: String, default: '' }, tab: { type: String, default: '' } },
      template: '<div class="tab-pane"><slot /></div>',
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
  emits: ['update:file', 'decoded', 'error'],
  template: '<div class="image-upload" />',
})

const CameraCaptureStub = defineComponent({
  name: 'CameraCapture',
  emits: ['decoded', 'error'],
  template: '<div class="camera-capture" />',
})

const QRResultStub = defineComponent({
  name: 'QRResult',
  props: {
    result: { type: String, default: null },
    error: { type: String, default: null },
  },
  template: '<div class="qr-result" />',
})

describe('QRCodeReaderView', () => {
  it('updates result and error from child events', async () => {
    const wrapper = mount(QRCodeReaderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ToolSection: ToolSectionStub,
          ImageUpload: ImageUploadStub,
          CameraCapture: CameraCaptureStub,
          QRResult: QRResultStub,
        },
      },
    })

    const result = wrapper.findComponent(QRResultStub)
    expect(result.props('result')).toBe(null)
    expect(result.props('error')).toBe(null)

    wrapper.findComponent(ImageUploadStub).vm.$emit('decoded', 'payload')
    await nextTick()

    expect(result.props('result')).toBe('payload')
    expect(result.props('error')).toBe(null)

    wrapper.findComponent(CameraCaptureStub).vm.$emit('error', 'failed')
    await nextTick()

    expect(result.props('result')).toBe(null)
    expect(result.props('error')).toBe('failed')
  })

  it('clears state when switching modes', async () => {
    const wrapper = mount(QRCodeReaderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ToolSection: ToolSectionStub,
          ImageUpload: ImageUploadStub,
          CameraCapture: CameraCaptureStub,
          QRResult: QRResultStub,
        },
      },
    })

    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    const upload = wrapper.findComponent(ImageUploadStub)
    upload.vm.$emit('update:file', file)
    upload.vm.$emit('decoded', 'payload')
    await nextTick()

    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'camera')
    await nextTick()

    const result = wrapper.findComponent(QRResultStub)
    expect(result.props('result')).toBe(null)
    expect(result.props('error')).toBe(null)
    expect(wrapper.findComponent(ImageUploadStub).props('file')).toBe(null)
  })
})
