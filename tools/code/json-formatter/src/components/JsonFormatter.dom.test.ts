import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NInputNumber, NMessageProvider } from 'naive-ui'
import JsonFormatter from './JsonFormatter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonFormatter))
  },
}

const getFormattedCode = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonFormatter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('formats the default JSON using the default indentation', () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')
    const rawValue = (textarea.element as HTMLTextAreaElement).value
    const expected = JSON.stringify(JSON.parse(rawValue), null, 2)

    expect(getFormattedCode(wrapper)).toBe(expected)
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSON')
    expect(getFormattedCode(wrapper)).toMatch(/^# Invalid JSON:/)
  })

  it('updates formatting when indentation changes', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')
    const inputNumber = wrapper.findComponent(NInputNumber)

    await inputNumber.vm.$emit('update:value', 4)
    await flushPromises()

    const rawValue = (textarea.element as HTMLTextAreaElement).value
    const expected = JSON.stringify(JSON.parse(rawValue), null, 4)

    expect(getFormattedCode(wrapper)).toBe(expected)
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":"demo"}',
    })

    const wrapper = mount(TestWrapper)
    const button = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"name":"demo"}')
  })
})
