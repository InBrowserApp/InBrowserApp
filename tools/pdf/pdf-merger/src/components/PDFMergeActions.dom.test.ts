import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

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
    setup(props, { slots, attrs, emit }) {
      return () =>
        h(
          props.tag,
          {
            ...attrs,
            href: props.href,
            download: props.download,
            disabled: props.disabled,
            onClick: (event: Event) => emit('click', event),
          },
          [slots.icon?.(), slots.default?.()],
        )
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
    inheritAttrs: false,
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NAlert: stub('NAlert'),
    NButton,
    NFlex: stub('NFlex'),
    NIcon: stub('NIcon'),
    NInput,
    NText: stub('NText', 'span'),
  }
})

import PDFMergeActions from './PDFMergeActions.vue'

const ToolSection = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeader = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2><slot /></h2>',
})

describe('PDFMergeActions', () => {
  it('emits clear, merge and output filename updates', async () => {
    let outputName = 'merged.pdf'

    const wrapper = mount(PDFMergeActions, {
      props: {
        outputName,
        'onUpdate:outputName': (value: string) => {
          outputName = value
        },
        itemsCount: 2,
        totalPages: 8,
        canMerge: true,
        isMerging: false,
        errorMessage: '',
        downloadUrl: null,
        downloadFilename: 'merged.pdf',
      },
      global: {
        stubs: {
          ToolSection,
          ToolSectionHeader,
        },
      },
    })

    await wrapper.find('input').setValue('output')

    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')

    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('merge')).toHaveLength(1)
    expect(outputName).toBe('output')
  })

  it('renders download anchor when merged file exists', () => {
    const wrapper = mount(PDFMergeActions, {
      props: {
        outputName: 'merged.pdf',
        'onUpdate:outputName': () => {},
        itemsCount: 2,
        totalPages: 8,
        canMerge: true,
        isMerging: false,
        errorMessage: '',
        downloadUrl: 'blob:merged',
        downloadFilename: 'result.pdf',
      },
      global: {
        stubs: {
          ToolSection,
          ToolSectionHeader,
        },
      },
    })

    const anchor = wrapper.find('a[href="blob:merged"]')
    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('download')).toBe('result.pdf')
  })
})
