import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import JsonPathInputs from './JsonPathInputs.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
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
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      template: '<button class="copy-button" type="button">copy</button>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template:
      '<div class="n-form-item-gi"><div class="label"><slot name="label" /></div><slot /><slot name="feedback" /></div>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon" />',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
      status: {
        type: String,
        default: undefined,
      },
    },
    emits: ['update:value'],
    template:
      '<textarea v-if="type === \'textarea\'" :value="value" @input="$emit(\'update:value\', $event.target.value)" /><input v-else :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: null,
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="n-select" />',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NButton,
    NFlex,
    NFormItemGi,
    NGrid,
    NIcon,
    NInput,
    NSelect,
    NText,
  }
})

describe('JsonPathInputs', () => {
  it('renders feedback messages and triggers import/format actions', async () => {
    const importFromFile = vi.fn(async () => {})
    const formatJson = vi.fn()

    const wrapper = mount(JsonPathInputs, {
      props: {
        jsonText: '{',
        queryText: '$.books[*]',
        exampleOptions: [{ label: 'Authors', value: '$.store.book[*].author' }],
        jsonStatus: 'error',
        queryStatus: 'error',
        jsonErrorMessage: 'Invalid JSON payload',
        queryErrorMessage: 'Invalid JSONPath query',
        importFromFile,
        formatJson,
      },
    })

    const buttons = wrapper.findAll('button')
    const importButton = buttons[0]
    const formatButton = buttons[1]

    if (!importButton || !formatButton) {
      throw new Error('Expected import and format buttons')
    }

    await importButton.trigger('click')
    await formatButton.trigger('click')

    expect(importFromFile).toHaveBeenCalledOnce()
    expect(formatJson).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Invalid JSON payload')
    expect(wrapper.text()).toContain('Invalid JSONPath query')
  })

  it('updates models from inputs and example selection', async () => {
    const wrapper = mount(JsonPathInputs, {
      props: {
        jsonText: '{}',
        queryText: '$.items[*]',
        exampleOptions: [{ label: 'First item', value: '$.items[0]' }],
        jsonErrorMessage: '',
        queryErrorMessage: '',
        importFromFile: async () => {},
        formatJson: () => {},
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    const jsonInput = inputs[0]
    const queryInput = inputs[1]

    if (!jsonInput || !queryInput) {
      throw new Error('Expected JSON and query inputs')
    }

    jsonInput.vm.$emit('update:value', '{"updated":true}')
    queryInput.vm.$emit('update:value', '$.updated')

    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', '$.items[0]')
    select.vm.$emit('update:value', null)

    await nextTick()

    expect(wrapper.emitted('update:jsonText')?.[0]).toEqual(['{"updated":true}'])
    expect(wrapper.emitted('update:queryText')?.[0]).toEqual(['$.updated'])
    expect(wrapper.emitted('update:queryText')?.[1]).toEqual(['$.items[0]'])
    expect(wrapper.emitted('update:queryText')).toHaveLength(2)
  })
})
