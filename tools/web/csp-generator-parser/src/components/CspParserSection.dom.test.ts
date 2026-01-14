import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CspParserSection from './CspParserSection.vue'

vi.mock('naive-ui', () => ({
  NButton: defineComponent({
    name: 'NButton',
    props: { disabled: { type: Boolean, default: false } },
    emits: ['click'],
    setup(props, { emit, slots }) {
      return () =>
        h(
          'button',
          {
            disabled: props.disabled,
            onClick: () => {
              if (!props.disabled) emit('click')
            },
          },
          slots.default?.(),
        )
    },
  }),
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
    applyParsed: 'Use parsed directives',
  }

  it('emits updates and apply actions', async () => {
    const wrapper = mount(CspParserSection, {
      props: {
        input: '',
        inputError: true,
        inputStatus: 'error',
        directives: [],
        labels,
        canApplyParsed: false,
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

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('allows applying parsed directives when enabled', async () => {
    const wrapper = mount(CspParserSection, {
      props: {
        input: 'default-src',
        inputError: false,
        directives: [{ name: 'default-src', values: [] }],
        labels,
        canApplyParsed: true,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          ParsedDirectivesList: { template: '<div>Directive list</div>' },
        },
      },
    })

    const button = wrapper.get('button')
    await button.trigger('click')

    expect(wrapper.emitted('apply-parsed')).toBeTruthy()
  })
})
