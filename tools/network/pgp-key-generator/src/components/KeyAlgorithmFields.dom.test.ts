import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import KeyAlgorithmFields from './KeyAlgorithmFields.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div class="radio-group"><slot /></div>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<select class="n-select"></select>',
  })

  return {
    NGrid: actual.NGrid,
    NFormItemGi: actual.NFormItemGi,
    NRadioGroup,
    NRadio: Base,
    NSpace: Base,
    NSelect,
    NTag: Base,
  }
})

describe('KeyAlgorithmFields', () => {
  it('emits algorithm and key size updates', async () => {
    const wrapper = mount(KeyAlgorithmFields, {
      props: {
        algorithm: 'ecc',
        rsaKeySize: 4096,
      },
    })

    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'rsa')
    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['rsa'])

    await wrapper.setProps({ algorithm: 'rsa' })
    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 2048)
    expect(wrapper.emitted('update:rsaKeySize')?.[0]).toEqual([2048])
  })

  it('shows RSA key size options when RSA is selected', async () => {
    const wrapper = mount(KeyAlgorithmFields, {
      props: {
        algorithm: 'rsa',
        rsaKeySize: 4096,
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: number }>

    expect(options.map((option) => option.value)).toEqual([2048, 3072, 4096])
    expect(options[2]?.label).toContain('Recommended')
  })
})
