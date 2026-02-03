import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RotConverter from './RotConverter.vue'
import { rot } from '../utils'

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

describe('RotConverter', () => {
  it('initializes output from input and type', async () => {
    const wrapper = mount(RotConverter, {
      global: {
        stubs,
      },
    })

    await nextTick()

    const select = wrapper.get('select.n-select').element as HTMLSelectElement
    expect(select.value).toBe('rot13')

    const inputs = wrapper.findAll('textarea.n-input')
    expect(inputs).toHaveLength(2)
    expect((inputs[0]!.element as HTMLTextAreaElement).value).toBe('Hello World! 12345')
    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      rot('Hello World! 12345', 'rot13'),
    )
  })

  it('updates output and input when text changes', async () => {
    const wrapper = mount(RotConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    await inputs[0]!.setValue('Test123')
    await nextTick()

    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(rot('Test123', 'rot13'))

    await inputs[1]!.setValue('Uryyb')
    await nextTick()

    expect((inputs[0]!.element as HTMLTextAreaElement).value).toBe(rot('Uryyb', 'rot13'))
  })

  it('updates output when rot type changes', async () => {
    const wrapper = mount(RotConverter, {
      global: {
        stubs,
      },
    })

    const select = wrapper.get('select.n-select')
    const inputs = wrapper.findAll('textarea.n-input')

    await select.setValue('rot5')
    await nextTick()

    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      rot((inputs[0]!.element as HTMLTextAreaElement).value, 'rot5'),
    )
  })
})
