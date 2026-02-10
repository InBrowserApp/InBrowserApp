import { describe, it, expect, vi, beforeEach } from 'vitest'

const fileOpenMock = vi.fn()
const objectUrlState = { value: 'available' as 'available' | 'missing' }

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref(objectUrlState.value === 'missing' ? null : 'blob:mock')
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

import { flushPromises, mount } from '@vue/test-utils'
import { NCode } from 'naive-ui'
import HtmlToMarkdownConverter from './HtmlToMarkdownConverter.vue'

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

const getMarkdown = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('HtmlToMarkdownConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'available'
  })

  it('converts html input to markdown and updates clipboard content', async () => {
    const wrapper = mount(HtmlToMarkdownConverter, mountOptions)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('<h2>Title</h2><p>Body</p>')
    await flushPromises()

    const markdown = getMarkdown(wrapper)
    expect(markdown).toContain('Title')
    expect(markdown).toContain('Body')

    const copyButton = wrapper.findComponent({ name: 'CopyToClipboardButton' })
    expect(copyButton.props('content')).toBe(markdown)
  })

  it('imports html from a file and updates the input', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '<p>Loaded</p>',
    })

    const wrapper = mount(HtmlToMarkdownConverter, mountOptions)
    const button = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    expect(fileOpenMock).toHaveBeenCalledWith({
      extensions: ['.html', '.htm', '.txt'],
    })

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('<p>Loaded</p>')
  })

  it('exposes a download link for the converted markdown', () => {
    const wrapper = mount(HtmlToMarkdownConverter, mountOptions)
    const link = wrapper.find('a[download="converted.md"]')

    expect(link.attributes('href')).toBe('blob:mock')
  })

  it('omits the download href when object url is unavailable', () => {
    objectUrlState.value = 'missing'

    const wrapper = mount(HtmlToMarkdownConverter, mountOptions)
    const link = wrapper.find('a[download="converted.md"]')

    expect(link.attributes('href')).toBeUndefined()
  })
})
