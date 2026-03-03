import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import PDFTextExtractorView from './PDFTextExtractorView.vue'
import PDFTextExtractor from './components/PDFTextExtractor.vue'
import WhatIsPDFTextExtractor from './components/WhatIsPDFTextExtractor.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(PDFTextExtractorView))
  },
}

describe('PDFTextExtractorView', () => {
  it('renders extractor and introduction blocks', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.findComponent(PDFTextExtractor).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsPDFTextExtractor).exists()).toBe(true)
  })
})
