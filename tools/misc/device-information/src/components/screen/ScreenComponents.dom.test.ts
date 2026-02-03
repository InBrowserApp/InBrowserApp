import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ScreenResolution from './ScreenResolution.vue'
import AvailableResolution from './AvailableResolution.vue'
import WindowSize from './WindowSize.vue'
import ViewportSize from './ViewportSize.vue'
import DevicePixelRatio from './DevicePixelRatio.vue'
import ColorDepth from './ColorDepth.vue'
import MultipleScreens from './MultipleScreens.vue'
import FpsInfo from './FpsInfo.vue'
import ScreenOrientation from './ScreenOrientation.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

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
    useScreenOrientation: () => ({ isSupported: true, orientation: ref('landscape-primary') }),
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
    expect(wrapper.text()).toContain('hdr')
  })

  it('renders multiple screens indicator', () => {
    const wrapper = mountWithStub(MultipleScreens)

    expect(wrapper.text()).toContain('yes')
  })

  it('renders fps info', () => {
    const wrapper = mountWithStub(FpsInfo)

    expect(wrapper.text()).toContain('60')
  })

  it('renders screen orientation', () => {
    const wrapper = mountWithStub(ScreenOrientation)

    expect(wrapper.text()).toContain('orientation-landscape-primary')
  })
})
