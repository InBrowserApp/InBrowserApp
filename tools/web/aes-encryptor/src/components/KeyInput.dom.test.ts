import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KeyInput from './KeyInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@utils/aes', async () => {
  const actual = await vi.importActual<typeof import('@utils/aes')>('@utils/aes')
  return {
    ...actual,
    generateRandomKey: vi.fn(() => 'a'.repeat(32)),
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
  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: ['value'],
    emits: ['update:value'],
    template: '<div class="n-radio-group"><slot /></div>',
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
    },
    emits: ['update:value'],
    template: '<input class="n-input" :data-status="status" :value="value" />',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
  })
  return {
    NSpace: Base,
    NRadioGroup,
    NRadioButton: Base,
    NInput,
    NInputGroup: Base,
    NText,
    NButton,
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

  it('generates a key when requested', async () => {
    const onUpdateRawKey = vi.fn()
    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'raw',
        password: '',
        rawKey: '',
        'onUpdate:keyType': () => {},
        'onUpdate:password': () => {},
        'onUpdate:rawKey': onUpdateRawKey,
      },
    })

    await wrapper.find('.n-button').trigger('click')

    expect(onUpdateRawKey).toHaveBeenCalledWith('a'.repeat(32))
  })

  it('emits key and input updates from field controls', async () => {
    const onUpdateKeyType = vi.fn()
    const onUpdatePassword = vi.fn()
    const onUpdateRawKey = vi.fn()

    const wrapper = mount(KeyInput, {
      props: {
        keyLength: 128,
        keyType: 'password',
        password: 'secret',
        rawKey: '',
        'onUpdate:keyType': onUpdateKeyType,
        'onUpdate:password': onUpdatePassword,
        'onUpdate:rawKey': onUpdateRawKey,
      },
    })

    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'raw')
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'updated-password')

    await wrapper.setProps({ keyType: 'raw' })
    await nextTick()

    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'ab'.repeat(16))

    expect(onUpdateKeyType).toHaveBeenCalledWith('raw')
    expect(onUpdatePassword).toHaveBeenCalledWith('updated-password')
    expect(onUpdateRawKey).toHaveBeenCalledWith('ab'.repeat(16))
  })
})
