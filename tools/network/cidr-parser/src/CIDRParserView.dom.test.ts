import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CIDRParserView from './CIDRParserView.vue'

const CIDRParserStub = defineComponent({
  name: 'CIDRParser',
  template: '<div class="cidr-parser" />',
})

const WhatIsCIDRStub = defineComponent({
  name: 'WhatIsCIDR',
  template: '<div class="what-is-cidr" />',
})

describe('CIDRParserView', () => {
  it('renders the tool layout and sections', () => {
    const wrapper = mount(CIDRParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout" :data-tool="info.toolID"><slot /></div>',
          },
          CIDRParser: CIDRParserStub,
          WhatIsCIDR: WhatIsCIDRStub,
        },
      },
    })

    expect(wrapper.find('.layout').attributes('data-tool')).toBe('cidr-parser')
    expect(wrapper.find('.cidr-parser').exists()).toBe(true)
    expect(wrapper.find('.what-is-cidr').exists()).toBe(true)
  })
})
