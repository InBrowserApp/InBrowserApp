import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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
  }
})

import BaseInput from './BaseInput.vue'

describe('BaseInput', () => {
  it('renders label and syncs v-model updates', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'Binary',
        modelValue: '1010',
        status: 'error',
        placeholder: 'Enter...',
      },
    })

    expect(wrapper.text()).toContain('Binary')
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('1010')

    const input = wrapper.get('input')
    expect(input.attributes('data-status')).toBe('error')
    expect(input.attributes('placeholder')).toBe('Enter...')

    await input.setValue('1111')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1111'])
  })
})
