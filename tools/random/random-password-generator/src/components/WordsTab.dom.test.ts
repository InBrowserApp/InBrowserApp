import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, type Ref } from 'vue'
import WordsTab from './WordsTab.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('bip39/src/wordlists/english.json', () => ({ default: ['alpha', 'bravo'] }))

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
  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<div class="n-slider" />',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input class="n-input" />',
  })
  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template: '<button class="n-switch" type="button" />',
  })
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NSlider,
    NInput,
    NSwitch,
  }
})

describe('WordsTab', () => {
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

  it('generates capitalized words with a number suffix', () => {
    storage.set('tools:random-password-generator:words:count', ref(2))
    storage.set('tools:random-password-generator:words:sep', ref('.'))
    storage.set('tools:random-password-generator:words:caps', ref(true))
    storage.set('tools:random-password-generator:words:num', ref(true))

    const wrapper = mount(WordsTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string
    const parts = value.split('.')

    expect(parts).toHaveLength(3)
    expect(parts[0]?.[0]).toBe('A')
    expect(parts[1]?.[0]).toBe('A')
    expect(parts[2]).toBe('0')
  })

  it('falls back to a dash separator when empty', () => {
    storage.set('tools:random-password-generator:words:count', ref(2))
    storage.set('tools:random-password-generator:words:sep', ref(''))
    storage.set('tools:random-password-generator:words:caps', ref(false))
    storage.set('tools:random-password-generator:words:num', ref(false))

    const wrapper = mount(WordsTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value.split('-')).toHaveLength(2)
  })

  it('updates stored options from form controls', async () => {
    storage.set('tools:random-password-generator:words:count', ref(2))
    storage.set('tools:random-password-generator:words:sep', ref('-'))
    storage.set('tools:random-password-generator:words:caps', ref(false))
    storage.set('tools:random-password-generator:words:num', ref(false))

    const wrapper = mount(WordsTab, {
      props: {
        nonce: 0,
      },
    })

    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 6)
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', '_')
    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    switches[0]?.vm.$emit('update:value', true)
    switches[1]?.vm.$emit('update:value', true)
    await nextTick()

    expect((storage.get('tools:random-password-generator:words:count') as Ref<number>).value).toBe(
      6,
    )
    expect((storage.get('tools:random-password-generator:words:sep') as Ref<string>).value).toBe(
      '_',
    )
    expect((storage.get('tools:random-password-generator:words:caps') as Ref<boolean>).value).toBe(
      true,
    )
    expect((storage.get('tools:random-password-generator:words:num') as Ref<boolean>).value).toBe(
      true,
    )
  })
})
