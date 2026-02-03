import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'status', 'placeholder'],
      emits: ['update:value'],
      template:
        '<input :value="value" :data-status="status" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value', 'min', 'max'],
      emits: ['update:value'],
      template:
        '<input type="number" :value="value" :min="min" :max="max" @input="$emit(\'update:value\', Number($event.target.value))" />',
    }),
  }
})

import NumberBaseCustomInput from './NumberBaseCustomInput.vue'

describe('NumberBaseCustomInput', () => {
  it('emits custom base updates and forwards custom input', async () => {
    const onInput = vi.fn()
    const wrapper = mount(NumberBaseCustomInput, {
      props: {
        custom: 'zz',
        customStatus: 'error',
        customBaseValue: 58,
        onInput,
      },
    })

    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('zz')

    await wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 16)
    expect(wrapper.emitted('update:customBaseValue')?.[0]).toEqual([16])

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'abc')
    expect(onInput).toHaveBeenCalledWith('custom', 'abc')
  })
})
