import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PDFWatermarkUploadSection from './PDFWatermarkUploadSection.vue'

const createProps = (
  overrides: Partial<InstanceType<typeof PDFWatermarkUploadSection>['$props']> = {},
) => ({
  title: 'Upload PDF',
  chooseFileLabel: 'Upload PDF',
  replaceFileLabel: 'Replace PDF',
  clearFileLabel: 'Clear PDF',
  privacyHint: 'Local only',
  fileNameText: 'File name: sample.pdf',
  pageCountText: 'Page count: 4',
  fileErrorMessage: '',
  file: null,
  isLoadingDocument: false,
  isGenerating: false,
  ...overrides,
})

describe('PDFWatermarkUploadSection', () => {
  it('opens the file dialog and emits upload for the selected pdf', async () => {
    const wrapper = mount(PDFWatermarkUploadSection, {
      props: createProps(),
    })

    const fileInput = wrapper.get('input[type="file"]')
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

    await wrapper.get('[data-test="choose-file-button"]').trigger('click')
    expect(clickSpy).toHaveBeenCalledTimes(1)

    const selectedFile = new File(['pdf'], 'demo.pdf', { type: 'application/pdf' })
    Object.defineProperty(fileInput.element, 'files', {
      value: [selectedFile],
      configurable: true,
    })

    await fileInput.trigger('change')
    expect(wrapper.emitted('upload')).toEqual([[selectedFile]])

    Object.defineProperty(fileInput.element, 'files', {
      value: [],
      configurable: true,
    })

    await fileInput.trigger('change')
    expect(wrapper.emitted('upload')).toHaveLength(1)

    clickSpy.mockRestore()
  })

  it('renders file metadata, error message, and clear action for an uploaded file', async () => {
    const selectedFile = new File(['pdf'], 'report.pdf', { type: 'application/pdf' })
    const wrapper = mount(PDFWatermarkUploadSection, {
      props: createProps({
        file: selectedFile,
        fileErrorMessage: 'Failed to read PDF file.',
      }),
    })

    expect(wrapper.text()).toContain('Replace PDF')
    expect(wrapper.get('[data-test="file-meta"]').text()).toContain('File name: sample.pdf')
    expect(wrapper.get('[data-test="file-meta"]').text()).toContain('Page count: 4')
    expect(wrapper.text()).toContain('Failed to read PDF file.')

    await wrapper.get('[data-test="clear-file-button"]').trigger('click')
    expect(wrapper.emitted('clear-file')).toEqual([[]])
  })

  it('disables upload actions while generation is running', () => {
    const selectedFile = new File(['pdf'], 'report.pdf', { type: 'application/pdf' })
    const wrapper = mount(PDFWatermarkUploadSection, {
      props: createProps({
        file: selectedFile,
        isGenerating: true,
      }),
    })

    expect(wrapper.get('[data-test="choose-file-button"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-test="clear-file-button"]').attributes('disabled')).toBeDefined()
  })
})
