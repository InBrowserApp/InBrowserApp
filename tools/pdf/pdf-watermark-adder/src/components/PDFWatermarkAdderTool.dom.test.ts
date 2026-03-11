import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'
import { PAGE_RANGE_ERROR } from '../utils/page-range'

const { usePdfWatermarkAdderMock } = vi.hoisted(() => ({
  usePdfWatermarkAdderMock: vi.fn(),
}))

vi.mock('./usePdfWatermarkAdder', () => ({
  usePdfWatermarkAdder: () => usePdfWatermarkAdderMock(),
}))

import PDFWatermarkAdderTool from './PDFWatermarkAdderTool.vue'

type AdderState = ReturnType<typeof createAdderState>

const uploadStub = defineComponent({
  name: 'PDFWatermarkUploadSection',
  props: [
    'title',
    'fileNameText',
    'pageCountText',
    'fileErrorMessage',
    'file',
    'isLoadingDocument',
    'isGenerating',
  ],
  emits: ['upload', 'clear-file'],
  template: '<div data-test="upload-stub" />',
})

const settingsStub = defineComponent({
  name: 'PDFWatermarkSettingsSection',
  props: [
    'title',
    'rangeErrorMessage',
    'imageErrorMessage',
    'fontFamilyOptions',
    'positionOptions',
    'textPresets',
    'file',
    'pageCount',
  ],
  emits: [
    'update-mode',
    'update-range-input',
    'update-text',
    'preset-text',
    'upload-image',
    'clear-image',
    'update-position',
    'update-font-family',
    'update-font-size',
    'update-color',
    'update-opacity',
    'update-rotation',
    'update-offset-x',
    'update-offset-y',
    'update-image-scale',
  ],
  template: '<div data-test="settings-stub" />',
})

const generateStub = defineComponent({
  name: 'PDFWatermarkGenerateSection',
  props: [
    'title',
    'generateErrorMessage',
    'canGenerate',
    'hasResult',
    'resultFilename',
    'resultUrl',
  ],
  emits: ['generate'],
  template: '<div data-test="generate-stub" />',
})

const createAdderState = () => {
  const file = ref<File | null>(null)
  const pageCount = ref(0)
  const imageFile = ref<File | null>(null)
  const mode = ref<'text' | 'image'>('text')
  const rangeInput = ref('')
  const text = ref('CONFIDENTIAL')
  const fontFamily = ref<'sans-serif' | 'serif' | 'monospace'>('sans-serif')
  const fontSize = ref(48)
  const color = ref('#000000')
  const opacity = ref(18)
  const rotation = ref(-35)
  const position = ref<
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  >('center')
  const offsetX = ref(0)
  const offsetY = ref(0)
  const imageScale = ref(28)
  const isLoadingDocument = ref(false)
  const isGenerating = ref(false)
  const fileErrorCode = ref('')
  const imageErrorCode = ref('')
  const rangeErrorCode = ref('')
  const generateErrorCode = ref('')
  const resultFilename = ref('')
  const resultUrl = ref<string | null>(null)
  const canGenerate = ref(false)
  const hasResult = ref(false)

  return {
    file,
    pageCount,
    imageFile,
    mode,
    rangeInput,
    text,
    fontFamily,
    fontSize,
    color,
    opacity,
    rotation,
    position,
    offsetX,
    offsetY,
    imageScale,
    isLoadingDocument,
    isGenerating,
    fileErrorCode,
    imageErrorCode,
    rangeErrorCode,
    generateErrorCode,
    resultFilename,
    resultUrl,
    canGenerate,
    hasResult,
    setMode: vi.fn(),
    setRangeInput: vi.fn(),
    setText: vi.fn(),
    setTextPreset: vi.fn(),
    setFontFamily: vi.fn(),
    setFontSize: vi.fn(),
    setColor: vi.fn(),
    setOpacity: vi.fn(),
    setRotation: vi.fn(),
    setPosition: vi.fn(),
    setOffsetX: vi.fn(),
    setOffsetY: vi.fn(),
    setImageScale: vi.fn(),
    clearFile: vi.fn(),
    clearImage: vi.fn(),
    handleUpload: vi.fn(),
    handleImageUpload: vi.fn(),
    generate: vi.fn(),
  }
}

const mountTool = () =>
  mount(PDFWatermarkAdderTool, {
    global: {
      stubs: {
        PDFWatermarkUploadSection: uploadStub,
        PDFWatermarkSettingsSection: settingsStub,
        PDFWatermarkGenerateSection: generateStub,
      },
    },
  })

let state: AdderState

