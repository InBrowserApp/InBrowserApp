import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPCIDRNormalizer from './IPCIDRNormalizer.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.text()).toContain('input.title')
    expect(wrapper.find('.result').exists()).toBe(false)

    wrapper.findComponent({ name: 'IPCIDRInput' }).vm.$emit('update:ipcidr', '192.168.0.1/24')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('result.title')
    expect(wrapper.find('.result').text()).toBe('192.168.0.1/24')
  })
})
