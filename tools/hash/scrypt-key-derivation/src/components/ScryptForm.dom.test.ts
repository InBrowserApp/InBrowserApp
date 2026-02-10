import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScryptForm from './ScryptForm.vue'
import type { SaltFormat } from '../types'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

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
  costFactorMin: 1024,
  costFactorMax: 1048576,
  blockSizeMin: 1,
  blockSizeMax: 32,
  parallelismMin: 1,
  parallelismMax: 16,
  lengthMin: 16,
  lengthMax: 256,
  password: '',
  salt: '',
  saltFormat: 'utf-8' as SaltFormat,
  costFactor: 1024,
  blockSize: 8,
  parallelism: 1,
  length: 32,
}

describe('ScryptForm', () => {
  it('emits v-model updates and shows validation feedback', async () => {
    const wrapper = mount(ScryptForm, {
      props: {
        ...defaultProps,
        costFactorValid: false,
        costFactorPowerOfTwo: true,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: false,
        saltErrorType: 'hex',
      },
    })

    await wrapper.find('.password-input').setValue('secret')
    await wrapper.find('.salt-input').setValue('salt')

    const select = wrapper.find('.select')
    await select.setValue('hex')

    const numbers = wrapper.findAll('.number-input')
    await numbers[0]?.setValue('2048')
    await numbers[1]?.setValue('64')
    await numbers[2]?.setValue('4')
    await numbers[3]?.setValue('2')

    expect(wrapper.emitted('update:password')?.[0]).toEqual(['secret'])
    expect(wrapper.emitted('update:salt')?.[0]).toEqual(['salt'])
    expect(wrapper.emitted('update:saltFormat')?.[0]).toEqual(['hex'])
    expect(wrapper.emitted('update:costFactor')?.[0]).toEqual([2048])
    expect(wrapper.emitted('update:length')?.[0]).toEqual([64])
    expect(wrapper.emitted('update:blockSize')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:parallelism')?.[0]).toEqual([2])

    expect(wrapper.find('[data-label="N (Cost Factor)"]').attributes('data-feedback')).toBe(
      'range-invalid',
    )
    expect(wrapper.find('[data-label="length"]').attributes('data-feedback')).toBe('length-invalid')
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('salt-invalid-hex')
  })

  it('renders power-of-two feedback for cost factor', () => {
    const wrapper = mount(ScryptForm, {
      props: {
        ...defaultProps,
        costFactorValid: false,
        costFactorPowerOfTwo: false,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: true,
        saltErrorType: '',
      },
    })

    expect(wrapper.find('[data-label="N (Cost Factor)"]').attributes('data-feedback')).toBe(
      'N must be a power of 2.',
    )
  })

  it('renders base64 salt feedback', () => {
    const wrapper = mount(ScryptForm, {
      props: {
        ...defaultProps,
        costFactorValid: true,
        costFactorPowerOfTwo: true,
        blockSizeValid: true,
        parallelismValid: true,
        lengthValid: true,
        saltErrorType: 'base64',
      },
    })

    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('salt-invalid-base64')
  })
})
