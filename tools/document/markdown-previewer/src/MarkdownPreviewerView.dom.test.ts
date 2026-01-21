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
      WhatIsMarkdown: {
        template: '<section data-test="what-is-markdown" />',
      },
    },
  },
}

describe('MarkdownPreviewerView', () => {
  it('renders the previewer component', () => {
    const wrapper = mount(MarkdownPreviewerView, mountOptions)

    expect(wrapper.find('[data-test="markdown-previewer"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="what-is-markdown"]').exists()).toBe(true)
  })
})
