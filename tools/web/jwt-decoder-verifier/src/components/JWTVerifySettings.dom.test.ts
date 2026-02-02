import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JWTVerifySettings from './JWTVerifySettings.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div><slot /></div>',
  })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div><slot /></div>',
  })

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
    template: '<input data-testid="secret-input" />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div data-testid="alg-select" />',
  })

  return { NGrid, NFormItemGi, NInput, NSelect }
})

describe('JWTVerifySettings', () => {
  it('renders secret and algorithm inputs', async () => {
    const wrapper = mount(JWTVerifySettings, {
      props: {
        secret: '',
        alg: 'auto',
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

    expect(wrapper.text()).toContain('verify-settings')
    const input = wrapper.findComponent({ name: 'NInput' })
    expect(input.props('placeholder')).toBe('secret')
    expect(input.props('type')).toBe('password')
    expect(input.props('showPasswordOn')).toBe('click')

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: string }>
    expect(options).toHaveLength(14)
    expect(options[0]).toEqual({ label: 'auto', value: 'auto' })

    await input.vm.$emit('update:value', 'next-secret')
    await select.vm.$emit('update:value', 'HS256')

    expect(wrapper.emitted('update:secret')?.[0]).toEqual(['next-secret'])
    expect(wrapper.emitted('update:alg')?.[0]).toEqual(['HS256'])
  })
})
