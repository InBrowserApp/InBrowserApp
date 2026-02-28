import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { DesktopBrowserOptions } from '../utils/favicon-generator/desktop-browser'
import type { iOSWebClipOptions } from '../utils/favicon-generator/ios-web-clip'
import type { PWAOptions } from '../utils/favicon-generator/pwa'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NCheckbox = defineComponent({
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template:
      '<input class="n-checkbox" type="checkbox" :checked="checked" @change="$emit(\'update:checked\', $event.target.checked)" />',
  })

  const NColorPicker = defineComponent({
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-color-picker" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSlider = defineComponent({
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-slider" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NCollapseTransition = defineComponent({
    props: {
      show: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div v-if="show" class="n-collapse-transition"><slot /></div>',
  })

  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  const NTabPane = defineComponent({
    props: {
      name: {
        type: String,
        default: '',
      },
      tab: {
        type: String,
        default: '',
      },
    },
    template: '<section class="n-tab-pane" :data-name="name" :data-tab="tab"><slot /></section>',
  })

  return {
    NCheckbox,
    NColorPicker,
    NSlider,
    NCollapseTransition,
    NFormItem: Base,
    NP: Base,
    NTabs: Base,
    NTabPane,
  }
})

import DesktopBrowserSettings from './desktop-browser/DesktopBrowserSettings.vue'
import DesktopBrowserSettingsDisplay from './desktop-browser/DesktopBrowserSettingsDisplay.vue'
import IOSWebClipSettings from './ios-web-clip/iOSWebClipSettings.vue'
import IOSWebClipSettingsDisplay from './ios-web-clip/iOSWebClipSettingsDisplay.vue'
import PWASettings from './pwa/any/PWASettings.vue'
import PWASettingsDisplay from './pwa/any/PWASettingsDisplay.vue'
import PWAMaskableSettings from './pwa/maskable/PWAMaskableSettings.vue'
import PWAMaskableSettingsDisplay from './pwa/maskable/PWAMaskableSettingsDisplay.vue'

const createDesktopOptions = (
  overrides: Partial<DesktopBrowserOptions> = {},
): DesktopBrowserOptions => ({
  original: false,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 4,
  margin: 8,
  ...overrides,
})

const createIOSOptions = (overrides: Partial<iOSWebClipOptions> = {}): iOSWebClipOptions => ({
  backgroundColor: '#ffffff',
  margin: 12,
  ...overrides,
})

const createPWAOptions = (overrides: Partial<PWAOptions> = {}): PWAOptions => ({
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 10,
  maskable: true,
  maskableBackgroundColor: '#ffffff',
  maskableMargin: 20,
  margin: 14,
  ...overrides,
})

const modelStub = (className: string) =>
  defineComponent({
    props: {
      options: {
        type: Object,
        required: true,
      },
    },
    template: `<div class="${className}" :data-margin="options.margin" />`,
  })

const downloadStub = (className: string) =>
  defineComponent({
    props: {
      options: {
        type: Object,
        required: true,
      },
      image: {
        type: Object,
        default: undefined,
      },
    },
    template: `<div class="${className}" :data-margin="options.margin" :data-has-image="image ? 'yes' : 'no'" />`,
  })

describe('settings display components', () => {
  it('updates desktop browser display options through controls', async () => {
    const options = createDesktopOptions()
    const wrapper = mount(DesktopBrowserSettingsDisplay, {
      props: {
        options,
      },
    })

    const checkboxes = wrapper.findAll('input.n-checkbox')
    await checkboxes[0]!.setValue(true)
    expect(options.original).toBe(true)

    await checkboxes[0]!.setValue(false)
    await wrapper.findAll('input.n-checkbox')[1]!.setValue(true)
    expect(options.background).toBe(true)

    await wrapper.find('input.n-color-picker').setValue('#112233')

    const sliders = wrapper.findAll('input.n-slider')
    await sliders[0]!.setValue('16')
    await sliders[1]!.setValue('24')

    expect(options.backgroundColor).toBe('#112233')
    expect(options.backgroundRadius).toBe(16)
    expect(options.margin).toBe(24)
  })

  it('updates ios web clip display options', async () => {
    const options = createIOSOptions()
    const wrapper = mount(IOSWebClipSettingsDisplay, {
      props: {
        options,
      },
    })

    await wrapper.find('input.n-color-picker').setValue('#abcdef')
    await wrapper.find('input.n-slider').setValue('18')

    expect(options.backgroundColor).toBe('#abcdef')
    expect(options.margin).toBe(18)
  })

  it('updates pwa display options and reveals background controls', async () => {
    const options = createPWAOptions({ background: false })
    const wrapper = mount(PWASettingsDisplay, {
      props: {
        options,
      },
    })

    await wrapper.find('input.n-checkbox').setValue(true)
    expect(options.background).toBe(true)

    await wrapper.find('input.n-color-picker').setValue('#223344')
    const sliders = wrapper.findAll('input.n-slider')
    await sliders[0]!.setValue('22')
    await sliders[1]!.setValue('28')

    expect(options.backgroundColor).toBe('#223344')
    expect(options.backgroundRadius).toBe(22)
    expect(options.margin).toBe(28)
  })

  it('updates pwa maskable display options', async () => {
    const options = createPWAOptions()
    const wrapper = mount(PWAMaskableSettingsDisplay, {
      props: {
        options,
      },
    })

    await wrapper.find('input.n-color-picker').setValue('#334455')
    await wrapper.find('input.n-slider').setValue('26')

    expect(options.maskableBackgroundColor).toBe('#334455')
    expect(options.maskableMargin).toBe(26)
  })
})

