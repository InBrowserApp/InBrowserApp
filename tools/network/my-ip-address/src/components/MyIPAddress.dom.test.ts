import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import MyIPAddress from './MyIPAddress.vue'

const { getMyIPv4Mock, getMyIPv6Mock, getIPsMock } = vi.hoisted(() => ({
  getMyIPv4Mock: vi.fn(),
  getMyIPv6Mock: vi.fn(),
  getIPsMock: vi.fn(),
}))

vi.mock('@utils/ip', () => ({
  getMyIPv4: (...args: unknown[]) => getMyIPv4Mock(...args),
  getMyIPv6: (...args: unknown[]) => getMyIPv6Mock(...args),
}))

vi.mock('webrtc-ips', () => ({
  getIPs: (...args: unknown[]) => getIPsMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect } = await import('vue')

  return {
    ...actual,
    computedAsync: (getter: () => Promise<unknown>) => {
      const state = ref<unknown>(undefined)
      watchEffect(() => {
        void Promise.resolve(getter()).then((value) => {
          state.value = value
        })
      })
      return state
    },
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NCollapse = defineComponent({
    name: 'NCollapse',
    props: {
      displayDirective: {
        type: String,
        default: '',
      },
    },
    template: '<div class="collapse"><slot /></div>',
  })

  const NCollapseItem = defineComponent({
    name: 'NCollapseItem',
    props: {
      title: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
    },
    template: '<div class="collapse-item" :data-title="title" :data-name="name"><slot /></div>',
  })

  return {
    NCollapse,
    NCollapseItem,
  }
})

vi.mock('@shared/ui/domain/ip', async () => {
  const { defineComponent } = await import('vue')

  return {
    IPInfo: defineComponent({
      name: 'IPInfo',
      props: {
        ip: {
          type: String,
          default: '',
        },
      },
      template: '<div class="ip-info" :data-ip="ip" />',
    }),
  }
})

const MyIPLoadingNullStub = defineComponent({
  name: 'MyIPLoadingNull',
  props: ['ip'],
  template: '<div class="loading-null" :data-ip="String(ip)" />',
})

const stubs = {
  ToolSectionHeader: {
    template: '<h3 class="section-header"><slot /></h3>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  MyIPLoadingNull: MyIPLoadingNullStub,
  HowToGetYourIPAddress: {
    template: '<div class="how-to" />',
  },
}

beforeEach(() => {
  getMyIPv4Mock.mockReset()
  getMyIPv6Mock.mockReset()
  getIPsMock.mockReset()
})

describe('MyIPAddress', () => {
  it('renders IPv4/IPv6 details and WebRTC leak addresses', async () => {
    getMyIPv4Mock.mockResolvedValue('203.0.113.10')
    getMyIPv6Mock.mockResolvedValue('2001:db8::1')
    getIPsMock.mockResolvedValue([
      { address: '10.0.0.1', v6: false },
      { address: 'fe80::1', v6: true },
    ])

    const wrapper = mount(MyIPAddress, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    await flushPromises()

    const items = wrapper.findAll('.collapse-item')
    const titles = items.map((item) => item.attributes('data-title'))
    expect(titles).toEqual(
      expect.arrayContaining(['203.0.113.10', '2001:db8::1', '10.0.0.1', 'fe80::1']),
    )
    expect(wrapper.findAll('.ip-info')).toHaveLength(4)
    expect(wrapper.findAll('.loading-null')).toHaveLength(0)
    expect(wrapper.text()).toContain('webrtc-leak')
  })

  it('shows loading fallbacks when address lookups fail', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getMyIPv4Mock.mockRejectedValue(new Error('fail'))
    getMyIPv6Mock.mockRejectedValue(new Error('fail'))
    getIPsMock.mockResolvedValue([])

    const wrapper = mount(MyIPAddress, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    await flushPromises()

    expect(wrapper.findAll('.loading-null')).toHaveLength(2)
    expect(wrapper.findAll('.collapse-item')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('webrtc-leak')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
