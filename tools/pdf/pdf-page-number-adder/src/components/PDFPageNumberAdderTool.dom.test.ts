import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const handleUploadMock = vi.fn(async () => ({ success: true }))
const generateMock = vi.fn(async () => ({ success: true }))
const clearFileMock = vi.fn()
const setRangeInputMock = vi.fn()
const setStartNumberMock = vi.fn()
const setFormatMock = vi.fn()
const setFontFamilyMock = vi.fn()
const setPositionMock = vi.fn()
const setFontSizeMock = vi.fn()
const setMarginXMock = vi.fn()
const setMarginYMock = vi.fn()

const fileRef = ref<File | null>(null)
const pageCountRef = ref(0)
const rangeInputRef = ref('')
const startNumberRef = ref(1)
const formatRef = ref<'n' | 'n-total'>('n')
const fontFamilyRef = ref<'sans-serif' | 'serif'>('sans-serif')
const positionRef = ref<
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
>('bottom-center')
const fontSizeRef = ref(12)
const marginXRef = ref(24)
const marginYRef = ref(24)
const isLoadingDocumentRef = ref(false)
const isGeneratingRef = ref(false)
const fileErrorCodeRef = ref('')
const rangeErrorCodeRef = ref('')
const generateErrorCodeRef = ref('')
const resultFilenameRef = ref('result.pdf')
const resultUrlRef = ref<string | null>(null)
const canGenerateRef = ref(true)
const hasResultRef = ref(false)

vi.mock('./usePdfPageNumberAdder', () => ({
  usePdfPageNumberAdder: () => ({
    file: fileRef,
    pageCount: pageCountRef,
    rangeInput: rangeInputRef,
    startNumber: startNumberRef,
    format: formatRef,
    fontFamily: fontFamilyRef,
    position: positionRef,
    fontSize: fontSizeRef,
    marginX: marginXRef,
    marginY: marginYRef,
    isLoadingDocument: isLoadingDocumentRef,
    isGenerating: isGeneratingRef,
    fileErrorCode: fileErrorCodeRef,
    rangeErrorCode: rangeErrorCodeRef,
    generateErrorCode: generateErrorCodeRef,
    resultFilename: resultFilenameRef,
    resultUrl: resultUrlRef,
    canGenerate: canGenerateRef,
    hasResult: hasResultRef,
    setRangeInput: setRangeInputMock,
    setStartNumber: setStartNumberMock,
    setFormat: setFormatMock,
    setFontFamily: setFontFamilyMock,
    setPosition: setPositionMock,
    setFontSize: setFontSizeMock,
    setMarginX: setMarginXMock,
    setMarginY: setMarginYMock,
    clearFile: clearFileMock,
    handleUpload: handleUploadMock,
    generate: generateMock,
  }),
}))

vi.mock('./PDFPageNumberPreview.vue', () => ({
  default: defineComponent({
    name: 'PDFPageNumberPreview',
    template: '<div data-test="preview-section" />',
  }),
}))

import PDFPageNumberAdderTool from './PDFPageNumberAdderTool.vue'

describe('PDFPageNumberAdderTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    fileRef.value = null
    pageCountRef.value = 0
    rangeInputRef.value = ''
    startNumberRef.value = 1
    formatRef.value = 'n'
    fontFamilyRef.value = 'sans-serif'
    positionRef.value = 'bottom-center'
    fontSizeRef.value = 12
    marginXRef.value = 24
    marginYRef.value = 24
    isLoadingDocumentRef.value = false
    isGeneratingRef.value = false
    fileErrorCodeRef.value = ''
    rangeErrorCodeRef.value = ''
    generateErrorCodeRef.value = ''
    resultFilenameRef.value = 'result.pdf'
    resultUrlRef.value = null
    canGenerateRef.value = true
    hasResultRef.value = false
  })

  it('uploads selected file from hidden file input', async () => {
    const wrapper = mount(PDFPageNumberAdderTool)

    const fileInput = wrapper.get('input[type="file"]')
    Object.defineProperty(fileInput.element, 'files', {
      value: [new File(['x'], 'demo.pdf', { type: 'application/pdf' })],
      configurable: true,
    })

    await fileInput.trigger('change')

    expect(handleUploadMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'demo.pdf' }))
  })

  it('renders settings and supports generate/clear actions when file exists', async () => {
    fileRef.value = new File(['x'], 'demo.pdf', { type: 'application/pdf' })
    pageCountRef.value = 8
    startNumberRef.value = 3
    formatRef.value = 'n-total'
    hasResultRef.value = true
    resultUrlRef.value = 'blob:demo'

    const wrapper = mount(PDFPageNumberAdderTool)

    expect(wrapper.find('[data-test="settings-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="generate-section"]').exists()).toBe(true)

    const generateButton = wrapper.get('[data-test="generate-button"]')
    await generateButton.trigger('click')
    expect(generateMock).toHaveBeenCalledTimes(1)

    const clearButton = wrapper.get('[data-test="clear-file-button"]')
    await clearButton.trigger('click')
    expect(clearFileMock).toHaveBeenCalledTimes(1)

    expect(wrapper.find('[data-test="preview-section"]').exists()).toBe(true)

    for (const field of [
      'start-number-input',
      'font-family-select',
      'font-size-input',
      'margin-x-input',
      'margin-y-input',
    ]) {
      const target = wrapper.get(`[data-test="${field}"]`)
      if (field !== 'font-family-select') {
        expect(target.attributes('style')).toContain('width: 100%')
      }
    }

    const downloadAnchor = wrapper.get('a[download="result.pdf"]')
    expect(downloadAnchor.attributes('href')).toBe('blob:demo')
  })
})
