import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'

const generateOutputMock = vi.hoisted(() => vi.fn())
const getHTMLCodeMock = vi.hoisted(() => vi.fn(() => '<link rel="apple-touch-icon" />'))
const messageErrorMock = vi.hoisted(() => vi.fn())

vi.mock('../../utils/favicon-generator/ios-web-clip', () => ({
  generateOutput: generateOutputMock,
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

import iOSWebClipSettingsDownload from './iOSWebClipSettingsDownload.vue'

const stubs = {
  FileMinifiedUsingOxipng: {
    template: '<div data-testid="minified-note" />',
  },
  DownloadFileButton: {
    props: ['filename', 'href'],
    template: '<a :data-filename="filename" :data-href="href" />',
  },
}

const createOptions = (overrides: Partial<iOSWebClipOptions> = {}): iOSWebClipOptions => ({
  backgroundColor: '#ffffff',
  margin: 0,
  image: undefined,
  ...overrides,
})

describe('iOSWebClipSettingsDownload', () => {
  beforeEach(() => {
    generateOutputMock.mockReset()
    getHTMLCodeMock.mockClear()
    messageErrorMock.mockClear()
  })

  it('generates the download file and HTML snippet', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options = createOptions()

    generateOutputMock.mockResolvedValue(new Blob(['png']))

    const wrapper = mount(iOSWebClipSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateOutputMock).toHaveBeenCalledWith(image, options)

    const filenames = wrapper
      .findAll('[data-filename]')
      .map((node) => node.attributes('data-filename'))
    expect(filenames).toEqual(expect.arrayContaining(['apple-touch-icon.png']))
  })

  it('reports errors when generation fails', async () => {
    const image = new Blob(['icon'], { type: 'image/png' })
    const options = createOptions()

    generateOutputMock.mockRejectedValue(new Error('boom'))

    mount(iOSWebClipSettingsDownload, {
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
