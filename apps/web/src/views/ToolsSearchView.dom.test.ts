import { computed, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const route = reactive({
  query: {
    query: '' as string | string[] | undefined,
  },
})

const useHead = vi.fn()
const useSearchTools = vi.fn((searchQuery: { value: string }) => ({
  toolsResults: computed(() => [
    {
      toolID: `${searchQuery.value || 'empty'}-tool`,
      path: '/tools/result',
      meta: { en: { name: 'Result', description: 'Result description' } },
    },
  ]),
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => route,
  }
})

vi.mock('@registry/tools/search', () => ({
  useSearchTools,
}))

vi.mock('@unhead/vue', () => ({
  useHead,
}))

describe('ToolsSearchView', () => {
  beforeEach(() => {
    route.query.query = undefined
    useHead.mockClear()
  })

  it('uses the first value when query is an array', async () => {
    route.query.query = ['alpha', 'beta']

    const ToolsSearchView = (await import('./ToolsSearchView.vue')).default
    const wrapper = mount(ToolsSearchView, {
      global: {
        stubs: {
          NH1: { template: '<h1><slot /></h1>' },
          NP: { template: '<p><slot /></p>' },
          ToolsGrid: {
            props: ['tools'],
            template: '<div data-test="grid" :data-count="tools.length" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Search Tools - alpha')
    expect(wrapper.get('[data-test="grid"]').attributes('data-count')).toBe('1')
    expect(useHead).toHaveBeenCalledWith({
      title: 'alpha - InBrowser.App',
      meta: [{ name: 'description', content: 'Search results for alpha' }],
    })
  })

  it('uses direct string queries and empty fallback', async () => {
    route.query.query = 'delta'

    const ToolsSearchView = (await import('./ToolsSearchView.vue')).default
    const wrapper = mount(ToolsSearchView, {
      global: {
        stubs: {
          NH1: { template: '<h1><slot /></h1>' },
          NP: { template: '<p><slot /></p>' },
          ToolsGrid: {
            props: ['tools'],
            template: '<div data-test="grid" :data-count="tools.length" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Search Tools - delta')

    route.query.query = undefined
    const emptyWrapper = mount(ToolsSearchView, {
      global: {
        stubs: {
          NH1: { template: '<h1><slot /></h1>' },
          NP: { template: '<p><slot /></p>' },
          ToolsGrid: {
            props: ['tools'],
            template: '<div data-test="grid" :data-count="tools.length" />',
          },
        },
      },
    })

    expect(emptyWrapper.text()).toContain('Search Tools -')
  })
})
