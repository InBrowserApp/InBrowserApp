import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fileOpenMock = vi.fn()
const objectUrlState = { value: 'blob:mock' as string | null }

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref(objectUrlState.value)
      watchEffect(() => {
        if (isRef(source)) {
          return void source.value
        }
        if (typeof source === 'function') {
          source()
        }
      })
      return url
    },
  }
})

vi.mock('github-markdown-css/github-markdown-light.css?raw', () => ({
  default: '.markdown-body { color: #000; }',
}))

vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string) => html.replace(/onerror="[^"]*"/g, ''),
  },
}))

import { flushPromises, mount } from '@vue/test-utils'
import { NCode, NSwitch } from 'naive-ui'
import MarkdownToHtmlConverter from './MarkdownToHtmlConverter.vue'

const CopyToClipboardButtonStub = {
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button data-test="copy" />',
}

const ToolSectionStub = {
  template: '<section><slot /></section>',
}

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: CopyToClipboardButtonStub,
      ToolSection: ToolSectionStub,
    },
  },
}

const getHtml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('MarkdownToHtmlConverter', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'blob:mock'
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('converts markdown to sanitized html by default', async () => {
    const wrapper = mount(MarkdownToHtmlConverter, mountOptions)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('# Title\n\n<img src="x" onerror="alert(1)">')
    await flushPromises()

    const html = getHtml(wrapper)
    expect(html).toContain('Title')
    expect(html).not.toContain('onerror')

    const copyButton = wrapper.findComponent({ name: 'CopyToClipboardButton' })
    expect(copyButton.props('content')).toBe(html)
  })

  it('skips sanitization when toggled off', async () => {
    const wrapper = mount(MarkdownToHtmlConverter, mountOptions)
    const toggle = wrapper.findComponent(NSwitch)

    await toggle.vm.$emit('update:value', false)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('# Title\n\n<img src="x" onerror="alert(1)">')
    await flushPromises()

    const html = getHtml(wrapper)
    expect(html).toContain('onerror')
  })

  it('omits the download href when object url is unavailable', () => {
    objectUrlState.value = null

    const wrapper = mount(MarkdownToHtmlConverter, mountOptions)
    const link = wrapper.find('a[download="markdown.html"]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('imports markdown from a file and updates the input', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '# Loaded',
    })

    const wrapper = mount(MarkdownToHtmlConverter, mountOptions)
    const button = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    expect(fileOpenMock).toHaveBeenCalledWith({
      extensions: ['.md', '.markdown', '.txt'],
    })

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('# Loaded')
  })

  it('exposes a download link and supports printing', async () => {
    const wrapper = mount(MarkdownToHtmlConverter, mountOptions)
    const link = wrapper.find('a[download="markdown.html"]')

    expect(link.attributes('href')).toBe('blob:mock')

    const openSpy = vi.spyOn(window, 'open')
    const printButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Print HTML'))

    openSpy.mockReturnValueOnce(null)
    await printButton!.trigger('click')

    const loadHandlers: Array<() => void> = []
    const closeSpy = vi.fn()
    const printSpy = vi.fn()
    const printWindow = {
      document: {
        documentElement: { innerHTML: '' },
        close: vi.fn(),
      },
      focus: vi.fn(),
      close: closeSpy,
      print: printSpy,
      addEventListener: (event: string, handler: () => void) => {
        if (event === 'load') {
          loadHandlers.push(handler)
        }
      },
      onafterprint: null as null | (() => void),
    }

    openSpy.mockReturnValueOnce(printWindow as unknown as Window)
    await printButton!.trigger('click')

    expect(printWindow.document.documentElement.innerHTML).toContain('markdown-body')

    printWindow.onafterprint?.()
    expect(closeSpy).toHaveBeenCalled()

    loadHandlers.forEach((handler) => handler())
    expect(printSpy).toHaveBeenCalled()

    openSpy.mockRestore()
  })
})
