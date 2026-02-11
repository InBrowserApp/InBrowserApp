import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlInputOutput from './SqlInputOutput.vue'

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button class="copy">copy</button>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<div><slot name="label" /><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: 'button',
        },
        href: {
          type: String,
          default: undefined,
        },
        download: {
          type: String,
          default: undefined,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template:
        '<component :is="tag" class="n-button" :href="href" :download="download" :disabled="disabled" @click="$emit(\'click\')"><slot name="icon" /><slot /></component>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="icon" />',
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
  overrides: Partial<{
    sourceSql: string
    formattedSql: string
    formatError: string
    downloadUrl: string | null
    downloadFilename: string
  }> = {},
) =>
  mount(SqlInputOutput, {
    props: {
      sourceSql: 'SELECT 1',
      formattedSql: 'SELECT\n  1;',
      formatError: '',
      downloadUrl: 'blob:test-url',
      downloadFilename: 'formatted.sql',
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

  it('emits import/sample/clear actions from source header', async () => {
    const wrapper = mountComponent()

    const importButton = wrapper
      .findAll('.n-button')
      .find((button) => button.text().includes('Import from file'))
    const sampleButton = wrapper
      .findAll('.n-button')
      .find((button) => button.text().includes('Use sample'))
    const clearButton = wrapper
      .findAll('.n-button')
      .find((button) => button.text().includes('Clear'))

    expect(importButton).toBeTruthy()
    expect(sampleButton).toBeTruthy()
    expect(clearButton).toBeTruthy()

    await importButton!.trigger('click')
    await sampleButton!.trigger('click')
    await clearButton!.trigger('click')

    expect(wrapper.emitted('import')).toHaveLength(1)
    expect(wrapper.emitted('sample')).toHaveLength(1)
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('renders formatted download action as anchor', () => {
    const wrapper = mountComponent({
      downloadUrl: 'blob:formatted',
      downloadFilename: 'pretty.sql',
    })

    const downloadButton = wrapper
      .findAllComponents({ name: 'NButton' })
      .find((button) => button.props('tag') === 'a')

    expect(downloadButton).toBeTruthy()
    expect(downloadButton!.props('tag')).toBe('a')
    expect(downloadButton!.props('href')).toBe('blob:formatted')
    expect(downloadButton!.props('download')).toBe('pretty.sql')
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
