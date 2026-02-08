import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import GifToAnimatedWebpConverterView from './GifToAnimatedWebpConverterView.vue'
import type { GifToAnimatedWebpResult } from './types'
import { convertGifToAnimatedWebp } from './utils/convert-gif-to-animated-webp'
import { createWebpZip } from './utils/create-webp-zip'

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('./utils/convert-gif-to-animated-webp', () => ({
  convertGifToAnimatedWebp: vi.fn(),
}))

vi.mock('./utils/create-webp-zip', () => ({
  createWebpZip: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')

  return {
    ...actual,
    useMessage: () => messageMock,
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="alert"><slot /></div>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: defineComponent({
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div><slot /></div>',
  }),
  ToolSection: defineComponent({
    name: 'ToolSection',
    template: '<section><slot /></section>',
  }),
  ToolSectionHeader: defineComponent({
    name: 'ToolSectionHeader',
    template: '<header><slot /></header>',
  }),
}))

const UploadSectionStub = defineComponent({
  name: 'GifToAnimatedWebpUploadSection',
  props: ['files'],
  emits: ['update:files'],
  template: '<div class="upload" />',
})

const OptionsSectionStub = defineComponent({
  name: 'GifToAnimatedWebpOptionsSection',
  props: ['scale', 'speed', 'loopMode', 'loopCount', 'isConverting', 'canConvert'],
  emits: ['update:scale', 'update:speed', 'update:loopMode', 'update:loopCount', 'convert'],
  template: '<button class="convert" @click="$emit(\'convert\')">convert</button>',
})

const ResultsSectionStub = defineComponent({
  name: 'GifToAnimatedWebpResultsSection',
  props: ['results', 'zipBlob', 'isZipping', 'downloadZipName'],
  template: '<div class="results">{{ results.length }}</div>',
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const mockedConvert = vi.mocked(convertGifToAnimatedWebp)
const mockedZip = vi.mocked(createWebpZip)

function createFile(name: string) {
  return new File(['gif'], name, { type: 'image/gif' })
}

function createResult(file: File, outputName: string): GifToAnimatedWebpResult {
  return {
    file,
    blob: new Blob(['webp'], { type: 'image/webp' }),
    outputName,
    originalWidth: 120,
    originalHeight: 90,
    outputWidth: 120,
    outputHeight: 90,
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

function mountView() {
  return mount(GifToAnimatedWebpConverterView, {
    global: {
      plugins: [i18n],
      stubs: {
        GifToAnimatedWebpUploadSection: UploadSectionStub,
        GifToAnimatedWebpOptionsSection: OptionsSectionStub,
        GifToAnimatedWebpResultsSection: ResultsSectionStub,
      },
    },
  })
}

describe('GifToAnimatedWebpConverterView error branches', () => {
  beforeEach(() => {
    mockedConvert.mockReset()
    mockedZip.mockReset()
    messageMock.success.mockClear()
    messageMock.error.mockClear()
  })

  it('handles partial failures and deduplicates generated output names', async () => {
    const wrapper = mountView()
    const files = [createFile('same.gif'), createFile('same.gif')]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()
    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:loopMode', 'custom')
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'same.webp'))
    mockedConvert.mockRejectedValueOnce(new Error('EMPTY_GIF'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).toHaveBeenNthCalledWith(
      1,
      files[0],
      expect.objectContaining({ loopMode: 'custom', loopCount: 1 }),
      'same.webp',
    )
    expect(mockedConvert).toHaveBeenNthCalledWith(
      2,
      files[1],
      expect.objectContaining({ loopMode: 'custom', loopCount: 1 }),
      'same-2.webp',
    )
    expect(messageMock.error).toHaveBeenCalledWith('1 files failed to convert.')
    expect(wrapper.text()).toContain('1 files failed to convert.')
  })

  it('reports a zip creation error while keeping successful conversion results', async () => {
    const wrapper = mountView()
    const files = [createFile('a.gif'), createFile('b.gif')]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'a.webp'))
    mockedConvert.mockResolvedValueOnce(createResult(files[1]!, 'b.webp'))
    mockedZip.mockRejectedValueOnce(new Error('zip failed'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedZip).toHaveBeenCalledTimes(1)
    expect(messageMock.error).toHaveBeenCalledWith('Failed to create ZIP file.')
    expect(wrapper.text()).toContain('Failed to create ZIP file.')
  })

  it('maps INVALID_FRAME failures to a localized error', async () => {
    const wrapper = mountView()
    const file = createFile('broken.gif')

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('INVALID_FRAME'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to decode GIF frames.')
  })

  it('maps CANVAS_CONTEXT_UNAVAILABLE failures to a localized error', async () => {
    const wrapper = mountView()
    const file = createFile('canvas.gif')

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('CANVAS_CONTEXT_UNAVAILABLE'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Canvas rendering is unavailable.')
  })

  it('falls back to generic messages for unknown and non-error throws', async () => {
    const wrapper = mountView()
    const files = [createFile('unknown.gif'), createFile('non-error.gif')]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('SOMETHING_ELSE'))
    mockedConvert.mockRejectedValueOnce('boom')

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(messageMock.error).toHaveBeenLastCalledWith('Failed to convert GIFs. Please try again.')
    expect(wrapper.text()).toContain('Failed to convert GIFs. Please try again.')
  })

  it('applies option updates and falls back to image.webp for extension-only names', async () => {
    const wrapper = mountView()
    const file = createFile('.gif')

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    const options = wrapper.findComponent(OptionsSectionStub)
    options.vm.$emit('update:scale', 180)
    options.vm.$emit('update:speed', 2)
    options.vm.$emit('update:loopMode', 'custom')
    options.vm.$emit('update:loopCount', 5)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(file, 'image.webp'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        scale: 180,
        speed: 2,
        loopMode: 'custom',
        loopCount: 5,
      }),
      'image.webp',
    )
  })

  it('cancels an in-flight conversion when options change mid-run', async () => {
    const wrapper = mountView()
    const file = createFile('race.gif')
    const deferred = createDeferred<GifToAnimatedWebpResult>()

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    mockedConvert.mockImplementationOnce(() => deferred.promise)

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:scale', 140)
    await flushPromises()

    deferred.resolve(createResult(file, 'race.webp'))
    await flushPromises()

    expect(messageMock.success).not.toHaveBeenCalled()
    expect(messageMock.error).not.toHaveBeenCalled()
    expect(wrapper.findComponent(ResultsSectionStub).exists()).toBe(false)
  })

  it('abandons zip results when state changes before zip resolves', async () => {
    const wrapper = mountView()
    const files = [createFile('a.gif'), createFile('b.gif')]
    const zipDeferred = createDeferred<Blob>()

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'a.webp'))
    mockedConvert.mockResolvedValueOnce(createResult(files[1]!, 'b.webp'))
    mockedZip.mockImplementationOnce(() => zipDeferred.promise)

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:speed', 1.5)
    await flushPromises()

    zipDeferred.resolve(new Blob(['zip']))
    await flushPromises()

    expect(messageMock.success).not.toHaveBeenCalled()
    expect(messageMock.error).not.toHaveBeenCalledWith('Failed to create ZIP file.')
    expect(wrapper.findComponent(ResultsSectionStub).exists()).toBe(false)
  })

  it('abandons zip errors when state changes before zip rejection settles', async () => {
    const wrapper = mountView()
    const files = [createFile('c.gif'), createFile('d.gif')]
    const zipDeferred = createDeferred<Blob>()

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'c.webp'))
    mockedConvert.mockResolvedValueOnce(createResult(files[1]!, 'd.webp'))
    mockedZip.mockImplementationOnce(() => zipDeferred.promise)

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:loopMode', 'infinite')
    await flushPromises()

    zipDeferred.reject(new Error('zip failed'))
    await flushPromises()

    expect(messageMock.error).not.toHaveBeenCalledWith('Failed to create ZIP file.')
    expect(wrapper.findComponent(ResultsSectionStub).exists()).toBe(false)
  })

  it('stops before reporting errors when a stale run finishes with failures', async () => {
    const wrapper = mountView()
    const files = [createFile('first.gif'), createFile('second.gif')]
    const secondDeferred = createDeferred<GifToAnimatedWebpResult>()

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockRejectedValueOnce(new Error('INVALID_GIF'))
    mockedConvert.mockImplementationOnce(() => secondDeferred.promise)

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:speed', 1.5)
    await flushPromises()

    secondDeferred.reject(new Error('EMPTY_GIF'))
    await flushPromises()

    expect(messageMock.success).not.toHaveBeenCalled()
    expect(messageMock.error).not.toHaveBeenCalled()
    expect(wrapper.findComponent(ResultsSectionStub).exists()).toBe(false)
  })

  it('falls back to convertFailed when files.length is truthy but iterable is empty', async () => {
    const wrapper = mountView()
    const filesLike = {
      length: 1,
      *[Symbol.iterator]() {},
    } as unknown as File[]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', filesLike)
    await flushPromises()

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).not.toHaveBeenCalled()
    expect(messageMock.error).toHaveBeenCalledWith('Failed to convert GIFs. Please try again.')
    expect(wrapper.text()).toContain('Failed to convert GIFs. Please try again.')
  })
})
