import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import PDFTextExtractor from './PDFTextExtractor.vue'
import { extractPdfText } from '../utils/extract-pdf-text'
import type { PdfTextExtractionResult } from '../utils/extract-pdf-text'

vi.mock('../utils/extract-pdf-text', () => ({
  extractPdfText: vi.fn(),
}))

const file = new File(['%PDF-1.7'], 'sample.pdf', { type: 'application/pdf' })
const extractionResult: PdfTextExtractionResult = {
  text: '',
  pageCount: 3,
  emptyTextPages: 3,
  likelyScannedPages: 2,
  pages: [
    {
      pageNumber: 1,
      text: '',
      characterCount: 0,
      wordCount: 0,
      likelyScanned: true,
    },
    {
      pageNumber: 2,
      text: '',
      characterCount: 0,
      wordCount: 0,
      likelyScanned: true,
    },
    {
      pageNumber: 3,
      text: '',
      characterCount: 0,
      wordCount: 0,
      likelyScanned: false,
    },
  ],
}

const stubs = {
  PDFUpload: {
    name: 'PDFUpload',
    emits: ['upload-file'],
    template: '<button class="upload" @click="$emit(\'upload-file\', file)">upload</button>',
    data() {
      return { file }
    },
  },
  CopyToClipboardButton: {
    template: '<button class="copy-btn" />',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  NAlert: {
    template: '<div class="n-alert"><slot /></div>',
  },
  NButton: {
    template: '<button class="n-button"><slot /></button>',
  },
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
  NGi: {
    template: '<div class="n-gi"><slot /></div>',
  },
  NGrid: {
    template: '<div class="n-grid"><slot /></div>',
  },
  NIcon: {
    template: '<i class="n-icon"><slot /></i>',
  },
  NInput: {
    template: '<textarea class="n-input" />',
  },
  NSpin: {
    template: '<div class="n-spin"><slot /></div>',
  },
  NStatistic: {
    props: ['label', 'value'],
    template: '<div class="n-statistic">{{ label }}: {{ value }}</div>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
}

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(PDFTextExtractor))
  },
}

const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
let scrollIntoViewMock = vi.fn()

describe('PDFTextExtractor', () => {
  beforeEach(() => {
    vi.mocked(extractPdfText).mockReset()
    scrollIntoViewMock = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    })
  })

  afterEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    })
  })

  it('smooth scrolls to result after extraction completes', async () => {
    let resolveExtraction: (value: PdfTextExtractionResult) => void = () => undefined

    vi.mocked(extractPdfText).mockReturnValueOnce(
      new Promise<PdfTextExtractionResult>((resolve) => {
        resolveExtraction = resolve
      }),
    )

    const wrapper = mount(TestWrapper, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button.upload').trigger('click')
    await flushPromises()

    expect(scrollIntoViewMock).not.toHaveBeenCalled()

    resolveExtraction(extractionResult)
    await flushPromises()

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('does not scroll when extraction fails', async () => {
    vi.mocked(extractPdfText).mockRejectedValueOnce(new Error('Boom'))

    const wrapper = mount(TestWrapper, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button.upload').trigger('click')
    await flushPromises()

    expect(scrollIntoViewMock).not.toHaveBeenCalled()
  })
})
