import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import KeyExpirationFields from './KeyExpirationFields.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      options: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<select class="n-select"></select>',
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
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NGrid: actual.NGrid,
    NFormItemGi: actual.NFormItemGi,
    NSelect,
    NInput,
  }
})

describe('KeyExpirationFields', () => {
  it('emits expiration and passphrase updates', async () => {
    const wrapper = mount(KeyExpirationFields, {
      props: {
        expirationDays: 0,
        passphrase: '',
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: number }>
    expect(options.map((option) => option.value)).toEqual([0, 30, 90, 365, 730, 1825])

    select.vm.$emit('update:value', 30)
    expect(wrapper.emitted('update:expirationDays')?.[0]).toEqual([30])

    const input = wrapper.find('input.n-input')
    await input.setValue('secret')
    expect(wrapper.emitted('update:passphrase')?.[0]).toEqual(['secret'])
  })
})
