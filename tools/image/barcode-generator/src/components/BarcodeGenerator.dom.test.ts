import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import BarcodeGenerator from './BarcodeGenerator.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const BarcodeOptionsFormStub = defineComponent({
  name: 'BarcodeOptionsForm',
  props: {
    text: { type: String, required: true },
    format: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    margin: { type: Number, required: true },
    displayValue: { type: Boolean, required: true },
    textAlign: { type: String, required: true },
    textPosition: { type: String, required: true },
    fontSize: { type: Number, required: true },
    lineColor: { type: String, required: true },
    background: { type: String, required: true },
  },
  emits: [
    'update:text',
    'update:format',
    'update:width',
    'update:height',
    'update:margin',
    'update:display-value',
    'update:text-align',
    'update:text-position',
    'update:font-size',
    'update:line-color',
    'update:background',
  ],
  template: '<button class="options" />',
})

const BarcodePreviewStub = defineComponent({
  name: 'BarcodePreview',
  props: {
    text: { type: String, required: true },
    format: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    margin: { type: Number, required: true },
    displayValue: { type: Boolean, required: true },
    textAlign: { type: String, required: true },
    textPosition: { type: String, required: true },
    fontSize: { type: Number, required: true },
    lineColor: { type: String, required: true },
    background: { type: String, required: true },
  },
  template: '<div class="preview" />',
})

const BarcodeDownloadButtonsStub = defineComponent({
  name: 'BarcodeDownloadButtons',
  props: {
    text: { type: String, required: true },
    format: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    margin: { type: Number, required: true },
    displayValue: { type: Boolean, required: true },
    textAlign: { type: String, required: true },
    textPosition: { type: String, required: true },
    fontSize: { type: Number, required: true },
    lineColor: { type: String, required: true },
    background: { type: String, required: true },
  },
  template: '<div class="downloads" />',
})

const ToolSectionStub = {
  template: '<section><slot /></section>',
}

const ToolSectionHeaderStub = {
  template: '<h2><slot /></h2>',
}

const NGridStub = {
  template: '<div class="grid"><slot /></div>',
}

const NGiStub = {
  template: '<div class="gi"><slot /></div>',
}

describe('BarcodeGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('syncs options updates to preview and download props', async () => {
    const wrapper = mount(BarcodeGenerator, {
      global: {
        plugins: [i18n],
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NGrid: NGridStub,
          NGi: NGiStub,
          BarcodeOptionsForm: BarcodeOptionsFormStub,
          BarcodePreview: BarcodePreviewStub,
          BarcodeDownloadButtons: BarcodeDownloadButtonsStub,
        },
      },
    })

    const options = wrapper.findComponent(BarcodeOptionsFormStub)
    const preview = wrapper.findComponent(BarcodePreviewStub)
    const downloads = wrapper.findComponent(BarcodeDownloadButtonsStub)

    expect(options.props('text')).toBe('0123456789')
    expect(options.props('format')).toBe('CODE128')
    expect(options.props('width')).toBe(2)
    expect(options.props('height')).toBe(100)
    expect(options.props('margin')).toBe(10)
    expect(options.props('displayValue')).toBe(true)
    expect(options.props('textAlign')).toBe('center')
    expect(options.props('textPosition')).toBe('bottom')
    expect(options.props('fontSize')).toBe(20)
    expect(options.props('lineColor')).toBe('#000000FF')
    expect(options.props('background')).toBe('#FFFFFFFF')

    await options.vm.$emit('update:text', 'ABC123')
    await options.vm.$emit('update:format', 'EAN13')
    await options.vm.$emit('update:width', 4)
    await options.vm.$emit('update:height', 120)
    await options.vm.$emit('update:margin', 4)
    await options.vm.$emit('update:display-value', false)
    await options.vm.$emit('update:text-align', 'left')
    await options.vm.$emit('update:text-position', 'top')
    await options.vm.$emit('update:font-size', 18)
    await options.vm.$emit('update:line-color', '#123456')
    await options.vm.$emit('update:background', '#abcdef')
    await nextTick()

    expect(preview.props('text')).toBe('ABC123')
    expect(preview.props('format')).toBe('EAN13')
    expect(preview.props('width')).toBe(4)
    expect(preview.props('height')).toBe(120)
    expect(preview.props('margin')).toBe(4)
    expect(preview.props('displayValue')).toBe(false)
    expect(preview.props('textAlign')).toBe('left')
    expect(preview.props('textPosition')).toBe('top')
    expect(preview.props('fontSize')).toBe(18)
    expect(preview.props('lineColor')).toBe('#123456')
    expect(preview.props('background')).toBe('#abcdef')
    expect(downloads.props('text')).toBe('ABC123')
    expect(downloads.props('format')).toBe('EAN13')
    expect(downloads.props('width')).toBe(4)
    expect(downloads.props('height')).toBe(120)
    expect(downloads.props('margin')).toBe(4)
    expect(downloads.props('displayValue')).toBe(false)
    expect(downloads.props('textAlign')).toBe('left')
    expect(downloads.props('textPosition')).toBe('top')
    expect(downloads.props('fontSize')).toBe(18)
    expect(downloads.props('lineColor')).toBe('#123456')
    expect(downloads.props('background')).toBe('#abcdef')
  })
})
