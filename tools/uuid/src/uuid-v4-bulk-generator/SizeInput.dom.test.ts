import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SizeInput from './SizeInput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
      showFeedback: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div class="n-form-item"><slot /></div>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-input-number" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  return {
    NFormItem,
    NInputNumber,
  }
})

describe('SizeInput', () => {
  it('renders label and emits updates', async () => {
    const wrapper = mount(SizeInput, {
      props: {
        size: 5,
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    expect(formItem.props('label')).toBe('Size')

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', 10)

    expect(wrapper.emitted('update:size')?.[0]).toEqual([10])
  })
})
