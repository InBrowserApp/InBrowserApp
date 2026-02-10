import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import PlaceholderImageGenerator from './PlaceholderImageGenerator.vue'

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

const PlaceholderOptionsFormStub = defineComponent({
  name: 'PlaceholderOptionsForm',
  props: [
    'width',
    'height',
    'bgType',
    'bgColor',
    'gradientColor1',
    'gradientColor2',
    'gradientAngle',
    'textColor',
    'customText',
    'fontSize',
  ],
  emits: [
    'update:width',
    'update:height',
    'update:bg-type',
    'update:bg-color',
    'update:gradient-color1',
    'update:gradient-color2',
    'update:gradient-angle',
    'update:text-color',
    'update:custom-text',
    'update:font-size',
  ],
  template: '<div class="options-form" />',
})

const PlaceholderPreviewStub = defineComponent({
  name: 'PlaceholderPreview',
  props: [
    'width',
    'height',
    'bgType',
    'bgColor',
    'gradientColor1',
    'gradientColor2',
    'gradientAngle',
    'textColor',
    'customText',
    'fontSize',
  ],
  template: '<div class="preview" />',
})

const PlaceholderDownloadButtonsStub = defineComponent({
  name: 'PlaceholderDownloadButtons',
  props: ['options'],
  template: '<div class="download" />',
})

const mountGenerator = () =>
  mount(PlaceholderImageGenerator, {
    global: {
      stubs: {
        PlaceholderOptionsForm: PlaceholderOptionsFormStub,
        PlaceholderPreview: PlaceholderPreviewStub,
        PlaceholderDownloadButtons: PlaceholderDownloadButtonsStub,
      },
    },
  })

describe('PlaceholderImageGenerator', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('passes stored options into child components', () => {
    storage.set('tools:placeholder:width', ref(320))
    storage.set('tools:placeholder:height', ref(200))
    storage.set('tools:placeholder:bgType', ref('linear-gradient'))
    storage.set('tools:placeholder:bgColor', ref('#111111'))
    storage.set('tools:placeholder:gradientColor1', ref('#222222'))
    storage.set('tools:placeholder:gradientColor2', ref('#333333'))
    storage.set('tools:placeholder:gradientAngle', ref(30))
    storage.set('tools:placeholder:textColor', ref('#444444'))
    storage.set('tools:placeholder:customText', ref('Hello'))
    storage.set('tools:placeholder:fontSize', ref(42))

    const wrapper = mountGenerator()

    const optionsForm = wrapper.findComponent(PlaceholderOptionsFormStub)
    expect(optionsForm.props('width')).toBe(320)
    expect(optionsForm.props('height')).toBe(200)
    expect(optionsForm.props('bgType')).toBe('linear-gradient')
    expect(optionsForm.props('gradientAngle')).toBe(30)
    expect(optionsForm.props('customText')).toBe('Hello')
    expect(optionsForm.props('fontSize')).toBe(42)

    const preview = wrapper.findComponent(PlaceholderPreviewStub)
    expect(preview.props('width')).toBe(320)
    expect(preview.props('bgColor')).toBe('#111111')
    expect(preview.props('gradientColor1')).toBe('#222222')
    expect(preview.props('gradientColor2')).toBe('#333333')

    const download = wrapper.findComponent(PlaceholderDownloadButtonsStub)
    const options = download.props('options') as Record<string, unknown>
    expect(options.width).toBe(320)
    expect(options.height).toBe(200)
    expect(options.bgType).toBe('linear-gradient')
    expect(options.textColor).toBe('#444444')
    expect(options.customText).toBe('Hello')
  })

  it('syncs option updates across preview and download props', async () => {
    const wrapper = mountGenerator()
    const optionsForm = wrapper.findComponent(PlaceholderOptionsFormStub)
    const preview = wrapper.findComponent(PlaceholderPreviewStub)
    const download = wrapper.findComponent(PlaceholderDownloadButtonsStub)

    await optionsForm.vm.$emit('update:width', 640)
    await optionsForm.vm.$emit('update:height', 480)
    await optionsForm.vm.$emit('update:bg-type', 'radial-gradient')
    await optionsForm.vm.$emit('update:bg-color', '#111111')
    await optionsForm.vm.$emit('update:gradient-color1', '#222222')
    await optionsForm.vm.$emit('update:gradient-color2', '#333333')
    await optionsForm.vm.$emit('update:gradient-angle', 120)
    await optionsForm.vm.$emit('update:text-color', '#444444')
    await optionsForm.vm.$emit('update:custom-text', 'Updated')
    await optionsForm.vm.$emit('update:font-size', 36)
    await nextTick()

    expect(preview.props('width')).toBe(640)
    expect(preview.props('height')).toBe(480)
    expect(preview.props('bgType')).toBe('radial-gradient')
    expect(preview.props('bgColor')).toBe('#111111')
    expect(preview.props('gradientColor1')).toBe('#222222')
    expect(preview.props('gradientColor2')).toBe('#333333')
    expect(preview.props('gradientAngle')).toBe(120)
    expect(preview.props('textColor')).toBe('#444444')
    expect(preview.props('customText')).toBe('Updated')
    expect(preview.props('fontSize')).toBe(36)

    const options = download.props('options') as Record<string, unknown>
    expect(options.width).toBe(640)
    expect(options.height).toBe(480)
    expect(options.bgType).toBe('radial-gradient')
    expect(options.bgColor).toBe('#111111')
    expect(options.gradientColor1).toBe('#222222')
    expect(options.gradientColor2).toBe('#333333')
    expect(options.gradientAngle).toBe(120)
    expect(options.textColor).toBe('#444444')
    expect(options.customText).toBe('Updated')
    expect(options.fontSize).toBe(36)
  })
})
