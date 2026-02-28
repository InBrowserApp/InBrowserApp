import { ref, h, type Ref, type VNodeChild, computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import ToolEntry from './ToolEntry.vue'
import type { ToolInfo } from '@shared/tools'
import { useToolsSearchWorker } from '../../../composables/useToolsSearchWorker'

export type SearchResult = {
  label: string
  value: string
  action: 'tool'
  info: ToolInfo
}

export const useSearchResults = (): {
  query: Ref<string>
  loading: Ref<boolean>
  searchResults: Ref<SearchResult[]>
} => {
  const query = ref('')
  const allTools = computedAsync(async () => {
    const { tools } = await import('@registry/tools')
    return tools
  }, undefined)

  const { toolsResults, searching } = useToolsSearchWorker({
    tools: allTools,
    query,
    debounceMs: 80,
  })

  const searchResults = computed(() => {
    return (toolsResults.value ?? []).map((tool) => ({
      label: tool.toolID,
      value: `tool:${tool.toolID}`,
      action: 'tool' as const,
      info: tool,
    }))
  })

  return { query, loading: searching, searchResults }
}

export const renderSearchResultLabel = (option: SearchResult): VNodeChild => {
  return h(ToolEntry, {
    info: option.info,
  })
}
