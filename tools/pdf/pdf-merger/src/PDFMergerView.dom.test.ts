import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMergerView from './PDFMergerView.vue'

describe('PDFMergerView', () => {
  it('renders tool layout and merger tool', () => {
    const wrapper = mount(PDFMergerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFMergerTool: {
            template: '<div class="tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
