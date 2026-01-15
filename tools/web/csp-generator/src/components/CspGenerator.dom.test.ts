import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import type { BuilderDirective } from './CspBuilderSection.vue'
import CspGenerator from './CspGenerator.vue'

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
            onClick: () => emit('remove', (props.directives as BuilderDirective[])?.[0]?.id),
          },
          'remove',
        ),
        h(
          'button',
          {
            'data-test': 'update-name',
            onClick: () =>
              emit('update-name', (props.directives as BuilderDirective[])?.[0]?.id, 'img-src'),
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
                (props.directives as BuilderDirective[])?.[0]?.id,
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

describe('CspGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates output from the default directive and supports updates', async () => {
    const wrapper = mount(CspGenerator, {
      global: {
        stubs: {
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

  it('normalizes invalid stored directives', () => {
    localStorage.setItem('tools:csp-generator:builder', '"invalid"')

    const wrapper = mount(CspGenerator, {
      global: {
        stubs: {
          CspBuilderSection: BuilderStub,
        },
      },
    })

    const builder = wrapper.findComponent(BuilderStub)
    expect(builder.props('directives')).toHaveLength(1)
  })

  it('repairs missing ids to keep add working', async () => {
    localStorage.setItem(
      'tools:csp-generator:builder',
      JSON.stringify([{ name: 'default-src', valuesText: "'self'" }]),
    )

    const wrapper = mount(CspGenerator, {
      global: {
        stubs: {
          CspBuilderSection: BuilderStub,
        },
      },
    })

    const builder = wrapper.findComponent(BuilderStub)
    const directives = builder.props('directives') as BuilderDirective[]
    expect(directives[0]?.id).toBeTruthy()

    await wrapper.get('[data-test="add"]').trigger('click')
    expect(builder.props('directives')).toHaveLength(2)
  })
})
