import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import JSONInput from './JSONInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('JSONInput', () => {
  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(JSONInput, {
      props: {
        value: '{"a":1}',
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '{')
    await wrapper.vm.$nextTick()

    const formItem = wrapper.findComponent(NFormItem)
    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('invalid-json')
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  it('emits updates when JSON is valid', async () => {
    const wrapper = mount(JSONInput, {
      props: {
        value: '{"a":1}',
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '{"b":2}')
    await wrapper.vm.$nextTick()

    const formItem = wrapper.findComponent(NFormItem)
    expect(formItem.props().validationStatus).toBeUndefined()
    expect(wrapper.emitted('update:value')).toEqual([['{"b":2}']])
  })
})
