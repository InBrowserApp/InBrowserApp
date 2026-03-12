import { createI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataSaveSection from './PDFMetadataSaveSection.vue'

const createTestI18n = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    messages: {},
    missingWarn: false,
    fallbackWarn: false,
  })

const stubs = {
  PDFMetadataSectionHeader: defineComponent({
    props: ['title'],
    template: '<h2 class="section-header">{{ title }}</h2>',
  }),
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  Space: defineComponent({ template: '<div class="n-space"><slot /></div>' }),
  Flex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  Text: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  Alert: defineComponent({
    props: ['title'],
    template: '<div class="n-alert"><strong>{{ title }}</strong><slot /></div>',
  }),
  Button: defineComponent({
    inheritAttrs: false,
    props: ['tag', 'href', 'download', 'disabled', 'loading'],
    emits: ['click'],
    template:
      '<a v-if="tag === \'a\'" class="n-button-link" v-bind="$attrs" :href="href" :data-download="download"><slot /></a><button v-else class="n-button" v-bind="$attrs" :disabled="disabled" :data-loading="loading" @click="$emit(\'click\')"><slot /></button>',
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

describe('PDFMetadataSaveSection', () => {
  it('renders empty state when there are no changes', () => {
    const wrapper = mount(PDFMetadataSaveSection, {
      props: {
        title: 'Save and download',
        fieldLabels,
        changeSummary: [],
        canGenerate: false,
        isGenerating: false,
        resultFilename: '',
        resultUrl: undefined,
        errorMessage: '',
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Change at least one field to create a new PDF.')
    expect(wrapper.find('.n-button').attributes('disabled')).toBeDefined()
  })

  it('renders errors, pending changes, and download output', async () => {
    const wrapper = mount(PDFMetadataSaveSection, {
      props: {
        title: 'Save and download',
        fieldLabels,
        changeSummary: [
          { key: 'title', action: 'set' },
          { key: 'author', action: 'clear' },
        ],
        canGenerate: true,
        isGenerating: true,
        resultFilename: 'sample-metadata.pdf',
        resultUrl: 'blob:ready',
        errorMessage: 'Save failed',
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    await wrapper.find('.n-button').trigger('click')

    expect(wrapper.text()).toContain('Save failed')
    expect(wrapper.text()).toContain('Title: Update value')
    expect(wrapper.text()).toContain('Author: Clear field')
    expect(wrapper.text()).toContain('Saving metadata...')
    expect(wrapper.find('.n-button').attributes('data-loading')).toBe('true')
    expect(wrapper.find('.n-button-link').attributes('href')).toBe('blob:ready')
    expect(wrapper.find('.n-button-link').attributes('data-download')).toBe('sample-metadata.pdf')
    expect(wrapper.emitted('generate')).toEqual([[]])
  })
})
