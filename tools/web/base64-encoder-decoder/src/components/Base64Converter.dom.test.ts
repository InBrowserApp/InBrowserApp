import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Base64Converter from './Base64Converter.vue'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button data-testid="copy" :data-content="content" />',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<textarea :value="value" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

describe('Base64Converter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('encodes plain text and updates the encoded output', async () => {
    const wrapper = mount(Base64Converter)
    const textareas = wrapper.findAll('textarea')

    expect(textareas).toHaveLength(2)
    expect((textareas[1]!.element as HTMLTextAreaElement).value).toBe('SGVsbG8gV29ybGQh')

    await textareas[0]!.setValue('Test')

    expect((textareas[1]!.element as HTMLTextAreaElement).value).toBe('VGVzdA==')
    expect(wrapper.findAll('[data-testid="copy"]')[1]?.attributes('data-content')).toBe('VGVzdA==')
  })

  it('decodes valid base64 and reports errors for invalid input', async () => {
    const wrapper = mount(Base64Converter)
    const textareas = wrapper.findAll('textarea')

    await textareas[1]!.setValue('SGVsbG8=')
    expect((textareas[0]!.element as HTMLTextAreaElement).value).toBe('Hello')

    await textareas[1]!.setValue('@@@')

    expect((textareas[1]!.element as HTMLTextAreaElement).getAttribute('data-status')).toBe('error')
    expect(wrapper.text()).toContain('invalid-base64')
    expect((textareas[0]!.element as HTMLTextAreaElement).value).toBe('Hello')
  })

  it('treats empty base64 input as valid and clears decoded text', async () => {
    const wrapper = mount(Base64Converter)
    const textareas = wrapper.findAll('textarea')

    await textareas[1]!.setValue('')

    expect((textareas[1]!.element as HTMLTextAreaElement).getAttribute('data-status')).toBe(
      'success',
    )
    expect((textareas[0]!.element as HTMLTextAreaElement).value).toBe('')
    expect(wrapper.text()).not.toContain('invalid-base64')
  })
})
