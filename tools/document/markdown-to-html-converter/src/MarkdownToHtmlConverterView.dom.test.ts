import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownToHtmlConverterView from './MarkdownToHtmlConverterView.vue'

const ToolDefaultPageLayoutStub = {
  props: ['info'],
  template: '<div><slot /></div>',
}

const MarkdownToHtmlConverterStub = {
  template: '<div data-test="markdown-to-html" />',
}

describe('MarkdownToHtmlConverterView', () => {
  it('renders the markdown to html converter', () => {
    const wrapper = mount(MarkdownToHtmlConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          MarkdownToHtmlConverter: MarkdownToHtmlConverterStub,
        },
      },
    })

    expect(wrapper.find('[data-test="markdown-to-html"]').exists()).toBe(true)
  })
})
