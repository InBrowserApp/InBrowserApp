import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlToolbar from './SqlToolbar.vue'

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: undefined,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      template:
        '<component :is="tag || \'button\'" v-bind="$attrs" :disabled="disabled"><slot name="icon" /><slot /></component>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span><slot /></span>',
    }),
  }
})

const mountComponent = (
  overrides: Partial<{
    formattedSql: string
    downloadUrl?: string | null
    downloadFilename: string
  }> = {},
) =>
  mount(SqlToolbar, {
    props: {
      formattedSql: 'SELECT 1;',
      downloadUrl: 'blob:download',
      downloadFilename: 'formatted-sql.sql',
      ...overrides,
    },
  })

describe('SqlToolbar', () => {
  it('emits actions for import/sample/clear buttons', async () => {
    const wrapper = mountComponent()

    const importButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Import from file'))
    const sampleButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Use sample'))
    const clearButton = wrapper.findAll('button').find((button) => button.text().includes('Clear'))

    expect(importButton).toBeTruthy()
    expect(sampleButton).toBeTruthy()
    expect(clearButton).toBeTruthy()

    await importButton!.trigger('click')
    await sampleButton!.trigger('click')
    await clearButton!.trigger('click')

    expect(wrapper.emitted('import')).toBeTruthy()
    expect(wrapper.emitted('sample')).toBeTruthy()
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('renders download link and copy content', () => {
    const wrapper = mountComponent()

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('blob:download')
    expect(link.attributes('download')).toBe('formatted-sql.sql')

    const copy = wrapper.get('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe('SELECT 1;')
  })

  it('disables download when no url is provided', () => {
    const wrapper = mountComponent({ downloadUrl: null })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('disabled')).toBeDefined()
  })

  it('renders icon slot content to exercise icon templates', () => {
    const wrapper = mountComponent()
    expect(wrapper.findAll('span').length).toBeGreaterThan(0)
  })
})
