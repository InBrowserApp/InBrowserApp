import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { filesize } from 'filesize'
import PDFCompressorTool from './PDFCompressorTool.vue'

const file = ref<File | null>(null)
const pageCount = ref<number | null>(null)
const preset = ref<'safe' | 'balanced' | 'max-lossless'>('balanced')
const options = ref({
  compressStreams: true,
  recompressFlate: true,
  compressionLevel: 6,
  objectStreams: 'generate' as const,
  linearize: false,
})
const isLoadingDocument = ref(false)
const isCompressing = ref(false)
const fileErrorCode = ref('')
const compressionErrorCode = ref('')
const resultBlob = ref<Blob | null>(null)
const resultUrl = ref<string | undefined>(undefined)
const resultFilename = ref('demo-compressed.pdf')

const state = {
  file,
  pageCount,
  preset,
  options,
  isLoadingDocument,
  isCompressing,
  fileErrorCode,
  compressionErrorCode,
  resultBlob,
  resultUrl,
  resultFilename,
  canCompress: computed(
    () =>
      Boolean(file.value) &&
      !isLoadingDocument.value &&
      !isCompressing.value &&
      !fileErrorCode.value,
  ),
  hasResult: computed(() => Boolean(resultBlob.value)),
  handleUpload: vi.fn(),
  clearFile: vi.fn(),
  compress: vi.fn(),
}

vi.mock('./usePdfCompressor', () => ({
  usePdfCompressor: () => state,
}))

vi.mock('vue-i18n', () => ({
  useI18n: ({ messages }: { messages: Record<string, Record<string, string>> }) => ({
    t: (key: string, values?: Record<string, string | number>) => {
      const template = messages.en?.[key] ?? key
      return Object.entries(values ?? {}).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        template,
      )
    },
  }),
}))

vi.mock('@shared/ui/domain/pdf', () => ({
  PDFUpload: {
    name: 'PDFUpload',
    emits: ['upload-file'],
    methods: {
      emitUpload(this: { $emit: (event: string, file: File) => void }) {
        this.$emit(
          'upload-file',
          new globalThis.File(['pdf'], 'uploaded.pdf', { type: 'application/pdf' }),
        )
      },
    },
    template: '<button class="upload" @click="emitUpload" />',
  },
}))

vi.mock('@shared/ui/tool', () => ({
  ToolConfigHeader: {
    template: '<h2 class="config-header">Configuration</h2>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3><slot /></h3>',
  },
}))

vi.mock('naive-ui', () => ({
  NAlert: {
    props: ['title', 'type'],
    template:
      '<div class="alert" :data-title="title" :data-type="type"><strong>{{ title }}</strong><slot /></div>',
  },
  NButton: {
    props: ['tag', 'href', 'download', 'disabled', 'tertiary', 'type'],
    emits: ['click'],
    template:
      '<component :is="tag === \'a\' ? \'a\' : \'button\'" class="button" :href="href" :download="download" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></component>',
  },
  NCollapseTransition: {
    props: ['show'],
    template: '<div v-if="show"><slot /></div>',
  },
  NFlex: {
    template: '<div class="flex"><slot /></div>',
  },
  NForm: {
    template: '<form><slot /></form>',
  },
  NFormItem: {
    props: ['label'],
    template: '<label><span>{{ label }}</span><slot /></label>',
  },
  NGrid: {
    template: '<div class="grid"><slot /></div>',
  },
  NGridItem: {
    template: '<div class="grid-item"><slot /></div>',
  },
  NRadioButton: {
    props: ['value'],
    template: '<button class="radio-button" :data-value="value"><slot /></button>',
  },
  NRadioGroup: {
    props: ['value'],
    emits: ['update:value'],
    template:
      '<div class="radio-group" @click="$emit(\'update:value\', $event.target.dataset.value)"><slot /></div>',
  },
  NSlider: {
    props: ['value', 'min', 'max', 'step'],
    emits: ['update:value'],
    template:
      '<input class="slider" type="range" :value="value" :min="min" :max="max" :step="step" @input="$emit(\'update:value\', Number($event.target.value))" />',
  },
  NStatistic: {
    props: ['label', 'value'],
    template:
      '<div class="stat"><span>{{ label }}</span><span>{{ value }}</span><slot name="suffix" /></div>',
  },
  NSwitch: {
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input class="switch" type="checkbox" :checked="value" @change="$emit(\'update:value\', $event.target.checked)" />',
  },
  NTag: {
    template: '<span class="tag"><slot /></span>',
  },
  NText: {
    props: ['depth', 'strong'],
    template: '<span class="text"><slot /></span>',
  },
}))

