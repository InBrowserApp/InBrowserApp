import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasicAuthDecoderView from './BasicAuthDecoderView.vue'

describe('BasicAuthDecoderView', () => {
  it('renders the decoder tool', () => {
    const wrapper = mount(BasicAuthDecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          BasicAuthDecoder: {
            template: '<div class="basic-auth-decoder" />',
          },
        },
      },
    })

    expect(wrapper.find('.basic-auth-decoder').exists()).toBe(true)
  })
})
