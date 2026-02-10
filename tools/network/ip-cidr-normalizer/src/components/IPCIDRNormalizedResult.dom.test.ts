import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPCIDRNormalizedResult from './IPCIDRNormalizedResult.vue'

vi.mock('cidr-tools', () => ({
  normalizeCidr: (value: string) => `normalized:${value}`,
}))

const stubs = {
  CopyToClipboardTooltip: {
    props: ['content'],
    template: '<div class="clipboard"><slot :copy="() => {}" /></div>',
  },
  NText: {
    template: '<span class="text"><slot /></span>',
  },
}

describe('IPCIDRNormalizedResult', () => {
  it('renders the normalized output', () => {
    const wrapper = mount(IPCIDRNormalizedResult, {
      props: {
        ipcidr: '192.168.0.1/24',
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('normalized:192.168.0.1/24')
  })
})
