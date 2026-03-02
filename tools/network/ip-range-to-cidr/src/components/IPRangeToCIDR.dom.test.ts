import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import IPRangeToCIDR from './IPRangeToCIDR.vue'

const IPRangeInputStub = defineComponent({
  name: 'IPRangeInput',
  emits: ['update:ip-range'],
  template: '<div class="ip-range-input" />',
})

const IPRangeCIDRResultStub = defineComponent({
  name: 'IPRangeCIDRResult',
  props: {
    ipRange: {
      type: Array,
      default: () => ['', ''],
    },
  },
  template: '<div class="cidr-result" :data-range="ipRange.join(\',\')" />',
})

describe('IPRangeToCIDR', () => {
  it('shows CIDR results after a valid range is provided', async () => {
    const wrapper = mount(IPRangeToCIDR, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          IPRangeInput: IPRangeInputStub,
          IPRangeCIDRResult: IPRangeCIDRResultStub,
        },
      },
    })

    expect(wrapper.text()).toContain('IP Range')
    expect(wrapper.find('.cidr-result').exists()).toBe(false)

    wrapper.findComponent(IPRangeInputStub).vm.$emit('update:ip-range', ['10.0.0.1', '10.0.0.2'])
    await nextTick()

    expect(wrapper.text()).toContain('CIDR Result')
    expect(wrapper.find('.cidr-result').attributes('data-range')).toBe('10.0.0.1,10.0.0.2')
  })
})
