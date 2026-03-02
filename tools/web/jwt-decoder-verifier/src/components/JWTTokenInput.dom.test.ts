import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JWTTokenInput from './JWTTokenInput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

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
      type: {
        type: String,
        default: 'text',
      },
      showPasswordOn: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input data-testid="token-input" />',
  })

  return { NInput }
})

describe('JWTTokenInput', () => {
  it('renders a token field and emits updates', async () => {
    const wrapper = mount(JWTTokenInput, {
      props: {
        value: 'initial',
        placeholder: 'placeholder',
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Token')
    const input = wrapper.findComponent({ name: 'NInput' })
    expect(input.props('placeholder')).toBe('placeholder')
    expect(input.props('type')).toBe('password')
    expect(input.props('showPasswordOn')).toBe('click')

    await input.vm.$emit('update:value', 'next')
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['next'])
  })
})
