import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'

const generatePWAMaskablePNGMock = vi.hoisted(() => vi.fn())
const messageErrorMock = vi.hoisted(() => vi.fn())

vi.mock('../../../utils/favicon-generator/pwa', () => ({
  generatePWAMaskablePNG: generatePWAMaskablePNGMock,
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

import PWAMaskableSettingsDownload from './PWAMaskableSettingsDownload.vue'

const stubs = {
  FileMinifiedUsingOxipng: {
    template: '<div data-testid="minified-note" />',
  },
  DownloadFileButton: {
    props: ['filename', 'href'],
    template: '<a :data-filename="filename" :data-href="href" />',
  },
}

const createOptions = (overrides: Partial<PWAOptions> = {}): PWAOptions => ({
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  maskable: true,
  maskableBackgroundColor: '#ffffff',
  maskableMargin: 0,
  margin: 0,
  image: undefined,
  maskableImage: undefined,
  ...overrides,
})

describe('PWAMaskableSettingsDownload', () => {
  beforeEach(() => {
    generatePWAMaskablePNGMock.mockReset()
    messageErrorMock.mockClear()
  })

  it('generates maskable PWA downloads', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options = createOptions()

    generatePWAMaskablePNGMock.mockResolvedValue(new Blob(['png']))

    const wrapper = mount(PWAMaskableSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generatePWAMaskablePNGMock).toHaveBeenCalledWith(image, options, 192)
    expect(generatePWAMaskablePNGMock).toHaveBeenCalledWith(image, options, 512)

    const filenames = wrapper
      .findAll('[data-filename]')
      .map((node) => node.attributes('data-filename'))
    expect(filenames).toEqual(
      expect.arrayContaining(['pwa-maskable-192x192.png', 'pwa-maskable-512x512.png']),
    )
  })

  it('reports errors when generation fails', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options = createOptions()

    generatePWAMaskablePNGMock.mockRejectedValue(new Error('boom'))

    mount(PWAMaskableSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(messageErrorMock).toHaveBeenCalledWith('boom')
  })
})
