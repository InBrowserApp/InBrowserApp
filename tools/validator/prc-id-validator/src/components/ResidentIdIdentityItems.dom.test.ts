import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateResidentId } from '../data/residentId'
import ResidentIdIdentityItems from './ResidentIdIdentityItems.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDescriptionsItem = defineComponent({
    name: 'NDescriptionsItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div class="desc-item" :data-label="label"><slot /></div>',
  })

  return { NDescriptionsItem }
})

vi.mock('./ResidentIdCheckDigitDisplay.vue', () => ({
  default: {
    props: ['expected', 'actual'],
    template: '<div class="check-digit" :data-expected="expected" :data-actual="actual" />',
  },
}))

vi.mock('./ResidentIdChecksumTag.vue', () => ({
  default: {
    props: ['isChecksumValid'],
    template: '<div class="checksum" :data-valid="isChecksumValid" />',
  },
}))

vi.mock('./ResidentIdCopyableValue.vue', () => ({
  default: {
    props: ['value'],
    template: '<div class="copyable" :data-value="value" />',
  },
}))

vi.mock('./ResidentIdGenderDisplay.vue', () => ({
  default: {
    props: ['gender'],
    template: '<div class="gender" :data-gender="gender" />',
  },
}))

vi.mock('./ResidentIdTextValue.vue', () => ({
  default: {
    props: ['value'],
    template: '<div class="text-value" :data-value="value" />',
  },
}))

describe('ResidentIdIdentityItems', () => {
  it('renders identity details with labels', () => {
    const validationResult = validateResidentId('11010519491231002X')
    const wrapper = mount(ResidentIdIdentityItems, {
      props: { validationResult },
    })

    const labels = wrapper.findAll('.desc-item').map((item) => item.attributes('data-label'))
    expect(labels).toEqual([
      'birthdate',
      'age',
      'gender',
      'sequenceCode',
      'checksum',
      'checkDigit',
      'normalized',
    ])

    expect(wrapper.find('.text-value[data-value="1949-12-31"]').exists()).toBe(true)
    expect(wrapper.find(`.text-value[data-value="${String(validationResult.age)}"]`).exists()).toBe(
      true,
    )
    expect(wrapper.get('.gender').attributes('data-gender')).toBe(validationResult.gender)
    expect(wrapper.find('.text-value[data-value="002"]').exists()).toBe(true)
    expect(wrapper.get('.checksum').attributes('data-valid')).toBe('true')
    expect(wrapper.get('.check-digit').attributes('data-expected')).toBe('X')
    expect(wrapper.get('.check-digit').attributes('data-actual')).toBe('X')
    expect(wrapper.get('.copyable').attributes('data-value')).toBe('11010519491231002X')
  })
})
