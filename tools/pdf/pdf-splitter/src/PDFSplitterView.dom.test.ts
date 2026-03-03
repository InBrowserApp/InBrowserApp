import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFSplitterView from './PDFSplitterView.vue'

describe('PDFSplitterView', () => {
  it('renders tool layout and splitter tool', () => {
    const wrapper = mount(PDFSplitterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFSplitterTool: {
            template: '<div class="tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
