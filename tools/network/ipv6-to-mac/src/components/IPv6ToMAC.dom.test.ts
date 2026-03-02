import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPv6ToMAC from './IPv6ToMAC.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  IPv6Input: {
    name: 'IPv6Input',
    emits: ['update:ipv6'],
    template: '<div class="ipv6-input" />',
  },
  MacResult: {
    name: 'MacResult',
    props: ['ipv6'],
    template: '<div class="mac-result" :data-ipv6="ipv6" />',
  },
}

describe('IPv6ToMAC', () => {
  it('shows the mac result after ipv6 updates', async () => {
    const wrapper = mount(IPv6ToMAC, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('IPv6 Address')
    expect(wrapper.find('.mac-result').exists()).toBe(false)

    wrapper.findComponent({ name: 'IPv6Input' }).vm.$emit('update:ipv6', 'fe80::1')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('MAC Address')
    expect(wrapper.find('.mac-result').attributes('data-ipv6')).toBe('fe80::1')
  })
})
