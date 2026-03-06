import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NPagination } from 'naive-ui'

const { loadPdfDocumentMock } = vi.hoisted(() => ({
  loadPdfDocumentMock: vi.fn(),
}))

vi.mock('../utils/pdfjs', () => ({
  loadPdfDocument: loadPdfDocumentMock,
}))

import PDFPageNumberPreview from './PDFPageNumberPreview.vue'

type CanvasContextMock = {
  clearRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
  measureText: ReturnType<typeof vi.fn>
  fillRect: ReturnType<typeof vi.fn>
  fillText: ReturnType<typeof vi.fn>
  font: string
  fillStyle: string
  textBaseline: CanvasTextBaseline
}

const createCanvasContextMock = (): CanvasContextMock => ({
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  measureText: vi.fn((text: string) => ({ width: text.length * 8 })),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  font: '',
  fillStyle: '',
  textBaseline: 'alphabetic',
})

const createPdfDocumentMock = () => {
  const createPage = () => ({
    getViewport: vi.fn(({ scale }: { scale: number }) => ({
      width: 200 * scale,
      height: 320 * scale,
    })),
    render: vi.fn(() => ({ promise: Promise.resolve() })),
  })

  const firstPage = createPage()
  const secondPage = createPage()
  return {
    firstPage,
    secondPage,
    document: {
      getPage: vi.fn(async (pageNumber: number) => (pageNumber === 2 ? secondPage : firstPage)),
      destroy: vi.fn(),
    },
  }
}

describe('PDFPageNumberPreview', () => {
  let getContextSpy: ReturnType<typeof vi.spyOn>
  let contexts: CanvasContextMock[]

  beforeEach(() => {
    vi.clearAllMocks()
    contexts = []

    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      const context = createCanvasContextMock()
      contexts.push(context)
      return context as unknown as CanvasRenderingContext2D
    })
  })

  afterEach(() => {
    getContextSpy.mockRestore()
  })

  it('renders first PDF page and overlays page number text', async () => {
    const pdfDocumentMock = createPdfDocumentMock()
    const loadingTaskDestroyMock = vi.fn()

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: loadingTaskDestroyMock,
    })

    const wrapper = mount(PDFPageNumberPreview, {
      props: {
        file: new File(['demo'], 'demo.pdf', { type: 'application/pdf' }),
        rangeInput: '',
        rangeErrorCode: '',
        startNumber: 3,
        format: 'n-total',
        fontFamily: 'sans-serif',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 24,
        marginY: 24,
        pageCount: 8,
      },
    })

    await flushPromises()

    expect(loadPdfDocumentMock).toHaveBeenCalledOnce()
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(1)
    expect(wrapper.find('[data-test="preview-error"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="preview-page-canvas"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="preview-paper"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="preview-pagination"]').exists()).toBe(true)

    expect(
      contexts.some((context) => context.fillText.mock.calls.some(([text]) => text === '3/8')),
    ).toBe(true)

    await wrapper.getComponent(NPagination).vm.$emit('update:page', 2)
    await flushPromises()

    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(2)

    await wrapper.setProps({
      startNumber: 5,
      format: 'n',
      fontFamily: 'serif',
    })
    await flushPromises()

    expect(
      contexts.some((context) => context.fillText.mock.calls.some(([text]) => text === '6')),
    ).toBe(true)
    expect(contexts.some((context) => context.font.includes('serif'))).toBe(true)
    expect(loadingTaskDestroyMock).toHaveBeenCalled()
    expect(pdfDocumentMock.document.destroy).toHaveBeenCalled()
  })

  it('shows fallback message when PDF preview cannot be rendered', async () => {
    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.reject(new Error('invalid-pdf')),
      destroy: vi.fn(),
    })

    const wrapper = mount(PDFPageNumberPreview, {
      props: {
        file: new File(['bad'], 'bad.pdf', { type: 'application/pdf' }),
        rangeInput: '',
        rangeErrorCode: '',
        startNumber: 1,
        format: 'n',
        fontFamily: 'sans-serif',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 24,
        marginY: 24,
        pageCount: 3,
      },
    })

    await flushPromises()

    const previewError = wrapper.get('[data-test="preview-error"]')
    expect(previewError.text()).toContain('Preview unavailable')
  })

  it('renders selected range pages in preview order', async () => {
    const pdfDocumentMock = createPdfDocumentMock()

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdfDocumentMock.document),
      destroy: vi.fn(),
    })

    const wrapper = mount(PDFPageNumberPreview, {
      props: {
        file: new File(['range'], 'range.pdf', { type: 'application/pdf' }),
        rangeInput: '2,4',
        rangeErrorCode: '',
        startNumber: 10,
        format: 'n',
        fontFamily: 'serif',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 24,
        marginY: 24,
        pageCount: 8,
      },
    })

    await flushPromises()
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(2)
    expect(
      contexts.some((context) => context.fillText.mock.calls.some(([text]) => text === '10')),
    ).toBe(true)

    await wrapper.getComponent(NPagination).vm.$emit('update:page', 2)
    await flushPromises()
    expect(pdfDocumentMock.document.getPage).toHaveBeenCalledWith(4)
    expect(
      contexts.some((context) => context.fillText.mock.calls.some(([text]) => text === '11')),
    ).toBe(true)
  })
})
