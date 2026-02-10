import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import IPv6LinkLocalResult from './IPv6LinkLocalResult.vue'

const macToIPv6Mock = vi.fn<(mac: string) => string>(() => 'fe80::abcd')
const copySpy = vi.fn()

vi.mock('@utils/mac-address', () => ({
  macAddressToIPv6LinkLocalAddress: (mac: string) => macToIPv6Mock(mac),
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: defineComponent({
    name: 'CopyToClipboardTooltip',
    props: {
      content: {
        type: String,
        default: '',
      },
    },
    setup(_, { slots }) {
      return () => h('span', { class: 'copy-tooltip' }, slots.default?.({ copy: copySpy }))
    },
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NText,
  }
})

describe('IPv6LinkLocalResult', () => {
  it('renders the IPv6 link-local address', () => {
    const wrapper = mount(IPv6LinkLocalResult, {
      props: {
        mac: 'aa:bb:cc:dd:ee:ff',
        networkInterface: '',
      },
    })

    expect(macToIPv6Mock).toHaveBeenCalledWith('aa:bb:cc:dd:ee:ff')
    expect(wrapper.text()).toContain('fe80::abcd')
  })

  it('appends the network interface suffix and supports copy', async () => {
    const wrapper = mount(IPv6LinkLocalResult, {
      props: {
        mac: 'aa:bb:cc:dd:ee:ff',
        networkInterface: 'eth0',
      },
    })

    expect(wrapper.text()).toContain('fe80::abcd%eth0')

    await wrapper.find('.n-text').trigger('click')
    expect(copySpy).toHaveBeenCalled()
  })
})
