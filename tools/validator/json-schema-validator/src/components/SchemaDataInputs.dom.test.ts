import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SchemaDataInputs from './SchemaDataInputs.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: {
      label: {
        type: String,
        default: '',
      },
      showFeedback: {
        type: Boolean,
        default: false,
      },
      validationStatus: {
        type: String,
        default: undefined,
      },
    },
    template: '<div class="n-form-item-gi"><slot /><slot name="feedback" /></div>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      type: {
        type: String,
        default: '',
      },
      depth: {
        type: [String, Number],
        default: undefined,
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NFormItemGi,
    NGrid,
    NText,
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section class="tool-section"><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3 class="tool-section-header"><slot /></h3>',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    TextOrFileInput: defineComponent({
      name: 'TextOrFileInput',
      props: {
        value: {
          type: [String, Object],
          default: '',
        },
        accept: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          default: undefined,
        },
        wrapWithFormItem: {
          type: Boolean,
          default: true,
        },
      },
      emits: ['update:value'],
      template: '<div class="text-or-file-input" />',
    }),
  }
})

describe('SchemaDataInputs', () => {
  it('renders placeholders and validation feedback', () => {
    const wrapper = mount(SchemaDataInputs, {
      props: {
        schemaStatus: 'error',
        dataStatus: 'success',
        schemaError: 'bad schema',
        dataError: '',
        schemaValue: '',
        dataValue: '',
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'TextOrFileInput' })
    expect(inputs).toHaveLength(2)
    const schemaInput = inputs[0]
    const dataInput = inputs[1]
    if (!schemaInput || !dataInput) {
      throw new Error('Expected schema and data inputs')
    }
    expect(schemaInput.props('placeholder')).toBe('schemaPlaceholder')
    expect(schemaInput.props('status')).toBe('error')
    expect(schemaInput.props('accept')).toBe('.json,.txt')
    expect(schemaInput.props('wrapWithFormItem')).toBe(false)
    expect(dataInput.props('placeholder')).toBe('dataPlaceholder')
    expect(dataInput.props('status')).toBe('success')

    expect(wrapper.text()).toContain('invalidJson')
    expect(wrapper.text()).toContain('bad schema')
  })

  it('emits updates for schema and data models', async () => {
    const wrapper = mount(SchemaDataInputs, {
      props: {
        schemaValue: '',
        dataValue: '',
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'TextOrFileInput' })
    const schemaInput = inputs[0]
    const dataInput = inputs[1]
    if (!schemaInput || !dataInput) {
      throw new Error('Expected schema and data inputs')
    }
    schemaInput.vm.$emit('update:value', '{"type":"object"}')
    dataInput.vm.$emit('update:value', '{"name":"Ada"}')
    await nextTick()

    expect(wrapper.emitted('update:schemaValue')?.[0]).toEqual(['{"type":"object"}'])
    expect(wrapper.emitted('update:dataValue')?.[0]).toEqual(['{"name":"Ada"}'])
  })

  it('renders data feedback and hides feedback blocks without errors', () => {
    const withDataError = mount(SchemaDataInputs, {
      props: {
        schemaStatus: 'success',
        dataStatus: 'error',
        schemaError: '',
        dataError: 'bad data',
        schemaValue: '',
        dataValue: '',
      },
    })

    expect(withDataError.text()).toContain('invalidJson')
    expect(withDataError.text()).toContain('bad data')
    expect(withDataError.text()).not.toContain('bad schema')

    const withoutErrors = mount(SchemaDataInputs, {
      props: {
        schemaStatus: 'success',
        dataStatus: 'success',
        schemaError: '',
        dataError: '',
        schemaValue: '',
        dataValue: '',
      },
    })

    expect(withoutErrors.text()).not.toContain('invalidJson')
  })
})
