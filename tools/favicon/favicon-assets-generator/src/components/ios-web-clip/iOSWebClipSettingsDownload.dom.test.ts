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
      computed(() => {
        const blob = source.value as (Blob & { __tag?: string }) | null
        return blob ? `blob:${blob.__tag ?? 'download'}` : null
      }),
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

const taggedBlob = (tag: string, type = 'image/png'): Blob & { __tag: string } =>
  Object.assign(new Blob([tag], { type }), { __tag: tag })

const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve,
    reject,
  }
}

const getDownloadMap = (wrapper: ReturnType<typeof mount>) =>
  Object.fromEntries(
    wrapper
      .findAll('[data-filename]')
      .map((node) => [node.attributes('data-filename'), node.attributes('data-href')]),
  )

describe('iOSWebClipSettingsDownload', () => {
  beforeEach(() => {
    generateOutputMock.mockReset()
    getHTMLCodeMock.mockClear()
    messageErrorMock.mockClear()
  })

  it('generates the download file and HTML snippet', async () => {
    const image = taggedBlob('icon')
    const options = createOptions()

    generateOutputMock.mockResolvedValue(taggedBlob('png'))

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

  it('uses options image when present', async () => {
    const optionsImage = taggedBlob('options')
    const options = createOptions({ image: optionsImage })

    generateOutputMock.mockResolvedValue(taggedBlob('png'))

    mount(iOSWebClipSettingsDownload, {
      props: {
        image: taggedBlob('prop'),
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateOutputMock).toHaveBeenCalledWith(optionsImage, options)
  })

  it('does not generate files when image is missing', async () => {
    const wrapper = mount(iOSWebClipSettingsDownload, {
      props: {
        image: undefined,
        options: createOptions({ image: undefined }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateOutputMock).not.toHaveBeenCalled()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['apple-touch-icon.png']).toBeUndefined()
  })

  it('ignores stale successful updates', async () => {
    const image = taggedBlob('icon')
    const first = createDeferred<Blob>()
    let calls = 0

    generateOutputMock.mockImplementation(() => {
      calls += 1
      if (calls === 1) {
        return first.promise
      }
      return Promise.resolve(taggedBlob('new'))
    })

    const wrapper = mount(iOSWebClipSettingsDownload, {
      props: {
        image,
        options: createOptions({ margin: 1 }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    await wrapper.setProps({
      options: createOptions({ margin: 2 }),
    })
    await flushPromises()

    first.resolve(taggedBlob('old'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['apple-touch-icon.png']).toBe('blob:new')
  })

  it('ignores stale failed updates', async () => {
    const image = taggedBlob('icon')
    const first = createDeferred<Blob>()
    let calls = 0

    generateOutputMock.mockImplementation(() => {
      calls += 1
      if (calls === 1) {
        return first.promise
      }
      return Promise.resolve(taggedBlob('new'))
    })

    const wrapper = mount(iOSWebClipSettingsDownload, {
      props: {
        image,
        options: createOptions({ margin: 1 }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    await wrapper.setProps({
      options: createOptions({ margin: 3 }),
    })
    await flushPromises()

    first.reject(new Error('stale'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['apple-touch-icon.png']).toBe('blob:new')
    expect(messageErrorMock).not.toHaveBeenCalled()
  })

  it('reports errors when generation fails', async () => {
    const image = taggedBlob('icon')
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
