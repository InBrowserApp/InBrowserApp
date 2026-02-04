import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UnicodeConverter from './UnicodeConverter.vue'
import { escapeUnicode } from '../utils'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
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

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NSelect = defineComponent({
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
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
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
      autosize: {
        type: Object,
        default: () => ({}),
      },
      type: {
        type: String,
        default: 'text',
      },
    },
    emits: ['update:value'],
    template:
      '<textarea class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NSelect,
    NInput,
  }
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  CopyToClipboardButton: {
    props: {
      content: {
        type: String,
        default: '',
      },
    },
    template: '<button class="copy" />',
  },
}

const defaultPlainText = `Hello ${String.fromCodePoint(0x4f60, 0x597d)} ${String.fromCodePoint(0x1f389)}`

describe('UnicodeConverter', () => {
  it('renders default values and escape format', async () => {
    const wrapper = mount(UnicodeConverter, {
      global: {
        stubs,
      },
    })

    await nextTick()

    const select = wrapper.get('select.n-select').element as HTMLSelectElement
    expect(select.value).toBe('js')

    const options = wrapper.findAll('select.n-select option')
    expect(options.length).toBeGreaterThan(0)

    const inputs = wrapper.findAll('textarea.n-input')
    expect(inputs).toHaveLength(2)

    const plainInput = inputs[0]!.element as HTMLTextAreaElement
    const escapedInput = inputs[1]!.element as HTMLTextAreaElement

    expect(plainInput.value).toBe(defaultPlainText)
    expect(escapedInput.value).toBe(escapeUnicode(defaultPlainText, 'js'))
  })

  it('updates escaped text when plain text changes', async () => {
    const wrapper = mount(UnicodeConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    const plainInput = inputs[0]!
    const escapedInput = inputs[1]!

    const nextValue = `Hi ${String.fromCodePoint(0x1f600)}`
    await plainInput.setValue(nextValue)
    await nextTick()

    expect((escapedInput.element as HTMLTextAreaElement).value).toBe(escapeUnicode(nextValue, 'js'))
  })

  it('updates plain text when escaped text changes', async () => {
    const wrapper = mount(UnicodeConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    const plainInput = inputs[0]!
    const escapedInput = inputs[1]!

    await escapedInput.setValue('\\u4F60\\u597D')
    await nextTick()

    const expectedPlain = String.fromCodePoint(0x4f60, 0x597d)
    expect((plainInput.element as HTMLTextAreaElement).value).toBe(expectedPlain)
  })

  it('updates escaped text when format changes', async () => {
    const wrapper = mount(UnicodeConverter, {
      global: {
        stubs,
      },
    })

    const select = wrapper.get('select.n-select')
    const inputs = wrapper.findAll('textarea.n-input')
    const plainInput = inputs[0]!.element as HTMLTextAreaElement
    const escapedInput = inputs[1]!.element as HTMLTextAreaElement

    await select.setValue('url')
    await nextTick()

    expect(escapedInput.value).toBe(escapeUnicode(plainInput.value, 'url'))
  })
})
