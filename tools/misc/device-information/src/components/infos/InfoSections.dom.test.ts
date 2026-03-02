import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BrowserInfo from './BrowserInfo.vue'
import HardwareInfo from './HardwareInfo.vue'
import ScreenInfo from './ScreenInfo.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    props: {
      level: {
        type: [String, Number],
        default: '2',
      },
    },
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

const InfosGridStub = {
  name: 'InfosGrid',
  template: '<div class="infos-grid"><slot /></div>',
}

const createStubs = (names: string[]) =>
  names.reduce<Record<string, boolean>>((acc, name) => {
    acc[name] = true
    return acc
  }, {})

const browserStubs = createStubs([
  'BrowserName',
  'PrimaryLanguage',
  'BrowserLanguages',
  'Architecture',
  'PlatformInfo',
  'TimezoneInfo',
  'CookieEnabled',
  'UserAgent',
])

const hardwareStubs = createStubs([
  'CpuCores',
  'CpuArchitecture',
  'CpuBitness',
  'DeviceMemory',
  'StorageQuota',
  'ConnectionType',
  'ConnectionSpeed',
  'MaxTouchPoints',
  'DeviceModel',
  'FormFactor',
  'GpuVendor',
  'GpuRenderer',
])

const screenStubs = createStubs([
  'ScreenResolution',
  'AvailableResolution',
  'WindowSize',
  'ViewportSize',
  'ColorDepth',
  'DevicePixelRatio',
  'ScreenOrientation',
  'FpsInfo',
  'MultipleScreens',
])

describe('info sections', () => {
  it('renders browser info with child components', () => {
    const wrapper = mount(BrowserInfo, {
      global: {
        stubs: {
          InfosGrid: InfosGridStub,
          ...browserStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('Browser Information')
    expect(wrapper.find('browser-name-stub').exists()).toBe(true)
  })

  it('renders hardware info with child components', () => {
    const wrapper = mount(HardwareInfo, {
      global: {
        stubs: {
          InfosGrid: InfosGridStub,
          ...hardwareStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('Hardware Information')
    expect(wrapper.find('cpu-cores-stub').exists()).toBe(true)
  })

  it('renders screen info with child components', () => {
    const wrapper = mount(ScreenInfo, {
      global: {
        stubs: {
          InfosGrid: InfosGridStub,
          ...screenStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('Screen Information')
    expect(wrapper.find('screen-resolution-stub').exists()).toBe(true)
  })
})
