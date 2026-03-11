import { createI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataCurrentSection from './PDFMetadataCurrentSection.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  ToolSectionHeader: defineComponent({ template: '<h2><slot /></h2>' }),
  NGrid: defineComponent({ template: '<div class="n-grid"><slot /></div>' }),
  NGi: defineComponent({ template: '<div class="n-gi"><slot /></div>' }),
  NFlex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  NText: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  NDescriptions: defineComponent({ template: '<div class="n-descriptions"><slot /></div>' }),
  NDescriptionsItem: defineComponent({
    props: ['label'],
    template: '<div class="n-descriptions-item"><strong>{{ label }}</strong><slot /></div>',
  }),
}

const fieldLabels = {
  title: 'Title',
  author: 'Author',
  subject: 'Subject',
  keywords: 'Keywords',
  creator: 'Creator',
  producer: 'Producer',
  creationDate: 'Creation date',
  modificationDate: 'Modification date',
} as const

describe('PDFMetadataCurrentSection', () => {
  it('renders file and metadata values', () => {
    const wrapper = mount(PDFMetadataCurrentSection, {
      props: {
        title: 'Current metadata',
        fieldLabels,
        info: {
          file: { name: 'sample.pdf', size: 100, type: 'application/pdf' },
          document: { version: '1.7', pageCount: 3, encrypted: true },
          metadata: {
            title: 'Sample title',
            author: 'Sample author',
            subject: 'Sample subject',
            keywords: 'alpha beta',
            creator: 'Creator',
            producer: 'Producer',
            creationDate: new Date('2024-01-01T00:00:00Z'),
            modificationDate: new Date('2024-01-02T00:00:00Z'),
          },
        },
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('sample.pdf')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('1.7')
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('Sample title')
    expect(wrapper.text()).toContain('Sample author')
  })

  it('falls back to not available for empty values', () => {
    const wrapper = mount(PDFMetadataCurrentSection, {
      props: {
        title: 'Current metadata',
        fieldLabels,
        info: {
          file: { name: 'sample.pdf', size: 100, type: 'application/pdf' },
          document: { version: undefined, pageCount: undefined, encrypted: false },
          metadata: {
            title: undefined,
            author: '   ',
            subject: undefined,
            keywords: undefined,
            creator: undefined,
            producer: undefined,
            creationDate: new Date('invalid'),
            modificationDate: undefined,
          },
        },
      },
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('No')
    expect(wrapper.text()).toContain('Not available')
  })
})
