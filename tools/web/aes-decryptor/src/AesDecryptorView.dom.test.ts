import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AesDecryptorView from './AesDecryptorView.vue'

describe('AesDecryptorView', () => {
  it('renders the decrypt form inside the layout', () => {
    const wrapper = mount(AesDecryptorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          DecryptForm: {
            template: '<div class="decrypt-form" />',
          },
        },
      },
    })

    expect(wrapper.find('.decrypt-form').exists()).toBe(true)
  })
})
