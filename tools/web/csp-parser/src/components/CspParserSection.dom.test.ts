import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CspParserSection from './CspParserSection.vue'

vi.mock('naive-ui', () => ({
  NFormItemGi: defineComponent({
    name: 'NFormItemGi',
    setup(_, { slots }) {
      return () => h('div', [slots.label?.(), slots.default?.(), slots.feedback?.()])
    },
  }),
  NGrid: defineComponent({
    name: 'NGrid',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  NInput: defineComponent({
    name: 'NInput',
    props: { value: { type: String, default: '' } },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('textarea', {
          value: props.value,
          onInput: (event: Event) => {
            emit('update:value', (event.target as HTMLTextAreaElement).value)
          },
        })
    },
  }),
  NText: defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
}))

describe('CspParserSection', () => {
  const labels = {
    parserTitle: 'CSP Parser',
    parserLabel: 'CSP Header',
    parserPlaceholder: 'Paste CSP',
    parserError: 'Enter a CSP header',
    parsedTitle: 'Parsed Directives',
    parsedEmpty: 'No directives',
    noValues: 'No values',
  }

  it('emits updates and renders sections', async () => {
    const wrapper = mount(CspParserSection, {
      props: {
        input: '',
        inputError: true,
        inputStatus: 'error',
        directives: [],
        labels,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          ParsedDirectivesList: { template: '<div>No directives</div>' },
        },
      },
    })

    expect(wrapper.text()).toContain('CSP Parser')
    expect(wrapper.text()).toContain('Enter a CSP header')

    const textarea = wrapper.get('textarea')
    await textarea.setValue("default-src 'self'")
    expect(wrapper.emitted('update:input')?.[0]).toEqual(["default-src 'self'"])
  })
})
