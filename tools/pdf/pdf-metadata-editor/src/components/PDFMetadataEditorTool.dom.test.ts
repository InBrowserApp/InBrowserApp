import { createI18n } from 'vue-i18n'
import { computed, defineComponent, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataEditorTool from './PDFMetadataEditorTool.vue'

const hoisted = vi.hoisted(() => ({
  usePdfMetadataEditorMock: vi.fn(),
}))

vi.mock('../composables/usePdfMetadataEditor', () => ({
  usePdfMetadataEditor: hoisted.usePdfMetadataEditorMock,
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const uploadSectionStub = defineComponent({
  name: 'PDFMetadataUploadSection',
  props: ['title', 'info', 'isLoading'],
  emits: ['upload-file', 'clear-file'],
  methods: {
    emitUploadFile() {
      this.$emit('upload-file', { name: 'sample.pdf', type: 'application/pdf' })
    },
  },
  template:
    '<div class="upload-section">{{ title }}<button class="upload-action" @click="emitUploadFile" /><button class="clear-action" @click="$emit(\'clear-file\')" /></div>',
})

const sectionStubs = {
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  NAlert: defineComponent({
    props: ['title'],
    template: '<div class="n-alert"><strong>{{ title }}</strong><slot /></div>',
  }),
  NFlex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  NSpin: defineComponent({ template: '<div class="n-spin" />' }),
  NText: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  PDFMetadataUploadSection: uploadSectionStub,
  PDFMetadataEditorSections: defineComponent({
    props: ['currentTitle', 'editTitle', 'saveTitle', 'canEdit'],
    template:
      '<div class="editor-sections"><div class="current-section">{{ currentTitle }}</div><div v-if="canEdit" class="form-section">{{ editTitle }}</div><div v-if="canEdit" class="save-section">{{ saveTitle }}</div></div>',
  }),
}

const createComposableState = (overrides?: Record<string, unknown>) => ({
  info: ref(null),
  fields: {
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    creationDate: null,
    modificationDate: null,
  },
  isLoading: ref(false),
  isSaving: ref(false),
  errorMessage: ref(''),
  changeSummary: computed(() => []),
  canGenerate: computed(() => false),
  resultFilename: ref(''),
  resultUrl: computed(() => undefined),
  handleUpload: vi.fn(),
  clearFile: vi.fn(),
  setTextFieldValue: vi.fn(),
  setDateFieldValue: vi.fn(),
  restoreField: vi.fn(),
  clearAllFields: vi.fn(),
  generate: vi.fn(),
  ...overrides,
})

describe('PDFMetadataEditorTool', () => {
  beforeEach(() => {
    hoisted.usePdfMetadataEditorMock.mockReset()
  })

  it('renders upload and loading states and forwards upload actions', async () => {
    const state = createComposableState({
      isLoading: ref(true),
    })
    hoisted.usePdfMetadataEditorMock.mockReturnValue(state)

    const wrapper = mount(PDFMetadataEditorTool, {
      global: {
        plugins: [i18n],
        stubs: sectionStubs,
      },
    })

    await wrapper.find('.upload-action').trigger('click')
    await wrapper.find('.clear-action').trigger('click')

    expect(wrapper.text()).toContain('Reading PDF metadata...')
    expect(state.handleUpload).toHaveBeenCalledWith(expect.objectContaining({ name: 'sample.pdf' }))
    expect(state.clearFile).toHaveBeenCalled()
  })

  it('renders editable sections for unlocked PDFs', () => {
    hoisted.usePdfMetadataEditorMock.mockReturnValue(
      createComposableState({
        info: ref({
          file: { name: 'sample.pdf', size: 100, type: 'application/pdf' },
          document: { version: '1.7', pageCount: 1, encrypted: false },
          metadata: {},
        }),
      }),
    )

    const wrapper = mount(PDFMetadataEditorTool, {
      global: {
        plugins: [i18n],
        stubs: sectionStubs,
      },
    })

    expect(wrapper.find('.current-section').exists()).toBe(true)
    expect(wrapper.find('.form-section').exists()).toBe(true)
    expect(wrapper.find('.save-section').exists()).toBe(true)
  })

  it('shows an encrypted notice and hides edit sections for locked PDFs', () => {
    hoisted.usePdfMetadataEditorMock.mockReturnValue(
      createComposableState({
        info: ref({
          file: { name: 'locked.pdf', size: 100, type: 'application/pdf' },
          document: { version: '1.7', pageCount: 1, encrypted: true },
          metadata: {},
        }),
      }),
    )

    const wrapper = mount(PDFMetadataEditorTool, {
      global: {
        plugins: [i18n],
        stubs: sectionStubs,
      },
    })

    expect(wrapper.text()).toContain('Encrypted PDF')
    expect(wrapper.find('.current-section').exists()).toBe(true)
    expect(wrapper.find('.form-section').exists()).toBe(false)
    expect(wrapper.find('.save-section').exists()).toBe(false)
  })
})
