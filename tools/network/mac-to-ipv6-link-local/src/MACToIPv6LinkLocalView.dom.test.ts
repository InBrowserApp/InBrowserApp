import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MACToIPv6LinkLocalView from './MACToIPv6LinkLocalView.vue'

describe('MACToIPv6LinkLocalView', () => {
  it('renders the tool layout and sections', () => {
    const wrapper = mount(MACToIPv6LinkLocalView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          MACToIPv6LinkLocal: {
            template: '<div class="mac-tool" />',
          },
          WhatIsIPv6LinkLocal: {
            template: '<div class="what-is" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.mac-tool').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
