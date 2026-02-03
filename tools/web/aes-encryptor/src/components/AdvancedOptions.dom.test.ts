import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AdvancedOptions from './AdvancedOptions.vue'

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
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div class="n-form-item-gi"><slot /><slot name="feedback" /></div>',
  })
  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    emits: ['update:value'],
    template: '<div class="n-input-number" />',
  })
  const NSelect = defineComponent({
    name: 'NSelect',
    props: ['disabled'],
    emits: ['update:value'],
    template: '<div class="n-select" :data-disabled="disabled" />',
  })
  const NInput = defineComponent({
    name: 'NInput',
    template: '<input class="n-input" />',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NGrid: Base,
    NFormItemGi,
    NCollapse: Base,
    NCollapseItem: Base,
    NInputNumber,
    NSelect,
    NRadioGroup: Base,
    NRadio: Base,
    NInput,
    NSpace: Base,
    NText,
  }
})

describe('AdvancedOptions', () => {
  it('updates iterations when value is not null', async () => {
    const updateIterations = vi.fn()

    const wrapper = mount(AdvancedOptions, {
      props: {
        keyType: 'password',
        outputMode: 'raw',
        ivLength: 16,
        pbkdf2Iterations: 5000,
        pbkdf2Hash: 'SHA-256',
        saltMode: 'auto',
        manualSalt: '',
        ivMode: 'auto',
        manualIv: '',
        'onUpdate:pbkdf2Iterations': updateIterations,
        'onUpdate:pbkdf2Hash': () => {},
        'onUpdate:saltMode': () => {},
        'onUpdate:manualSalt': () => {},
        'onUpdate:ivMode': () => {},
        'onUpdate:manualIv': () => {},
      },
    })

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', null)
    await nextTick()

    expect(updateIterations).not.toHaveBeenCalled()

    input.vm.$emit('update:value', 12000)
    await nextTick()

    expect(updateIterations).toHaveBeenCalledWith(12000)
  })

  it('shows warnings and manual inputs for raw mode', () => {
    const wrapper = mount(AdvancedOptions, {
      props: {
        keyType: 'password',
        outputMode: 'raw',
        ivLength: 16,
        pbkdf2Iterations: 9999,
        pbkdf2Hash: 'SHA-256',
        saltMode: 'manual',
        manualSalt: 'ff',
        ivMode: 'manual',
        manualIv: 'aa',
        'onUpdate:pbkdf2Iterations': () => {},
        'onUpdate:pbkdf2Hash': () => {},
        'onUpdate:saltMode': () => {},
        'onUpdate:manualSalt': () => {},
        'onUpdate:ivMode': () => {},
        'onUpdate:manualIv': () => {},
      },
    })

    expect(wrapper.text()).toContain('lowIterationsWarning')
    expect(wrapper.findAll('.n-input')).toHaveLength(2)
  })

  it('disables hash selection in JWE mode', () => {
    const wrapper = mount(AdvancedOptions, {
      props: {
        keyType: 'password',
        outputMode: 'jwe',
        ivLength: 12,
        pbkdf2Iterations: 20000,
        pbkdf2Hash: 'SHA-256',
        saltMode: 'auto',
        manualSalt: '',
        ivMode: 'auto',
        manualIv: '',
        'onUpdate:pbkdf2Iterations': () => {},
        'onUpdate:pbkdf2Hash': () => {},
        'onUpdate:saltMode': () => {},
        'onUpdate:manualSalt': () => {},
        'onUpdate:ivMode': () => {},
        'onUpdate:manualIv': () => {},
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.attributes('data-disabled')).toBe('true')
    expect(wrapper.text()).toContain('jweHashNote')
  })
})
