import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Base32EncoderView from './Base32EncoderView.vue'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  Base32Encoder: {
    name: 'Base32Encoder',
    template: '<div class="base32-encoder" />',
  },
}

describe('Base32EncoderView', () => {
  it('renders the layout and encoder', () => {
    const wrapper = mount(Base32EncoderView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toBeTruthy()
    expect(wrapper.find('.base32-encoder').exists()).toBe(true)
  })
})
