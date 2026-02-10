import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrettierInputOutput from './PrettierInputOutput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NCard: defineComponent({
      name: 'NCard',
      template: '<div data-card><slot /></div>',
    }),
    NCode: defineComponent({
      name: 'NCode',
      props: ['code', 'language'],
      template: '<pre data-testid="code" :data-language="language">{{ code }}</pre>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label'],
      template: '<div><span data-label>{{ label }}</span><slot /><slot name="feedback" /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'status'],
      emits: ['update:value'],
      template:
        '<textarea :data-status="status" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span data-testid="error"><slot /></span>',
    }),
  }
})

type InputOutputProps = {
  sourceCode: string
  formattedCode: string
  formatError: string
  highlightLanguage: string
}

const mountComponent = (overrides: Partial<InputOutputProps> = {}) =>
  mount(PrettierInputOutput, {
    props: {
      sourceCode: 'const value = 1',
      formattedCode: 'formatted',
      formatError: '',
      highlightLanguage: 'javascript',
      ...overrides,
    },
  })

describe('PrettierInputOutput', () => {
  it('renders labels and formatted output', () => {
    const wrapper = mountComponent({ formattedCode: 'output', highlightLanguage: 'yaml' })

    const labels = wrapper.findAll('[data-label]').map((label) => label.text())
    expect(labels).toContain('input-code')
    expect(labels).toContain('formatted-code')

    const code = wrapper.get('[data-testid="code"]')
    expect(code.text()).toBe('output')
    expect(code.attributes('data-language')).toBe('yaml')
  })

  it('emits source updates when input changes', async () => {
    const wrapper = mountComponent()
    const textarea = wrapper.get('textarea')

    await textarea.setValue('next value')

    expect(wrapper.emitted('update:sourceCode')).toBeTruthy()
    expect(wrapper.emitted('update:sourceCode')![0]).toEqual(['next value'])
  })

  it('shows errors and marks the input when formatting fails', () => {
    const wrapper = mountComponent({ formatError: 'format failed' })

    const error = wrapper.get('[data-testid="error"]')
    expect(error.text()).toContain('format failed')

    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('data-status')).toBe('error')
  })
})
