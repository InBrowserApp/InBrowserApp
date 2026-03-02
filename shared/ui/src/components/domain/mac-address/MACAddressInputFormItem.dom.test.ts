import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MACAddressInputFormItem from './MACAddressInputFormItem.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<label class="form-item" :data-label="label"><slot /></label>',
    }),
  }
})

describe('MACAddressInputFormItem', () => {
  it('renders label and forwards v-model updates', async () => {
    const onUpdateAddress = vi.fn()

    const wrapper = mount(MACAddressInputFormItem, {
      props: {
        address: '00:11:22:33:44:55',
        'onUpdate:address': onUpdateAddress,
      },
      global: {
        stubs: {
          MACAddressInput: {
            props: ['address'],
            emits: ['update:address'],
            template:
              '<button class="mac-input" @click="$emit(\'update:address\', \'aa:bb:cc:dd:ee:ff\')">{{ address }}</button>',
          },
        },
      },
    })

    expect(wrapper.get('.form-item').attributes('data-label')).toBe('MAC Address')
    expect(wrapper.get('.mac-input').text()).toContain('00:11:22:33:44:55')

    await wrapper.get('.mac-input').trigger('click')
    expect(onUpdateAddress).toHaveBeenCalledWith('aa:bb:cc:dd:ee:ff')
  })
})
