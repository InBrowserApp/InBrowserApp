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

describe('DesktopBrowserSettingsDownload', () => {
  beforeEach(() => {
    generateFaviconICOMock.mockReset()
    generateFaviconPNGMock.mockReset()
    generateFaviconSVGMock.mockReset()
    getHTMLCodeMock.mockClear()
    messageErrorMock.mockClear()
  })

  it('renders PNG downloads when not using original svg', async () => {
    const image = taggedBlob('icon')
    const options = createOptions()

    generateFaviconICOMock.mockResolvedValue(taggedBlob('ico', 'image/x-icon'))
    generateFaviconPNGMock.mockResolvedValue(taggedBlob('png'))

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

  it('uses options image when original svg is selected', async () => {
    const optionsImage = taggedBlob('options-svg', 'image/svg+xml')
    const options = createOptions({ original: true, image: optionsImage })

    generateFaviconICOMock.mockResolvedValue(taggedBlob('ico', 'image/x-icon'))
    generateFaviconSVGMock.mockResolvedValue(taggedBlob('svg', 'image/svg+xml'))

    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image: undefined,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateFaviconICOMock).toHaveBeenCalledWith(optionsImage, options)
    expect(generateFaviconSVGMock).toHaveBeenCalledWith(optionsImage, options)
    expect(generateFaviconPNGMock).not.toHaveBeenCalled()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['favicon.svg']).toBe('blob:svg')
  })

  it('keeps download links empty when image is missing in raster mode', async () => {
    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image: undefined,
        options: createOptions(),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateFaviconICOMock).not.toHaveBeenCalled()
    expect(generateFaviconPNGMock).not.toHaveBeenCalled()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['favicon.ico']).toBeUndefined()
    expect(downloads['favicon-32x32.png']).toBeUndefined()
    expect(downloads['favicon-16x16.png']).toBeUndefined()
  })

  it('keeps svg download empty when image is missing in svg mode', async () => {
    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image: undefined,
        options: createOptions({ original: true }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(generateFaviconICOMock).not.toHaveBeenCalled()
    expect(generateFaviconSVGMock).not.toHaveBeenCalled()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['favicon.ico']).toBeUndefined()
    expect(downloads['favicon.svg']).toBeUndefined()
  })

  it('reports generator errors in raster mode', async () => {
    const image = taggedBlob('icon')
    const options = createOptions()

    generateFaviconICOMock.mockRejectedValue(new Error('ico failed'))
    generateFaviconPNGMock.mockRejectedValue(new Error('png failed'))

    mount(DesktopBrowserSettingsDownload, {
      props: {
        image,
        options,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(messageErrorMock).toHaveBeenCalledWith('ico failed')
    expect(messageErrorMock).toHaveBeenCalledWith('png failed')
  })

  it('ignores stale successful updates in raster mode', async () => {
    const image = taggedBlob('icon')
    const firstIco = createDeferred<Blob>()
    const firstPng32 = createDeferred<Blob>()
    const firstPng16 = createDeferred<Blob>()

    let icoCalls = 0
    let png32Calls = 0
    let png16Calls = 0

    generateFaviconICOMock.mockImplementation(() => {
      icoCalls += 1
      if (icoCalls === 1) {
        return firstIco.promise
      }
      return Promise.resolve(taggedBlob('ico-new', 'image/x-icon'))
    })

    generateFaviconPNGMock.mockImplementation((_image, _options, size: number) => {
      if (size === 32) {
        png32Calls += 1
        if (png32Calls === 1) {
          return firstPng32.promise
        }
        return Promise.resolve(taggedBlob('png32-new'))
      }

      png16Calls += 1
      if (png16Calls === 1) {
        return firstPng16.promise
      }
      return Promise.resolve(taggedBlob('png16-new'))
    })

    const wrapper = mount(DesktopBrowserSettingsDownload, {
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

    firstIco.resolve(taggedBlob('ico-old', 'image/x-icon'))
    firstPng32.resolve(taggedBlob('png32-old'))
    firstPng16.resolve(taggedBlob('png16-old'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['favicon.ico']).toBe('blob:ico-new')
    expect(downloads['favicon-32x32.png']).toBe('blob:png32-new')
    expect(downloads['favicon-16x16.png']).toBe('blob:png16-new')
  })

  it('ignores stale rejections in svg mode', async () => {
    const image = taggedBlob('icon', 'image/svg+xml')
    const firstIco = createDeferred<Blob>()
    const firstSvg = createDeferred<Blob>()

    let icoCalls = 0
    let svgCalls = 0

    generateFaviconICOMock.mockImplementation(() => {
      icoCalls += 1
      if (icoCalls === 1) {
        return firstIco.promise
      }
      return Promise.resolve(taggedBlob('ico-new', 'image/x-icon'))
    })

    generateFaviconSVGMock.mockImplementation(() => {
      svgCalls += 1
      if (svgCalls === 1) {
        return firstSvg.promise
      }
      return Promise.resolve(taggedBlob('svg-new', 'image/svg+xml'))
    })

    const wrapper = mount(DesktopBrowserSettingsDownload, {
      props: {
        image,
        options: createOptions({ original: true }),
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    await wrapper.setProps({
      options: createOptions({ original: true, margin: 3 }),
    })
    await flushPromises()

    firstIco.reject(new Error('stale ico'))
    firstSvg.reject(new Error('stale svg'))
    await flushPromises()

    const downloads = getDownloadMap(wrapper)
    expect(downloads['favicon.ico']).toBe('blob:ico-new')
    expect(downloads['favicon.svg']).toBe('blob:svg-new')
    expect(messageErrorMock).not.toHaveBeenCalled()
  })
})