const resetState = () => {
  state.file.value = null
  state.pageCount.value = null
  state.preset.value = 'balanced'
  state.options.value = {
    compressStreams: true,
    recompressFlate: true,
    compressionLevel: 6,
    objectStreams: 'generate',
    linearize: false,
  }
  state.isLoadingDocument.value = false
  state.isCompressing.value = false
  state.fileErrorCode.value = ''
  state.compressionErrorCode.value = ''
  state.resultBlob.value = null
  state.resultUrl.value = undefined
  state.resultFilename.value = 'demo-compressed.pdf'
  state.handleUpload.mockReset()
  state.compress.mockReset()
}

describe('PDFCompressorTool', () => {
  beforeEach(() => {
    resetState()
  })

  it('renders the initial helper content and forwards uploads', async () => {
    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.text()).toContain('Upload PDF')
    expect(wrapper.text()).toContain('Runs locally in your browser. No uploads.')
    expect(wrapper.text()).toContain('Recommended. Recompresses flate streams')
    expect(wrapper.find('[data-test="download-link"]').exists()).toBe(false)

    await wrapper.get('button.upload').trigger('click')
    expect(state.handleUpload).toHaveBeenCalledTimes(1)
    expect(state.handleUpload.mock.calls[0]?.[0]).toBeInstanceOf(File)
  })

  it('toggles advanced options and triggers compression', async () => {
    state.file.value = new File(['pdf'], 'advanced.pdf', { type: 'application/pdf' })
    state.pageCount.value = 4
    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.find('[data-test="advanced-options"]').exists()).toBe(false)

    await wrapper.get('[data-test="advanced-toggle"]').trigger('click')
    expect(wrapper.find('[data-test="advanced-options"]').exists()).toBe(true)

    await wrapper.findAll('.radio-button')[0]!.trigger('click')
    expect(state.preset.value).toBe('safe')
    expect(wrapper.get('[data-test="preset-hint"]').text()).toContain(
      'Compresses uncompressed streams',
    )

    await wrapper.findAll('.radio-button')[3]!.trigger('click')
    expect(state.options.value.objectStreams).toBe('preserve')

    const switches = wrapper.findAll('.switch')
    await switches[0]!.setValue(false)
    await switches[1]!.setValue(false)
    await switches[2]!.setValue(true)
    await wrapper.get('.slider').setValue(3)

    expect(state.options.value.compressStreams).toBe(false)
    expect(state.options.value.recompressFlate).toBe(false)
    expect(state.options.value.linearize).toBe(true)
    expect(state.options.value.compressionLevel).toBe(3)

    await wrapper.get('[data-test="compress-action"]').trigger('click')
    expect(state.compress).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-test="selected-file"]').text()).toContain('advanced.pdf')
    expect(wrapper.get('[data-test="selected-file"]').text()).toContain('4 page(s)')
  })

  it('renders the max-lossless preset hint', () => {
    state.preset.value = 'max-lossless'

    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.get('[data-test="preset-hint"]').text()).toContain(
      'Most aggressive lossless rewrite',
    )
  })

  it('renders success results with download link and linearized badge', () => {
    state.file.value = new File(['1234567890'], 'small.pdf', { type: 'application/pdf' })
    state.pageCount.value = 2
    state.resultBlob.value = new Blob(['12345'], { type: 'application/pdf' })
    state.resultUrl.value = 'blob:compressed'
    state.options.value.linearize = true

    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.get('[data-test="result-summary"]').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.get('[data-test="linearized-badge"]').text()).toContain('Fast web view enabled')
    expect(wrapper.get('[data-test="download-link"]').attributes('href')).toBe('blob:compressed')
    expect(wrapper.get('[data-test="download-link"]').attributes('download')).toBe(
      'demo-compressed.pdf',
    )
  })

  it('renders same-size and larger-size result messages', () => {
    state.file.value = new File(['12345'], 'same.pdf', { type: 'application/pdf' })
    state.pageCount.value = 1
    state.resultBlob.value = new Blob(['12345'], { type: 'application/pdf' })
    state.resultUrl.value = 'blob:same'

    const sameWrapper = mount(PDFCompressorTool)
    expect(sameWrapper.get('[data-test="result-summary"]').attributes('data-type')).toBe('info')
    expect(sameWrapper.text()).toContain('same size as the original')

    resetState()
    state.file.value = new File(['12345'], 'larger.pdf', { type: 'application/pdf' })
    state.pageCount.value = 1
    state.resultBlob.value = new Blob(['123456789'], { type: 'application/pdf' })
    state.resultUrl.value = 'blob:larger'

    const largerWrapper = mount(PDFCompressorTool)
    expect(largerWrapper.get('[data-test="result-summary"]').attributes('data-type')).toBe(
      'warning',
    )
    expect(largerWrapper.text()).toContain('larger')
  })

  it('renders inspection and error states', () => {
    state.file.value = new File(['pdf'], 'broken.pdf', { type: 'application/pdf' })
    state.isLoadingDocument.value = true
    state.fileErrorCode.value = 'invalid-pdf'
    state.isCompressing.value = true

    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.get('[data-test="selected-file"]').text()).toContain('Reading PDF information')
    expect(wrapper.get('[data-test="error-alert"]').text()).toContain(
      'This file is not a valid PDF.',
    )
    expect(wrapper.get('[data-test="compress-action"]').text()).toContain('Compressing...')
  })

  it('renders encrypted and compression-specific error messages', () => {
    state.file.value = new File(['pdf'], 'locked.pdf', { type: 'application/pdf' })
    state.fileErrorCode.value = 'encrypted-pdf'

    const encryptedWrapper = mount(PDFCompressorTool)
    expect(encryptedWrapper.get('[data-test="error-alert"]').text()).toContain(
      'Encrypted PDF detected',
    )

    resetState()
    state.file.value = new File(['pdf'], 'worker.pdf', { type: 'application/pdf' })
    state.compressionErrorCode.value = 'worker-not-supported'

    const workerWrapper = mount(PDFCompressorTool)
    expect(workerWrapper.get('[data-test="error-alert"]').text()).toContain(
      'does not support Web Worker',
    )

    resetState()
    state.file.value = new File(['pdf'], 'failed.pdf', { type: 'application/pdf' })
    state.compressionErrorCode.value = 'compression-failed'

    const failedWrapper = mount(PDFCompressorTool)
    expect(failedWrapper.get('[data-test="error-alert"]').text()).toContain(
      'PDF compression failed',
    )
  })

  it('exposes zero-value computed stats before a result exists', () => {
    const wrapper = mount(PDFCompressorTool)
    const vm = wrapper.vm as unknown as {
      savedBytes: number
      reductionPercent: number
      formattedOriginalSize: string
      formattedCompressedSize: string
    }

    expect(vm.savedBytes).toBe(0)
    expect(vm.reductionPercent).toBe(0)
    expect(vm.formattedOriginalSize).toBe(filesize(0))
    expect(vm.formattedCompressedSize).toBe(filesize(0))
  })

  it('renders fallback metadata when page count or object URL is unavailable', () => {
    state.file.value = new File(['123456'], 'fallback.pdf', { type: 'application/pdf' })
    state.pageCount.value = null
    state.resultBlob.value = new Blob(['123'], { type: 'application/pdf' })

    const wrapper = mount(PDFCompressorTool)

    expect(wrapper.text()).toContain('Pages--')
    expect(wrapper.get('[data-test="download-link"]').attributes('href')).toBeUndefined()
  })
})
