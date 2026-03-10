import { vi } from 'vitest'
import { NUpload } from 'naive-ui'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'

const messageErrorMock = vi.fn()

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

import PDFOrganizerUploadSection from './PDFOrganizerUploadSection.vue'

describe('PDFOrganizerUploadSection', () => {
  it('shows file metadata, maps errors, and emits upload/clear actions', async () => {
    const scrollIntoViewMock = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    })

    const wrapper = mount(PDFOrganizerUploadSection, {
      props: {
        fileErrorCode: PDF_ERROR.Invalid,
        fileName: 'demo.pdf',
        pageCount: 7,
      },
    })

    expect(wrapper.text()).toContain('demo.pdf')
    expect(wrapper.text()).toContain('7')
    expect(wrapper.text()).toContain('Failed to read PDF file')

    await wrapper.getComponent(NUpload).vm.$emit('before-upload', {
      file: {
        file: new File(['pdf'], 'selected.pdf', { type: 'application/pdf' }),
      },
    })

    expect(wrapper.emitted('upload')?.[0]).toEqual([
      expect.objectContaining({ name: 'selected.pdf' }),
    ])

    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1]?.trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
    ;(wrapper.vm as unknown as { scrollIntoView: () => void }).scrollIntoView()
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('handles missing files, non-pdf uploads, and fallback error messages', async () => {
    messageErrorMock.mockReset()

    const wrapper = mount(PDFOrganizerUploadSection, {
      props: {
        fileErrorCode: 'OTHER',
        fileName: '',
        pageCount: 0,
      },
    })

    expect(wrapper.text()).toContain('Failed to load PDF file')

    await wrapper.getComponent(NUpload).vm.$emit('before-upload', {
      file: {
        file: undefined,
      },
    })
    expect(wrapper.emitted('upload')).toBeUndefined()

    await wrapper.getComponent(NUpload).vm.$emit('before-upload', {
      file: {
        file: new File(['txt'], 'demo.txt', { type: 'text/plain' }),
      },
    })

    expect(messageErrorMock).toHaveBeenCalledWith('Only PDF files are allowed.')
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('renders encrypted and empty error states', () => {
    const encryptedWrapper = mount(PDFOrganizerUploadSection, {
      props: {
        fileErrorCode: PDF_ERROR.Encrypted,
        fileName: '',
        pageCount: 0,
      },
    })
    expect(encryptedWrapper.text()).toContain('Please remove the owner password first')

    const emptyWrapper = mount(PDFOrganizerUploadSection, {
      props: {
        fileErrorCode: '',
        fileName: '',
        pageCount: 0,
      },
    })
    expect(emptyWrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
