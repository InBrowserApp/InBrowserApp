import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('MorseCodeConverterView', () => {
  it('renders the converter and info sections', async () => {
    const { default: MorseCodeConverterView } = await import('./MorseCodeConverterView.vue')

    const wrapper = mount(MorseCodeConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          MorseConverter: {
            template: '<div class="morse-converter" />',
          },
          WhatIsMorseCode: {
            template: '<div class="what-is-morse" />',
          },
        },
      },
    })

    expect(wrapper.find('.morse-converter').exists()).toBe(true)
    expect(wrapper.find('.what-is-morse').exists()).toBe(true)
  })
})
