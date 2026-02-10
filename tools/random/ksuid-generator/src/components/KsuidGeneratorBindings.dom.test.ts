import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, type Ref } from 'vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('../utils/ksuid', () => ({
  KSUID_EPOCH_SECONDS: 1400000000,
  MAX_KSUID_TIMESTAMP: 0xffffffff,
  generateKsuid: vi.fn(() => 'fixed-ksuid'),
  isValidKsuidUnixSeconds: vi.fn(() => true),
}))

import KsuidGenerator from './KsuidGenerator.vue'

const KsuidGeneratorOptionsStub = defineComponent({
  name: 'KsuidGeneratorOptions',
  emits: [
    'update:count',
    'update:timestampMode',
    'update:customDateMs',
    'update:customUnixSeconds',
    'set-now',
  ],
  template: `
    <div>
      <button data-testid="date-null" @click="$emit('update:customDateMs', null)" />
      <button data-testid="date-value" @click="$emit('update:customDateMs', 1700001234567)" />
    </div>
  `,
})

const KsuidGeneratorResultsStub = defineComponent({
  name: 'KsuidGeneratorResults',
  props: ['output', 'generatedAtUnixSeconds'],
  emits: ['regenerate'],
  template: '<div />',
})

const getStorageValue = (key: string) => (storage.get(key) as Ref<unknown>)?.value

describe('KsuidGenerator bindings', () => {
  it('keeps custom unix seconds when custom date is cleared', async () => {
    storage.clear()
    storage.set('tools:ksuid-generator:count', ref(1))
    storage.set('tools:ksuid-generator:timestamp-mode', ref('custom'))
    storage.set('tools:ksuid-generator:custom-unix-seconds', ref(1700000000))

    const wrapper = mount(KsuidGenerator, {
      global: {
        stubs: {
          KsuidGeneratorOptions: KsuidGeneratorOptionsStub,
          KsuidGeneratorResults: KsuidGeneratorResultsStub,
        },
      },
    })

    await wrapper.get('[data-testid="date-null"]').trigger('click')
    expect(getStorageValue('tools:ksuid-generator:custom-unix-seconds')).toBe(1700000000)

    await wrapper.get('[data-testid="date-value"]').trigger('click')
    expect(getStorageValue('tools:ksuid-generator:custom-unix-seconds')).toBe(1700001234)
  })
})
