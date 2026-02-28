import { useSiteLanguage } from '@shared/locale'
import type { ToolInfo } from '@shared/tools'
import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { searchToolIDs, type SearchableTool } from './toolSearchCore'
import ToolsSearchWorker from '../workers/tools-search.worker.ts?worker'
import { createDebouncedFn } from './createDebouncedFn'

type InitMessage = {
  type: 'init'
  tools: SearchableTool[]
}

type SearchMessage = {
  type: 'search'
  query: string
  locale: string
  requestId: number
}

type SearchWorkerRequest = InitMessage | SearchMessage

type SearchWorkerResponse = {
  type: 'result'
  requestId: number
  toolIDs: string[]
}

const toSearchableTools = (tools: ToolInfo[]): SearchableTool[] =>
  tools.map((tool) => ({
    toolID: tool.toolID,
    tags: tool.tags,
    meta: Object.fromEntries(
      Object.entries(tool.meta).map(([lang, localizedMeta]) => [
        lang,
        {
          name: localizedMeta.name,
          description: localizedMeta.description,
        },
      ]),
    ),
  }))

const mapToolIDs = (tools: ToolInfo[], toolIDs: string[]): ToolInfo[] => {
  const toolMap = new Map(tools.map((tool) => [tool.toolID, tool]))
  return toolIDs.map((toolID) => toolMap.get(toolID)).filter((tool): tool is ToolInfo => !!tool)
}

type UseToolsSearchWorkerOptions = {
  tools: Ref<ToolInfo[] | undefined>
  query: Ref<string>
  debounceMs?: number
}

type UseToolsSearchWorkerResult = {
  toolsResults: Ref<ToolInfo[] | undefined>
  searching: Ref<boolean>
}

export const useToolsSearchWorker = (
  options: UseToolsSearchWorkerOptions,
): UseToolsSearchWorkerResult => {
  const { tools, query, debounceMs = 160 } = options
  const { language } = useSiteLanguage()
  const searchableTools = computed(() => toSearchableTools(tools.value ?? []))
  const toolsResults = ref<ToolInfo[] | undefined>(undefined)
  const searching = ref(false)

  let requestID = 0
  let activeRequestID = 0

  const supportsWorker = typeof window !== 'undefined' && typeof window.Worker !== 'undefined'
  let worker: Worker | null = supportsWorker ? new ToolsSearchWorker() : null

  const getLocale = (): string => language.value ?? navigator.language

  const applyInlineSearch = (queryValue: string, localeValue: string): void => {
    const sourceTools = tools.value
    if (!sourceTools) {
      toolsResults.value = undefined
      searching.value = false
      return
    }

    const toolIDs = searchToolIDs(searchableTools.value, queryValue, localeValue)
    toolsResults.value = mapToolIDs(sourceTools, toolIDs)
    searching.value = false
  }

  if (worker) {
    worker.onmessage = (event: MessageEvent<SearchWorkerResponse>) => {
      if (event.data.type !== 'result' || event.data.requestId !== activeRequestID) {
        return
      }

      const sourceTools = tools.value ?? []
      toolsResults.value = mapToolIDs(sourceTools, event.data.toolIDs)
      searching.value = false
    }

    worker.onerror = () => {
      worker?.terminate()
      worker = null
      applyInlineSearch(query.value, getLocale())
    }
  }

  const runSearch = (queryValue: string, localeValue: string): void => {
    const sourceTools = tools.value
    if (!sourceTools) {
      toolsResults.value = undefined
      searching.value = false
      return
    }

    if (!worker) {
      applyInlineSearch(queryValue, localeValue)
      return
    }

    const nextRequestID = ++requestID
    activeRequestID = nextRequestID

    const payload: SearchWorkerRequest = {
      type: 'search',
      requestId: nextRequestID,
      query: queryValue,
      locale: localeValue,
    }
    worker.postMessage(payload)
  }

  const debouncedSearch = createDebouncedFn(runSearch, debounceMs)

  const queueSearch = (): void => {
    if (!tools.value) {
      debouncedSearch.cancel()
      toolsResults.value = undefined
      searching.value = false
      return
    }

    searching.value = true
    debouncedSearch(query.value, getLocale())
  }

  watch(
    searchableTools,
    (nextTools) => {
      if (worker) {
        const payload: SearchWorkerRequest = {
          type: 'init',
          tools: nextTools,
        }
        worker.postMessage(payload)
      }

      queueSearch()
    },
    { immediate: true },
  )

  watch([query, () => language.value], () => {
    queueSearch()
  })

  onBeforeUnmount(() => {
    debouncedSearch.cancel()
    worker?.terminate()
  })

  return {
    toolsResults,
    searching,
  }
}
