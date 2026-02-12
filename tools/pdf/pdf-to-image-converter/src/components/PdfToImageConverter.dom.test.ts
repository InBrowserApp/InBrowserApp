import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PdfToImageConverter from './PdfToImageConverter.vue'

const handleUploadMock = vi.fn()
const setFormatMock = vi.fn()
const setDpiMock = vi.fn()
const setQualityMock = vi.fn()
const exportAllPagesMock = vi.fn()

vi.mock('../composables/usePdfToImageConverter', () => ({
  usePdfToImageConverter: () => ({
    page: ref(1),
    numPages: ref(2),
    format: ref('png'),
    dpi: ref(144),
    quality: ref(0.92),
    currentPageImage: ref(null),
    isLoadingDocument: ref(false),
    isRendering: ref(false),
    isExporting: ref(false),
    exportProgress: ref(0),
    errorMessage: ref(''),
    uploadedFileName: ref('demo.pdf'),
    uploadedFileSize: ref(1024),
    currentImageURL: ref('blob:current'),
    currentDownloadName: ref('p1.png'),
    zipDownloadURL: ref(null),
    zipDownloadName: ref('all.zip'),
    handleUpload: handleUploadMock,
    setFormat: setFormatMock,
    setDpi: setDpiMock,
    setQuality: setQualityMock,
    exportAllPages: exportAllPagesMock,
  }),
}))

describe('PdfToImageConverter', () => {
  it('wires child events to composable actions', async () => {
    const wrapper = mount(PdfToImageConverter, {
      global: {
        stubs: {
          PdfToImageUploadSection: {
            template: '<button @click="$emit(\'upload-file\', file)">upload</button>',
            data: () => ({
              file: new File([new Uint8Array([1])], 'demo.pdf', { type: 'application/pdf' }),
            }),
          },
          PdfToImageOptionsSection: {
            template:
              '<div><button class="format" @click="$emit(\'update:format\',\'webp\')" />' +
              '<button class="dpi" @click="$emit(\'update:dpi\',300)" />' +
              '<button class="quality" @click="$emit(\'update:quality\',0.8)" />' +
              '<button class="export" @click="$emit(\'export-all\')" /></div>',
          },
          PdfToImagePreviewSection: true,
        },
      },
    })

    await wrapper.get('button').trigger('click')
    await wrapper.get('.format').trigger('click')
    await wrapper.get('.dpi').trigger('click')
    await wrapper.get('.quality').trigger('click')
    await wrapper.get('.export').trigger('click')

    expect(handleUploadMock).toHaveBeenCalledOnce()
    expect(setFormatMock).toHaveBeenCalledWith('webp')
    expect(setDpiMock).toHaveBeenCalledWith(300)
    expect(setQualityMock).toHaveBeenCalledWith(0.8)
    expect(exportAllPagesMock).toHaveBeenCalledOnce()
  })
})
