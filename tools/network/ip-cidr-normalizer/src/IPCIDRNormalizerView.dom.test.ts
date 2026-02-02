import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IPCIDRNormalizerView from './IPCIDRNormalizerView.vue'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  IPCIDRNormalizer: {
    name: 'IPCIDRNormalizer',
    template: '<div class="normalizer" />',
  },
}

describe('IPCIDRNormalizerView', () => {
  it('renders the layout and normalizer', () => {
    const wrapper = mount(IPCIDRNormalizerView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toBeTruthy()
    expect(wrapper.find('.normalizer').exists()).toBe(true)
  })
})
