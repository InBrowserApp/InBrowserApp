import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PDFInfoViewer from './PDFInfoViewer.vue'
import { extractPdfInfo } from '../utils/extractPdfInfo'
import type { PdfInfo } from '../utils/extractPdfInfo'

vi.mock('../utils/extractPdfInfo', () => ({
  extractPdfInfo: vi.fn(),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  PDFUpload: {
    emits: ['upload-file'],
    template: '<button class="upload" @click="$emit(\'upload-file\', file)">Upload</button>',
    data() {
      return {
        file: new File(['%PDF-1.7'], 'sample.pdf', { type: 'application/pdf' }),
      }
    },
  },
  PDFInfoResults: {
    props: ['info'],
    template: '<div class="results">{{ info.file.name }}</div>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  NAlert: {
    props: ['title', 'type'],
    template: '<div class="n-alert"><span class="title">{{ title }}</span><slot /></div>',
  },
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
  NSpin: {
    template: '<div class="n-spin"><slot /></div>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
}

const baseInfo: PdfInfo = {
  file: {
    name: 'sample.pdf',
    size: 1024,
    type: 'application/pdf',
  },
  document: {
    version: '1.7',
    pageCount: 2,
    encrypted: false,
  },
  metadata: {},
}

describe('PDFInfoViewer', () => {
  it('renders results after upload', async () => {
    const mockedExtract = vi.mocked(extractPdfInfo)
    mockedExtract.mockResolvedValueOnce(baseInfo)

    const wrapper = mount(PDFInfoViewer, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    await wrapper.find('button.upload').trigger('click')
    await flushPromises()

    expect(mockedExtract).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.results').text()).toContain('sample.pdf')
  })

  it('shows error when extraction fails', async () => {
    const mockedExtract = vi.mocked(extractPdfInfo)
    mockedExtract.mockRejectedValueOnce(new Error('Boom'))

    const wrapper = mount(PDFInfoViewer, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    await wrapper.find('button.upload').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Boom')
    expect(wrapper.text()).toContain('Error')
  })
})
