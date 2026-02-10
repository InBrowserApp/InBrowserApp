import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import IPRangeToCIDR from './IPRangeToCIDR.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.text()).toContain('ipRange')
    expect(wrapper.find('.cidr-result').exists()).toBe(false)

    wrapper.findComponent(IPRangeInputStub).vm.$emit('update:ip-range', ['10.0.0.1', '10.0.0.2'])
    await nextTick()

    expect(wrapper.text()).toContain('cidrResult')
    expect(wrapper.find('.cidr-result').attributes('data-range')).toBe('10.0.0.1,10.0.0.2')
  })
})
