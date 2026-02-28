import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberBaseExtendedInputs from './NumberBaseExtendedInputs.vue'

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    NGrid: actual.NGrid,
    NGi: actual.NGi,
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
    expect(inputs[0]?.props('label')).toBe('Base 32')
    expect(inputs[1]?.props('label')).toBe('Base 36')
    expect(inputs[2]?.props('label')).toBe('Base 62')
    expect(inputs[3]?.props('label')).toBe('Base 64')

    await inputs[0]?.trigger('click')
    await inputs[1]?.trigger('click')
    await inputs[2]?.trigger('click')
    await inputs[3]?.trigger('click')

    expect(onInput).toHaveBeenCalledWith('base32', 'next-Base 32')
    expect(onInput).toHaveBeenCalledWith('base36', 'next-Base 36')
    expect(onInput).toHaveBeenCalledWith('base62', 'next-Base 62')
    expect(onInput).toHaveBeenCalledWith('base64', 'next-Base 64')
  })
})
