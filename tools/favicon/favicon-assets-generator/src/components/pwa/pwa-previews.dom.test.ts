import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useObjectUrl: () => ref('blob:mock'),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NSkeleton: defineComponent({
      name: 'NSkeleton',
      template: '<div class="n-skeleton" />',
    }),
  }
})

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

import PWAPreview from './any/PWAPreview.vue'
import PWAPreviewWindowsTaskbar from './any/PWAPreviewWindowsTaskbar.vue'
import PWAPreviewAndroid from './maskable/PWAPreviewAndroid.vue'
import PWAMaskablePreview from './maskable/PWAMaskablePreview.vue'

const basePwaOptions: PWAOptions = {
  background: true,
  backgroundColor: '#123456',
  backgroundRadius: 12,
  maskable: true,
  maskableBackgroundColor: '#654321',
  maskableMargin: 16,
  margin: 8,
}

const baseGeneralInfo: GeneralInfoOptions = {
  name: 'PWA App',
  short_name: 'PWA',
  description: 'Example',
  start_url: '/start',
  display: 'standalone',
  theme_color: '#ffffff',
  theme_color_dark_enabled: false,
  theme_color_dark: undefined,
  background_color: '#ffffff',
  path: '/favicon',
}

describe('PWAPreviewWindowsTaskbar', () => {
  it('renders skeleton with transparent background when disabled', () => {
    const wrapper = mount(PWAPreviewWindowsTaskbar, {
      props: {
        image: undefined,
        options: {
          ...basePwaOptions,
          background: false,
        },
      },
    })

    expect(wrapper.find('.n-skeleton').exists()).toBe(true)

    const background = wrapper.find('.icon-background')
    expect(background.attributes('style')).toContain('transparent')

    expect(wrapper.find('img.background').attributes('alt')).toBe('windowsTaskbarBackground')
  })

  it('renders the icon with background styles', () => {
    const image = new Blob(['icon'], { type: 'image/png' })

    const wrapper = mount(PWAPreviewWindowsTaskbar, {
      props: {
        image,
        options: {
          ...basePwaOptions,
          background: true,
          backgroundColor: '#abcdef',
          backgroundRadius: 20,
          margin: 10,
        },
      },
    })

    const img = wrapper.find('img.icon')
    expect(img.exists()).toBe(true)
    expect(img.attributes('style')).toContain('--icon-margin: 5%')

    const background = wrapper.find('.icon-background')
    expect(background.attributes('style')).toContain('--icon-background-color: #abcdef')
    expect(background.attributes('style')).toContain('--icon-background-radius: 10%')
  })
})

describe('PWAPreview', () => {
  const PWAPreviewWindowsTaskbarStub = {
    name: 'PWAPreviewWindowsTaskbar',
    props: ['image', 'options'],
    template: '<div data-testid="pwa-preview" />',
  }

  it('prefers options image over prop image', async () => {
    const optionsImage = new Blob(['options'], { type: 'image/png' })
    const propImage = new Blob(['prop'], { type: 'image/png' })

    const wrapper = mount(PWAPreview, {
      props: {
        image: propImage,
        options: {
          ...basePwaOptions,
          image: optionsImage,
        },
        generalInfoOptions: baseGeneralInfo,
      },
      global: {
        stubs: {
          PWAPreviewWindowsTaskbar: PWAPreviewWindowsTaskbarStub,
        },
      },
    })

    const stubImage = wrapper.findComponent(PWAPreviewWindowsTaskbarStub).props('image') as Blob
    await expect(stubImage.text()).resolves.toBe('options')
  })
})

describe('PWAPreviewAndroid', () => {
  it('renders skeleton when image is missing', () => {
    const wrapper = mount(PWAPreviewAndroid, {
      props: {
        image: undefined,
        options: {
          ...basePwaOptions,
          maskableImage: undefined,
        },
      },
    })

    expect(wrapper.find('.n-skeleton').exists()).toBe(true)
  })

  it('renders maskable image with styles', () => {
    const maskableImage = new Blob(['maskable'], { type: 'image/png' })

    const wrapper = mount(PWAPreviewAndroid, {
      props: {
        image: undefined,
        options: {
          ...basePwaOptions,
          maskableImage,
          maskableBackgroundColor: '#fedcba',
          maskableMargin: 12,
        },
      },
    })

    const img = wrapper.find('img.icon')
    expect(img.exists()).toBe(true)
    expect(img.attributes('style')).toContain('--icon-margin: 6%')

    const background = wrapper.find('.icon-background')
    expect(background.attributes('style')).toContain('--icon-background-color: #fedcba')
  })
})

describe('PWAMaskablePreview', () => {
  const PWAPreviewAndroidStub = {
    name: 'PWAPreviewAndroid',
    props: ['image', 'options'],
    template: '<div data-testid="pwa-maskable" />',
  }

  it('passes props to the android preview', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })

    const wrapper = mount(PWAMaskablePreview, {
      props: {
        image,
        options: basePwaOptions,
        generalInfoOptions: baseGeneralInfo,
      },
      global: {
        stubs: {
          PWAPreviewAndroid: PWAPreviewAndroidStub,
        },
      },
    })

    const stubImage = wrapper.findComponent(PWAPreviewAndroidStub).props('image') as Blob
    await expect(stubImage.text()).resolves.toBe('icon')
  })
})
