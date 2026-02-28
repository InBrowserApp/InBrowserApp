import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Pbkdf2Form from './Pbkdf2Form.vue'
import type { Pbkdf2Algorithm, SaltFormat } from '../types'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  TextOrFileInput: {
    props: ['value', 'label', 'validationStatus', 'feedback', 'showFeedback', 'placeholder'],
    emits: ['update:value'],
    template:
      '<div class="text-or-file" :data-status="validationStatus" :data-feedback="feedback">' +
      '<textarea class="salt-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />' +
      '</div>',
  },
}))

vi.mock('naive-ui', () => ({
  NFormItem: {
    props: ['label', 'validationStatus', 'feedback', 'showFeedback'],
    template:
      '<div class="form-item" :data-label="label" :data-status="validationStatus" :data-feedback="feedback"><slot /></div>',
  },
  NInput: {
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input class="password-input" :value="value || \'\'" @input="$emit(\'update:value\', $event.target.value)" />',
  },
  NInputNumber: {
    props: ['value'],
    emits: ['update:value'],
    template:
      '<input class="number-input" :value="value ?? \'\'" @input="$emit(\'update:value\', $event.target.value === \'\' ? null : Number($event.target.value))" />',
  },
  NSelect: {
    props: ['value', 'options'],
    emits: ['update:value'],
    template:
      '<select class="select" :value="value" @change="$emit(\'update:value\', $event.target.value)">' +
      '<option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>' +
      '</select>',
  },
  NGi: {
    template: '<div class="grid-item"><slot /></div>',
  },
  NGrid: {
    template: '<div class="grid"><slot /></div>',
  },
}))

const defaultProps = {
  iterationsMin: 1,
  iterationsMax: 1000000,
  lengthMin: 16,
  lengthMax: 256,
  password: '',
  salt: '',
  saltFormat: 'utf-8' as SaltFormat,
  algorithm: 'SHA-256' as Pbkdf2Algorithm,
  iterations: 0,
  length: 0,
}

describe('Pbkdf2Form', () => {
  it('emits v-model updates and shows validation feedback', async () => {
    const wrapper = mount(Pbkdf2Form, {
      props: {
        ...defaultProps,
        iterationsValid: false,
        lengthValid: false,
        saltErrorType: 'hex',
      },
    })

    await wrapper.find('.password-input').setValue('secret')
    await wrapper.find('.salt-input').setValue('salt')

    const selects = wrapper.findAll('.select')
    await selects[0]?.setValue('SHA-1')
    await selects[1]?.setValue('hex')

    const numbers = wrapper.findAll('.number-input')
    await numbers[0]?.setValue('123')
    await numbers[1]?.setValue('64')

    expect(wrapper.emitted('update:password')?.[0]).toEqual(['secret'])
    expect(wrapper.emitted('update:salt')?.[0]).toEqual(['salt'])
    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['SHA-1'])
    expect(wrapper.emitted('update:saltFormat')?.[0]).toEqual(['hex'])
    expect(wrapper.emitted('update:iterations')?.[0]).toEqual([123])
    expect(wrapper.emitted('update:length')?.[0]).toEqual([64])

    expect(wrapper.find('[data-label="Iterations"]').attributes('data-feedback')).toBe(
      'Enter a whole number between 1 and 1000000.',
    )
    expect(wrapper.find('[data-label="Derived Length (bytes)"]').attributes('data-feedback')).toBe(
      'Enter a number between 16 and 256 bytes.',
    )
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe(
      'Salt must be valid hex.',
    )
  })

  it('renders base64 salt feedback', () => {
    const wrapper = mount(Pbkdf2Form, {
      props: {
        ...defaultProps,
        iterationsValid: true,
        lengthValid: true,
        saltErrorType: 'base64',
      },
    })

    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe(
      'Salt must be valid Base64.',
    )
  })
})
