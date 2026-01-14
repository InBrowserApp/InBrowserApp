import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CspBuilderSection from './CspBuilderSection.vue'

vi.mock('naive-ui', () => ({
  NButton: defineComponent({
    name: 'NButton',
    emits: ['click'],
    setup(_, { emit, slots }) {
      return () => h('button', { onClick: () => emit('click') }, slots.default?.())
    },
  }),
  NCard: defineComponent({
    name: 'NCard',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  NEmpty: defineComponent({
    name: 'NEmpty',
    props: { description: { type: String, default: '' } },
    setup(props) {
      return () => h('div', props.description)
    },
  }),
  NFormItemGi: defineComponent({
    name: 'NFormItemGi',
    setup(_, { slots }) {
      return () => h('div', [slots.label?.(), slots.default?.()])
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
        h('input', {
          value: props.value,
          onInput: (event: Event) => {
            emit('update:value', (event.target as HTMLInputElement).value)
          },
        })
    },
  }),
}))

describe('CspBuilderSection', () => {
  const labels = {
    builderTitle: 'CSP Generator',
    directiveName: 'Directive',
    directiveValues: 'Values',
    namePlaceholder: 'default-src',
    valuesPlaceholder: "'self'",
    addDirective: 'Add',
    removeDirective: 'Remove',
    outputTitle: 'Generated Policy',
    outputLabel: 'CSP Output',
    outputEmpty: 'No output',
  }

  it('emits add, remove, and update events', async () => {
    const wrapper = mount(CspBuilderSection, {
      props: {
        directives: [{ id: '1', name: 'default-src', valuesText: "'self'" }],
        generatedPolicy: '',
        hasOutput: false,
        labels,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: { template: '<button data-test="copy" />' },
        },
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('script-src')
    await inputs[1]!.setValue("'self' https://cdn.example.com")

    expect(wrapper.emitted('update-name')?.[0]).toEqual(['1', 'script-src'])
    expect(wrapper.emitted('update-values')?.[0]).toEqual(['1', "'self' https://cdn.example.com"])

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('add')).toBeTruthy()
  })

  it('renders empty output state when no policy exists', () => {
    const wrapper = mount(CspBuilderSection, {
      props: {
        directives: [],
        generatedPolicy: '',
        hasOutput: false,
        labels,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: { template: '<button data-test="copy" />' },
        },
      },
    })

    expect(wrapper.text()).toContain('No output')
    expect(wrapper.find('[data-test="copy"]').exists()).toBe(false)
  })

  it('shows output and copy button when policy exists', () => {
    const wrapper = mount(CspBuilderSection, {
      props: {
        directives: [],
        generatedPolicy: "default-src 'self'",
        hasOutput: true,
        labels,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: { template: '<button data-test="copy" />' },
          NInput: { template: '<textarea>default-src</textarea>' },
        },
      },
    })

    expect(wrapper.find('[data-test="copy"]').exists()).toBe(true)
  })
})
