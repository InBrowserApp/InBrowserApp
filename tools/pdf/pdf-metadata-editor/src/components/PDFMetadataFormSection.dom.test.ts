import { createI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataFormSection from './PDFMetadataFormSection.vue'
import type { MetadataFieldsState } from '../composables/usePdfMetadataEditor'

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
  Button: defineComponent({
    name: 'NaiveButtonStub',
    inheritAttrs: false,
    emits: ['click'],
    template:
      '<button class="n-button" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  }),
  Input: defineComponent({
    name: 'NaiveInputStub',
    inheritAttrs: false,
    props: ['value', 'type', 'placeholder'],
    emits: ['update:value'],
    template:
      '<input class="n-input" v-bind="$attrs" :value="value" :data-type="type" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  }),
  DatePicker: defineComponent({
    name: 'NaiveDatePickerStub',
    inheritAttrs: false,
    props: ['value', 'type', 'placeholder', 'clearable'],
    emits: ['update:value'],
    template:
      '<div class="n-date-picker" v-bind="$attrs" :data-value="value" :data-clearable="clearable" />',
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

const createFields = (): MetadataFieldsState => ({
  title: 'Updated title',
  author: 'Author',
  subject: '',
  keywords: 'alpha, beta',
  creator: '',
  producer: 'Updated producer',
  creationDate: Date.parse('2024-01-01T00:00:00Z'),
  modificationDate: null,
})

describe('PDFMetadataFormSection', () => {
  it('renders direct inputs and date pickers', () => {
    const wrapper = mount(PDFMetadataFormSection, {
      props: {
        title: 'Edit metadata',
        fieldLabels,
        fields: createFields(),
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Delete a value to clear that field.')
    expect(wrapper.text()).toContain('Basic fields')
    expect(wrapper.text()).toContain('Advanced fields')
    expect(wrapper.findAll('.n-input')).toHaveLength(6)
    expect(wrapper.find('[data-input-field="keywords"]').attributes('placeholder')).toBe(
      'Comma or line separated keywords',
    )
    expect(wrapper.find('[data-input-field="producer"]').attributes('placeholder')).toBe(
      'Leave empty to clear',
    )
    expect(wrapper.findAllComponents({ name: 'NaiveDatePickerStub' })).toHaveLength(2)
    expect(wrapper.find('[data-input-field="creationDate"]').attributes('data-clearable')).toBe('')
  })

  it('emits text, date, restore, and clear-all actions', async () => {
    const wrapper = mount(PDFMetadataFormSection, {
      props: {
        title: 'Edit metadata',
        fieldLabels,
        fields: createFields(),
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    await wrapper.find('[data-input-field="title"]').setValue('New title')
    await wrapper.find('[data-input-field="producer"]').setValue('New producer')
    await wrapper.find('[data-input-field="creationDate"]').trigger('click')
    wrapper.findAllComponents({ name: 'NaiveDatePickerStub' })[0]?.vm.$emit('update:value', 123456)
    wrapper.findAllComponents({ name: 'NaiveDatePickerStub' })[1]?.vm.$emit('update:value', null)
    await wrapper.find('[data-restore-field="title"]').trigger('click')
    await wrapper.find('[data-restore-field="producer"]').trigger('click')
    await wrapper.find('[data-restore-field="creationDate"]').trigger('click')
    await wrapper.findAll('.n-button')[0]?.trigger('click')

    expect(wrapper.emitted('update:text-field')).toEqual([
      ['title', 'New title'],
      ['producer', 'New producer'],
    ])
    expect(wrapper.emitted('update:date-field')).toEqual([
      ['creationDate', 123456],
      ['modificationDate', null],
    ])
    expect(wrapper.emitted('restore-field')).toEqual([['title'], ['producer'], ['creationDate']])
    expect(wrapper.emitted('clear-all')).toEqual([[]])
  })
})
