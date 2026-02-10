import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

const useHead = vi.fn()

const mockedTools = [
  { toolID: 'one', path: '/tools/one', meta: { en: { name: 'One', description: 'first' } } },
  { toolID: 'two', path: '/tools/two', meta: { en: { name: 'Two', description: 'second' } } },
  { toolID: 'three', path: '/tools/three', meta: { en: { name: 'Three', description: 'third' } } },
]

vi.mock('@unhead/vue', () => ({
  useHead,
}))

vi.mock('@vueuse/core', () => ({
  computedAsync: () => ref(mockedTools),
}))

describe('ToolsView', () => {
  it('renders the tools title, count, and metadata', async () => {
    const ToolsView = (await import('./ToolsView.vue')).default
    const wrapper = mount(ToolsView, {
      global: {
        stubs: {
          ToolTitle: { template: '<h1><slot /></h1>' },
          ToolSection: { template: '<section><slot /></section>' },
          ToolsGrid: {
            props: ['tools'],
            template: '<div data-test="grid" :data-count="tools?.length ?? 0" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('All Tools')
    expect(wrapper.text()).toContain('Total tools: 3')
    expect(wrapper.get('[data-test="grid"]').attributes('data-count')).toBe('3')
    expect(useHead).toHaveBeenCalledWith({
      title: 'All Tools - InBrowser.App',
      meta: [
        {
          name: 'description',
          content:
            'Explore and use our collection of powerful tools that run entirely in your browser - no server required. All tools are free, secure, and work offline once loaded.',
        },
      ],
    })
  })
})
