import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import MACInput from './MACInput.vue'

const isValidMacAddressMock = vi.fn((value: string) => value === 'valid-mac')

vi.mock('@utils/mac-address', () => ({
  isValidMacAddress: (value: string) => isValidMacAddressMock(value),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    template: '<label class="form-item"><slot /></label>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="network-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NFormItem,
    NInput,
  }
})

vi.mock('@shared/ui/domain/mac-address', () => ({
  MACAddressInputFormItem: {
    props: ['address'],
    emits: ['update:address'],
    template:
      '<input class="mac-input" :value="address" @input="$emit(\'update:address\', $event.target.value)" />',
  },
}))

describe('MACInput', () => {
  it('emits valid MAC addresses', async () => {
    const updateMac = vi.fn()
    const updateNetwork = vi.fn()

    const wrapper = mount(MACInput, {
      props: {
        mac: '',
        networkInterface: '',
        'onUpdate:mac': updateMac,
        'onUpdate:networkInterface': updateNetwork,
      },
    })

    await wrapper.find('input.mac-input').setValue('valid-mac')
    await flushPromises()

    expect(updateMac).toHaveBeenCalledWith('valid-mac')
  })

  it('clears invalid MAC addresses', async () => {
    const updateMac = vi.fn()

    const wrapper = mount(MACInput, {
      props: {
        mac: 'valid-mac',
        networkInterface: '',
        'onUpdate:mac': updateMac,
      },
    })

    await wrapper.find('input.mac-input').setValue('invalid')
    await flushPromises()

    expect(updateMac).toHaveBeenCalledWith('')
  })

  it('emits network interface updates', async () => {
    const updateNetwork = vi.fn()

    const wrapper = mount(MACInput, {
      props: {
        mac: '',
        networkInterface: '',
        'onUpdate:networkInterface': updateNetwork,
      },
    })

    await wrapper.find('input.network-input').setValue('eth0')
    await flushPromises()

    expect(updateNetwork).toHaveBeenCalledWith('eth0')
  })
})
