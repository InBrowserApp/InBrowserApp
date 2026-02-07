import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'

const generatePWAPNGMock = vi.hoisted(() => vi.fn())
const messageErrorMock = vi.hoisted(() => vi.fn())

vi.mock('../../../utils/favicon-generator/pwa', () => ({
  generatePWAPNG: generatePWAPNGMock,
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

import PWASettingsDownload from './PWASettingsDownload.vue'

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
  maskable: false,
  maskableBackgroundColor: '#ffffff',
  maskableMargin: 0,
  margin: 0,
  image: undefined,
  maskableImage: undefined,
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

describe('PWASettingsDownload', () => {
  beforeEach(() => {
    generatePWAPNGMock.mockReset()
    messageErrorMock.mockClear()
  })

  it('generates PWA downloads for both sizes', async () => {
    const image = taggedBlob('icon')
    const options = createOptions()

    generatePWAPNGMock.mockResolvedValue(taggedBlob('png'))

    const wrapper = mount(PWASettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generatePWAPNGMock).toHaveBeenCalledWith(image, options, 192)
    expect(generatePWAPNGMock).toHaveBeenCalledWith(image, options, 512)

    const filenames = wrapper
      .findAll('[data-filename]')
      .map((node) => node.attributes('data-filename'))
    expect(filenames).toEqual(expect.arrayContaining(['pwa-192x192.png', 'pwa-512x512.png']))
  })

  it('uses options image when available', async () => {
    const optionsImage = taggedBlob('options-image')
    const options = createOptions({ image: optionsImage })

    generatePWAPNGMock.mockResolvedValue(taggedBlob('png'))

    mount(PWASettingsDownload, {
      props: {
        image: taggedBlob('prop-image'),
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generatePWAPNGMock).toHaveBeenCalledWith(optionsImage, options, 192)
    expect(generatePWAPNGMock).toHaveBeenCalledWith(optionsImage, options, 512)
  })

  it('does not generate files when image is missing', async () => {
    const wrapper = mount(PWASettingsDownload, {
      props: {
        image: undefined,
        options: createOptions({ image: undefined }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generatePWAPNGMock).not.toHaveBeenCalled()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['pwa-192x192.png']).toBeUndefined()
    expect(downloads['pwa-512x512.png']).toBeUndefined()
  })

  it('ignores stale successful updates', async () => {
    const image = taggedBlob('icon')
    const first192 = createDeferred<Blob>()
    const first512 = createDeferred<Blob>()

    let calls192 = 0
    let calls512 = 0

    generatePWAPNGMock.mockImplementation((_image, _options, size: number) => {
      if (size === 192) {
        calls192 += 1
        if (calls192 === 1) {
          return first192.promise
        }
        return Promise.resolve(taggedBlob('new-192'))
      }

      calls512 += 1
      if (calls512 === 1) {
        return first512.promise
      }
      return Promise.resolve(taggedBlob('new-512'))
    })

    const wrapper = mount(PWASettingsDownload, {
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

    first192.resolve(taggedBlob('old-192'))
    first512.resolve(taggedBlob('old-512'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['pwa-192x192.png']).toBe('blob:new-192')
    expect(downloads['pwa-512x512.png']).toBe('blob:new-512')
  })

  it('ignores stale failed updates', async () => {
    const image = taggedBlob('icon')
    const first192 = createDeferred<Blob>()
    const first512 = createDeferred<Blob>()

    let calls192 = 0
    let calls512 = 0

    generatePWAPNGMock.mockImplementation((_image, _options, size: number) => {
      if (size === 192) {
        calls192 += 1
        if (calls192 === 1) {
          return first192.promise
        }
        return Promise.resolve(taggedBlob('new-192'))
      }

      calls512 += 1
      if (calls512 === 1) {
        return first512.promise
      }
      return Promise.resolve(taggedBlob('new-512'))
    })

    const wrapper = mount(PWASettingsDownload, {
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

    first192.reject(new Error('stale-192'))
    first512.reject(new Error('stale-512'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['pwa-192x192.png']).toBe('blob:new-192')
    expect(downloads['pwa-512x512.png']).toBe('blob:new-512')
    expect(messageErrorMock).not.toHaveBeenCalled()
  })

  it('reports errors when generation fails', async () => {
    const image = taggedBlob('icon')
    const options = createOptions()

    generatePWAPNGMock.mockRejectedValue(new Error('boom'))

    mount(PWASettingsDownload, {
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
