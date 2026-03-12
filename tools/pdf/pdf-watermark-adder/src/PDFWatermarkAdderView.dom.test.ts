import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFWatermarkAdderView from './PDFWatermarkAdderView.vue'

describe('PDFWatermarkAdderView', () => {
  it('renders tool layout and tool component', () => {
    const wrapper = mount(PDFWatermarkAdderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFWatermarkAdderTool: {
            template: '<div class="tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
