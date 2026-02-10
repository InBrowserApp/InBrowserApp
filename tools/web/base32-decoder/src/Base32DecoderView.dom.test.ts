import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Base32DecoderView from './Base32DecoderView.vue'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  Base32Decoder: {
    name: 'Base32Decoder',
    template: '<div class="base32-decoder" />',
  },
}

describe('Base32DecoderView', () => {
  it('renders the layout and decoder', () => {
    const wrapper = mount(Base32DecoderView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toBeTruthy()
    expect(wrapper.find('.base32-decoder').exists()).toBe(true)
  })
})
