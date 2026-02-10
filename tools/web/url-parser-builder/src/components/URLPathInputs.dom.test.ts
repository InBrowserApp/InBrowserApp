import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { NFormItem, NInput } from 'naive-ui'
import URLPathInputs from './URLPathInputs.vue'

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

  return {
    NGridItem,
    NFormItem,
    NInput,
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

describe('URLPathInputs', () => {
  it('renders labels and values', () => {
    const wrapper = mount(URLPathInputs, {
      props: {
        path: '/docs',
        queryString: '?next=1',
        hash: '#section',
      },
      global: {
        plugins: [i18n],
      },
    })

    const formItems = wrapper.findAllComponents(NFormItem)
    expect(formItems).toHaveLength(3)
    expect(formItems[0]?.props('label')).toBe('Path')
    expect(formItems[1]?.props('label')).toBe('Query Parameters')
    expect(formItems[2]?.props('label')).toBe('Hash/Fragment')

    const inputs = wrapper.findAllComponents(NInput)
    expect(inputs).toHaveLength(3)
    expect(inputs[0]?.props('value')).toBe('/docs')
    expect(inputs[1]?.props('value')).toBe('?next=1')
    expect(inputs[2]?.props('value')).toBe('#section')
  })
})
