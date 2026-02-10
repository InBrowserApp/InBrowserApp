import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { NFormItem, NInput, NInputNumber } from 'naive-ui'
import URLAuthorityInputs from './URLAuthorityInputs.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGridItem = defineComponent({
    name: 'NGridItem',
    template: '<div><slot /></div>',
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  return {
    NGridItem,
    NFormItem,
    NInput,
    NInputNumber,
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

describe('URLAuthorityInputs', () => {
  it('renders labels and values', () => {
    const wrapper = mount(URLAuthorityInputs, {
      props: {
        protocol: 'https',
        username: 'user',
        password: 'pass',
        hostname: 'example.com',
        portNumber: 443,
      },
      global: {
        plugins: [i18n],
      },
    })

    const formItems = wrapper.findAllComponents(NFormItem)
    expect(formItems).toHaveLength(5)
    expect(formItems[0]?.props('label')).toBe('Protocol')
    expect(formItems[1]?.props('label')).toBe('Username')
    expect(formItems[2]?.props('label')).toBe('Password')
    expect(formItems[3]?.props('label')).toBe('Hostname')
    expect(formItems[4]?.props('label')).toBe('Port')

    const inputs = wrapper.findAllComponents(NInput)
    expect(inputs).toHaveLength(4)
    expect(inputs[0]?.props('value')).toBe('https')
    expect(inputs[1]?.props('value')).toBe('user')
    expect(inputs[2]?.props('value')).toBe('pass')
    expect(inputs[3]?.props('value')).toBe('example.com')

    const portInput = wrapper.findComponent(NInputNumber)
    expect(portInput.props('value')).toBe(443)
  })
})
