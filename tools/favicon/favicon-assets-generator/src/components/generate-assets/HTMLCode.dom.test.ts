import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'
import HTMLCode from './HTMLCode.vue'

const NCodeStub = defineComponent({
  name: 'NCode',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  template: '<pre class="n-code">{{ code }}</pre>',
})

const baseGeneralInfo: GeneralInfoOptions = {
  name: 'App',
  short_name: 'App',
  description: 'Description',
  start_url: '/',
  display: 'standalone',
  theme_color: '#ffffff',
  theme_color_dark_enabled: false,
  theme_color_dark: '#000000',
  background_color: '#cccccc',
  path: '/assets/',
}

const baseDesktop: DesktopBrowserOptions = {
  original: true,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  margin: 0,
  image: undefined,
}

const baseIos: iOSWebClipOptions = {
  backgroundColor: '#ffffff',
  margin: 0,
  image: undefined,
}

const basePwa: PWAOptions = {
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  maskable: false,
  maskableBackgroundColor: '#ffffff',
  maskableMargin: 0,
  margin: 0,
  image: undefined,
  maskableImage: undefined,
}

describe('HTMLCode', () => {
  it('renders icon links for original images', () => {
    const wrapper = mount(HTMLCode, {
      props: {
        image: undefined,
        generalInfoOptions: { ...baseGeneralInfo },
        desktopBrowserOptions: { ...baseDesktop },
        iosWebClipOptions: { ...baseIos },
        pwaOptions: { ...basePwa },
      },
      global: {
        stubs: {
          NCode: NCodeStub,
        },
      },
    })

    const code = wrapper.find('.n-code').text()
    expect(code).toContain('favicon.ico')
    expect(code).toContain('favicon.svg')
    expect(code).toContain('theme-color')
    expect(code).toContain('site.webmanifest')
  })

  it('renders png icons and dark mode theme colors', () => {
    const wrapper = mount(HTMLCode, {
      props: {
        image: new Blob(['icon'], { type: 'image/png' }),
        generalInfoOptions: {
          ...baseGeneralInfo,
          theme_color_dark_enabled: true,
        },
        desktopBrowserOptions: {
          ...baseDesktop,
          original: false,
        },
        iosWebClipOptions: { ...baseIos },
        pwaOptions: { ...basePwa },
      },
      global: {
        stubs: {
          NCode: NCodeStub,
        },
      },
    })

    const code = wrapper.find('.n-code').text()
    expect(code).toContain('favicon-32x32.png')
    expect(code).toContain('favicon-16x16.png')
    expect(code).toContain('prefers-color-scheme: light')
    expect(code).toContain('prefers-color-scheme: dark')
  })
})
