import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IPRangeToCIDRView from './IPRangeToCIDRView.vue'

const IPRangeToCIDRStub = defineComponent({
  name: 'IPRangeToCIDR',
  template: '<div class="ip-range-to-cidr" />',
})

const WhatIsCIDRStub = defineComponent({
  name: 'WhatIsCIDR',
  template: '<div class="what-is-cidr" />',
})

describe('IPRangeToCIDRView', () => {
  it('renders the tool layout and sections', () => {
    const wrapper = mount(IPRangeToCIDRView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout" :data-tool="info.toolID"><slot /></div>',
          },
          IPRangeToCIDR: IPRangeToCIDRStub,
          WhatIsCIDR: WhatIsCIDRStub,
        },
      },
    })

    expect(wrapper.find('.layout').attributes('data-tool')).toBe('ip-range-to-cidr')
    expect(wrapper.find('.ip-range-to-cidr').exists()).toBe(true)
    expect(wrapper.find('.what-is-cidr').exists()).toBe(true)
  })
})
