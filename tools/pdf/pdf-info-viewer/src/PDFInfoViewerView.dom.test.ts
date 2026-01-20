import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PDFInfoViewerView from './PDFInfoViewerView.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  PDFInfoViewer: {
    template: '<div class="pdf-info-viewer" />',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
  NUl: {
    template: '<ul class="n-ul"><slot /></ul>',
  },
  NLi: {
    template: '<li class="n-li"><slot /></li>',
  },
}

describe('PDFInfoViewerView', () => {
  it('renders the view layout and description', () => {
    const wrapper = mount(PDFInfoViewerView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.find('.pdf-info-viewer').exists()).toBe(true)
    expect(wrapper.text()).toContain('What is PDF metadata?')
  })
})
