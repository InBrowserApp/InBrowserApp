import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DOHServerSelectFormItem from './DOHServerSelectFormItem.vue'

describe('DOHServerSelectFormItem', () => {
  it('renders builtin DoH server options', () => {
    const wrapper = mount(DOHServerSelectFormItem, {
      props: {
        value: '',
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
})
