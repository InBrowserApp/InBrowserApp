import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import GifToApngConverterView from './GifToApngConverterView.vue'
import type { GifToApngResult } from './types'
import { convertGifToApng } from './utils/convert-gif-to-apng'
import { createApngZip } from './utils/create-apng-zip'

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('./utils/convert-gif-to-apng', () => ({
  convertGifToApng: vi.fn(),
}))

vi.mock('./utils/create-apng-zip', () => ({
  createApngZip: vi.fn(),
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
  name: 'GifToApngUploadSection',
  props: ['files'],
  emits: ['update:files'],
  template: '<div class="upload" />',
})

const OptionsSectionStub = defineComponent({
  name: 'GifToApngOptionsSection',
  props: [
    'scale',
    'speed',
    'loopMode',
    'loopCount',
    'optimize',
    'optimizeLevel',
    'isConverting',
    'canConvert',
  ],
  emits: [
    'update:scale',
    'update:speed',
    'update:loopMode',
    'update:loopCount',
    'update:optimize',
    'update:optimizeLevel',
    'convert',
  ],
  template: '<button class="convert" @click="$emit(\'convert\')">convert</button>',
})

const ResultsSectionStub = defineComponent({
  name: 'GifToApngResultsSection',
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

const mockedConvert = vi.mocked(convertGifToApng)
const mockedZip = vi.mocked(createApngZip)

function createFile(name: string) {
  return new File(['gif'], name, { type: 'image/gif' })
}

function createResult(file: File, outputName: string): GifToApngResult {
  return {
    file,
    blob: new Blob(['png'], { type: 'image/png' }),
    outputName,
    originalWidth: 120,
    originalHeight: 90,
    outputWidth: 120,
    outputHeight: 90,
  }
}

function mountView() {
  return mount(GifToApngConverterView, {
    global: {
      plugins: [i18n],
      stubs: {
        GifToApngUploadSection: UploadSectionStub,
        GifToApngOptionsSection: OptionsSectionStub,
        GifToApngResultsSection: ResultsSectionStub,
      },
    },
  })
}

describe('GifToApngConverterView error branches', () => {
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

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'same.png'))
    mockedConvert.mockRejectedValueOnce(new Error('EMPTY_GIF'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).toHaveBeenNthCalledWith(
      1,
      files[0],
      expect.objectContaining({ loopMode: 'custom', loopCount: 1, optimize: true }),
      'same.png',
    )
    expect(mockedConvert).toHaveBeenNthCalledWith(
      2,
      files[1],
      expect.objectContaining({ loopMode: 'custom', loopCount: 1, optimize: true }),
      'same-2.png',
    )
    expect(messageMock.error).toHaveBeenCalledWith('1 files failed to convert.')
    expect(wrapper.text()).toContain('1 files failed to convert.')
  })

  it('reports a zip creation error while keeping successful conversion results', async () => {
    const wrapper = mountView()
    const files = [createFile('a.gif'), createFile('b.gif')]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', files)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(files[0]!, 'a.png'))
    mockedConvert.mockResolvedValueOnce(createResult(files[1]!, 'b.png'))
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

  it('applies option updates from child emits and falls back to a default output name', async () => {
    const wrapper = mountView()
    const file = createFile('.gif')

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    const options = wrapper.findComponent(OptionsSectionStub)
    options.vm.$emit('update:scale', 150)
    options.vm.$emit('update:speed', 1.5)
    options.vm.$emit('update:loopMode', 'infinite')
    options.vm.$emit('update:loopMode', 'custom')
    options.vm.$emit('update:loopCount', 4)
    options.vm.$emit('update:optimize', false)
    options.vm.$emit('update:optimizeLevel', 5)
    await flushPromises()

    mockedConvert.mockResolvedValueOnce(createResult(file, 'image.png'))

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).toHaveBeenCalledWith(
      file,
      {
        scale: 150,
        speed: 1.5,
        loopMode: 'custom',
        loopCount: 4,
        optimize: false,
        optimizeLevel: 5,
      },
      'image.png',
    )
  })

  it('shows conversion failure when file input length is non-zero but yields no items', async () => {
    const wrapper = mountView()
    const filesLike = {
      length: 1,
      *[Symbol.iterator]() {
        return
      },
    } as unknown as File[]

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', filesLike)
    await flushPromises()

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    expect(mockedConvert).not.toHaveBeenCalled()
    expect(messageMock.error).toHaveBeenCalledWith('Failed to convert GIFs. Please try again.')
    expect(wrapper.text()).toContain('Failed to convert GIFs. Please try again.')
  })
  it('ignores stale conversion results when options change mid-run', async () => {
    const wrapper = mountView()
    const file = createFile('slow.gif')

    wrapper.findComponent(UploadSectionStub).vm.$emit('update:files', [file])
    await flushPromises()

    let resolveConvert: ((value: GifToApngResult) => void) | undefined
    mockedConvert.mockImplementationOnce(
      () =>
        new Promise<GifToApngResult>((resolve) => {
          resolveConvert = resolve
        }),
    )

    await wrapper.find('button.convert').trigger('click')
    await flushPromises()

    wrapper.findComponent(OptionsSectionStub).vm.$emit('update:scale', 200)
    await flushPromises()

    resolveConvert?.(createResult(file, 'slow.png'))
    await flushPromises()

    expect(wrapper.findComponent(ResultsSectionStub).exists()).toBe(false)
    expect(messageMock.success).not.toHaveBeenCalled()
  })
})
