import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { NInput } from 'naive-ui'
import URLInput from './URLInput.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const mountInput = (url: string) =>
  mount(URLInput, {
    props: { url },
    global: {
      plugins: [i18n],
    },
  })

describe('URLInput', () => {
  it('shows no status when empty', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountInput('')
    const input = wrapper.findComponent(NInput)

    expect(input.props().status).toBeUndefined()

    errorSpy.mockRestore()
  })

  it('shows success status for valid urls', () => {
    const wrapper = mountInput('https://example.com/path')
    const input = wrapper.findComponent(NInput)

    expect(input.props().status).toBe('success')
  })

  it('shows error status for invalid urls', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountInput('not-a-url')
    const input = wrapper.findComponent(NInput)

    expect(input.props().status).toBe('error')

    errorSpy.mockRestore()
  })

  it('emits updates for valid input', async () => {
    const wrapper = mountInput('https://example.com')
    const input = wrapper.findComponent(NInput)

    await input.vm.$emit('update:value', 'https://next.example.com')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:url')).toEqual([['https://next.example.com']])
  })

  it('logs errors and skips emit for invalid input', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mountInput('https://example.com')
    const input = wrapper.findComponent(NInput)
    const initialEmits = wrapper.emitted('update:url')?.length ?? 0

    await input.vm.$emit('update:value', 'invalid')
    await wrapper.vm.$nextTick()

    const nextEmits = wrapper.emitted('update:url')?.length ?? 0

    expect(nextEmits).toBe(initialEmits)
    expect(errorSpy.mock.calls.some((call) => call[0] === 'Invalid URL')).toBe(true)

    errorSpy.mockRestore()
  })
})
