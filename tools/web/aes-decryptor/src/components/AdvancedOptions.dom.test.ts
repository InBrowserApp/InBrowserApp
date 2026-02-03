import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AdvancedOptions from './AdvancedOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    emits: ['update:value'],
    template: '<div class="n-input-number" />',
  })
  const NSelect = defineComponent({
    name: 'NSelect',
    emits: ['update:value'],
    template: '<div class="n-select" />',
  })
  return {
    NGrid: Base,
    NFormItemGi: Base,
    NCollapse: Base,
    NCollapseItem: Base,
    NInputNumber,
    NSelect,
  }
})

describe('AdvancedOptions', () => {
  it('updates iterations when value is not null', async () => {
    const updateIterations = vi.fn()
    const updateHash = vi.fn()

    const wrapper = mount(AdvancedOptions, {
      props: {
        isJweMode: false,
        keyType: 'password',
        pbkdf2Iterations: 5000,
        pbkdf2Hash: 'SHA-256',
        'onUpdate:pbkdf2Iterations': updateIterations,
        'onUpdate:pbkdf2Hash': updateHash,
      },
    })

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', null)
    await nextTick()

    expect(updateIterations).not.toHaveBeenCalled()

    input.vm.$emit('update:value', 12000)
    await nextTick()

    expect(updateIterations).toHaveBeenCalledWith(12000)
  })

  it('hides password-only fields when key type is raw', () => {
    const wrapper = mount(AdvancedOptions, {
      props: {
        isJweMode: false,
        keyType: 'raw',
        pbkdf2Iterations: 5000,
        pbkdf2Hash: 'SHA-256',
        'onUpdate:pbkdf2Iterations': () => {},
        'onUpdate:pbkdf2Hash': () => {},
      },
    })

    expect(wrapper.findComponent({ name: 'NInputNumber' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(false)
  })

  it('renders nothing when in JWE mode', () => {
    const wrapper = mount(AdvancedOptions, {
      props: {
        isJweMode: true,
        keyType: 'password',
        pbkdf2Iterations: 5000,
        pbkdf2Hash: 'SHA-256',
        'onUpdate:pbkdf2Iterations': () => {},
        'onUpdate:pbkdf2Hash': () => {},
      },
    })

    expect(wrapper.find('.tool-section').exists()).toBe(false)
  })
})
