import { describe, it, expect, vi, beforeEach } from 'vitest'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref('blob:mock')
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

vi.mock('github-markdown-css/github-markdown-dark.css?raw', () => ({
  default: '.markdown-body { color: #fff; }',
}))

import { flushPromises, mount } from '@vue/test-utils'
import MarkdownPreviewer from './MarkdownPreviewer.vue'

type TocItem = {
  id: string
  text: string
  level: number
}

type PreviewerVm = {
  markdown: string
  sanitize: boolean
  showToc: boolean
  viewMode: 'split' | 'preview'
  theme: 'light' | 'dark'
  tocItems: TocItem[]
  renderedHtml: string
  scopedMarkdownCss: string
  importFromFile: () => Promise<void>
  printHtml: () => void
}

describe('MarkdownPreviewer', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('builds unique toc ids and handles empty headings', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    vm.markdown = '# <span></span>\n# Title\n# Title\n## Another!'
    await flushPromises()

    expect(vm.tocItems).toHaveLength(4)
    expect(vm.tocItems[0]?.id).toBe('section')
    expect(vm.tocItems[1]?.id).toBe('title')
    expect(vm.tocItems[2]?.id).toBe('title-1')
    expect(vm.tocItems[3]?.id).toBe('another')
  })

  it('sanitizes HTML when enabled and allows raw HTML when disabled', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    vm.markdown = '# Title\n<img src="x" onerror="alert(1)">'
    await flushPromises()

    expect(vm.renderedHtml).not.toContain('onerror')

    vm.sanitize = false
    await flushPromises()

    expect(vm.renderedHtml).toContain('onerror')
  })

  it('updates layout for preview mode and toc visibility', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    expect(wrapper.find('textarea').exists()).toBe(true)

    vm.showToc = false
    vm.viewMode = 'preview'
    await flushPromises()

    expect(wrapper.find('.toc-card').exists()).toBe(false)
    expect(wrapper.find('textarea').exists()).toBe(false)

    vm.viewMode = 'split'
    await flushPromises()

    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('scopes markdown css and switches themes', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    const lightCss = vm.scopedMarkdownCss
    expect(lightCss).toContain('.markdown-preview .markdown-body')

    vm.theme = 'dark'
    await flushPromises()

    const darkCss = vm.scopedMarkdownCss
    expect(darkCss).toContain('.markdown-preview .markdown-body')
    expect(darkCss).not.toBe(lightCss)
  })

  it('imports markdown from a file and ignores cancellations', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    fileOpenMock.mockResolvedValue({
      text: async () => '# Loaded',
    })

    await vm.importFromFile()
    await flushPromises()

    expect(fileOpenMock).toHaveBeenCalledWith({
      extensions: ['.md', '.markdown', '.txt'],
    })
    expect(vm.markdown).toBe('# Loaded')

    vm.markdown = '# Keep'
    fileOpenMock.mockRejectedValue(new Error('cancel'))

    await expect(vm.importFromFile()).resolves.toBeUndefined()
    expect(vm.markdown).toBe('# Keep')
  })

  it('uses object urls for download and prints exported HTML', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    const link = wrapper.find('a[download="markdown.html"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('blob:mock')

    const openSpy = vi.spyOn(window, 'open')
    openSpy.mockReturnValueOnce(null)

    vm.printHtml()
    expect(openSpy).toHaveBeenCalledTimes(1)

    const writeSpy = vi.fn()
    const openDocumentSpy = vi.fn()
    const closeDocumentSpy = vi.fn()
    const focusSpy = vi.fn()
    const printSpy = vi.fn()
    const closeSpy = vi.fn()
    const loadHandlers: Array<() => void> = []

    const printWindow = {
      document: {
        open: openDocumentSpy,
        write: writeSpy,
        close: closeDocumentSpy,
      },
      focus: focusSpy,
      print: printSpy,
      close: closeSpy,
      addEventListener: (event: string, handler: () => void) => {
        if (event === 'load') {
          loadHandlers.push(handler)
        }
      },
      onafterprint: null as null | (() => void),
    }

    openSpy.mockReturnValueOnce(printWindow as unknown as Window)

    vm.printHtml()

    expect(openDocumentSpy).toHaveBeenCalled()
    expect(writeSpy).toHaveBeenCalled()
    expect(closeDocumentSpy).toHaveBeenCalled()
    expect(focusSpy).toHaveBeenCalled()
    expect(writeSpy.mock.calls[0]?.[0]).toContain('<!DOCTYPE html>')
    expect(writeSpy.mock.calls[0]?.[0]).toContain('markdown-body')

    printWindow.onafterprint?.()
    expect(closeSpy).toHaveBeenCalled()

    loadHandlers.forEach((handler) => handler())
    expect(printSpy).toHaveBeenCalled()

    openSpy.mockRestore()
  })
})
