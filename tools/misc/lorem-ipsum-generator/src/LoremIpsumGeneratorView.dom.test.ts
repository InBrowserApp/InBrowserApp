import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoremIpsumGeneratorView from './LoremIpsumGeneratorView.vue'

describe('LoremIpsumGeneratorView', () => {
  it('renders the generator and info sections', () => {
    const wrapper = mount(LoremIpsumGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          LoremIpsumGenerator: {
            template: '<div class="lorem-generator" />',
          },
          WhatIsLoremIpsum: {
            template: '<div class="what-is-lorem" />',
          },
        },
      },
    })

    expect(wrapper.find('.lorem-generator').exists()).toBe(true)
    expect(wrapper.find('.what-is-lorem').exists()).toBe(true)
  })
})
