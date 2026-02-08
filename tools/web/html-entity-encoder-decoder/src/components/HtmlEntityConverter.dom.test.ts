import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HtmlEntityConverter from './HtmlEntityConverter.vue'
import { decodeHtmlEntities, encodeHtmlEntities } from '../utils'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  type Watch = typeof actual.watch

  const watchSync: Watch = (source: unknown, callback: unknown, options?: unknown) =>
    actual.watch(
      source as Parameters<Watch>[0],
      callback as Parameters<Watch>[1],
      {
        ...(options ?? {}),
        flush: 'sync',
      } as Parameters<Watch>[2],
    )

  return {
    ...actual,
    watch: watchSync,
  }
})

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

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div class="n-gi"><slot /></div>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: ['label', 'labelPlacement'],
    template: '<div class="n-form-item" :data-label="label"><slot /></div>',
  })

  return { NSelect, NInput, NGrid, NGi, NFlex, NFormItem }
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

const defaultPlain = '<div class="hello">Hello & World</div>'

describe('HtmlEntityConverter', () => {
  it('initializes with defaults and encodes the plain text', async () => {
    const wrapper = mount(HtmlEntityConverter, {
      global: {
        stubs,
      },
    })

    await nextTick()

    const selects = wrapper.findAll('select.n-select')
    expect(selects).toHaveLength(2)
    expect((selects[0]!.element as HTMLSelectElement).value).toBe('named')
    expect((selects[1]!.element as HTMLSelectElement).value).toBe('minimal')

    const inputs = wrapper.findAll('textarea.n-input')
    expect(inputs).toHaveLength(2)
    expect((inputs[0]!.element as HTMLTextAreaElement).value).toBe(defaultPlain)
    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      encodeHtmlEntities(defaultPlain, 'named', 'minimal'),
    )
  })

  it('updates encoded output when plain text and options change', async () => {
    const wrapper = mount(HtmlEntityConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    const selects = wrapper.findAll('select.n-select')

    await inputs[0]!.setValue('<span>AT&T</span>')
    await nextTick()

    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      encodeHtmlEntities('<span>AT&T</span>', 'named', 'minimal'),
    )

    await selects[0]!.setValue('decimal')
    await nextTick()

    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      encodeHtmlEntities('<span>AT&T</span>', 'decimal', 'minimal'),
    )

    await selects[1]!.setValue('all-special')
    await nextTick()

    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(
      encodeHtmlEntities('<span>AT&T</span>', 'decimal', 'all-special'),
    )
  })

  it('updates plain text when encoded input changes', async () => {
    const wrapper = mount(HtmlEntityConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    const encoded = '&lt;span&gt;Hi &amp; Bye&lt;/span&gt;'

    await inputs[1]!.setValue(encoded)
    await nextTick()

    expect((inputs[0]!.element as HTMLTextAreaElement).value).toBe(decodeHtmlEntities(encoded))
  })
})
