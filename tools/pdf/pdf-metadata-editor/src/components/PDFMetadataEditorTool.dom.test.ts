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

const PDFUploadStub = defineComponent({
  name: 'PDFUpload',
  emits: ['upload-file'],
  template: '<div class="pdf-upload" />',
})

const sectionStubs = {
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  ToolSectionHeader: defineComponent({ template: '<h2><slot /></h2>' }),
  NAlert: defineComponent({
    props: ['title'],
    template: '<div class="n-alert"><strong>{{ title }}</strong><slot /></div>',
  }),
  NButton: defineComponent({
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  }),
  NFlex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  NSpin: defineComponent({ template: '<div class="n-spin" />' }),
  NText: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  PDFUpload: PDFUploadStub,
  PDFMetadataEditorSections: defineComponent({
    props: ['currentTitle', 'editTitle', 'saveTitle', 'canEdit'],
    template:
      '<div class="editor-sections"><div class="current-section">{{ currentTitle }}</div><div v-if="canEdit" class="form-section">{{ editTitle }}</div><div v-if="canEdit" class="save-section">{{ saveTitle }}</div></div>',
  }),
}

const createComposableState = (overrides?: Record<string, unknown>) => ({
  file: ref<File | null>(null),
  info: ref(null),
  fields: {
    title: { mode: 'preserve', value: '' },
    author: { mode: 'preserve', value: '' },
    subject: { mode: 'preserve', value: '' },
    keywords: { mode: 'preserve', value: '' },
    creator: { mode: 'preserve', value: '' },
    producer: { mode: 'preserve', value: '' },
    creationDate: { mode: 'preserve', value: '' },
    modificationDate: { mode: 'preserve', value: '' },
  },
  isLoading: ref(false),
  isSaving: ref(false),
  errorMessage: ref(''),
  validationFieldKeys: computed(() => []),
  changeSummary: computed(() => []),
  canGenerate: computed(() => false),
  resultFilename: ref(''),
  resultUrl: computed(() => undefined),
  handleUpload: vi.fn(),
  clearFile: vi.fn(),
  setFieldMode: vi.fn(),
  setFieldValue: vi.fn(),
  restoreField: vi.fn(),
  clearAllFields: vi.fn(),
  generate: vi.fn(),
  ...overrides,
})

describe('PDFMetadataEditorTool', () => {
  beforeEach(() => {
    hoisted.usePdfMetadataEditorMock.mockReset()
  })

  it('renders upload and loading states and forwards upload action', async () => {
    const state = createComposableState({
      file: ref(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })),
      isLoading: ref(true),
    })
    hoisted.usePdfMetadataEditorMock.mockReturnValue(state)

    const wrapper = mount(PDFMetadataEditorTool, {
      global: {
        plugins: [i18n],
        stubs: sectionStubs,
      },
    })

    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    wrapper.findComponent(PDFUploadStub).vm.$emit('upload-file', file)
    await wrapper.find('.n-button').trigger('click')

    expect(wrapper.text()).toContain('Reading PDF metadata...')
    expect(state.handleUpload).toHaveBeenCalledWith(file)
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
