import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, type Ref } from 'vue'
import PinTab from './PinTab.vue'

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
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NSlider: Base,
    NSwitch: Base,
  }
})

describe('PinTab', () => {
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

  it('avoids leading zero when disabled', () => {
    storage.set('tools:random-password-generator:pin:length', ref(4))
    storage.set('tools:random-password-generator:pin:leadingZero', ref(false))

    const wrapper = mount(PinTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toHaveLength(4)
    expect(value.startsWith('0')).toBe(false)
  })

  it('allows leading zero when enabled', () => {
    storage.set('tools:random-password-generator:pin:length', ref(2))
    storage.set('tools:random-password-generator:pin:leadingZero', ref(true))

    const wrapper = mount(PinTab, {
      props: {
        nonce: 0,
      },
    })

    const emitted = wrapper.emitted('update:value')
    const value = emitted?.[0]?.[0] as string

    expect(value).toBe('00')
  })
})
