import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'

const generateFaviconICOMock = vi.hoisted(() => vi.fn())
const generateFaviconPNGMock = vi.hoisted(() => vi.fn())
const generateFaviconSVGMock = vi.hoisted(() => vi.fn())
const getHTMLCodeMock = vi.hoisted(() => vi.fn(() => '<link rel="icon" />'))
const messageErrorMock = vi.hoisted(() => vi.fn())

vi.mock('../../utils/favicon-generator/desktop-browser', () => ({
  generateFaviconICO: generateFaviconICOMock,
  generateFaviconPNG: generateFaviconPNGMock,
  generateFaviconSVG: generateFaviconSVGMock,
  getHTMLCode: getHTMLCodeMock,
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
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  return {
    NCode: Base,
    NP: Base,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

import DesktopBrowserSettingsDownload from './DesktopBrowserSettingsDownload.vue'

const stubs = {
  FileMinifiedUsingOxipngAndSvgo: {
    template: '<div data-testid="minified-note" />',
  },
  DownloadFileButton: {
    props: ['filename', 'href'],
    template: '<a :data-filename="filename" :data-href="href" />',
  },
}

const createOptions = (overrides: Partial<DesktopBrowserOptions> = {}): DesktopBrowserOptions => ({
  original: false,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  margin: 0,
  image: undefined,
  ...overrides,
})

describe('DesktopBrowserSettingsDownload', () => {
  beforeEach(() => {
    generateFaviconICOMock.mockReset()
    generateFaviconPNGMock.mockReset()
    generateFaviconSVGMock.mockReset()
    getHTMLCodeMock.mockClear()
    messageErrorMock.mockClear()
  })

  it('renders PNG downloads when not using original svg', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options = createOptions()

    generateFaviconICOMock.mockResolvedValue(new Blob(['ico']))
    generateFaviconPNGMock.mockResolvedValue(new Blob(['png']))

    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateFaviconICOMock).toHaveBeenCalledWith(image, options)
    expect(generateFaviconPNGMock).toHaveBeenCalledWith(image, options, 32)
    expect(generateFaviconPNGMock).toHaveBeenCalledWith(image, options, 16)
    expect(generateFaviconSVGMock).not.toHaveBeenCalled()

    const filenames = wrapper
      .findAll('[data-filename]')
      .map((node) => node.attributes('data-filename'))
    expect(filenames).toEqual(
      expect.arrayContaining(['favicon.ico', 'favicon-32x32.png', 'favicon-16x16.png']),
    )
  })

  it('renders SVG download when original svg is selected', async () => {
    const image = new Blob(['icon'], { type: 'image/svg+xml' })
    const options = createOptions({ original: true })

    generateFaviconICOMock.mockResolvedValue(new Blob(['ico']))
    generateFaviconSVGMock.mockResolvedValue(new Blob(['svg']))

    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateFaviconSVGMock).toHaveBeenCalledWith(image, options)
    expect(generateFaviconPNGMock).not.toHaveBeenCalled()

    const filenames = wrapper
      .findAll('[data-filename]')
      .map((node) => node.attributes('data-filename'))
    expect(filenames).toEqual(expect.arrayContaining(['favicon.ico', 'favicon.svg']))
  })
})
