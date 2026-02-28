import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import KeyIdentityFields from './KeyIdentityFields.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

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
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NGrid: actual.NGrid,
    NFormItemGi: actual.NFormItemGi,
    NInput,
  }
})

describe('KeyIdentityFields', () => {
  it('emits updates for name, email, and comment', async () => {
    const wrapper = mount(KeyIdentityFields, {
      props: {
        name: '',
        email: '',
        comment: '',
      },
    })

    const inputs = wrapper.findAll('input.n-input')
    await inputs[0]!.setValue('Alice')
    await inputs[1]!.setValue('alice@example.com')
    await inputs[2]!.setValue('work')

    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Alice'])
    expect(wrapper.emitted('update:email')?.[0]).toEqual(['alice@example.com'])
    expect(wrapper.emitted('update:comment')?.[0]).toEqual(['work'])
  })
})
