import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PDFInfoResults from './PDFInfoResults.vue'
import type { PdfInfo } from '../utils/extractPdfInfo'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  NDescriptions: {
    template: '<div class="n-descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    props: ['label'],
    template:
      '<div class="n-descriptions-item"><span class="label">{{ label }}</span><slot /></div>',
  },
  NSpin: {
    template: '<div class="n-spin"><slot /></div>',
  },
  NTag: {
    props: ['type'],
    template: '<span class="n-tag" :data-type="type"><slot /></span>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
  NAlert: {
    props: ['title', 'type'],
    template: '<div class="n-alert"><span class="title">{{ title }}</span><slot /></div>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}

const baseInfo: PdfInfo = {
  file: {
    name: 'sample.pdf',
    size: 1024,
    type: 'application/pdf',
    lastModified: new Date('2024-02-01T00:00:00Z'),
  },
  document: {
    version: '1.7',
    pageCount: 2,
    encrypted: false,
  },
  metadata: {
    title: 'Test Title',
    author: 'Test Author',
    subject: 'Test Subject',
    keywords: ['alpha', 'beta'],
    creator: 'Test Creator',
    producer: 'Test Producer',
    creationDate: new Date('2024-01-01T00:00:00Z'),
    modificationDate: new Date('2024-01-02T00:00:00Z'),
  },
}

describe('PDFInfoResults', () => {
  it('renders file and metadata fields', () => {
    const wrapper = mount(PDFInfoResults, {
      props: {
        info: baseInfo,
        loading: false,
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('File details')
    expect(wrapper.text()).toContain('sample.pdf')
    expect(wrapper.text()).toContain('Not encrypted')
    expect(wrapper.text()).toContain('Test Title')
  })

  it('shows encrypted notice when encrypted', () => {
    const wrapper = mount(PDFInfoResults, {
      props: {
        info: {
          ...baseInfo,
          document: {
            ...baseInfo.document,
            encrypted: true,
          },
        },
        loading: false,
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Password protected')
    expect(wrapper.text()).toContain('Encrypted')
  })
})
