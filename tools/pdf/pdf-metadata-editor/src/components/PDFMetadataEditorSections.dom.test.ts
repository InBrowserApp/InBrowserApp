import { createI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { MetadataFieldsState } from '../composables/usePdfMetadataEditor'
import type { PdfMetadataInfo } from '../utils/pdfMetadata'
import PDFMetadataEditorSections from './PDFMetadataEditorSections.vue'

const createTestI18n = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    messages: {},
    missingWarn: false,
    fallbackWarn: false,
  })

const PDFMetadataCurrentSectionStub = defineComponent({
  name: 'PDFMetadataCurrentSection',
  props: ['title', 'fieldLabels'],
  template: '<div class="current-section">{{ title }}</div>',
})

const PDFMetadataFormSectionStub = defineComponent({
  name: 'PDFMetadataFormSection',
  props: ['title', 'fieldLabels'],
  emits: ['update:text-field', 'update:date-field', 'restore-field', 'clear-all'],
  template: '<div class="form-section">{{ title }}</div>',
})

const PDFMetadataSaveSectionStub = defineComponent({
  name: 'PDFMetadataSaveSection',
  props: ['title', 'fieldLabels'],
  emits: ['generate'],
  template: '<div class="save-section">{{ title }}</div>',
})

const createProps = () => {
  const info: PdfMetadataInfo = {
    file: { name: 'sample.pdf', size: 100, type: 'application/pdf' },
    document: { version: '1.7', pageCount: 1, encrypted: false },
    metadata: {},
  }

  const fields: MetadataFieldsState = {
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    creationDate: null,
    modificationDate: null,
  }

  return {
    currentTitle: 'Current metadata',
    editTitle: 'Edit metadata',
    saveTitle: 'Save and download',
    info,
    canEdit: true,
    fields,
    changeSummary: [],
    canGenerate: false,
    isSaving: false,
    resultFilename: '',
    resultUrl: undefined,
    errorMessage: '',
  }
}

describe('PDFMetadataEditorSections', () => {
  it('renders current, form, and save sections with translated field labels', () => {
    const wrapper = mount(PDFMetadataEditorSections, {
      props: createProps(),
      global: {
        plugins: [createTestI18n()],
        stubs: {
          PDFMetadataCurrentSection: PDFMetadataCurrentSectionStub,
          PDFMetadataFormSection: PDFMetadataFormSectionStub,
          PDFMetadataSaveSection: PDFMetadataSaveSectionStub,
        },
      },
    })

    const currentSection = wrapper.findComponent(PDFMetadataCurrentSectionStub)
    expect(wrapper.find('.current-section').exists()).toBe(true)
    expect(wrapper.find('.form-section').exists()).toBe(true)
    expect(wrapper.find('.save-section').exists()).toBe(true)
    expect(currentSection.props('fieldLabels')).toMatchObject({
      title: 'Title',
      author: 'Author',
      creationDate: 'Creation date',
    })
  })

  it('hides editable sections when locked and forwards emitted actions', async () => {
    const wrapper = mount(PDFMetadataEditorSections, {
      props: {
        ...createProps(),
        canEdit: false,
      },
      global: {
        plugins: [createTestI18n()],
        stubs: {
          PDFMetadataCurrentSection: PDFMetadataCurrentSectionStub,
          PDFMetadataFormSection: PDFMetadataFormSectionStub,
          PDFMetadataSaveSection: PDFMetadataSaveSectionStub,
        },
      },
    })

    expect(wrapper.find('.current-section').exists()).toBe(true)
    expect(wrapper.find('.form-section').exists()).toBe(false)
    expect(wrapper.find('.save-section').exists()).toBe(false)

    await wrapper.setProps({ canEdit: true })

    wrapper
      .findComponent(PDFMetadataFormSectionStub)
      .vm.$emit('update:text-field', 'title', 'Updated')
    wrapper
      .findComponent(PDFMetadataFormSectionStub)
      .vm.$emit('update:date-field', 'creationDate', 123)
    wrapper.findComponent(PDFMetadataFormSectionStub).vm.$emit('restore-field', 'title')
    wrapper.findComponent(PDFMetadataFormSectionStub).vm.$emit('clear-all')
    wrapper.findComponent(PDFMetadataSaveSectionStub).vm.$emit('generate')

    expect(wrapper.emitted('update:text-field')).toEqual([['title', 'Updated']])
    expect(wrapper.emitted('update:date-field')).toEqual([['creationDate', 123]])
    expect(wrapper.emitted('restore-field')).toEqual([['title']])
    expect(wrapper.emitted('clear-all')).toEqual([[]])
    expect(wrapper.emitted('generate')).toEqual([[]])
  })
})
