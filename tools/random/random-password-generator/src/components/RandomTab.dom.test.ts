import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, type Ref } from 'vue'
import RandomTab from './RandomTab.vue'

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
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<label class="checkbox"><slot /></label>',
  })
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NSlider: Base,
    NCheckboxGroup: Base,
    NCheckbox,
    NSwitch: Base,
    NFlex: Base,
  }
})

describe('RandomTab', () => {
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint32Array) => {
        buffer[0] = 0
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates a value without similar digits when excluded', () => {
    storage.set('tools:random-password-generator:random:length', ref(4))
    storage.set('tools:random-password-generator:random:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:random:excludeSimilar', ref(true))

    const wrapper = mount(RandomTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toHaveLength(4)
    expect(value).not.toMatch(/[01]/)
  })

  it('allows similar digits and enforces a minimum length', () => {
    storage.set('tools:random-password-generator:random:length', ref(0))
    storage.set('tools:random-password-generator:random:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:random:excludeSimilar', ref(false))

    const wrapper = mount(RandomTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('0')
  })
})
