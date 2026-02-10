import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceholderImageGeneratorView from './PlaceholderImageGeneratorView.vue'

describe('PlaceholderImageGeneratorView', () => {
  it('renders the placeholder generator inside the layout', () => {
    const wrapper = mount(PlaceholderImageGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PlaceholderImageGenerator: {
            template: '<div class="placeholder-generator" />',
          },
        },
      },
    })

    expect(wrapper.find('.placeholder-generator').exists()).toBe(true)
  })
})
