import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DOHServerSelectFormItem from './DOHServerSelectFormItem.vue'

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
      template: '<label class="form-item"><slot /></label>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: [String, Number],
          default: '',
        },
        options: {
          type: Array,
          default: () => [],
        },
      },
      emits: ['update:value'],
      template:
        '<button class="emit-update" @click="$emit(\'update:value\', \'https://dns.google/dns-query\')" />',
    }),
  }
})

describe('DOHServerSelectFormItem', () => {
  it('renders builtin DoH server options', () => {
    const wrapper = mount(DOHServerSelectFormItem, {
      props: {
        value: '',
      },
      global: {
        stubs: {
          Icon: defineComponent({ template: '<i />' }),
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          options: Array<{ label: string; value: string }>
        }
      }
    ).setupState
    const options = setupState.options

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Cloudflare' }),
        expect.objectContaining({ label: 'Google' }),
        expect.objectContaining({ label: 'AliDNS' }),
      ]),
    )
  })

  it('forwards select updates through v-model', async () => {
    const wrapper = mount(DOHServerSelectFormItem, {
      props: {
        value: '',
      },
    })

    await wrapper.get('.emit-update').trigger('click')

    expect(wrapper.emitted('update:value')).toEqual([['https://dns.google/dns-query']])
  })
})
