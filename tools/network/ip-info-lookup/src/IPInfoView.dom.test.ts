import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive } from 'vue'
import IPInfoView from './IPInfoView.vue'

const routeParams = reactive({ ipdomain: '8.8.8.8' })
const isIPMock = vi.fn()
const getDomainIPsMock = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: routeParams }),
}))

vi.mock('is-ip', () => ({
  isIP: (...args: unknown[]) => isIPMock(...args),
}))

vi.mock('@utils/ip', () => ({
  getDomainIPs: (...args: unknown[]) => getDomainIPsMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect } = await import('vue')

  return {
    ...actual,
    computedAsync: (getter: () => Promise<unknown>) => {
      const state = ref<unknown>(undefined)
      watchEffect(() => {
        state.value = undefined
        void Promise.resolve(getter()).then((value) => {
          state.value = value
        })
      })
      return state
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NResult = defineComponent({
    name: 'NResult',
    props: {
      status: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    template: '<div class="result" :data-status="status" :data-title="title" />',
  })

  const NCollapse = defineComponent({
    name: 'NCollapse',
    props: {
      expandedNames: {
        type: Array,
        default: () => [],
      },
      displayDirective: {
        type: String,
        default: '',
      },
    },
    emits: ['update:expandedNames'],
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
    template:
      '<div class="collapse-item" :data-title="title" :data-name="name"><slot name="header-extra" /><slot /></div>',
  })

  return {
    NResult,
    NCollapse,
    NCollapseItem,
  }
})

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  setup(_, { slots }) {
    return () =>
      h('div', { class: 'layout' }, [slots.title?.({ t: (key: string) => key }), slots.default?.()])
  },
})

const stubs = {
  ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
  ToolTitle: {
    template: '<h1 class="tool-title"><slot /></h1>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  IPInfo: {
    props: ['ip'],
    template: '<div class="ip-info" :data-ip="ip" />',
  },
  IPVersionTag: {
    props: ['ip'],
    template: '<span class="ip-tag" :data-ip="ip" />',
  },
  IPAddressSearchInput: {
    template: '<div class="ip-search" />',
  },
  HowDoWeGetIPInfo: {
    template: '<div class="how-info" />',
  },
}

describe('IPInfoView', () => {
  beforeEach(() => {
    isIPMock.mockReset()
    getDomainIPsMock.mockReset()
  })

  it('renders results for direct IPs', async () => {
    routeParams.ipdomain = '8.8.8.8'
    isIPMock.mockReturnValue(true)

    const wrapper = mount(IPInfoView, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(getDomainIPsMock).not.toHaveBeenCalled()
    const items = wrapper.findAll('.collapse-item')
    expect(items).toHaveLength(1)
    expect(wrapper.find('.ip-info').attributes('data-ip')).toBe('8.8.8.8')
    expect(wrapper.find('.ip-tag').attributes('data-ip')).toBe('8.8.8.8')

    const collapse = wrapper.findComponent({ name: 'NCollapse' })
    collapse.vm.$emit('update:expandedNames', ['8.8.8.8'])
    await flushPromises()
  })

  it('renders collapsible results when domain lookup succeeds', async () => {
    routeParams.ipdomain = 'example.com'
    isIPMock.mockReturnValue(false)
    getDomainIPsMock.mockResolvedValue(['1.1.1.1', '8.8.8.8'])

    const wrapper = mount(IPInfoView, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(getDomainIPsMock).toHaveBeenCalledWith('example.com')
    expect(wrapper.findAll('.collapse-item')).toHaveLength(2)
    expect(wrapper.findAll('.collapse-item')[0]?.attributes('data-title')).toBe('1.1.1.1')

    const collapse = wrapper.findComponent({ name: 'NCollapse' })
    collapse.vm.$emit('update:expandedNames', ['1.1.1.1'])
    await flushPromises()

    expect(wrapper.find('.result').exists()).toBe(false)
  })

  it('resets expanded names while a domain lookup is pending', async () => {
    routeParams.ipdomain = 'example.com'
    isIPMock.mockReturnValue(false)
    getDomainIPsMock.mockResolvedValueOnce(['1.1.1.1'])

    const wrapper = mount(IPInfoView, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const collapse = wrapper.findComponent({ name: 'NCollapse' })
    collapse.vm.$emit('update:expandedNames', ['1.1.1.1'])
    await flushPromises()

    getDomainIPsMock.mockReturnValueOnce(new Promise<string[]>(() => {}))
    routeParams.ipdomain = 'pending.example'
    await nextTick()
    await flushPromises()

    expect(getDomainIPsMock).toHaveBeenCalledWith('pending.example')
    expect(wrapper.findAll('.collapse-item')).toHaveLength(0)
    expect(wrapper.find('.ip-info').attributes('data-ip')).toBeUndefined()
  })

  it('shows an error when domain lookup fails', async () => {
    routeParams.ipdomain = 'example.com'
    isIPMock.mockReturnValue(false)
    getDomainIPsMock.mockRejectedValue(new Error('failed'))

    const wrapper = mount(IPInfoView, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(getDomainIPsMock).toHaveBeenCalledWith('example.com')
    expect(wrapper.find('.result').attributes('data-title')).toBe("Failed to get example.com's IP")
    expect(wrapper.findAll('.collapse-item')).toHaveLength(0)
  })
})
