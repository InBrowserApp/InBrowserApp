import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPCIDRNormalizer from './IPCIDRNormalizer.vue'

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  IPCIDRInput: {
    name: 'IPCIDRInput',
    emits: ['update:ipcidr'],
    template: '<div class="ipcidr-input" />',
  },
  IPCIDRNormalizedResult: {
    name: 'IPCIDRNormalizedResult',
    props: ['ipcidr'],
    template: '<div class="result">{{ ipcidr }}</div>',
  },
}

describe('IPCIDRNormalizer', () => {
  it('shows the result section after a valid input update', async () => {
    const wrapper = mount(IPCIDRNormalizer, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('IP/CIDR')
    expect(wrapper.find('.result').exists()).toBe(false)

    wrapper.findComponent({ name: 'IPCIDRInput' }).vm.$emit('update:ipcidr', '192.168.0.1/24')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Normalized Result')
    expect(wrapper.find('.result').text()).toBe('192.168.0.1/24')
  })
})