describe('PDFWatermarkAdderTool', () => {
  beforeEach(() => {
    state = createAdderState()
    usePdfWatermarkAdderMock.mockReturnValue(state)
  })

  it('renders the upload section before a file is loaded', () => {
    const wrapper = mountTool()

    expect(wrapper.find('[data-test="upload-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="settings-stub"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="generate-stub"]').exists()).toBe(false)
    expect(wrapper.getComponent(uploadStub).props('fileErrorMessage')).toBe('')
  })

  it('maps state to child props and forwards all child events', async () => {
    state.file.value = new File(['pdf'], 'proposal.pdf', { type: 'application/pdf' })
    state.pageCount.value = 12
    state.imageFile.value = new File(['png'], 'seal.png', { type: 'image/png' })
    state.canGenerate.value = true
    state.hasResult.value = true
    state.resultFilename.value = 'proposal-watermarked.pdf'
    state.resultUrl.value = 'blob:result'
    state.fileErrorCode.value = PDF_ERROR.Encrypted
    state.imageErrorCode.value = PDF_ERROR.InvalidImage
    state.rangeErrorCode.value = PAGE_RANGE_ERROR.OutOfBounds
    state.generateErrorCode.value = PDF_ERROR.WorkerUnsupported

    const wrapper = mountTool()
    await nextTick()

    const upload = wrapper.getComponent(uploadStub)
    const settings = wrapper.getComponent(settingsStub)
    const generate = wrapper.getComponent(generateStub)
    const uploadFile = new File(['pdf'], 'new.pdf', { type: 'application/pdf' })
    const imageFile = new File(['png'], 'logo.png', { type: 'image/png' })

    expect(upload.props('fileNameText')).toContain('proposal.pdf')
    expect(upload.props('pageCountText')).toContain('12')
    expect(upload.props('fileErrorMessage')).toContain('Encrypted PDF')
    expect(settings.props('rangeErrorMessage')).toContain('outside the PDF page count')
    expect(settings.props('imageErrorMessage')).toContain('valid watermark image')
    expect(settings.props('textPresets')).toEqual(['CONFIDENTIAL', 'DRAFT', 'INTERNAL'])
    expect(
      (settings.props('fontFamilyOptions') as Array<{ value: string }>).map(({ value }) => value),
    ).toEqual(['sans-serif', 'serif', 'monospace'])
    expect(
      (settings.props('positionOptions') as Array<{ value: string }>).map(({ value }) => value),
    ).toEqual([
      'top-left',
      'top-center',
      'top-right',
      'center-left',
      'center',
      'center-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ])
    expect(generate.props('generateErrorMessage')).toContain('Web Worker')

    upload.vm.$emit('upload', uploadFile)
    upload.vm.$emit('clear-file')

    settings.vm.$emit('update-mode', 'image')
    settings.vm.$emit('update-range-input', '2-4')
    settings.vm.$emit('update-text', 'DRAFT')
    settings.vm.$emit('preset-text', 'INTERNAL')
    settings.vm.$emit('upload-image', imageFile)
    settings.vm.$emit('clear-image')
    settings.vm.$emit('update-position', 'bottom-right')
    settings.vm.$emit('update-font-family', 'serif')
    settings.vm.$emit('update-font-size', 60)
    settings.vm.$emit('update-color', '#336699')
    settings.vm.$emit('update-opacity', 22)
    settings.vm.$emit('update-rotation', -48)
    settings.vm.$emit('update-offset-x', 8)
    settings.vm.$emit('update-offset-y', -6)
    settings.vm.$emit('update-image-scale', 44)
    generate.vm.$emit('generate')

    expect(state.handleUpload).toHaveBeenCalledWith(uploadFile)
    expect(state.clearFile).toHaveBeenCalledOnce()
    expect(state.setMode).toHaveBeenCalledWith('image')
    expect(state.setRangeInput).toHaveBeenCalledWith('2-4')
    expect(state.setText).toHaveBeenCalledWith('DRAFT')
    expect(state.setTextPreset).toHaveBeenCalledWith('INTERNAL')
    expect(state.handleImageUpload).toHaveBeenCalledWith(imageFile)
    expect(state.clearImage).toHaveBeenCalledOnce()
    expect(state.setPosition).toHaveBeenCalledWith('bottom-right')
    expect(state.setFontFamily).toHaveBeenCalledWith('serif')
    expect(state.setFontSize).toHaveBeenCalledWith(60)
    expect(state.setColor).toHaveBeenCalledWith('#336699')
    expect(state.setOpacity).toHaveBeenCalledWith(22)
    expect(state.setRotation).toHaveBeenCalledWith(-48)
    expect(state.setOffsetX).toHaveBeenCalledWith(8)
    expect(state.setOffsetY).toHaveBeenCalledWith(-6)
    expect(state.setImageScale).toHaveBeenCalledWith(44)
    expect(state.generate).toHaveBeenCalledOnce()
  })

  it('maps the remaining range and generate error states', async () => {
    state.file.value = new File(['pdf'], 'proposal.pdf', { type: 'application/pdf' })

    const wrapper = mountTool()
    const settings = wrapper.getComponent(settingsStub)
    const generate = wrapper.getComponent(generateStub)
    const upload = wrapper.getComponent(uploadStub)

    expect(settings.props('rangeErrorMessage')).toBe('')
    expect(settings.props('imageErrorMessage')).toBe('')
    expect(generate.props('generateErrorMessage')).toBe('')

    state.fileErrorCode.value = PDF_ERROR.Invalid
    state.rangeErrorCode.value = PAGE_RANGE_ERROR.DescendingRange
    state.generateErrorCode.value = PDF_ERROR.Encrypted
    await nextTick()

    expect(upload.props('fileErrorMessage')).toContain('valid PDF')
    expect(settings.props('rangeErrorMessage')).toContain('smaller page numbers')
    expect(generate.props('generateErrorMessage')).toContain('Encrypted PDF')

    state.rangeErrorCode.value = PAGE_RANGE_ERROR.DuplicatePage
    state.generateErrorCode.value = PDF_ERROR.InvalidImage
    await nextTick()

    expect(settings.props('rangeErrorMessage')).toContain('selected once')
    expect(generate.props('generateErrorMessage')).toContain('valid watermark image')

    state.rangeErrorCode.value = PAGE_RANGE_ERROR.InvalidToken
    state.generateErrorCode.value = PDF_ERROR.ApplyFailed
    await nextTick()

    expect(settings.props('rangeErrorMessage')).toContain('Invalid page range format')
    expect(generate.props('generateErrorMessage')).toContain('Failed to generate')
  })
})
