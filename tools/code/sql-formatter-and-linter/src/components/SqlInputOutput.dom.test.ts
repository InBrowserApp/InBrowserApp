import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlInputOutput from './SqlInputOutput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<textarea :value="value" @input="$emit(\'update:value\', ($event.target).value)" />',
    }),
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="alert"><slot /></div>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="card"><slot /></div>',
    }),
    NCode: defineComponent({
      name: 'NCode',
      props: ['code'],
      template: '<pre class="code">{{ code }}</pre>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="text"><slot /></span>',
    }),
  }
})

const mountComponent = (
  overrides: Partial<{ sourceSql: string; formattedSql: string; formatError: string }> = {},
) =>
  mount(SqlInputOutput, {
    props: {
      sourceSql: 'SELECT 1',
      formattedSql: 'SELECT\n  1;',
      formatError: '',
      ...overrides,
    },
  })

describe('SqlInputOutput', () => {
  it('emits source updates from textarea input', async () => {
    const wrapper = mountComponent()

    const textarea = wrapper.get('textarea')
    await textarea.setValue('SELECT 2;')

    expect(wrapper.emitted('update:sourceSql')?.[0]).toEqual(['SELECT 2;'])
  })

  it('renders formatting error when present', () => {
    const wrapper = mountComponent({ formatError: 'Parse error', formattedSql: '' })

    expect(wrapper.find('.alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('Parse error')
    expect(wrapper.find('.code').exists()).toBe(false)
  })

  it('renders formatted SQL output when no error exists', () => {
    const wrapper = mountComponent({ formattedSql: 'SELECT\n  id\nFROM users;' })

    expect(wrapper.find('.alert').exists()).toBe(false)
    expect(wrapper.find('.code').text()).toContain('FROM users')
  })

  it('renders empty output placeholder when no formatted content exists', () => {
    const wrapper = mountComponent({ formattedSql: '', formatError: '' })

    expect(wrapper.find('.text').exists()).toBe(true)
    expect(wrapper.find('.text').text()).toContain('Formatting output appears here.')
  })
})
