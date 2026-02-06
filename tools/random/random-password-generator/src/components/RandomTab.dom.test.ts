import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, type Ref } from 'vue'
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
  const NCheckboxGroup = defineComponent({
    name: 'NCheckboxGroup',
    props: {
      value: {
        type: Array<string>,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="checkbox-group"><slot /></div>',
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
    NCheckboxGroup,
    NCheckbox,
    NSwitch,
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

  it('builds the pool from upper, lower, and symbol sets', () => {
    storage.set('tools:random-password-generator:random:length', ref(3))
    storage.set(
      'tools:random-password-generator:random:charsets',
      ref(['upper', 'lower', 'symbols']),
    )
    storage.set('tools:random-password-generator:random:excludeSimilar', ref(false))

    const wrapper = mount(RandomTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('AAA')
  })

  it('falls back to the default charset when none are selected', () => {
    storage.set('tools:random-password-generator:random:length', ref(1))
    storage.set('tools:random-password-generator:random:charsets', ref([]))
    storage.set('tools:random-password-generator:random:excludeSimilar', ref(false))

    const wrapper = mount(RandomTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('A')
  })

  it('updates stored options from controls', async () => {
    storage.set('tools:random-password-generator:random:length', ref(8))
    storage.set('tools:random-password-generator:random:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:random:excludeSimilar', ref(true))

    const wrapper = mount(RandomTab, {
      props: {
        nonce: 0,
      },
    })

    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 12)
    wrapper.findComponent({ name: 'NCheckboxGroup' }).vm.$emit('update:value', ['upper', 'symbols'])
    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', false)
    await nextTick()

    expect(
      (storage.get('tools:random-password-generator:random:length') as Ref<number>).value,
    ).toBe(12)
    expect(
      (storage.get('tools:random-password-generator:random:charsets') as Ref<string[]>).value,
    ).toEqual(['upper', 'symbols'])
    expect(
      (storage.get('tools:random-password-generator:random:excludeSimilar') as Ref<boolean>).value,
    ).toBe(false)
  })
})
