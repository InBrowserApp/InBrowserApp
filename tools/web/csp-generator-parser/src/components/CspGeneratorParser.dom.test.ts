import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CspGeneratorParser from './CspGeneratorParser.vue'

const ParserStub = defineComponent({
  name: 'CspParserSection',
  props: ['input', 'directives', 'canApplyParsed'],
  emits: ['update:input', 'apply-parsed'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h(
          'button',
          {
            'data-test': 'set-input',
            onClick: () => emit('update:input', "script-src 'self'"),
          },
          'set input',
        ),
        h(
          'button',
          {
            'data-test': 'apply',
            disabled: !props.canApplyParsed,
            onClick: () => emit('apply-parsed'),
          },
          'apply',
        ),
      ])
  },
})

const BuilderStub = defineComponent({
  name: 'CspBuilderSection',
  props: ['directives', 'generatedPolicy', 'hasOutput'],
  emits: ['add', 'remove', 'update-name', 'update-values'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h('span', { 'data-test': 'policy' }, props.generatedPolicy as string),
        h(
          'button',
          {
            'data-test': 'add',
            onClick: () => emit('add'),
          },
          'add',
        ),
        h(
          'button',
          {
            'data-test': 'remove',
            onClick: () => emit('remove', props.directives?.[0]?.id ?? 'missing'),
          },
          'remove',
        ),
        h(
          'button',
          {
            'data-test': 'update-name',
            onClick: () => emit('update-name', props.directives?.[0]?.id ?? 'missing', 'img-src'),
          },
          'update',
        ),
        h(
          'button',
          {
            'data-test': 'update-name-missing',
            onClick: () => emit('update-name', 'missing', 'img-src'),
          },
          'update name missing',
        ),
        h(
          'button',
          {
            'data-test': 'update-values',
            onClick: () =>
              emit(
                'update-values',
                props.directives?.[0]?.id ?? 'missing',
                "'self' https://images.example.com",
              ),
          },
          'update values',
        ),
        h(
          'button',
          {
            'data-test': 'update-missing',
            onClick: () => emit('update-values', 'missing', "'self'"),
          },
          'update missing',
        ),
      ])
  },
})

describe('CspGeneratorParser', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates output from the default directive and supports updates', async () => {
    const wrapper = mount(CspGeneratorParser, {
      global: {
        stubs: {
          CspParserSection: ParserStub,
          CspBuilderSection: BuilderStub,
        },
      },
    })

    const builder = wrapper.findComponent(BuilderStub)
    expect(builder.props('generatedPolicy')).toBe("default-src 'self'")
    expect(builder.props('directives')).toHaveLength(1)

    await wrapper.get('[data-test="add"]').trigger('click')
    expect(builder.props('directives')).toHaveLength(2)

    await wrapper.get('[data-test="update-name"]').trigger('click')
    expect(builder.props('generatedPolicy')).toBe("img-src 'self'")

    await wrapper.get('[data-test="update-values"]').trigger('click')
    expect(builder.props('generatedPolicy')).toBe("img-src 'self' https://images.example.com")

    await wrapper.get('[data-test="remove"]').trigger('click')
    expect(builder.props('generatedPolicy')).toBe('')
    expect(builder.props('hasOutput')).toBe(false)

    await wrapper.get('[data-test="remove"]').trigger('click')
    expect(builder.props('directives')).toHaveLength(1)

    await wrapper.get('[data-test="update-missing"]').trigger('click')
    expect(builder.props('generatedPolicy')).toBe('')

    await wrapper.get('[data-test="update-name-missing"]').trigger('click')
    expect(builder.props('generatedPolicy')).toBe('')
  })

  it('ignores apply actions when there is nothing to parse', async () => {
    const wrapper = mount(CspGeneratorParser, {
      global: {
        stubs: {
          CspParserSection: ParserStub,
          CspBuilderSection: BuilderStub,
        },
      },
    })

    wrapper.findComponent(ParserStub).vm.$emit('apply-parsed')
    await wrapper.vm.$nextTick()

    const builder = wrapper.findComponent(BuilderStub)
    expect(builder.props('generatedPolicy')).toBe("default-src 'self'")
  })

  it('applies parsed directives when available', async () => {
    const wrapper = mount(CspGeneratorParser, {
      global: {
        stubs: {
          CspParserSection: ParserStub,
          CspBuilderSection: BuilderStub,
        },
      },
    })

    await wrapper.get('[data-test="set-input"]').trigger('click')
    await wrapper.get('[data-test="apply"]').trigger('click')

    const builder = wrapper.findComponent(BuilderStub)
    expect(builder.props('generatedPolicy')).toBe("script-src 'self'")
  })
})
