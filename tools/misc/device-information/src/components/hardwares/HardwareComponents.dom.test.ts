import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CpuCores from './CpuCores.vue'
import CpuArchitecture from './CpuArchitecture.vue'
import DeviceMemory from './DeviceMemory.vue'
import ConnectionType from './ConnectionType.vue'
import ConnectionSpeed from './ConnectionSpeed.vue'
import MaxTouchPoints from './MaxTouchPoints.vue'
import GpuVendor from './GpuVendor.vue'
import GpuRenderer from './GpuRenderer.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const InfoStatisticStub = defineComponent({
  name: 'InfoStatistic',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  template: '<div class="info-stat" :data-label="label">{{ value ?? "" }}</div>',
})

const mountWithStub = (component: Parameters<typeof mount>[0]) =>
  mount(component, {
    global: {
      stubs: {
        InfoStatistic: InfoStatisticStub,
      },
    },
  })

const createNavigator = (overrides: Record<string, unknown> = {}) => ({
  hardwareConcurrency: 8,
  deviceMemory: 16,
  maxTouchPoints: 5,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
  connection: {
    effectiveType: '4g',
    type: 'wifi',
    downlink: 25,
  },
  ...overrides,
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('hardware components', () => {
  it('reports cpu cores', () => {
    vi.stubGlobal('navigator', createNavigator({ hardwareConcurrency: 12 }))
    const wrapper = mountWithStub(CpuCores)

    expect(wrapper.text()).toContain('12')
  })

  it('reports cpu architecture from user agent', () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/115.0' }),
    )
    const wrapper = mountWithStub(CpuArchitecture)

    expect(wrapper.text()).toContain('x86_64')
  })

  it('reports device memory', () => {
    vi.stubGlobal('navigator', createNavigator({ deviceMemory: 8 }))
    const wrapper = mountWithStub(DeviceMemory)

    expect(wrapper.text()).toContain('8 GB')
  })

  it('reports connection type', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { effectiveType: '3g' } }))
    const wrapper = mountWithStub(ConnectionType)

    expect(wrapper.text()).toContain('3g')
  })

  it('reports connection speed', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { downlink: 12 } }))
    const wrapper = mountWithStub(ConnectionSpeed)

    expect(wrapper.text()).toContain('12 Mbps')
  })

  it('reports max touch points', () => {
    vi.stubGlobal('navigator', createNavigator({ maxTouchPoints: 10 }))
    const wrapper = mountWithStub(MaxTouchPoints)

    expect(wrapper.text()).toContain('10')
  })

  it('renders the gpu vendor label', () => {
    vi.stubGlobal('navigator', createNavigator())
    const wrapper = mountWithStub(GpuVendor)

    const stat = wrapper.find('.info-stat')
    expect(stat.attributes('data-label')).toBe('gpu-vendor')
  })

  it('renders the gpu renderer label', () => {
    vi.stubGlobal('navigator', createNavigator())
    const wrapper = mountWithStub(GpuRenderer)

    const stat = wrapper.find('.info-stat')
    expect(stat.attributes('data-label')).toBe('gpu-renderer')
  })
})
