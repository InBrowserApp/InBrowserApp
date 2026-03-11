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
  ToolSection: defineComponent({ template: '<section><slot /></section>' }),
  ToolSectionHeader: defineComponent({ template: '<h2><slot /></h2>' }),
  Space: defineComponent({ template: '<div class="n-space"><slot /></div>' }),
  Flex: defineComponent({ template: '<div class="n-flex"><slot /></div>' }),
  Text: defineComponent({ template: '<span class="n-text"><slot /></span>' }),
  Alert: defineComponent({ template: '<div class="n-alert"><slot /></div>' }),
  Button: defineComponent({
    name: 'NaiveButtonStub',
    inheritAttrs: false,
    emits: ['click'],
    template:
      '<button class="n-button" v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  }),
  RadioButton: defineComponent({
    name: 'NaiveRadioButtonStub',
    props: ['value'],
    template: '<button class="n-radio-button" :data-value="value"><slot /></button>',
  }),
  RadioGroup: defineComponent({
    name: 'NaiveRadioGroupStub',
    inheritAttrs: false,
    props: ['value'],
    emits: ['update:value'],
    template: '<div class="n-radio-group" v-bind="$attrs"><slot /></div>',
  }),
  Input: defineComponent({
    name: 'NaiveInputStub',
    inheritAttrs: false,
    props: ['value', 'type', 'placeholder'],
    emits: ['update:value'],
    template:
      '<input class="n-input" v-bind="$attrs" :value="value" :data-type="type" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
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
  title: { mode: 'set', value: 'Updated title' },
  author: { mode: 'preserve', value: 'Author' },
  subject: { mode: 'preserve', value: '' },
  keywords: { mode: 'set', value: 'alpha beta' },
  creator: { mode: 'preserve', value: '' },
  producer: { mode: 'preserve', value: '' },
  creationDate: { mode: 'set', value: '2024-01-01T00:00' },
  modificationDate: { mode: 'preserve', value: '' },
})

describe('PDFMetadataFormSection', () => {
  it('renders set-mode inputs and validation state', () => {
    const fields = createFields()
    fields.producer = { mode: 'set', value: 'Updated producer' }

    const wrapper = mount(PDFMetadataFormSection, {
      props: {
        title: 'Edit metadata',
        fieldLabels,
        fields,
        validationFieldKeys: ['creationDate'],
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Basic fields')
    expect(wrapper.text()).toContain('Advanced fields')
    expect(wrapper.findAll('.n-input')).toHaveLength(4)
    expect(wrapper.find('[data-input-field="keywords"]').attributes('placeholder')).toBe(
      'Enter keywords text',
    )
    expect(wrapper.find('[data-input-field="producer"]').attributes('placeholder')).toBeUndefined()
    expect(wrapper.find('[data-input-field="creationDate"]').attributes('placeholder')).toBe(
      'YYYY-MM-DDTHH:mm',
    )
    expect(wrapper.text()).toContain('Fix invalid fields before saving: Creation date')
  })

  it('emits updates and restore actions', async () => {
    const wrapper = mount(PDFMetadataFormSection, {
      props: {
        title: 'Edit metadata',
        fieldLabels,
        fields: createFields(),
        validationFieldKeys: [],
      },
      global: {
        plugins: [createTestI18n()],
        stubs,
      },
    })

    wrapper.findAllComponents({ name: 'NaiveRadioGroupStub' })[0]?.vm.$emit('update:value', 'clear')
    wrapper.findAllComponents({ name: 'NaiveRadioGroupStub' })[6]?.vm.$emit('update:value', 'clear')
    await wrapper.find('[data-input-field="title"]').setValue('New title')
    await wrapper.find('[data-input-field="creationDate"]').setValue('2024-02-03T04:05')
    await wrapper.find('[data-restore-field="title"]').trigger('click')
    await wrapper.find('[data-restore-field="creationDate"]').trigger('click')
    await wrapper.findAll('.n-button')[0]?.trigger('click')

    expect(wrapper.emitted('update:field-mode')).toEqual([
      ['title', 'clear'],
      ['creationDate', 'clear'],
    ])
    expect(wrapper.emitted('update:field-value')).toEqual([
      ['title', 'New title'],
      ['creationDate', '2024-02-03T04:05'],
    ])
    expect(wrapper.emitted('restore-field')).toEqual([['title'], ['creationDate']])
    expect(wrapper.emitted('clear-all')).toEqual([[]])
  })
})
