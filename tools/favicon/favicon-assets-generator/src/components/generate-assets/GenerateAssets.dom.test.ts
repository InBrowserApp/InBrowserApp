import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'

const generateAssetsMock = vi.fn()
const messageErrorMock = vi.fn()

vi.mock('../../utils/favicon-generator/generate-assets', () => ({
  generateAssets: (...args: unknown[]) => generateAssetsMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (source: { value: Blob | null }) =>
      computed(() => (source.value ? 'blob:download' : null)),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /><slot name="icon" /><slot name="trigger" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    emits: ['click'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  return {
    NButton,
    NIcon: Base,
    NText: Base,
    NOl: Base,
    NLi: Base,
    NTag: Base,
    NPopover: Base,
    NScrollbar: Base,
    NP: Base,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

import GenerateAssets from './GenerateAssets.vue'

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

const basePwa: PWAOptions = {
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  maskable: true,
  maskableBackgroundColor: '#ffffff',
  maskableMargin: 0,
  margin: 0,
  image: undefined,
  maskableImage: undefined,
}

const baseIos: iOSWebClipOptions = {
  backgroundColor: '#ffffff',
  margin: 0,
  image: undefined,
}

const createProps = () => ({
  generalInfoOptions: { ...baseGeneralInfo },
  desktopBrowserOptions: { ...baseDesktop },
  pwaOptions: { ...basePwa },
  iosWebClipOptions: { ...baseIos },
})

const stubbed = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  HTMLCode: {
    template: '<div class="html-code" />',
  },
  SiteWebManifest: {
    template: '<div class="manifest" />',
  },
  'i18n-t': {
    template:
      '<span class="i18n"><slot name="prefix" /><slot name="head" /><slot name="manifest" /></span>',
  },
}

const getDownloadButton = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('button').find((button) => button.text().includes('favicon-assets.zip'))

describe('GenerateAssets', () => {
  beforeEach(() => {
    generateAssetsMock.mockReset()
    messageErrorMock.mockReset()
  })

  it('disables download when there is no image', async () => {
    generateAssetsMock.mockResolvedValue(new Blob())
    const props = createProps()

    const wrapper = mount(GenerateAssets, {
      props: {
        ...props,
        image: undefined,
      },
      global: {
        stubs: stubbed,
      },
    })

    await flushPromises()

    expect(generateAssetsMock).not.toHaveBeenCalled()

    const button = getDownloadButton(wrapper)
    expect(button).toBeTruthy()
    expect(button!.attributes('disabled')).toBeDefined()
  })

  it('generates assets and enables download when image exists', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const zipBlob = new Blob(['zip'], { type: 'application/zip' })
    const props = createProps()

    generateAssetsMock.mockResolvedValue(zipBlob)

    const wrapper = mount(GenerateAssets, {
      props: {
        ...props,
        image,
      },
      global: {
        stubs: stubbed,
      },
    })

    await flushPromises()

    expect(generateAssetsMock).toHaveBeenCalledWith(image, {
      generalInfo: props.generalInfoOptions,
      desktopBrowser: props.desktopBrowserOptions,
      pwa: props.pwaOptions,
      iosWebClip: props.iosWebClipOptions,
    })

    const button = getDownloadButton(wrapper)
    expect(button).toBeTruthy()
    expect(button!.attributes('disabled')).toBeUndefined()
    expect(button!.attributes('href')).toBe('blob:download')
  })

  it('handles generation errors and keeps download disabled', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const props = createProps()

    generateAssetsMock.mockRejectedValue(new Error('boom'))

    const wrapper = mount(GenerateAssets, {
      props: {
        ...props,
        image,
      },
      global: {
        stubs: stubbed,
      },
    })

    await flushPromises()

    expect(messageErrorMock).toHaveBeenCalledWith('boom')

    const button = getDownloadButton(wrapper)
    expect(button).toBeTruthy()
    expect(button!.attributes('disabled')).toBeDefined()
  })
})
