import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MarkdownPreviewerPanels from './MarkdownPreviewerPanels.vue'

type PanelsVm = {
  gridCols: string
  isSplit: boolean
}

describe('MarkdownPreviewerPanels', () => {
  it('updates markdown model and reflects view/toc state', async () => {
    const wrapper = mount(MarkdownPreviewerPanels, {
      props: {
        markdown: '# Initial',
        viewMode: 'split',
        showToc: true,
        renderedHtml: '<h1>Title</h1>',
        tocItems: [],
        scopedMarkdownCss: '.markdown-body{}',
        markdownScopeClass: 'markdown-preview',
      },
    })

    const vm = wrapper.vm as unknown as PanelsVm
    expect(vm.gridCols).toBe('1 s:2')
    expect(vm.isSplit).toBe(true)
    expect(wrapper.find('.toc-empty').exists()).toBe(true)

    await wrapper.find('textarea').setValue('# Updated')
    expect(wrapper.emitted('update:markdown')?.[0]).toEqual(['# Updated'])

    await wrapper.setProps({
      tocItems: [{ id: 'title', text: 'Title', level: 2 }],
      viewMode: 'preview',
    })
    await nextTick()

    expect((wrapper.vm as unknown as PanelsVm).gridCols).toBe('1')
    expect((wrapper.vm as unknown as PanelsVm).isSplit).toBe(false)
    expect(wrapper.find('.toc-list').exists()).toBe(true)
    expect(wrapper.find('.toc-link').attributes('href')).toBe('#title')
  })
})
