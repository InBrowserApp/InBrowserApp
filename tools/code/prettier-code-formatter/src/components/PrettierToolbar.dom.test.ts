import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrettierToolbar from './PrettierToolbar.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
        '<component :is="tag || \'button\'" v-bind="$attrs" :disabled="disabled"><slot /></component>',
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
    formattedCode: string
    downloadUrl?: string | null
    downloadFilename: string
  }> = {},
) =>
  mount(PrettierToolbar, {
    props: {
      formattedCode: 'formatted code',
      downloadUrl: 'blob:download',
      downloadFilename: 'formatted.js',
      ...overrides,
    },
  })

describe('PrettierToolbar', () => {
  it('emits import on button click', async () => {
    const wrapper = mountComponent()
    const importButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('import-from-file'))

    expect(importButton).toBeTruthy()
    await importButton!.trigger('click')

    expect(wrapper.emitted('import')).toBeTruthy()
  })

  it('renders download link and copy content', () => {
    const wrapper = mountComponent()

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('blob:download')
    expect(link.attributes('download')).toBe('formatted.js')

    const copy = wrapper.get('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe('formatted code')
  })

  it('disables download when no url is provided', () => {
    const wrapper = mountComponent({ downloadUrl: null })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('disabled')).toBeDefined()
  })
})
