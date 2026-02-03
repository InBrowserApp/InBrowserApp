import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import QRCodeGenerator from './QRCodeGenerator.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

const QRContentFormStub = defineComponent({
  name: 'QRContentForm',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  mounted() {
    this.$emit('update:modelValue', 'https://example.com')
  },
  template: '<div class="qr-content-form" :data-text="modelValue" />',
})

const QROptionsFormStub = defineComponent({
  name: 'QROptionsForm',
  props: ['errorCorrectionLevel', 'width', 'margin', 'dark', 'light'],
  template:
    '<div class="qr-options" :data-ecc="errorCorrectionLevel" :data-width="width" :data-margin="margin" :data-dark="dark" :data-light="light" />',
})

const QRPreviewStub = defineComponent({
  name: 'QRPreview',
  props: ['text', 'errorCorrectionLevel', 'width', 'margin', 'dark', 'light'],
  template: '<div class="qr-preview" :data-text="text" />',
})

const QRDownloadButtonsStub = defineComponent({
  name: 'QRDownloadButtons',
  props: ['text', 'errorCorrectionLevel', 'width', 'margin', 'dark', 'light'],
  template: '<div class="qr-download" :data-text="text" />',
})

const mountGenerator = () =>
  mount(QRCodeGenerator, {
    global: {
      stubs: {
        QRContentForm: QRContentFormStub,
        QROptionsForm: QROptionsFormStub,
        QRPreview: QRPreviewStub,
        QRDownloadButtons: QRDownloadButtonsStub,
      },
    },
  })

describe('QRCodeGenerator', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('passes stored options into option, preview, and download components', async () => {
    storage.set('tools:qr:ecc', ref('H'))
    storage.set('tools:qr:width', ref(512))
    storage.set('tools:qr:margin', ref(4))
    storage.set('tools:qr:dark', ref('#111111FF'))
    storage.set('tools:qr:light', ref('#EEEEEEFF'))

    const wrapper = mountGenerator()
    await nextTick()

    const options = wrapper.find('.qr-options')
    expect(options.attributes('data-ecc')).toBe('H')
    expect(options.attributes('data-width')).toBe('512')
    expect(options.attributes('data-margin')).toBe('4')
    expect(options.attributes('data-dark')).toBe('#111111FF')
    expect(options.attributes('data-light')).toBe('#EEEEEEFF')

    expect(wrapper.find('.qr-preview').attributes('data-text')).toBe('https://example.com')
    expect(wrapper.find('.qr-download').attributes('data-text')).toBe('https://example.com')
  })
})
