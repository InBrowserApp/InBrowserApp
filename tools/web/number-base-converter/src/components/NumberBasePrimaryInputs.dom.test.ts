import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberBasePrimaryInputs from './NumberBasePrimaryInputs.vue'
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
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
describe('NumberBasePrimaryInputs', () => {
  it('forwards updates to the onInput callback', async () => {
    const onInput = vi.fn()
    const wrapper = mount(NumberBasePrimaryInputs, {
      props: {
        binary: '1',
        octal: '7',
        decimal: '10',
        hex: 'a',
        binaryStatus: undefined,
        octalStatus: 'error',
        decimalStatus: undefined,
        hexStatus: 'error',
        onInput,
      },
    })
    const inputs = wrapper.findAllComponents({ name: 'BaseInput' })
    expect(inputs).toHaveLength(4)
    expect(inputs[0]?.props('label')).toBe('Binary (Base 2)')
    expect(inputs[1]?.props('label')).toBe('Octal (Base 8)')
    expect(inputs[2]?.props('label')).toBe('Decimal (Base 10)')
    expect(inputs[3]?.props('label')).toBe('Hexadecimal (Base 16)')
    await inputs[0]?.trigger('click')
    await inputs[1]?.trigger('click')
    await inputs[2]?.trigger('click')
    await inputs[3]?.trigger('click')
    expect(onInput).toHaveBeenCalledWith('binary', 'next-Binary (Base 2)')
    expect(onInput).toHaveBeenCalledWith('octal', 'next-Octal (Base 8)')
    expect(onInput).toHaveBeenCalledWith('decimal', 'next-Decimal (Base 10)')
    expect(onInput).toHaveBeenCalledWith('hex', 'next-Hexadecimal (Base 16)')
  })
})
