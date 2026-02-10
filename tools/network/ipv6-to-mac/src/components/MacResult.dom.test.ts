import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MacResult from './MacResult.vue'

vi.mock('@utils/mac-address', () => ({
  ipv6AddressToMacAddress: () => 'aa:bb:cc:dd:ee:ff',
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

describe('MacResult', () => {
  it('renders the converted mac address', () => {
    const wrapper = mount(MacResult, {
      props: {
        ipv6: 'fe80::1',
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('aa:bb:cc:dd:ee:ff')
  })
})
