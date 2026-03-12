import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFCompressorView from './PDFCompressorView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/PDFCompressorTool.vue', () => ({
  default: {
    template: '<div class="tool" />',
  },
}))

describe('PDFCompressorView', () => {
  it('renders the page layout and tool body', () => {
    const wrapper = mount(PDFCompressorView)

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
