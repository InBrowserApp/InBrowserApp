import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, reactive, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

const searching = ref(false)

const useToolsSearchWorker = vi.fn(
  (params: { tools: { value: typeof mockedTools }; query: { value: string } }) => ({
    toolsResults: computed(() => {
      const sourceTools = params.tools.value
      const keyword = params.query.value.trim().toLowerCase()
      if (!sourceTools) {
        return undefined
      }
      if (!keyword) {
        return sourceTools
      }

      return sourceTools.filter((tool) => tool.meta.en.name.toLowerCase().includes(keyword))
    }),
    searching,
  }),
)

const NInput = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-test': 'filter-input',
        value: props.value,
        placeholder: props.placeholder,
        'data-loading': String(props.loading),
        onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
      })
  },
})

const NEmpty = defineComponent({
  name: 'NEmpty',
  props: {
    description: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () =>
      h('div', { 'data-test': 'empty', 'data-description': props.description }, props.description)
  },
})

vi.mock('@unhead/vue', () => ({
  useHead,
}))

vi.mock('../composables/useToolsSearchWorker', () => ({
  useToolsSearchWorker,
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
    vi.useFakeTimers()
    route.query = {}
    replace.mockClear()
    useHead.mockClear()
    useToolsSearchWorker.mockClear()
    searching.value = false
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders title, count, and search placeholder', async () => {
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
    expect(wrapper.get('[data-test="filter-input"]').attributes('placeholder')).toBe(
      'Search for tools...',
    )
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

  it('syncs the filter input into route query after debounce', async () => {
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
    expect(replace).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(401)
    expect(replace).toHaveBeenLastCalledWith({
      query: {
        query: 'three',
      },
    })

    await wrapper.get('[data-test="filter-input"]').setValue('')
    await vi.advanceTimersByTimeAsync(401)
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
    expect(wrapper.find('[data-test="empty"]').attributes('data-description')).toBe(
      'No tools found',
    )
    expect(wrapper.text()).toContain('Total tools: 0')
  })
})
