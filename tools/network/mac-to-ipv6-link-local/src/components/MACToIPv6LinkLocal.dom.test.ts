import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import MACToIPv6LinkLocal from './MACToIPv6LinkLocal.vue'

vi.mock('@utils/mac-address', () => ({
  randomMACAddress: () => '',
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const MACInputStub = defineComponent({
  name: 'MACInput',
  props: ['mac', 'networkInterface'],
  emits: ['update:mac', 'update:network-interface'],
  template: '<div class="mac-input" />',
})

const IPv6LinkLocalResultStub = defineComponent({
  name: 'IPv6LinkLocalResult',
  props: ['mac', 'networkInterface'],
  template: '<div class="ipv6-result" />',
})

describe('MACToIPv6LinkLocal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders result when mac is provided', async () => {
    const wrapper = mount(MACToIPv6LinkLocal, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2 class="section-header"><slot /></h2>',
          },
          MACInput: MACInputStub,
          IPv6LinkLocalResult: IPv6LinkLocalResultStub,
        },
      },
    })

    expect(wrapper.text()).toContain('macAddress')
    expect(wrapper.find('.ipv6-result').exists()).toBe(false)

    const inputStub = wrapper.findComponent(MACInputStub)

    await inputStub.vm.$emit('update:network-interface', 'eth0')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.ipv6-result').exists()).toBe(false)

    await inputStub.vm.$emit('update:mac', 'aa:bb:cc:dd:ee:ff')
    await wrapper.vm.$nextTick()

    const result = wrapper.findComponent(IPv6LinkLocalResultStub)
    expect(wrapper.text()).toContain('ipv6LinkLocalAddress')
    expect(result.exists()).toBe(true)
    expect(result.props('networkInterface')).toBe('eth0')
  })
})
