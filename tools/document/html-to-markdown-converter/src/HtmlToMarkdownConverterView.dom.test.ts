import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HtmlToMarkdownConverterView from './HtmlToMarkdownConverterView.vue'

const ToolDefaultPageLayoutStub = {
  props: ['info'],
  template: '<div><slot /></div>',
}

const HtmlToMarkdownConverterStub = {
  template: '<div data-test="html-to-markdown" />',
}

describe('HtmlToMarkdownConverterView', () => {
  it('renders the html to markdown converter', () => {
    const wrapper = mount(HtmlToMarkdownConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          HtmlToMarkdownConverter: HtmlToMarkdownConverterStub,
        },
      },
    })

    expect(wrapper.find('[data-test="html-to-markdown"]').exists()).toBe(true)
  })
})
