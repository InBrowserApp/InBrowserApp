import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyInput from './KeyInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: {
      status: {
        type: String,
        default: undefined,
      },
    },
    template: '<input class="n-input" :data-status="status" />',
  })
  const NText = defineComponent({
    name: 'NText',
    props: {
      type: {
        type: String,
        default: 'default',
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NSpace: Base,
    NRadioGroup: Base,
    NRadioButton: Base,
    NInput,
    NText,
  }
})

describe('KeyInput', () => {
  it('renders password input when key type is password', () => {
    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'password',
        password: 'secret',
        rawKey: '',
        'onUpdate:keyType': () => {},
        'onUpdate:password': () => {},
        'onUpdate:rawKey': () => {},
      },
    })

    expect(wrapper.findAll('.n-input')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('invalidHex')
  })

  it('flags invalid hex input', () => {
    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'raw',
        password: '',
        rawKey: 'zz',
        'onUpdate:keyType': () => {},
        'onUpdate:password': () => {},
        'onUpdate:rawKey': () => {},
      },
    })

    const input = wrapper.find('.n-input')
    expect(input.attributes('data-status')).toBe('error')
    expect(wrapper.text()).toContain('invalidHex')
  })

  it('flags wrong key length', () => {
    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'raw',
        password: '',
        rawKey: 'aa',
        'onUpdate:keyType': () => {},
        'onUpdate:password': () => {},
        'onUpdate:rawKey': () => {},
      },
    })

    const input = wrapper.find('.n-input')
    expect(input.attributes('data-status')).toBe('error')
    expect(wrapper.text()).toContain('wrongKeyLength')
  })

  it('accepts a valid key length', () => {
    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'raw',
        password: '',
        rawKey: 'a'.repeat(32),
        'onUpdate:keyType': () => {},
        'onUpdate:password': () => {},
        'onUpdate:rawKey': () => {},
      },
    })

    const input = wrapper.find('.n-input')
    expect(input.attributes('data-status')).toBe('success')
    expect(wrapper.text()).not.toContain('wrongKeyLength')
  })
})
