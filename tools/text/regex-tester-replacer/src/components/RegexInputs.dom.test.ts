import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegexInputs from './RegexInputs.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div class="n-gi"><slot /></div>',
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
      feedback: {
        type: String,
        default: '',
      },
    },
    template:
      '<label class="n-form-item">{{ label }}<slot /><span class="feedback">{{ feedback }}</span></label>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    methods: {
      onInput(event: Event) {
        this.$emit('update:value', (event.target as HTMLInputElement).value)
      },
    },
    template: '<input :value="value" :placeholder="placeholder" @input="onInput" />',
  })

  const NCheckboxGroup = defineComponent({
    name: 'NCheckboxGroup',
    emits: ['update:value'],
    template:
      "<div class=\"checkbox-group\" @click=\"$emit('update:value', ['g', 'i'])\"><slot /></div>",
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<span class="checkbox"><slot /></span>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
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
    template:
      '<button type="button" role="switch" :aria-checked="value" @click="$emit(\'update:value\', !value)"><slot /></button>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button type="button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NButton,
    NCheckbox,
    NCheckboxGroup,
    NFlex,
    NFormItem,
    NGi,
    NGrid,
    NInput,
    NSwitch,
    NText,
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
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      methods: {
        onInput(event: Event) {
          this.$emit('update:value', (event.target as HTMLTextAreaElement).value)
        },
      },
      template: `<textarea :value="typeof value === 'string' ? value : ''" :placeholder="placeholder" @input="onInput" />`,
    }),
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

const baseProps = {
  patternStatus: 'success' as const,
  patternError: '',
  flagOptions: ['g', 'i'],
  textOrFile: 'Order #123-ABC',
  pattern: '#(\\d+)-([A-Z]+)',
  selectedFlags: ['g'],
  replacement: 'ID:$1',
  autoRun: false,
  'onUpdate:textOrFile': vi.fn(),
  'onUpdate:pattern': vi.fn(),
  'onUpdate:selectedFlags': vi.fn(),
  'onUpdate:replacement': vi.fn(),
  'onUpdate:autoRun': vi.fn(),
}

const mountWithI18n = (props = {}) =>
  mount(RegexInputs, {
    props: { ...baseProps, ...props },
  })

describe('RegexInputs', () => {
  it('renders labels and controls', () => {
    const wrapper = mountWithI18n()
    const text = wrapper.text()

    expect(text).toContain('Test Text')
    expect(text).toContain('Regular Expression')
    expect(text).toContain('Replacement')
    expect(text).toContain('Automatically updates results as you type.')
  })

  it('emits model updates from all inputs', async () => {
    const wrapper = mountWithI18n({
      autoRun: true,
      patternStatus: 'error',
      patternError: 'Invalid token',
    })

    await wrapper.find('textarea').setValue('Updated input text')

    const regexInputs = wrapper.findAll('input')
    const patternInput = regexInputs[0]
    const replacementInput = regexInputs[1]
    if (!patternInput || !replacementInput) {
      throw new Error('Expected pattern and replacement inputs')
    }

    await patternInput.setValue('(?<word>[A-Za-z]+)')
    await replacementInput.setValue('$<word>')
    await wrapper.find('.checkbox-group').trigger('click')
    await wrapper.find('[role="switch"]').trigger('click')

    expect(wrapper.emitted('update:textOrFile')?.[0]).toEqual(['Updated input text'])
    expect(wrapper.emitted('update:pattern')?.[0]).toEqual(['(?<word>[A-Za-z]+)'])
    expect(wrapper.emitted('update:selectedFlags')?.[0]).toEqual([['g', 'i']])
    expect(wrapper.emitted('update:replacement')?.[0]).toEqual(['$<word>'])
    expect(wrapper.emitted('update:autoRun')?.[0]).toEqual([false])

    const disabledRunButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Run'))
    expect(disabledRunButton?.attributes('disabled')).toBeDefined()

    await wrapper.setProps({ autoRun: false })
    const enabledRunButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Run'))
    expect(enabledRunButton?.attributes('disabled')).toBeUndefined()
  })

  it('emits run when clicking the run button', async () => {
    const wrapper = mountWithI18n({ autoRun: false })
    const runButton = wrapper.findAll('button').find((button) => button.text().includes('Run'))

    expect(runButton).toBeTruthy()
    await runButton!.trigger('click')

    expect(wrapper.emitted('run')).toBeTruthy()
  })
})
