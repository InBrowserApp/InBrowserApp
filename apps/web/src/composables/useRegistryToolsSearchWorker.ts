import { useSiteLanguage } from '@shared/locale'
import type { ToolInfo } from '@shared/tools'
import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { createDebouncedFn } from './createDebouncedFn'
import { searchToolIDs, type SearchableTool } from './toolSearchCore'
import RegistryToolsSearchWorker from '../workers/registry-tools-search.worker.ts?worker'

type SearchResultTool = Pick<
  ToolInfo,
  'toolID' | 'meta' | 'tags' | 'features' | 'path' | 'external' | 'thirdParty' | 'collection'
>

type SearchMessage = {
  type: 'search'
  query: string
  locale: string
  requestId: number
}

type SearchWorkerResponse = {
  type: 'result'
  requestId: number
  tools: SearchResultTool[]
}

type UseRegistryToolsSearchWorkerOptions = {
  query: Ref<string>
  debounceMs?: number
}

type UseRegistryToolsSearchWorkerResult = {
  toolsResults: Ref<ToolInfo[]>
  searching: Ref<boolean>
}

const toSearchableTools = (tools: SearchResultTool[]): SearchableTool[] =>
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

const getToolMap = (tools: SearchResultTool[]): Map<string, SearchResultTool> =>
  new Map(tools.map((tool) => [tool.toolID, tool]))

export const useRegistryToolsSearchWorker = (
  options: UseRegistryToolsSearchWorkerOptions,
): UseRegistryToolsSearchWorkerResult => {
  const { query, debounceMs = 80 } = options
  const { language } = useSiteLanguage()

  const supportsWorker = typeof window !== 'undefined' && typeof window.Worker !== 'undefined'
  const toolsResults = ref<ToolInfo[]>([])
  const searching = ref(false)

  let worker: Worker | null = supportsWorker ? new RegistryToolsSearchWorker() : null
  let requestID = 0
  let activeRequestID = 0

  let inlineSearchableTools: SearchableTool[] = []
  let inlineToolMap = new Map<string, SearchResultTool>()
  let inlineLoadedPromise: Promise<void> | null = null

  const getLocale = (): string => language.value ?? navigator.language

  const ensureInlineToolsLoaded = (): Promise<void> => {
    if (inlineLoadedPromise) {
      return inlineLoadedPromise
    }

    inlineLoadedPromise = (async () => {
      const { tools } = await import('@registry/tools')
      const searchTools = tools.map((tool) => ({
        toolID: tool.toolID,
        meta: tool.meta,
        tags: tool.tags,
        features: tool.features,
        path: tool.path,
        external: tool.external,
        thirdParty: tool.thirdParty,
        collection: tool.collection,
      }))

      inlineSearchableTools = toSearchableTools(searchTools)
      inlineToolMap = getToolMap(searchTools)
    })()

    return inlineLoadedPromise
  }

  const runInlineSearch = async (
    queryValue: string,
    localeValue: string,
    requestId: number,
  ): Promise<void> => {
    try {
      await ensureInlineToolsLoaded()
    } catch {
      if (requestId !== activeRequestID) {
        return
      }

      toolsResults.value = []
      searching.value = false
      return
    }

    if (requestId !== activeRequestID) {
      return
    }

    const toolIDs = searchToolIDs(inlineSearchableTools, queryValue, localeValue)
    toolsResults.value = toolIDs
      .map((toolID) => inlineToolMap.get(toolID))
      .filter((tool): tool is SearchResultTool => !!tool)
    searching.value = false
  }

  if (worker) {
    worker.onmessage = (event: MessageEvent<SearchWorkerResponse>) => {
      if (event.data.type !== 'result' || event.data.requestId !== activeRequestID) {
        return
      }

      toolsResults.value = event.data.tools
      searching.value = false
    }

    worker.onerror = () => {
      worker?.terminate()
      worker = null
      void runInlineSearch(query.value, getLocale(), activeRequestID)
    }
  }

  const runSearch = (queryValue: string, localeValue: string, requestId: number): void => {
    if (!worker) {
      void runInlineSearch(queryValue, localeValue, requestId)
      return
    }

    const payload: SearchMessage = {
      type: 'search',
      query: queryValue,
      locale: localeValue,
      requestId,
    }
    worker.postMessage(payload)
  }

  const debouncedSearch = createDebouncedFn(runSearch, debounceMs)

  const queueSearch = (): void => {
    const nextRequestID = ++requestID
    activeRequestID = nextRequestID
    searching.value = true
    debouncedSearch(query.value, getLocale(), nextRequestID)
  }

  watch(
    [query, () => language.value],
    () => {
      queueSearch()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    debouncedSearch.cancel()
    worker?.terminate()
  })

  return {
    toolsResults,
    searching,
  }
}
