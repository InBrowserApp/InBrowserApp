import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFUpload from './PDFUpload.vue'

const { messageErrorMock } = vi.hoisted(() => ({
  messageErrorMock: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NUpload = defineComponent({
    name: 'NUpload',
    props: {
      accept: {
        type: String,
        default: '',
      },
      onBeforeUpload: {
        type: Function,
        required: false,
      },
    },
    setup(_, { slots }) {
      return () => h('div', { class: 'upload-stub' }, slots.default?.())
    },
  })

  const NUploadDragger = defineComponent({
    name: 'NUploadDragger',
    setup(_, { slots }) {
      return () => h('div', { class: 'dragger-stub' }, slots.default?.())
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    setup(_, { slots }) {
      return () => h('i', { class: 'icon-stub' }, slots.default?.())
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', { class: 'text-stub' }, slots.default?.())
    },
  })

  return {
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

beforeEach(() => {
  messageErrorMock.mockReset()
})

describe('PDFUpload', () => {
  it('emits upload-file for valid pdf files', async () => {
    const wrapper = mount(PDFUpload, {
      global: {
        stubs: {
          DocumentPdf: true,
        },
      },
    })

    const upload = wrapper.getComponent({ name: 'NUpload' })
    const beforeUpload = upload.props('onBeforeUpload') as (data: {
      file: { file: File }
      fileList: unknown[]
    }) => Promise<boolean>

    const pdfFile = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    const result = await beforeUpload({ file: { file: pdfFile }, fileList: [] })

    expect(result).toBe(false)
    expect(wrapper.emitted('upload-file')?.[0]).toEqual([pdfFile])
    expect(messageErrorMock).not.toHaveBeenCalled()
  })

  it('shows an error for non-pdf files', async () => {
    const wrapper = mount(PDFUpload, {
      global: {
        stubs: {
          DocumentPdf: true,
        },
      },
    })

    const upload = wrapper.getComponent({ name: 'NUpload' })
    const beforeUpload = upload.props('onBeforeUpload') as (data: {
      file: { file: File }
      fileList: unknown[]
    }) => Promise<boolean>

    const textFile = new File(['hello'], 'sample.txt', { type: 'text/plain' })
    const result = await beforeUpload({ file: { file: textFile }, fileList: [] })

    expect(result).toBe(false)
    expect(messageErrorMock).toHaveBeenCalledWith('Only PDF files are allowed')
    expect(wrapper.emitted('upload-file')).toBeUndefined()
  })
})
