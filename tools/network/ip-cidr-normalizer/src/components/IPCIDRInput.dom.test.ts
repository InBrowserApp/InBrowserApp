import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IPCIDRInput from './IPCIDRInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
  props: ['label', 'rule', 'showLabel'],
  template: '<div class="form-item"><slot /></div>',
})

const stubs = {
  NInput: NInputStub,
  NFormItem: NFormItemStub,
}

describe('IPCIDRInput', () => {
  it('emits updates for valid IP input', async () => {
    const wrapper = mount(IPCIDRInput, {
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('192.168.0.1')

    const events = wrapper.emitted('update:ipcidr')
    expect(events?.[0]).toEqual(['192.168.0.1'])
  })

  it('clears the model for invalid input', async () => {
    const wrapper = mount(IPCIDRInput, {
      props: {
        ipcidr: '10.0.0.1',
      },
      global: {
        stubs,
      },
    })

    await wrapper.find('input').setValue('999')

    const events = wrapper.emitted('update:ipcidr')
    expect(events).toBeTruthy()
    expect(events?.[events.length - 1]).toEqual([''])
  })
})
