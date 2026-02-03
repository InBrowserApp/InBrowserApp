import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CpuCores from './CpuCores.vue'
import CpuArchitecture from './CpuArchitecture.vue'
import CpuBitness from './CpuBitness.vue'
import DeviceMemory from './DeviceMemory.vue'
import DeviceModel from './DeviceModel.vue'
import FormFactor from './FormFactor.vue'
import ConnectionType from './ConnectionType.vue'
import ConnectionSpeed from './ConnectionSpeed.vue'
import MaxTouchPoints from './MaxTouchPoints.vue'
import GpuVendor from './GpuVendor.vue'
import GpuRenderer from './GpuRenderer.vue'
import StorageQuota from './StorageQuota.vue'

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

  it('reports cpu bitness from user agent data', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'Windows',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => ({ bitness: '64' }),
        },
      }),
    )

    const wrapper = mountWithStub(CpuBitness)
    await flushPromises()

    expect(wrapper.text()).toContain('64-bit')
  })

  it('reports device memory', () => {
    vi.stubGlobal('navigator', createNavigator({ deviceMemory: 8 }))
    const wrapper = mountWithStub(DeviceMemory)

    expect(wrapper.text()).toContain('8 GB')
  })

  it('reports storage quota when available', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        storage: {
          estimate: async () => ({ quota: 1024 * 1024 * 1024, usage: 1024 }),
        },
      }),
    )

    const wrapper = mountWithStub(StorageQuota)
    await flushPromises()

    expect(wrapper.text()).toContain('GB')
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

  it('reports device model from user agent data', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'Android',
          brands: [],
          mobile: true,
          getHighEntropyValues: async () => ({ model: 'Pixel' }),
        },
      }),
    )

    const wrapper = mountWithStub(DeviceModel)
    await flushPromises()

    expect(wrapper.text()).toContain('Pixel')
  })

  it('reports form factor from user agent data', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          getHighEntropyValues: async () => ({ formFactor: 'tablet' }),
        },
      }),
    )

    const wrapper = mountWithStub(FormFactor)
    await flushPromises()

    expect(wrapper.text()).toContain('tablet')
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
