import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  TextOrFileInput: {
    props: ['value', 'label', 'validationStatus', 'feedback', 'showFeedback'],
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
      '<div class="form-item" :data-status="validationStatus" :data-feedback="feedback"><slot /></div>',
  },
  NInput: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="password-input" :value="value || ''" @input="$emit('update:value', $event.target.value)" />`,
  },
  NInputNumber: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="number-input" :value="value ?? ''" @input="$emit('update:value', $event.target.value === '' ? null : Number($event.target.value))" />`,
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

vi.mock('./components/Pbkdf2Result.vue', () => ({
  default: {
    template: '<div class="pbkdf2-result" />',
  },
}))

vi.mock('./components/WhatIsPBKDF2.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let Pbkdf2KeyDerivationView: typeof import('./Pbkdf2KeyDerivationView.vue').default

beforeAll(async () => {
  Pbkdf2KeyDerivationView = (await import('./Pbkdf2KeyDerivationView.vue')).default
})

describe('Pbkdf2KeyDerivationView', () => {
  it('renders form, result, and description sections', () => {
    const wrapper = mount(Pbkdf2KeyDerivationView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.password-input').exists()).toBe(true)
    expect(wrapper.find('.salt-input').exists()).toBe(true)
    expect(wrapper.find('.pbkdf2-result').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
