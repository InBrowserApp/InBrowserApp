import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, reactive, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useHead = vi.fn()
const replace = vi.fn(({ query }: { query: { query?: string } }) => {
  route.query = { ...query }
})

const route = reactive({
  query: {} as { query?: string | string[] },
})

const mockedTools = [
  { toolID: 'one', path: '/tools/one', meta: { en: { name: 'One', description: 'first' } } },
  { toolID: 'two', path: '/tools/two', meta: { en: { name: 'Two', description: 'second' } } },
  { toolID: 'three', path: '/tools/three', meta: { en: { name: 'Three', description: 'third' } } },
]

const useSearchTools = vi.fn((searchQuery: { value: string }) => ({
  toolsResults: computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()
    if (!keyword) {
      return mockedTools
    }

    return mockedTools.filter((tool) => tool.meta.en.name.toLowerCase().includes(keyword))
  }),
}))

const NInput = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-test': 'filter-input',
        value: props.value,
        onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
      })
  },
})

const NEmpty = defineComponent({
  name: 'NEmpty',
  setup() {
    return () => h('div', { 'data-test': 'empty' })
  },
})

vi.mock('@unhead/vue', () => ({
  useHead,
}))

vi.mock('@registry/tools/search', () => ({
  useSearchTools,
}))

vi.mock('@vueuse/core', () => ({
  computedAsync: () => ref(mockedTools),
}))

vi.mock('naive-ui', () => ({
  NInput,
  NEmpty,
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => route,
    useRouter: () => ({
      replace,
    }),
  }
})

describe('ToolsView', () => {
  beforeEach(() => {
    route.query = {}
    replace.mockClear()
    useHead.mockClear()
    useSearchTools.mockClear()
  })

  it('renders the tools title, filtered count, and metadata', async () => {
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

  it('uses the first query item when route query is an array', async () => {
    route.query = {
      query: ['two', 'one'],
    }

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

    expect((wrapper.get('[data-test="filter-input"]').element as HTMLInputElement).value).toBe(
      'two',
    )
    expect(wrapper.get('[data-test="grid"]').attributes('data-count')).toBe('1')
    expect(wrapper.text()).toContain('Total tools: 1')
  })

  it('syncs the filter input into the route query', async () => {
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

    await wrapper.get('[data-test="filter-input"]').setValue('three')
    expect(replace).toHaveBeenLastCalledWith({
      query: {
        query: 'three',
      },
    })

    await wrapper.get('[data-test="filter-input"]').setValue('')
    expect(replace).toHaveBeenLastCalledWith({
      query: {},
    })
  })

  it('renders empty state when no tools match the filter', async () => {
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

    await wrapper.get('[data-test="filter-input"]').setValue('not-found')

    expect(wrapper.find('[data-test="grid"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Total tools: 0')
  })
})
