import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomPasswordGeneratorView from './RandomPasswordGeneratorView.vue'

describe('RandomPasswordGeneratorView', () => {
  it('renders the generator inside the layout', () => {
    const wrapper = mount(RandomPasswordGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          RandomPasswordGenerator: {
            template: '<div class="random-password-generator" />',
          },
        },
      },
    })

    expect(wrapper.find('.random-password-generator').exists()).toBe(true)
  })
})
