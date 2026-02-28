import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrettierOptionsForm from './PrettierOptionsForm.vue'
import type { LanguageKey } from '../languages'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label'],
      template: '<div><span data-label>{{ label }}</span><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value'],
      emits: ['update:value'],
      template:
        '<input type="number" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: String,
          default: '',
        },
        options: {
          type: Array,
          default: () => [],
        },
      },
      emits: ['update:value'],
      template:
        '<select :data-options-length="options.length" :data-value="value" @change="$emit(\'update:value\', $event.target.value)" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: ['value'],
      emits: ['update:value'],
      template:
        '<button type="button" :data-value="value" @click="$emit(\'update:value\', !value)" />',
    }),
  }
})

const defaultLanguageKeys = ['javascript', 'typescript'] as const

const mountComponent = (
  overrides: Partial<{
    languageKeys: readonly LanguageKey[]
    language: LanguageKey
    printWidth: number
    tabWidth: number
    useTabs: boolean
    semi: boolean
    singleQuote: boolean
    trailingComma: 'none' | 'es5' | 'all'
    supportsSemi: boolean
    supportsSingleQuote: boolean
    supportsTrailingComma: boolean
  }> = {},
) =>
  mount(PrettierOptionsForm, {
    props: {
      languageKeys: defaultLanguageKeys,
      language: 'javascript',
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      supportsSemi: true,
      supportsSingleQuote: true,
      supportsTrailingComma: true,
      ...overrides,
    },
  })

describe('PrettierOptionsForm', () => {
  it('renders language and trailing comma options', () => {
    const wrapper = mountComponent()

    const selects = wrapper.findAll('select')
    expect(selects).toHaveLength(2)
    expect(selects[0]?.attributes('data-options-length')).toBe('2')
    expect(selects[1]?.attributes('data-options-length')).toBe('3')

    const labels = wrapper.findAll('[data-label]').map((label) => label.text())
    expect(labels).toContain('Semicolons')
    expect(labels).toContain('Single quotes')
    expect(labels).toContain('Trailing commas')
  })

  it('omits conditional controls when unsupported', () => {
    const wrapper = mountComponent({
      supportsSemi: false,
      supportsSingleQuote: false,
      supportsTrailingComma: false,
    })

    const selects = wrapper.findAll('select')
    expect(selects).toHaveLength(1)

    const labels = wrapper.findAll('[data-label]').map((label) => label.text())
    expect(labels).not.toContain('Semicolons')
    expect(labels).not.toContain('Single quotes')
    expect(labels).not.toContain('Trailing commas')
  })

  it('emits updates from form controls', async () => {
    const wrapper = mountComponent()

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    await selects[0]!.vm.$emit('update:value', 'typescript')
    await selects[1]!.vm.$emit('update:value', 'all')

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    await inputs[0]!.vm.$emit('update:value', 120)
    await inputs[1]!.vm.$emit('update:value', 4)

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    await switches[0]!.vm.$emit('update:value', true)
    await switches[1]!.vm.$emit('update:value', false)
    await switches[2]!.vm.$emit('update:value', true)

    expect(wrapper.emitted('update:language')![0]).toEqual(['typescript'])
    expect(wrapper.emitted('update:trailingComma')![0]).toEqual(['all'])
    expect(wrapper.emitted('update:printWidth')![0]).toEqual([120])
    expect(wrapper.emitted('update:tabWidth')![0]).toEqual([4])
    expect(wrapper.emitted('update:useTabs')![0]).toEqual([true])
    expect(wrapper.emitted('update:semi')![0]).toEqual([false])
    expect(wrapper.emitted('update:singleQuote')![0]).toEqual([true])
  })
})
