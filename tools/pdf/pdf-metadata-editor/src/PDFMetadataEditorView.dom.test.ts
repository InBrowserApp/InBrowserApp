import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataEditorView from './PDFMetadataEditorView.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

describe('PDFMetadataEditorView', () => {
  it('renders the default layout and tool component', () => {
    const wrapper = mount(PDFMetadataEditorView, {
      global: {
        plugins: [i18n],
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFMetadataEditorTool: {
            template: '<div class="pdf-metadata-editor-tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.pdf-metadata-editor-tool').exists()).toBe(true)
  })
})
