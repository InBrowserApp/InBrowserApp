import { createI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataUploadSection from './PDFMetadataUploadSection.vue'

const hoisted = vi.hoisted(() => {
  const messageErrorMock = vi.fn()
  return {
    messageErrorMock,
    useMessageMock: vi.fn(() => ({
      error: messageErrorMock,
    })),
  }
})

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    useMessage: hoisted.useMessageMock,
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  PDFMetadataSectionHeader: defineComponent({
    props: ['title'],
    template: '<h2 class="section-header">{{ title }}</h2>',
  }),
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  Space: defineComponent({ template: '<div class="n-space"><slot /></div>' }),
  Flex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  Icon: defineComponent({ template: '<div class="n-icon"><slot /></div>' }),
  Text: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  Tag: defineComponent({ template: '<span class="n-tag"><slot /></span>' }),
  Card: defineComponent({ template: '<div class="n-card"><slot /></div>' }),
  Button: defineComponent({
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  }),
  Upload: defineComponent({
    name: 'NaiveUploadStub',
    template: '<div class="n-upload"><slot /></div>',
  }),
  UploadDragger: defineComponent({
    template: '<div class="n-upload-dragger"><slot /></div>',
  }),
}

describe('PDFMetadataUploadSection', () => {
  beforeEach(() => {
    hoisted.messageErrorMock.mockReset()
  })

  it('renders empty upload state and emits upload-file for PDFs', () => {
    const wrapper = mount(PDFMetadataUploadSection, {
      props: {
        title: 'Upload PDF',
        info: null,
        isLoading: false,
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Drop a PDF to inspect and edit metadata')
    expect(wrapper.text()).toContain('Runs locally in your browser. No uploads.')

    wrapper.findComponent({ name: 'NaiveUploadStub' }).vm.$emit('before-upload', {
      file: { file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }) },
    })

    expect(wrapper.emitted('upload-file')).toEqual([
      [expect.objectContaining({ name: 'sample.pdf' })],
    ])
    expect(hoisted.messageErrorMock).not.toHaveBeenCalled()
  })

  it('renders uploaded file summary, supports replace/remove, and rejects non-PDF files', async () => {
    const wrapper = mount(PDFMetadataUploadSection, {
      props: {
        title: 'Upload PDF',
        info: {
          file: { name: 'sample.pdf', size: 100, type: 'application/pdf' },
          document: { version: '1.7', pageCount: 3, encrypted: true },
          metadata: {},
        },
        isLoading: false,
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('sample.pdf')
    expect(wrapper.text()).toContain('Pages 3')
    expect(wrapper.text()).toContain('PDF 1.7')
    expect(wrapper.text()).toContain('Encrypted')

    const uploadWrappers = wrapper.findAllComponents({ name: 'NaiveUploadStub' })
    uploadWrappers[0]?.vm.$emit('before-upload', {
      file: { file: new File(['txt'], 'sample.txt', { type: 'text/plain' }) },
    })
    uploadWrappers[0]?.vm.$emit('before-upload', {
      file: { file: new File(['pdf'], 'replacement.pdf', { type: 'application/pdf' }) },
    })
    await wrapper.findAll('.n-button')[1]?.trigger('click')

    expect(hoisted.messageErrorMock).toHaveBeenCalledWith('Only PDF files are allowed')
    expect(wrapper.emitted('upload-file')).toEqual([
      [expect.objectContaining({ name: 'replacement.pdf' })],
    ])
    expect(wrapper.emitted('clear-file')).toEqual([[]])
  })
})
