import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NInput, NSelect } from 'naive-ui'
import JWTOptionsInput from './JWTOptionsInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('JWTOptionsInput', () => {
  it('emits updates for secret and algorithm', async () => {
    const wrapper = mount(JWTOptionsInput, {
      props: {
        secret: 'initial-secret',
        alg: 'HS256',
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', 'next-secret')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:secret')).toEqual([['next-secret']])

    const select = wrapper.findComponent(NSelect)
    select.vm.$emit('update:value', 'HS512')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:alg')).toEqual([['HS512']])

    const options = select.props().options as Array<{ value: string }>
    expect(options.some((option) => option.value === 'EdDSA')).toBe(true)
  })
})
