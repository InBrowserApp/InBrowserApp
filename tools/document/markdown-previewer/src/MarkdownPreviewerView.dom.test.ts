import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownPreviewerView from './MarkdownPreviewerView.vue'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
      MarkdownPreviewer: {
        template: '<div data-test="markdown-previewer" />',
      },
    },
  },
}

describe('MarkdownPreviewerView', () => {
  it('renders the previewer component', () => {
    const wrapper = mount(MarkdownPreviewerView, mountOptions)

    expect(wrapper.find('[data-test="markdown-previewer"]').exists()).toBe(true)
  })
})
