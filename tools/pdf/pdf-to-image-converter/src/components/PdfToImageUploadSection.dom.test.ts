import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NDescriptions: wrapper('NDescriptions'),
    NDescriptionsItem: wrapper('NDescriptionsItem'),
    NFlex: wrapper('NFlex'),
    NText: wrapper('NText'),
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
  uploadedFileType: '',
  numPages: 0,
}

describe('PdfToImageUploadSection', () => {
  it('re-emits uploaded file', async () => {
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

  it('shows uploaded file information', () => {
    const wrapper = mount(PdfToImageUploadSection, {
      props: {
        ...baseProps,
        uploadedFileName: 'example.pdf',
        uploadedFileSize: 1024,
        uploadedFileType: 'application/pdf',
        numPages: 3,
      },
    })

    expect(wrapper.text()).toContain('example.pdf')
    expect(wrapper.text()).toContain('application/pdf')
    expect(wrapper.text()).toContain('3')
  })
})
