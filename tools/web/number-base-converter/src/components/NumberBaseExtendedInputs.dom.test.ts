import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberBaseExtendedInputs from './NumberBaseExtendedInputs.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
  }
})

vi.mock('./BaseInput.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'BaseInput',
      props: ['label', 'modelValue', 'status', 'placeholder'],
      emits: ['update:modelValue'],
      template: `<button class="base-input" :data-label="label" :data-value="modelValue" :data-status="status" @click="$emit('update:modelValue', 'next-' + label)" />`,
    }),
  }
})

describe('NumberBaseExtendedInputs', () => {
  it('forwards updates to the onInput callback', async () => {
    const onInput = vi.fn()
    const wrapper = mount(NumberBaseExtendedInputs, {
      props: {
        base32: 'a',
        base36: 'z',
        base62: 'Z',
        base64: 'K',
        base32Status: undefined,
        base36Status: undefined,
        base62Status: 'error',
        base64Status: 'error',
        onInput,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'BaseInput' })
    expect(inputs).toHaveLength(4)
    expect(inputs[0]?.props('label')).toBe('base32')
    expect(inputs[1]?.props('label')).toBe('base36')
    expect(inputs[2]?.props('label')).toBe('base62')
    expect(inputs[3]?.props('label')).toBe('base64')

    await inputs[0]?.trigger('click')
    await inputs[1]?.trigger('click')
    await inputs[2]?.trigger('click')
    await inputs[3]?.trigger('click')

    expect(onInput).toHaveBeenCalledWith('base32', 'next-base32')
    expect(onInput).toHaveBeenCalledWith('base36', 'next-base36')
    expect(onInput).toHaveBeenCalledWith('base62', 'next-base62')
    expect(onInput).toHaveBeenCalledWith('base64', 'next-base64')
  })
})
