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

import { languageConfigs } from '../languages'
import PrettierCodeFormatter from './PrettierCodeFormatter.vue'
import PrettierOptionsForm from './PrettierOptionsForm.vue'
import PrettierToolbar from './PrettierToolbar.vue'

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

type PendingFormat = {
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
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

  it('keeps current language for files without a known extension', async () => {
    fileOpenMock
      .mockResolvedValueOnce({
        name: 'README',
        text: async () => 'const missingExtension = true',
      })
      .mockResolvedValueOnce({
        name: 'notes.unknown',
        text: async () => 'const unknownExtension = true',
      })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushFormatting()
    expect(wrapper.findComponent(NSelect).props('value')).toBe('javascript')

    await importButton!.trigger('click')
    await flushFormatting()
    expect(wrapper.findComponent(NSelect).props('value')).toBe('javascript')
  })

  it('ignores cancelled file imports', async () => {
    fileOpenMock.mockRejectedValueOnce(new Error('cancelled'))

    const wrapper = mount(TestWrapper)
    await flushFormatting()

    const callCountBeforeImport = formatMock.mock.calls.length
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushFormatting()

    expect(formatMock.mock.calls.length).toBe(callCountBeforeImport)
    expect(wrapper.findComponent(NSelect).props('value')).toBe('javascript')
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

  it('uses a fallback extension when the active language has no extension', async () => {
    const originalExtensions = [...languageConfigs.javascript.extensions]
    languageConfigs.javascript.extensions.splice(0, languageConfigs.javascript.extensions.length)

    try {
      const wrapper = mount(TestWrapper)
      await flushFormatting()

      const toolbar = wrapper.findComponent(PrettierToolbar)
      expect(toolbar.props('downloadFilename')).toBe('formatted.txt')
    } finally {
      languageConfigs.javascript.extensions.splice(
        0,
        languageConfigs.javascript.extensions.length,
        ...originalExtensions,
      )
    }
  })

  it('updates formatter options from child form model events', async () => {
    const wrapper = mount(TestWrapper)

    await flushFormatting()

    const form = wrapper.findComponent(PrettierOptionsForm)
    await form.vm.$emit('update:printWidth', 120)
    await form.vm.$emit('update:tabWidth', 4)
    await form.vm.$emit('update:useTabs', true)
    await form.vm.$emit('update:semi', false)
    await form.vm.$emit('update:singleQuote', true)
    await form.vm.$emit('update:trailingComma', 'all')
    await flushFormatting()

    expect(formatMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        printWidth: 120,
        tabWidth: 4,
        useTabs: true,
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      }),
    )
  })

  it('applies fallback options when the selected language does not support them', async () => {
    const wrapper = mount(TestWrapper)

    await flushFormatting()

    const form = wrapper.findComponent(PrettierOptionsForm)
    await form.vm.$emit('update:semi', false)
    await form.vm.$emit('update:singleQuote', true)
    await form.vm.$emit('update:trailingComma', 'all')
    await form.vm.$emit('update:language', 'json')
    await flushFormatting()

    expect(formatMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        parser: 'json',
        semi: true,
        singleQuote: false,
        trailingComma: 'none',
      }),
    )
  })

  it('ignores stale async success results', async () => {
    const pending: PendingFormat[] = []
    formatMock.mockImplementation(
      () =>
        new Promise<string>((resolve, reject) => {
          pending.push({ resolve, reject })
        }),
    )

    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await flushPromises()

    await textarea.setValue('const newest = true')
    await flushFormatting()

    expect(pending).toHaveLength(2)

    pending[1]!.resolve('SECOND_RESULT')
    await flushPromises()
    expect(getFormattedCode(wrapper)).toBe('SECOND_RESULT')

    pending[0]!.resolve('FIRST_RESULT')
    await flushPromises()

    expect(getFormattedCode(wrapper)).toBe('SECOND_RESULT')
    expect(getFormatError(wrapper)).toBe('')
  })

  it('ignores stale async errors', async () => {
    const pending: PendingFormat[] = []
    formatMock.mockImplementation(
      () =>
        new Promise<string>((resolve, reject) => {
          pending.push({ resolve, reject })
        }),
    )

    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await flushPromises()

    await textarea.setValue('const latest = true')
    await flushFormatting()

    expect(pending).toHaveLength(2)

    pending[1]!.resolve('LATEST_RESULT')
    await flushPromises()
    expect(getFormattedCode(wrapper)).toBe('LATEST_RESULT')

    pending[0]!.reject(new Error('stale error'))
    await flushPromises()

    expect(getFormattedCode(wrapper)).toBe('LATEST_RESULT')
    expect(getFormatError(wrapper)).toBe('')
  })
})
