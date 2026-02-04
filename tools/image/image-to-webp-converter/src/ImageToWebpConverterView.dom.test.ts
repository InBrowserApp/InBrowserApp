import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import ImageToWebpConverterView from './ImageToWebpConverterView.vue'
import type { WebpConversionResult } from './types'

const state = {
  results: ref<WebpConversionResult[]>([]),
  zipBlob: ref<Blob | null>(null),
  error: ref(''),
  isConverting: ref(false),
  isZipping: ref(false),
  canConvert: ref(true),
  convertImages: vi.fn(),
}

const makeResult = (): WebpConversionResult => ({
  file: new File(['data'], 'sample.png', { type: 'image/png' }),
  blob: new Blob(),
  outputName: 'output.webp',
  originalWidth: 100,
  originalHeight: 100,
  outputWidth: 80,
  outputHeight: 80,
})

const useWebpConversionMock = vi.fn((options) => {
  options.messages.convertSuccess()
  options.messages.convertFailed()
  options.messages.partialFailed(2)
  options.messages.zipFailed()
  options.messages.invalidImage()
  options.messages.canvasUnavailable()
  return state
})

vi.mock('./composables/useWebpConversion', () => ({
  useWebpConversion: (options: Parameters<typeof useWebpConversionMock>[0]) =>
    useWebpConversionMock(options),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const NAlert = defineComponent({
    name: 'NAlert',
    props: ['type', 'showIcon'],
    template: '<div class="n-alert"><slot /></div>',
  })

  return {
    NAlert,
    useMessage: () => ({ success: vi.fn(), error: vi.fn() }),
  }
})

const UploadStub = defineComponent({
  name: 'ImageToWebpUploadSection',
  emits: ['update:files'],
  setup(_, { emit }) {
    const sendFiles = () =>
      emit('update:files', [new File(['data'], 'sample.png', { type: 'image/png' })])
    return { sendFiles }
  },
  template: '<button class="upload" @click="sendFiles">upload</button>',
})

const OptionsStub = defineComponent({
  name: 'ImageToWebpOptionsSection',
  template: '<div class="options" />',
})

const ResultsStub = defineComponent({
  name: 'ImageToWebpResultsSection',
  props: ['results', 'zipBlob', 'isZipping', 'downloadZipName'],
  template: '<div class="results">{{ results.length }}</div>',
})

const NoteStub = defineComponent({
  name: 'ImageToWebpNote',
  template: '<div class="note" />',
})

const layoutStubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('ImageToWebpConverterView', () => {
  beforeEach(() => {
    state.results.value = []
    state.zipBlob.value = null
    state.error.value = ''
    state.isConverting.value = false
    state.isZipping.value = false
    state.canConvert.value = true
    state.convertImages.mockClear()
    useWebpConversionMock.mockClear()
  })

  it('renders upload and note by default', () => {
    const wrapper = mount(ImageToWebpConverterView, {
      global: {
        stubs: {
          ...layoutStubs,
          ImageToWebpUploadSection: UploadStub,
          ImageToWebpOptionsSection: OptionsStub,
          ImageToWebpResultsSection: ResultsStub,
          ImageToWebpNote: NoteStub,
        },
      },
    })

    expect(wrapper.find('.upload').exists()).toBe(true)
    expect(wrapper.find('.note').exists()).toBe(true)
    expect(wrapper.find('.options').exists()).toBe(false)
    expect(wrapper.find('.results').exists()).toBe(false)
    expect(wrapper.find('.n-alert').exists()).toBe(false)
  })

  it('shows options, results, and error when state updates', async () => {
    const wrapper = mount(ImageToWebpConverterView, {
      global: {
        stubs: {
          ...layoutStubs,
          ImageToWebpUploadSection: UploadStub,
          ImageToWebpOptionsSection: OptionsStub,
          ImageToWebpResultsSection: ResultsStub,
          ImageToWebpNote: NoteStub,
        },
      },
    })

    await wrapper.find('.upload').trigger('click')
    state.results.value = [makeResult()]
    state.zipBlob.value = new Blob()
    state.error.value = 'Conversion failed'
    await nextTick()

    expect(wrapper.find('.options').exists()).toBe(true)
    expect(wrapper.find('.results').text()).toContain('1')
    expect(wrapper.find('.n-alert').text()).toContain('Conversion failed')
  })
})
