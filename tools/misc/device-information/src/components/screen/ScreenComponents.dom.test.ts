import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import ScreenResolution from './ScreenResolution.vue'
import AvailableResolution from './AvailableResolution.vue'
import WindowSize from './WindowSize.vue'
import ViewportSize from './ViewportSize.vue'
import DevicePixelRatio from './DevicePixelRatio.vue'
import ColorDepth from './ColorDepth.vue'
import MultipleScreens from './MultipleScreens.vue'
import FpsInfo from './FpsInfo.vue'
import ScreenOrientation from './ScreenOrientation.vue'

const orientationRef = ref('landscape-primary')
let orientationSupported = true

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useWindowSize: (options?: { type?: 'inner' | 'outer' }) => {
      if (options?.type === 'outer') {
        return { width: ref(1280), height: ref(720) }
      }

      return { width: ref(1024), height: ref(768) }
    },
    useDevicePixelRatio: () => ({ pixelRatio: ref(2) }),
    useFps: () => ref(60),
    useScreenOrientation: () => ({
      isSupported: orientationSupported,
      orientation: orientationRef,
    }),
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

beforeEach(() => {
  orientationRef.value = 'landscape-primary'
  orientationSupported = true
  vi.stubGlobal('screen', {
    width: 1920,
    height: 1080,
    availWidth: 1680,
    availHeight: 1050,
    colorDepth: 30,
    isExtended: true,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('screen components', () => {
  it('renders screen resolution', () => {
    const wrapper = mountWithStub(ScreenResolution)

    expect(wrapper.text()).toContain('1920 × 1080')
  })

  it('renders available resolution', () => {
    const wrapper = mountWithStub(AvailableResolution)

    expect(wrapper.text()).toContain('1680 × 1050')
  })

  it('renders window size from outer dimensions', () => {
    const wrapper = mountWithStub(WindowSize)

    expect(wrapper.text()).toContain('1280 × 720')
  })

  it('renders viewport size from inner dimensions', () => {
    const wrapper = mountWithStub(ViewportSize)

    expect(wrapper.text()).toContain('1024 × 768')
  })

  it('renders device pixel ratio', () => {
    const wrapper = mountWithStub(DevicePixelRatio)

    expect(wrapper.text()).toContain('2')
  })

  it('renders HDR color depth when above 24 bits', () => {
    const wrapper = mountWithStub(ColorDepth)

    expect(wrapper.text()).toContain('30 bits')
    expect(wrapper.text()).toContain('HDR')
  })

  it('renders SDR color depth at or below 24 bits', () => {
    vi.stubGlobal('screen', {
      width: 1920,
      height: 1080,
      availWidth: 1680,
      availHeight: 1050,
      colorDepth: 24,
      isExtended: true,
    })
    const wrapper = mountWithStub(ColorDepth)

    expect(wrapper.text()).toContain('24 bits')
    expect(wrapper.text()).not.toContain('HDR')
  })

  it('renders multiple screens indicator', () => {
    const wrapper = mountWithStub(MultipleScreens)

    expect(wrapper.text()).toContain('Yes')
  })

  it('renders single screen indicator', () => {
    vi.stubGlobal('screen', {
      width: 1920,
      height: 1080,
      availWidth: 1680,
      availHeight: 1050,
      colorDepth: 30,
      isExtended: false,
    })
    const wrapper = mountWithStub(MultipleScreens)

    expect(wrapper.text()).toContain('No')
  })

  it('hides multiple screens indicator when unsupported', () => {
    vi.stubGlobal('screen', {
      width: 1920,
      height: 1080,
      availWidth: 1680,
      availHeight: 1050,
      colorDepth: 30,
    })
    const wrapper = mountWithStub(MultipleScreens)

    expect(wrapper.find('.info-stat').exists()).toBe(false)
  })

  it('renders fps info', () => {
    const wrapper = mountWithStub(FpsInfo)

    expect(wrapper.text()).toContain('60')
  })

  it.each([
    ['portrait-primary', 'Portrait Primary'],
    ['portrait-secondary', 'Portrait Secondary'],
    ['landscape-primary', 'Landscape Primary'],
    ['landscape-secondary', 'Landscape Secondary'],
  ])('renders screen orientation %s', (orientation, expected) => {
    orientationRef.value = orientation
    const wrapper = mountWithStub(ScreenOrientation)

    expect(wrapper.text()).toContain(expected)
  })

  it('renders empty orientation for unknown values', () => {
    orientationRef.value = 'diagonal'
    const wrapper = mountWithStub(ScreenOrientation)

    expect(wrapper.find('.info-stat').text()).toBe('')
  })

  it('hides screen orientation when unsupported', () => {
    orientationSupported = false
    const wrapper = mountWithStub(ScreenOrientation)

    expect(wrapper.find('.info-stat').exists()).toBe(false)
  })
})