describe('settings tab containers', () => {
  it('renders desktop settings panes and forwards model/image props', () => {
    const options = createDesktopOptions({ margin: 19 })
    const wrapper = mount(DesktopBrowserSettings, {
      props: {
        options,
        image: new Blob(['desktop']),
      },
      global: {
        stubs: {
          DesktopBrowserSettingsDisplay: modelStub('desktop-display'),
          DesktopBrowserSettingsDedicatedImage: modelStub('desktop-dedicated-image'),
          DesktopBrowserSettingsDownload: downloadStub('desktop-download'),
        },
      },
    })

    expect(wrapper.findAll('section.n-tab-pane')).toHaveLength(3)
    expect(wrapper.find('.desktop-display').attributes('data-margin')).toBe('19')
    expect(wrapper.find('.desktop-dedicated-image').attributes('data-margin')).toBe('19')
    expect(wrapper.find('.desktop-download').attributes('data-has-image')).toBe('yes')
  })

  it('renders ios settings panes and forwards model/image props', () => {
    const options = createIOSOptions({ margin: 17 })
    const wrapper = mount(IOSWebClipSettings, {
      props: {
        options,
        image: new Blob(['ios']),
      },
      global: {
        stubs: {
          IOSWebClipSettingsDisplay: modelStub('ios-display'),
          IOSWebClipSettingsDedicatedImage: modelStub('ios-dedicated-image'),
          IOSWebClipSettingsDownload: downloadStub('ios-download'),
        },
      },
    })

    expect(wrapper.findAll('section.n-tab-pane')).toHaveLength(3)
    expect(wrapper.find('.ios-display').attributes('data-margin')).toBe('17')
    expect(wrapper.find('.ios-dedicated-image').attributes('data-margin')).toBe('17')
    expect(wrapper.find('.ios-download').attributes('data-has-image')).toBe('yes')
  })

  it('renders pwa settings panes and forwards model/image props', () => {
    const options = createPWAOptions({ margin: 21 })
    const wrapper = mount(PWASettings, {
      props: {
        options,
        image: new Blob(['pwa']),
      },
      global: {
        stubs: {
          PWASettingsDisplay: modelStub('pwa-display'),
          PWASettingsDedicatedImage: modelStub('pwa-dedicated-image'),
          PWASettingsDownload: downloadStub('pwa-download'),
        },
      },
    })

    expect(wrapper.findAll('section.n-tab-pane')).toHaveLength(3)
    expect(wrapper.find('.pwa-display').attributes('data-margin')).toBe('21')
    expect(wrapper.find('.pwa-dedicated-image').attributes('data-margin')).toBe('21')
    expect(wrapper.find('.pwa-download').attributes('data-has-image')).toBe('yes')
  })

  it('renders pwa maskable settings panes and forwards model/image props', () => {
    const options = createPWAOptions({ margin: 23 })
    const wrapper = mount(PWAMaskableSettings, {
      props: {
        options,
        image: new Blob(['maskable']),
      },
      global: {
        stubs: {
          PWAMaskableSettingsDisplay: modelStub('maskable-display'),
          PWAMaskableSettingsDedicatedImage: modelStub('maskable-dedicated-image'),
          PWAMaskableSettingsDownload: downloadStub('maskable-download'),
        },
      },
    })

    expect(wrapper.findAll('section.n-tab-pane')).toHaveLength(3)
    expect(wrapper.find('.maskable-display').attributes('data-margin')).toBe('23')
    expect(wrapper.find('.maskable-dedicated-image').attributes('data-margin')).toBe('23')
    expect(wrapper.find('.maskable-download').attributes('data-has-image')).toBe('yes')
  })
})
