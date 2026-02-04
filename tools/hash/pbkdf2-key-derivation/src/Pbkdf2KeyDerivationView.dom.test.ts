import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'

const storageMap = new Map<string, Ref<unknown>>()
const useStorage = <T>(key: string, initial: T) => {
  if (!storageMap.has(key)) {
    storageMap.set(key, ref(initial))
  }
  return storageMap.get(key) as Ref<T>
}
const getStorage = <T>(key: string) => storageMap.get(key) as Ref<T>

vi.mock('@vueuse/core', () => ({
  useStorage,
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

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
      '<div class="form-item" :data-label="label" :data-status="validationStatus" :data-feedback="feedback"><slot /></div>',
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
  beforeEach(() => {
    storageMap.clear()
  })

  it('renders form, result, and description sections', () => {
    const wrapper = mount(Pbkdf2KeyDerivationView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.password-input').exists()).toBe(true)
    expect(wrapper.find('.salt-input').exists()).toBe(true)
    expect(wrapper.find('.pbkdf2-result').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('updates validation and salt error states', async () => {
    const wrapper = mount(Pbkdf2KeyDerivationView)
    const form = wrapper.findComponent({ name: 'Pbkdf2Form' })

    form.vm.$emit('update:password', 'secret')
    form.vm.$emit('update:salt', 'zz')
    form.vm.$emit('update:salt-format', 'hex')
    form.vm.$emit('update:algorithm', 'SHA-1')
    form.vm.$emit('update:iterations', 0)
    form.vm.$emit('update:length', 8)

    const iterationsRef = getStorage<number | null>('tools:pbkdf2-key-derivation:iterations')
    const lengthRef = getStorage<number | null>('tools:pbkdf2-key-derivation:length')
    const saltFormatRef = getStorage<'utf-8' | 'hex' | 'base64'>(
      'tools:pbkdf2-key-derivation:salt-format',
    )

    iterationsRef.value = null
    await nextTick()
    expect(wrapper.find('[data-label="iterations"]').attributes('data-status')).toBeUndefined()

    iterationsRef.value = 1.5
    await nextTick()
    expect(wrapper.find('[data-label="iterations"]').attributes('data-status')).toBe('error')

    iterationsRef.value = 1000001
    await nextTick()
    expect(wrapper.find('[data-label="iterations"]').attributes('data-status')).toBe('error')

    lengthRef.value = 512
    await nextTick()
    expect(wrapper.find('[data-label="length"]').attributes('data-status')).toBe('error')

    saltFormatRef.value = 'hex'
    form.vm.$emit('update:salt', 'zz')
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('salt-invalid-hex')

    saltFormatRef.value = 'base64'
    form.vm.$emit('update:salt', '***')
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('salt-invalid-base64')

    form.vm.$emit('update:salt', new File(['data'], 'salt.bin'))
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('')

    form.vm.$emit('update:salt', '')
    saltFormatRef.value = 'utf-8'
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('')
  })
})
