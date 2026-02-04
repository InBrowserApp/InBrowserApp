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
  vi.restoreAllMocks()
})

describe('hardware components', () => {
  it('reports cpu cores', () => {
    vi.stubGlobal('navigator', createNavigator({ hardwareConcurrency: 12 }))
    const wrapper = mountWithStub(CpuCores)

    expect(wrapper.text()).toContain('12')
  })

  it('renders empty cpu cores when unavailable', () => {
    vi.stubGlobal('navigator', createNavigator({ hardwareConcurrency: 0 }))
    const wrapper = mountWithStub(CpuCores)

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it.each([
    ['ARM', 'Mozilla/5.0 (Linux; ARMv8) AppleWebKit/537.36'],
    ['x86_64', 'Mozilla/5.0 (X11; Linux x86_64) Chrome/115.0'],
    ['x86', 'Mozilla/5.0 (X11; Linux x86) Gecko/20100101'],
    ['AArch64', 'Mozilla/5.0 (Linux; aarch64)'],
  ])('reports cpu architecture %s from user agent', (expected, userAgent) => {
    vi.stubGlobal('navigator', createNavigator({ userAgent }))
    const wrapper = mountWithStub(CpuArchitecture)

    expect(wrapper.text()).toContain(expected)
  })

  it('prefers cpu architecture from user agent data', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        userAgentData: {
          platform: 'Linux',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => ({ architecture: 'arm64' }),
        },
      }),
    )

    const wrapper = mountWithStub(CpuArchitecture)
    await flushPromises()

    expect(wrapper.text()).toContain('arm64')
  })

  it('returns empty cpu architecture when unknown', () => {
    vi.stubGlobal('navigator', createNavigator({ userAgent: 'UnknownUA/1.0' }))
    const wrapper = mountWithStub(CpuArchitecture)

    expect(wrapper.find('.info-stat').text()).toBe('')
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

  it('renders empty cpu bitness when missing', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'Windows',
          brands: [],
          mobile: false,
          getHighEntropyValues: async () => ({}),
        },
      }),
    )

    const wrapper = mountWithStub(CpuBitness)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('reports device memory', () => {
    vi.stubGlobal('navigator', createNavigator({ deviceMemory: 8 }))
    const wrapper = mountWithStub(DeviceMemory)

    expect(wrapper.text()).toContain('8 GB')
  })

  it('renders empty device memory when missing', () => {
    vi.stubGlobal('navigator', createNavigator({ deviceMemory: undefined }))
    const wrapper = mountWithStub(DeviceMemory)

    expect(wrapper.find('.info-stat').text()).toBe('')
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

  it('returns empty storage quota when storage is missing', async () => {
    vi.stubGlobal('navigator', createNavigator({ storage: undefined }))
    const wrapper = mountWithStub(StorageQuota)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('handles storage estimate errors gracefully', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        storage: {
          estimate: async () => {
            throw new Error('fail')
          },
        },
      }),
    )

    const wrapper = mountWithStub(StorageQuota)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('reports connection type', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { effectiveType: '3g' } }))
    const wrapper = mountWithStub(ConnectionType)

    expect(wrapper.text()).toContain('3g')
  })

  it('falls back to connection type when effective type is missing', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { type: 'ethernet' } }))
    const wrapper = mountWithStub(ConnectionType)

    expect(wrapper.text()).toContain('ethernet')
  })

  it('reads connection type from mozConnection', () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        connection: undefined,
        mozConnection: { effectiveType: '2g' },
      }),
    )
    const wrapper = mountWithStub(ConnectionType)

    expect(wrapper.text()).toContain('2g')
  })

  it('returns empty connection type when unavailable', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: undefined }))
    const wrapper = mountWithStub(ConnectionType)

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('reports connection speed', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { downlink: 12 } }))
    const wrapper = mountWithStub(ConnectionSpeed)

    expect(wrapper.text()).toContain('12 Mbps')
  })

  it('reads connection speed from webkitConnection', () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        connection: undefined,
        webkitConnection: { downlink: 8 },
      }),
    )
    const wrapper = mountWithStub(ConnectionSpeed)

    expect(wrapper.text()).toContain('8 Mbps')
  })

  it('returns empty connection speed when downlink is missing', () => {
    vi.stubGlobal('navigator', createNavigator({ connection: { downlink: 0 } }))
    const wrapper = mountWithStub(ConnectionSpeed)

    expect(wrapper.find('.info-stat').text()).toBe('')
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

  it('renders empty device model when user agent data errors', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          platform: 'Android',
          brands: [],
          mobile: true,
          getHighEntropyValues: async () => {
            throw new Error('fail')
          },
        },
      }),
    )

    const wrapper = mountWithStub(DeviceModel)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
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

  it('renders empty form factor when user agent data errors', async () => {
    vi.stubGlobal(
      'navigator',
      createNavigator({
        userAgentData: {
          getHighEntropyValues: async () => {
            throw new Error('fail')
          },
        },
      }),
    )

    const wrapper = mountWithStub(FormFactor)
    await flushPromises()

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('renders the gpu vendor label', () => {
    vi.stubGlobal('navigator', createNavigator())
    const wrapper = mountWithStub(GpuVendor)

    const stat = wrapper.find('.info-stat')
    expect(stat.attributes('data-label')).toBe('gpu-vendor')
  })

  it('reports gpu vendor when debug info is available', () => {
    const debugInfo = { UNMASKED_RENDERER_WEBGL: 1, UNMASKED_VENDOR_WEBGL: 2 }
    const gl = {
      getExtension: () => debugInfo,
      getParameter: (param: number) => (param === 2 ? 'Test Vendor' : 'Test Renderer'),
    }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          const canvas = originalCreateElement('canvas') as HTMLCanvasElement
          const getContextMock = ((contextId: string) =>
            contextId === 'webgl' || contextId === 'experimental-webgl'
              ? (gl as unknown as WebGLRenderingContext)
              : null) as HTMLCanvasElement['getContext']
          canvas.getContext = getContextMock
          return canvas
        }
        return originalCreateElement(tagName)
      })

    const wrapper = mountWithStub(GpuVendor)

    expect(wrapper.text()).toContain('Test Vendor')
    createElementSpy.mockRestore()
  })

  it('renders the gpu renderer label', () => {
    vi.stubGlobal('navigator', createNavigator())
    const wrapper = mountWithStub(GpuRenderer)

    const stat = wrapper.find('.info-stat')
    expect(stat.attributes('data-label')).toBe('gpu-renderer')
  })

  it('reports gpu renderer when debug info is available', () => {
    const debugInfo = { UNMASKED_RENDERER_WEBGL: 11, UNMASKED_VENDOR_WEBGL: 12 }
    const gl = {
      getExtension: () => debugInfo,
      getParameter: (param: number) => (param === 11 ? 'Test Renderer' : 'Test Vendor'),
    }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          const canvas = originalCreateElement('canvas') as HTMLCanvasElement
          const getContextMock = ((contextId: string) =>
            contextId === 'webgl' || contextId === 'experimental-webgl'
              ? (gl as unknown as WebGLRenderingContext)
              : null) as HTMLCanvasElement['getContext']
          canvas.getContext = getContextMock
          return canvas
        }
        return originalCreateElement(tagName)
      })

    const wrapper = mountWithStub(GpuRenderer)

    expect(wrapper.text()).toContain('Test Renderer')
    createElementSpy.mockRestore()
  })
})
