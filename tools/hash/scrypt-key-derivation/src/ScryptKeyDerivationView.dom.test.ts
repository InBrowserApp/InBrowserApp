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

vi.mock('./components/ScryptResult.vue', () => ({
  default: {
    template: '<div class="scrypt-result" />',
  },
}))

vi.mock('./components/WhatIsScrypt.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let ScryptKeyDerivationView: typeof import('./ScryptKeyDerivationView.vue').default

beforeAll(async () => {
  ScryptKeyDerivationView = (await import('./ScryptKeyDerivationView.vue')).default
})

describe('ScryptKeyDerivationView', () => {
  beforeEach(() => {
    storageMap.clear()
  })

  it('renders form, result, and description sections', () => {
    const wrapper = mount(ScryptKeyDerivationView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.password-input').exists()).toBe(true)
    expect(wrapper.find('.salt-input').exists()).toBe(true)
    expect(wrapper.find('.scrypt-result').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('auto-generates salt and regenerates while still auto-managed', async () => {
    const wrapper = mount(ScryptKeyDerivationView)
    const form = wrapper.findComponent({ name: 'ScryptForm' })

    const getSaltValue = () => (wrapper.find('.salt-input').element as HTMLTextAreaElement).value

    const initialSalt = getSaltValue()
    expect(initialSalt).not.toBe('')

    form.vm.$emit('update:saltFormat', 'hex')
    await nextTick()

    const regeneratedHexSalt = getSaltValue()
    expect(regeneratedHexSalt).toMatch(/^[a-f0-9]+$/)
    expect(regeneratedHexSalt).not.toBe(initialSalt)

    form.vm.$emit('update:salt', 'manual-salt')
    await nextTick()

    form.vm.$emit('update:saltFormat', 'base64')
    await nextTick()

    expect(getSaltValue()).toBe('manual-salt')
  })

  it('updates validation and salt error states', async () => {
    const wrapper = mount(ScryptKeyDerivationView)
    const form = wrapper.findComponent({ name: 'ScryptForm' })

    form.vm.$emit('update:password', 'secret')
    form.vm.$emit('update:salt', 'zz')
    form.vm.$emit('update:saltFormat', 'hex')
    form.vm.$emit('update:costFactor', 1024)
    form.vm.$emit('update:blockSize', 8)
    form.vm.$emit('update:parallelism', 1)
    form.vm.$emit('update:length', 32)

    const costFactorRef = getStorage<number | null>('tools:scrypt-key-derivation:cost-factor')
    const blockSizeRef = getStorage<number | null>('tools:scrypt-key-derivation:block-size')
    const parallelismRef = getStorage<number | null>('tools:scrypt-key-derivation:parallelism')
    const lengthRef = getStorage<number | null>('tools:scrypt-key-derivation:length')
    const saltFormatRef = getStorage<'utf-8' | 'hex' | 'base64'>(
      'tools:scrypt-key-derivation:salt-format',
    )

    costFactorRef.value = null
    await nextTick()
    expect(wrapper.find('[data-label="N (Cost Factor)"]').attributes('data-status')).toBeUndefined()

    costFactorRef.value = 3
    await nextTick()
    expect(wrapper.find('[data-label="N (Cost Factor)"]').attributes('data-status')).toBe('error')

    costFactorRef.value = 1048577
    await nextTick()
    expect(wrapper.find('[data-label="N (Cost Factor)"]').attributes('data-status')).toBe('error')

    blockSizeRef.value = 33
    await nextTick()
    expect(wrapper.find('[data-label="r (Block Size)"]').attributes('data-status')).toBe('error')

    parallelismRef.value = 0
    await nextTick()
    expect(wrapper.find('[data-label="p (Parallelism)"]').attributes('data-status')).toBe('error')

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

    form.vm.$emit('update:salt', 'AQID')
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('')

    form.vm.$emit('update:salt', new File(['data'], 'salt.bin'))
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('')

    form.vm.$emit('update:salt', '')
    saltFormatRef.value = 'utf-8'
    await nextTick()
    expect(wrapper.find('.text-or-file').attributes('data-feedback')).toBe('')
  })
})
