import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CIDRMergerExcluderView from './CIDRMergerExcluderView.vue'

describe('CIDRMergerExcluderView', () => {
  it('renders the tool content and info section', () => {
    const wrapper = mount(CIDRMergerExcluderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          CIDRMergerExcluder: {
            template: '<div class="cidr-tool" />',
          },
          WhatIsCIDR: {
            template: '<div class="cidr-info" />',
          },
        },
      },
    })

    expect(wrapper.find('.cidr-tool').exists()).toBe(true)
    expect(wrapper.find('.cidr-info').exists()).toBe(true)
  })
})
