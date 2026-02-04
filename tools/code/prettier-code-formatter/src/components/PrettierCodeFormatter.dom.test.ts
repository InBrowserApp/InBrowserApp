import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSelect } from 'naive-ui'

const { formatMock } = vi.hoisted(() => ({
  formatMock: vi.fn(async (value: string, options: { parser: string }) => {
    if (value.includes('SYNTAX_ERROR')) {
      throw new Error('format error')
    }
    return `FORMATTED:${options.parser}:${value.trim()}`
  }),
}))

vi.mock('prettier/standalone', () => ({
  format: formatMock,
}))

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

import PrettierCodeFormatter from './PrettierCodeFormatter.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(PrettierCodeFormatter))
  },
}

const getFormattedCode = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string
const getFormatError = (wrapper: ReturnType<typeof mount>) =>
  (wrapper.findComponent(PrettierCodeFormatter).vm as unknown as { formatError: string })
    .formatError

const flushFormatting = async () => {
  vi.advanceTimersByTime(350)
  await flushPromises()
}

describe('PrettierCodeFormatter', () => {
  beforeEach(() => {
    formatMock.mockClear()
    fileOpenMock.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats the default sample on load', async () => {
    const wrapper = mount(TestWrapper)

    await flushFormatting()

    const formattedCode = getFormattedCode(wrapper)
    expect(formattedCode).toContain('FORMATTED:babel:')
    expect(formattedCode).toContain('const greeting')
  })

  it('shows an error when formatting fails', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('SYNTAX_ERROR')
    await flushFormatting()

    expect(getFormattedCode(wrapper)).toBe('')
    expect(formatMock).toHaveBeenLastCalledWith(
      expect.stringContaining('SYNTAX_ERROR'),
      expect.objectContaining({ parser: 'babel' }),
    )
  })

  it('detects language when importing a file', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'demo.ts',
      text: async () => 'const value: number = 1',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushFormatting()

    const select = wrapper.findComponent(NSelect)
    expect(select.props('value')).toBe('typescript')

    const formattedCode = getFormattedCode(wrapper)
    expect(formattedCode).toContain('FORMATTED:typescript:')
  })

  it('clears output and errors when input is empty', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('   ')
    await flushFormatting()

    expect(getFormattedCode(wrapper)).toBe('')
    expect(getFormatError(wrapper)).toBe('')
  })

  it('uses a fallback message for non-error throws', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await flushFormatting()

    formatMock.mockImplementationOnce(async () => {
      throw 'boom'
    })

    await textarea.setValue('boom')
    await flushFormatting()

    expect(getFormattedCode(wrapper)).toBe('')
    expect(getFormatError(wrapper)).not.toBe('')
    expect(getFormatError(wrapper)).not.toBe('boom')
  })

  it('replaces the source when language changes from a blank state', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue(' ')
    await flushFormatting()

    const select = wrapper.findComponent(NSelect)
    await select.vm.$emit('update:value', 'typescript')
    await flushFormatting()

    expect((textarea.element as HTMLTextAreaElement).value).toContain('type User')
  })
})
