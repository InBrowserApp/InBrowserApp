import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { PDF_ERROR } from '../pdf-errors'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        if (key === 'pages') {
          return `${params?.count as number} pages`
        }

        return key
      },
    }),
  }
})

vi.mock('sortablejs-vue3', async () => {
  const { defineComponent, h } = await import('vue')

  const Sortable = defineComponent({
    name: 'SortableMock',
    inheritAttrs: false,
    props: {
      list: {
        type: Array,
        required: true,
      },
      itemKey: {
        type: [String, Function],
        required: true,
      },
      tag: {
        type: String,
        default: 'div',
      },
    },
    emits: ['end'],
    setup(props, { slots, attrs }) {
      return () =>
        h(
          props.tag,
          attrs,
          (props.list as Array<unknown>).map((element, index) => slots.item?.({ element, index })),
        )
    },
  })

  return {
    Sortable,
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const stub = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /></${tag}>`,
    })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></button>',
  })

  return {
    NButton,
    NEmpty: stub('NEmpty'),
    NFlex: stub('NFlex'),
    NIcon: stub('NIcon'),
    NText: stub('NText', 'span'),
  }
})

import PDFMergeQueue, { type PdfQueueItem } from './PDFMergeQueue.vue'

const ToolSection = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeader = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2><slot /></h2>',
})

describe('PDFMergeQueue', () => {
  it('renders loading, encrypted, invalid and page-count statuses', () => {
    const items: PdfQueueItem[] = [
      {
        id: '1',
        name: 'one.pdf',
        sizeLabel: '1 KB',
        pageCount: null,
        isLoading: true,
        errorCode: null,
      },
      {
        id: '2',
        name: 'two.pdf',
        sizeLabel: '2 KB',
        pageCount: null,
        isLoading: false,
        errorCode: PDF_ERROR.Encrypted,
      },
      {
        id: '3',
        name: 'three.pdf',
        sizeLabel: '3 KB',
        pageCount: null,
        isLoading: false,
        errorCode: PDF_ERROR.Invalid,
      },
      {
        id: '4',
        name: 'four.pdf',
        sizeLabel: '4 KB',
        pageCount: 4,
        isLoading: false,
        errorCode: null,
      },
    ]

    const wrapper = mount(PDFMergeQueue, {
      props: {
        items,
      },
      global: {
        stubs: {
          ToolSection,
          ToolSectionHeader,
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('pageLoading')
    expect(text).toContain('encryptedError')
    expect(text).toContain('invalidError')
    expect(text).toContain('4 pages')
  })

  it('emits reorder, move, preview and remove events', async () => {
    const wrapper = mount(PDFMergeQueue, {
      props: {
        items: [
          {
            id: '1',
            name: 'one.pdf',
            sizeLabel: '1 KB',
            pageCount: 1,
            isLoading: false,
            errorCode: null,
          },
          {
            id: '2',
            name: 'two.pdf',
            sizeLabel: '2 KB',
            pageCount: 2,
            isLoading: false,
            errorCode: null,
          },
        ],
      },
      global: {
        stubs: {
          ToolSection,
          ToolSectionHeader,
        },
      },
    })

    const sortable = wrapper.findComponent({ name: 'SortableMock' })
    sortable.vm.$emit('end', { oldIndex: 0, newIndex: 1 })

    const buttons = wrapper.findAll('button')
    await buttons[1]?.trigger('click')
    await buttons[2]?.trigger('click')
    await buttons[3]?.trigger('click')

    expect(wrapper.emitted('reorder')?.[0]).toEqual([{ oldIndex: 0, newIndex: 1 }])
    expect(wrapper.emitted('move-down')?.[0]).toEqual([0])
    expect(wrapper.emitted('preview')?.[0]).toEqual([0])
    expect(wrapper.emitted('remove')?.[0]).toEqual([0])
  })
})

describe('PDFMergeQueue empty', () => {
  it('renders empty state when there are no items', () => {
    const wrapper = mount(PDFMergeQueue, {
      props: {
        items: [],
      },
      global: {
        stubs: {
          ToolSection,
          ToolSectionHeader,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'NEmpty' }).exists()).toBe(true)
  })
})
