import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SchemaGeneratorOptions from './SchemaGeneratorOptions.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<label class="n-form-item-gi">{{ label }}<slot /></label>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        required: true,
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template:
      '<button class="n-select" @click="$emit(\'update:value\', (options[1] && options[1].value) || (options[0] && options[0].value) || value)" />',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template: '<button class="n-switch" @click="$emit(\'update:value\', !value)" />',
  })

  return {
    NGrid,
    NFormItemGi,
    NSelect,
    NSwitch,
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

describe('SchemaGeneratorOptions', () => {
  it('renders labels and emits option updates', async () => {
    const wrapper = mount(SchemaGeneratorOptions, {
      props: {
        draft: '2020-12',
        draftOptions: [
          { label: '2020-12', value: '2020-12' },
          { label: 'Draft-07', value: 'draft-07' },
        ],
        inferRequired: true,
        allowAdditionalProperties: true,
        detectFormat: true,
      },
    })

    expect(wrapper.text()).toContain('Schema draft')
    expect(wrapper.text()).toContain('Infer required properties')
    expect(wrapper.text()).toContain('Allow additional properties')
    expect(wrapper.text()).toContain('Detect string formats (uuid, email, uri, date-time)')

    const select = wrapper.findComponent({ name: 'NSelect' })
    await select.trigger('click')

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    const inferRequiredSwitch = switches[0]
    const additionalPropertiesSwitch = switches[1]
    const detectFormatSwitch = switches[2]

    if (!inferRequiredSwitch || !additionalPropertiesSwitch || !detectFormatSwitch) {
      throw new Error('Expected all option switches')
    }

    await inferRequiredSwitch.trigger('click')
    await additionalPropertiesSwitch.trigger('click')
    await detectFormatSwitch.trigger('click')

    expect(wrapper.emitted('update:draft')?.[0]).toEqual(['draft-07'])
    expect(wrapper.emitted('update:inferRequired')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:allowAdditionalProperties')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:detectFormat')?.[0]).toEqual([false])
  })
})
