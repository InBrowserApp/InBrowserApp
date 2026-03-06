import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFPageNumberAdderView from './PDFPageNumberAdderView.vue'

describe('PDFPageNumberAdderView', () => {
  it('renders tool layout and tool component', () => {
    const wrapper = mount(PDFPageNumberAdderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFPageNumberAdderTool: {
            template: '<div class="tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
