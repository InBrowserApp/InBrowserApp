import { computed, defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const queryRef = ref('')
const loadingRef = ref(false)
const searchResultsRef = ref([
  {
    label: 'Local Tool',
    value: 'tool:local',
    action: 'tool' as const,
    info: {
      toolID: 'local',
      path: '/tools/local',
      meta: { en: { name: 'Local Tool', description: 'Local tool' } },
    },
  },
  {
    label: 'External Tool',
    value: 'tool:external',
    action: 'tool' as const,
    info: {
      toolID: 'external',
      path: 'https://example.com/tool',
      meta: { en: { name: 'External Tool', description: 'External tool' } },
    },
  },
])

const searchActionOption = computed(() => ({
  label: `Search ${queryRef.value}`,
  value: `search:${queryRef.value}`,
  action: 'search' as const,
  query: queryRef.value,
}))

const renderSearchActionLabel = vi.fn(() => h('div', 'search-label'))
const renderSearchResultLabel = vi.fn(() => h('div', 'result-label'))
const warmup = vi.fn()

const push = vi.fn()
const resolve = vi.fn(({ query }) => ({ fullPath: `/tools?query=${query.query as string}` }))

const AutoCompleteStub = defineComponent({
  name: 'NAutoComplete',
  props: {
    options: {
      type: Array,
      required: true,
    },
    renderLabel: {
      type: Function,
      required: true,
    },
  },
  emits: ['select', 'focus', 'mouseenter', 'touchstart'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h('button', { 'data-test': 'emit-focus', onClick: () => emit('focus') }),
        h('button', { 'data-test': 'emit-mouseenter', onClick: () => emit('mouseenter') }),
        h('button', { 'data-test': 'emit-touchstart', onClick: () => emit('touchstart') }),
        h('button', { 'data-test': 'select-search', onClick: () => emit('select', 'search:hash') }),
        h('button', { 'data-test': 'select-local', onClick: () => emit('select', 'tool:local') }),
        h('button', {
          'data-test': 'select-external',
          onClick: () => emit('select', 'tool:external'),
        }),
        h('button', { 'data-test': 'select-number', onClick: () => emit('select', 100) }),
        h('button', {
          'data-test': 'select-missing',
          onClick: () => emit('select', 'tool:missing'),
        }),
        h('button', {
          'data-test': 'render-search-label',
          onClick: () =>
            (props.renderLabel as (option: unknown) => unknown)({
              action: 'search',
              value: 'search:hash',
              label: 'Search hash',
              query: 'hash',
            }),
        }),
        h('button', {
          'data-test': 'render-tool-label',
          onClick: () =>
            (props.renderLabel as (option: unknown) => unknown)({
              action: 'tool',
              value: 'tool:local',
              label: 'Local Tool',
              info: searchResultsRef.value[0]?.info,
            }),
        }),
        h('span', { 'data-options-length': String(props.options.length) }),
      ])
  },
})

vi.mock('naive-ui', () => ({
  NAutoComplete: AutoCompleteStub,
  NEmpty: defineComponent({
    name: 'NEmpty',
    setup() {
      return () => h('div', { 'data-test': 'empty' })
    },
  }),
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRouter: () => ({
      push,
      resolve,
    }),
  }
})

vi.mock('./useSearchAction', () => ({
  useSearchAction: () => ({ searchActionOption }),
  renderSearchActionLabel,
}))

vi.mock('./useSearchResults', () => ({
  useSearchResults: () => ({
    query: queryRef,
    loading: loadingRef,
    searchResults: searchResultsRef,
    warmup,
  }),
  renderSearchResultLabel,
}))

describe('SearchAutoComplete', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

  beforeEach(() => {
    window.history.replaceState({}, '', '/tools')
    queryRef.value = 'hash'
    push.mockReset()
    resolve.mockClear()
    renderSearchActionLabel.mockClear()
    renderSearchResultLabel.mockClear()
    warmup.mockClear()
    openSpy.mockClear()
  })

  it('warms up search worker on focus and pointer intent', async () => {
    const SearchAutoComplete = (await import('./SearchAutoComplete.vue')).default
    const wrapper = mount(SearchAutoComplete)

    await wrapper.get('[data-test="emit-focus"]').trigger('click')
    await wrapper.get('[data-test="emit-mouseenter"]').trigger('click')
    await wrapper.get('[data-test="emit-touchstart"]').trigger('click')

    expect(warmup).toHaveBeenCalledTimes(3)
  })

  it('routes search actions with and without locale prefixes', async () => {
    const SearchAutoComplete = (await import('./SearchAutoComplete.vue')).default
    const wrapper = mount(SearchAutoComplete)

    await wrapper.get('[data-test="select-search"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/tools?query=hash')

    window.history.replaceState({}, '', '/en/tools')
    await wrapper.get('[data-test="select-search"]').trigger('click')
    expect(push).toHaveBeenLastCalledWith('/en/tools?query=hash')

    const optionsLength = Number(
      wrapper.get('[data-options-length]').attributes('data-options-length'),
    )
    expect(optionsLength).toBe(3)
  })

  it('routes or opens tool results and ignores non-string selections', async () => {
    const SearchAutoComplete = (await import('./SearchAutoComplete.vue')).default
    const wrapper = mount(SearchAutoComplete)

    window.history.replaceState({}, '', '/tools')
    await wrapper.get('[data-test="select-local"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/tools/local')

    window.history.replaceState({}, '', '/zh/tools')
    await wrapper.get('[data-test="select-local"]').trigger('click')
    expect(push).toHaveBeenLastCalledWith('/zh/tools/local')

    await wrapper.get('[data-test="select-external"]').trigger('click')
    expect(openSpy).toHaveBeenCalledWith(
      'https://example.com/tool',
      '_blank',
      'noopener,noreferrer',
    )

    await wrapper.get('[data-test="select-number"]').trigger('click')
    expect(push).toHaveBeenCalledTimes(2)
  })

  it('throws when selecting an unknown tool id', async () => {
    const SearchAutoComplete = (await import('./SearchAutoComplete.vue')).default
    const wrapper = mount(SearchAutoComplete)

    await expect(wrapper.get('[data-test="select-missing"]').trigger('click')).rejects.toThrow(
      'Tool not found',
    )
  })

  it('uses action-specific label renderers', async () => {
    const SearchAutoComplete = (await import('./SearchAutoComplete.vue')).default
    const wrapper = mount(SearchAutoComplete)

    await wrapper.get('[data-test="render-search-label"]').trigger('click')
    await wrapper.get('[data-test="render-tool-label"]').trigger('click')

    expect(renderSearchActionLabel).toHaveBeenCalledTimes(1)
    expect(renderSearchResultLabel).toHaveBeenCalledTimes(1)
  })
})
