import { describe, it, expect, vi } from 'vitest'

vi.mock('marked', async () => {
  const actual = await vi.importActual<typeof import('marked')>('marked')
  return {
    ...actual,
    marked: {
      ...actual.marked,
      parse: (
        _source: string,
        options?: { renderer?: { heading?: (token: string, level?: number) => string } },
      ) => {
        const renderer = options?.renderer
        renderer?.heading?.('', undefined)
        renderer?.heading?.('Title <em>One</em>', 2)
        return '<h1>Mock</h1>'
      },
    },
  }
})

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
  tocItems: TocItem[]
  renderedHtml: string
}

describe('MarkdownPreviewer heading renderer', () => {
  it('handles string tokens and empty headings', async () => {
    const wrapper = mount(MarkdownPreviewer)
    const vm = wrapper.vm as unknown as PreviewerVm

    await flushPromises()

    expect(vm.tocItems).toHaveLength(2)
    expect(vm.tocItems[0]).toEqual({
      id: 'section',
      level: 1,
      text: 'Untitled',
    })
    expect(vm.tocItems[1]).toEqual({
      id: 'title-one',
      level: 2,
      text: 'Title One',
    })
    expect(vm.renderedHtml).toContain('<h1>Mock</h1>')
  })
})
