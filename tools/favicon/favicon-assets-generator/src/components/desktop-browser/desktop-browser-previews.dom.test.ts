import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  const width = ref(120)
  const height = ref(60)
  return {
    useObjectUrl: () => ref('blob:mock'),
    useElementSize: () => ({ width, height }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDivider: defineComponent({
      name: 'NDivider',
      template: '<div class="n-divider" />',
    }),
    NSkeleton: defineComponent({
      name: 'NSkeleton',
      template: '<div class="n-skeleton" />',
    }),
  }
})

import DesktopBrowserImage from './DesktopBrowserImage.vue'
import ChromeTabPreview from './ChromeTabPreview.vue'
import DesktopBrowserPreview from './DesktopBrowserPreview.vue'
import GoogleSearchResult from './GoogleSearchResult.vue'

const baseOptions: DesktopBrowserOptions = {
  original: false,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  margin: 0,
}

const baseGeneralInfo: GeneralInfoOptions = {
  name: 'InBrowser App',
  short_name: 'InBrowser',
  description: 'Example',
  start_url: '/start',
  display: 'standalone',
  theme_color: '#ffffff',
  theme_color_dark_enabled: false,
  theme_color_dark: undefined,
  background_color: '#ffffff',
  path: '/favicon',
}

describe('DesktopBrowserImage', () => {
  it('renders a skeleton and background styles when image is missing', () => {
    const wrapper = mount(DesktopBrowserImage, {
      props: {
        image: undefined,
        options: {
          ...baseOptions,
          background: true,
          backgroundColor: '#ff0000',
          backgroundRadius: 20,
          margin: 10,
        },
      },
    })

    expect(wrapper.find('.n-skeleton').exists()).toBe(true)

    const background = wrapper.find('.desktop-browser-image-background')
    expect(background.exists()).toBe(true)
    expect(background.attributes('style')).toContain('--icon-background-color: #ff0000')
    expect(background.attributes('style')).toContain('--icon-background-radius: 10%')
  })

  it('renders the image from options and applies margin styles', () => {
    const optionsImage = new Blob(['icon'], { type: 'image/png' })

    const wrapper = mount(DesktopBrowserImage, {
      props: {
        image: undefined,
        options: {
          ...baseOptions,
          original: true,
          margin: 10,
          image: optionsImage,
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.classes()).toContain('desktop-browser-image-asis')
    expect(img.attributes('style')).toContain('--icon-margin: 5%')
  })
})

describe('ChromeTabPreview', () => {
  const DesktopBrowserImageStub = {
    name: 'DesktopBrowserImage',
    props: ['image', 'options'],
    template: '<div data-testid="desktop-browser-image" />',
  }

  it('renders tab images for light/dark modes and passes options image', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options: DesktopBrowserOptions = {
      ...baseOptions,
      image,
    }

    const lightWrapper = mount(ChromeTabPreview, {
      props: {
        image: new Blob(['fallback'], { type: 'image/png' }),
        options,
        generalInfoOptions: baseGeneralInfo,
        dark: false,
      },
      global: {
        stubs: {
          DesktopBrowserImage: DesktopBrowserImageStub,
        },
      },
    })

    const darkWrapper = mount(ChromeTabPreview, {
      props: {
        image: new Blob(['fallback'], { type: 'image/png' }),
        options,
        generalInfoOptions: baseGeneralInfo,
        dark: true,
      },
      global: {
        stubs: {
          DesktopBrowserImage: DesktopBrowserImageStub,
        },
      },
    })

    const lightSrc = lightWrapper.find('img.chrome-tab-image').attributes('src')
    const darkSrc = darkWrapper.find('img.chrome-tab-image').attributes('src')

    expect(lightSrc).toBeTruthy()
    expect(darkSrc).toBeTruthy()

    const stubImage = lightWrapper.findComponent(DesktopBrowserImageStub).props('image') as Blob
    await expect(stubImage.text()).resolves.toBe('icon')
    expect(lightWrapper.find('.site-name').text()).toBe('InBrowser App')

    const style = lightWrapper.find('.container').attributes('style')
    expect(style).toContain('--chrome-tab-preview-tab-width: 120px')
    expect(style).toContain('--chrome-tab-preview-tab-height: 60px')
  })
})

describe('DesktopBrowserPreview', () => {
  const GoogleSearchResultStub = {
    name: 'GoogleSearchResult',
    props: ['image', 'options', 'generalInfoOptions'],
    template: '<div data-testid="google-search" />',
  }

  const ChromeTabPreviewStub = {
    name: 'ChromeTabPreview',
    props: ['image', 'options', 'generalInfoOptions', 'dark'],
    template: '<div class="chrome-tab" :data-dark="dark" />',
  }

  const ChromeTabDarkNoteStub = {
    name: 'ChromeTabDarkNote',
    template: '<div data-testid="chrome-note" />',
  }

  it('renders chrome tab previews and dark note for svg images', () => {
    const svg = new Blob(['<svg />'], { type: 'image/svg+xml' })

    const wrapper = mount(DesktopBrowserPreview, {
      props: {
        image: svg,
        options: baseOptions,
        generalInfoOptions: baseGeneralInfo,
      },
      global: {
        stubs: {
          GoogleSearchResult: GoogleSearchResultStub,
          ChromeTabPreview: ChromeTabPreviewStub,
          ChromeTabDarkNote: ChromeTabDarkNoteStub,
        },
      },
    })

    expect(wrapper.findAllComponents(ChromeTabPreviewStub)).toHaveLength(2)
    const darkProps = wrapper
      .findAllComponents(ChromeTabPreviewStub)
      .map((node) => node.props('dark'))
    expect(darkProps).toEqual([false, true])
    expect(wrapper.find('[data-testid="chrome-note"]').exists()).toBe(true)
  })

  it('uses option image and hides dark note for non-svg', async () => {
    const svg = new Blob(['<svg />'], { type: 'image/svg+xml' })
    const png = new Blob(['png'], { type: 'image/png' })

    const wrapper = mount(DesktopBrowserPreview, {
      props: {
        image: svg,
        options: {
          ...baseOptions,
          image: png,
        },
        generalInfoOptions: baseGeneralInfo,
      },
      global: {
        stubs: {
          GoogleSearchResult: GoogleSearchResultStub,
          ChromeTabPreview: ChromeTabPreviewStub,
          ChromeTabDarkNote: ChromeTabDarkNoteStub,
        },
      },
    })

    const stubImage = wrapper.findComponent(GoogleSearchResultStub).props('image') as Blob
    await expect(stubImage.text()).resolves.toBe('png')
    expect(wrapper.find('[data-testid="chrome-note"]').exists()).toBe(false)
  })
})

describe('GoogleSearchResult', () => {
  const DesktopBrowserImageStub = {
    name: 'DesktopBrowserImage',
    props: ['image', 'options'],
    template: '<div data-testid="desktop-browser-image" />',
  }

  it('prefers options image over prop image', async () => {
    const optionsImage = new Blob(['opt'], { type: 'image/png' })
    const propImage = new Blob(['prop'], { type: 'image/png' })

    const wrapper = mount(GoogleSearchResult, {
      props: {
        image: propImage,
        options: {
          ...baseOptions,
          image: optionsImage,
        },
        generalInfoOptions: baseGeneralInfo,
      },
      global: {
        stubs: {
          DesktopBrowserImage: DesktopBrowserImageStub,
        },
      },
    })

    const stubImage = wrapper.findComponent(DesktopBrowserImageStub).props('image') as Blob
    await expect(stubImage.text()).resolves.toBe('opt')
    expect(wrapper.text()).toContain('InBrowser App')
  })
})
