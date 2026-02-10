import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'
import IBANValidatorView from './IBANValidatorView.vue'
import * as toolInfo from './info'

const storage = vi.hoisted(() => new Map<string, Ref<string>>())
const validateMock = vi.hoisted(() => vi.fn())

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: string) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<string>
    },
  }
})

vi.mock('./data/iban', () => ({
  validateIBAN: (value: string) => validateMock(value),
}))

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolDefaultPageLayout: defineComponent({
      name: 'ToolDefaultPageLayout',
      props: ['info'],
      template: '<div class="layout"><slot /></div>',
    }),
  }
})

vi.mock('./components/IBANInput.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'IBANInput',
      props: ['modelValue', 'validationResult'],
      emits: ['update:modelValue'],
      template: '<div class="iban-input" />',
    }),
  }
})

vi.mock('./components/IBANResult.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'IBANResult',
      props: ['validationResult'],
      template: '<div class="iban-result" />',
    }),
  }
})

vi.mock('./components/WhatIsIBANValidator.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'WhatIsIBANValidator',
      template: '<div class="iban-info" />',
    }),
  }
})

const baseResult = {
  input: '',
  normalized: '',
  formatted: '',
  countryCode: null,
  expectedLength: null,
  length: 0,
  checkDigits: null,
  expectedCheckDigits: null,
  bban: null,
  isCountryValid: false,
  isLengthValid: false,
  isFormatValid: false,
  isStructureValid: false,
  isChecksumValid: false,
  isValid: false,
}

describe('IBANValidatorView', () => {
  beforeEach(() => {
    storage.clear()
    validateMock.mockReset()
    validateMock.mockReturnValue(baseResult)
  })

  it('renders input and result when iban is present', () => {
    storage.set('tools:iban-validator:iban', ref('DE89'))

    const wrapper = mount(IBANValidatorView)

    expect(validateMock).toHaveBeenCalledWith('DE89')
    expect(wrapper.find('.iban-input').exists()).toBe(true)
    expect(wrapper.find('.iban-result').exists()).toBe(true)
    expect(wrapper.find('.iban-info').exists()).toBe(true)

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toEqual(toolInfo)

    const input = wrapper.findComponent({ name: 'IBANInput' })
    expect(input.props('validationResult')).toEqual(baseResult)
  })

  it('updates iban from the input model event and revalidates', async () => {
    storage.set('tools:iban-validator:iban', ref('DE89'))

    const wrapper = mount(IBANValidatorView)

    expect(wrapper.find('.iban-result').exists()).toBe(true)

    wrapper.findComponent({ name: 'IBANInput' }).vm.$emit('update:modelValue', '')
    await nextTick()

    expect(validateMock).toHaveBeenLastCalledWith('')
    expect(wrapper.find('.iban-result').exists()).toBe(false)
  })

  it('hides result when iban is empty', () => {
    storage.set('tools:iban-validator:iban', ref(''))

    const wrapper = mount(IBANValidatorView)

    expect(wrapper.find('.iban-result').exists()).toBe(false)
  })
})
