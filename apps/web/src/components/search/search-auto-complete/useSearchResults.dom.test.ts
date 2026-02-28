import { computed, ref } from 'vue'
import type { ToolInfo } from '@shared/tools'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ToolEntry from './ToolEntry.vue'

const toolsResults = ref<ToolInfo[]>([
  {
    toolID: 'tool-a',
    path: '/tools/a',
    tags: [],
    features: [],
    meta: { en: { name: 'Tool A', description: 'A' } },
  } as unknown as ToolInfo,
])
const searching = ref(false)
const warmup = vi.fn()
const useToolsSearchWorkerMock = vi.fn(() => ({
  toolsResults: computed(() => toolsResults.value),
  searching,
  warmup,
}))

vi.mock('../../../composables/useToolsSearchWorker', () => ({
  useToolsSearchWorker: useToolsSearchWorkerMock,
}))

describe('useSearchResults', () => {
  beforeEach(() => {
    useToolsSearchWorkerMock.mockClear()
    warmup.mockClear()
    toolsResults.value = [
      {
        toolID: 'tool-a',
        path: '/tools/a',
        tags: [],
        features: [],
        meta: { en: { name: 'Tool A', description: 'A' } },
      } as unknown as ToolInfo,
    ]
    searching.value = false
  })

  it('maps search tools output to autocomplete result options', async () => {
    const { useSearchResults } = await import('./useSearchResults')

    const { query, loading, searchResults, warmup: warmupFn } = useSearchResults()

    expect(query.value).toBe('')
    expect(loading.value).toBe(false)
    expect(warmupFn).toBe(warmup)
    expect(searchResults.value).toEqual([
      {
        label: 'tool-a',
        value: 'tool:tool-a',
        action: 'tool',
        info: toolsResults.value[0],
      },
    ])
    expect(useToolsSearchWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        debounceMs: 80,
        lazy: true,
        allowEmptyQuerySearch: false,
        immediateFirstSearch: true,
      }),
    )
  })

  it('renders result labels with ToolEntry', async () => {
    const { renderSearchResultLabel } = await import('./useSearchResults')

    const option = {
      label: 'tool-a',
      value: 'tool:tool-a',
      action: 'tool' as const,
      info: toolsResults.value[0] as ToolInfo,
    }

    const vnode = renderSearchResultLabel(option) as unknown as {
      type: unknown
      props: {
        info: ToolInfo
      }
    }

    expect(vnode.type).toBe(ToolEntry)
    expect(vnode.props.info).toBe(option.info)
  })
})
