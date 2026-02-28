import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, type Ref } from 'vue'
import SeparatorTab from './SeparatorTab.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

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
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NSlider,
    NCheckboxGroup,
    NCheckbox,
    NSwitch,
    NFlex: Base,
    NInput,
  }
})

describe('SeparatorTab', () => {
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

  it('builds blocks without similar digits when excluded', () => {
    storage.set('tools:random-password-generator:separator:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:separator:excludeSimilar', ref(true))
    storage.set('tools:random-password-generator:separator:blockLength', ref(2))
    storage.set('tools:random-password-generator:separator:blockCount', ref(3))
    storage.set('tools:random-password-generator:separator:blockSeparator', ref(':'))

    const wrapper = mount(SeparatorTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string
    const blocks = value.split(':')

    expect(blocks).toHaveLength(3)
    blocks.forEach((block) => {
      expect(block).toHaveLength(2)
      expect(block).not.toMatch(/[01]/)
    })
  })

  it('falls back to a dash separator when empty', () => {
    storage.set('tools:random-password-generator:separator:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:separator:excludeSimilar', ref(false))
    storage.set('tools:random-password-generator:separator:blockLength', ref(1))
    storage.set('tools:random-password-generator:separator:blockCount', ref(2))
    storage.set('tools:random-password-generator:separator:blockSeparator', ref(''))

    const wrapper = mount(SeparatorTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('0-0')
  })

  it('builds blocks from upper, lower, and symbol sets', () => {
    storage.set(
      'tools:random-password-generator:separator:charsets',
      ref(['upper', 'lower', 'symbols']),
    )
    storage.set('tools:random-password-generator:separator:excludeSimilar', ref(false))
    storage.set('tools:random-password-generator:separator:blockLength', ref(1))
    storage.set('tools:random-password-generator:separator:blockCount', ref(2))
    storage.set('tools:random-password-generator:separator:blockSeparator', ref('.'))

    const wrapper = mount(SeparatorTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('A.A')
  })

  it('falls back to the default charset when none are selected', () => {
    storage.set('tools:random-password-generator:separator:charsets', ref([]))
    storage.set('tools:random-password-generator:separator:excludeSimilar', ref(false))
    storage.set('tools:random-password-generator:separator:blockLength', ref(1))
    storage.set('tools:random-password-generator:separator:blockCount', ref(2))
    storage.set('tools:random-password-generator:separator:blockSeparator', ref(':'))

    const wrapper = mount(SeparatorTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('A:A')
  })

  it('updates stored options from controls', async () => {
    storage.set('tools:random-password-generator:separator:charsets', ref(['digits']))
    storage.set('tools:random-password-generator:separator:excludeSimilar', ref(true))
    storage.set('tools:random-password-generator:separator:blockLength', ref(2))
    storage.set('tools:random-password-generator:separator:blockCount', ref(3))
    storage.set('tools:random-password-generator:separator:blockSeparator', ref('-'))

    const wrapper = mount(SeparatorTab, {
      props: {
        nonce: 0,
      },
    })

    wrapper.findComponent({ name: 'NCheckboxGroup' }).vm.$emit('update:value', ['upper'])
    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', false)
    const sliders = wrapper.findAllComponents({ name: 'NSlider' })
    sliders[0]?.vm.$emit('update:value', 6)
    sliders[1]?.vm.$emit('update:value', 5)
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', ':')
    await nextTick()

    expect(
      (storage.get('tools:random-password-generator:separator:charsets') as Ref<string[]>).value,
    ).toEqual(['upper'])
    expect(
      (storage.get('tools:random-password-generator:separator:excludeSimilar') as Ref<boolean>)
        .value,
    ).toBe(false)
    expect(
      (storage.get('tools:random-password-generator:separator:blockLength') as Ref<number>).value,
    ).toBe(6)
    expect(
      (storage.get('tools:random-password-generator:separator:blockCount') as Ref<number>).value,
    ).toBe(5)
    expect(
      (storage.get('tools:random-password-generator:separator:blockSeparator') as Ref<string>)
        .value,
    ).toBe(':')
  })
})
