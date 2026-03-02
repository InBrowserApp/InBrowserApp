import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IPv6Input from './IPv6Input.vue'

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template:
    '<input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
})

const NFormItemStub = defineComponent({
  name: 'NFormItem',
  props: ['label', 'rule'],
  template: '<div class="form-item"><slot /></div>',
})

const stubs = {
  NInput: NInputStub,
  NFormItem: NFormItemStub,
}

describe('IPv6Input', () => {
  it('emits updates for valid IPv6 input', async () => {
    const wrapper = mount(IPv6Input, {
      props: {
        ipv6: '',
      },
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('fe80::1')

    const events = wrapper.emitted('update:ipv6')
    expect(events?.[0]).toEqual(['fe80::1'])
  })

  it('clears the model for invalid input', async () => {
    const wrapper = mount(IPv6Input, {
      props: {
        ipv6: 'fe80::1',
      },
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('invalid')

    const events = wrapper.emitted('update:ipv6')
    expect(events).toBeTruthy()
    expect(events?.[events.length - 1]).toEqual([''])
  })
})
