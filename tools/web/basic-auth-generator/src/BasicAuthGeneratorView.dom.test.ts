import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasicAuthGeneratorView from './BasicAuthGeneratorView.vue'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  BasicAuthGenerator: {
    name: 'BasicAuthGenerator',
    template: '<div class="basic-auth-generator" />',
  },
}

describe('BasicAuthGeneratorView', () => {
  it('renders the layout and generator', () => {
    const wrapper = mount(BasicAuthGeneratorView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toBeTruthy()
    expect(wrapper.find('.basic-auth-generator').exists()).toBe(true)
  })
})
