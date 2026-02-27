import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const errorMock = vi.fn()

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NButton: wrapper('NButton'),
    NDescriptions: wrapper('NDescriptions'),
    NDescriptionsItem: wrapper('NDescriptionsItem'),
    NEllipsis: wrapper('NEllipsis'),
    NFlex: wrapper('NFlex'),
    NIcon: wrapper('NIcon'),
    NText: wrapper('NText'),
    NUpload: defineComponent({
      name: 'NUpload',
      emits: ['before-upload'],
      template: '<div class="n-upload"><slot /></div>',
    }),
    useMessage: () => ({
      error: errorMock,
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

vi.mock('@shared/ui/domain/pdf', () => ({
  PDFUpload: {
    name: 'PDFUpload',
    emits: ['upload-file'],
    template: '<button class="upload" @click="$emit(\'upload-file\', file)">upload</button>',
    data() {
      return {
        file: new File([new Uint8Array([1])], 'demo.pdf', { type: 'application/pdf' }),
      }
    },
  },
}))

import PdfToImageUploadSection from './PdfToImageUploadSection.vue'

const baseProps = {
  isLoadingDocument: false,
  uploadedFileName: '',
  uploadedFileSize: 0,
  numPages: 0,
}

describe('PdfToImageUploadSection', () => {
  it('re-emits uploaded file from initial uploader', async () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: baseProps,
    })

    await wrapper.get('button.upload').trigger('click')

    const events = wrapper.emitted('upload-file')
    expect(events).toHaveLength(1)
    expect(events?.[0]?.[0]).toBeInstanceOf(File)
  })

  it('shows loading text when loading', () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: {
        ...baseProps,
        isLoadingDocument: true,
      },
    })

    expect(wrapper.text()).toContain('Loading PDF pages')
  })

  it('shows uploaded file information and replacement button', () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: {
        ...baseProps,
        uploadedFileName: 'example.pdf',
        uploadedFileSize: 1024,
        numPages: 3,
      },
    })

    expect(wrapper.text()).toContain('example.pdf')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Upload a new one')
    expect(wrapper.find('button.upload').exists()).toBe(false)
  })

  it('re-emits uploaded file from replacement uploader', async () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: {
        ...baseProps,
        uploadedFileName: 'example.pdf',
        uploadedFileSize: 1024,
      },
    })

    const file = new File([new Uint8Array([1])], 'new.pdf', { type: 'application/pdf' })
    await wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })

    const events = wrapper.emitted('upload-file')
    expect(events).toHaveLength(1)
    expect(events?.[0]?.[0]).toBe(file)
  })

  it('shows error when replacement file is not pdf', async () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: {
        ...baseProps,
        uploadedFileName: 'example.pdf',
        uploadedFileSize: 1024,
      },
    })

    const file = new File([new Uint8Array([1])], 'bad.txt', { type: 'text/plain' })
    await wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })

    expect(errorMock).toHaveBeenCalledOnce()
    expect(wrapper.emitted('upload-file')).toBeUndefined()
  })
})
