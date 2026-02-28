import type { ToolInfo } from '@shared/tools'
import { searchToolIDs, type SearchableTool } from '../composables/toolSearchCore'

type SearchMessage = {
  type: 'search'
  query: string
  locale: string
  requestId: number
}

type SearchWorkerRequest = SearchMessage

type SearchResultTool = Pick<
  ToolInfo,
  'toolID' | 'meta' | 'tags' | 'features' | 'path' | 'external' | 'thirdParty' | 'collection'
>

type SearchWorkerResponse = {
  type: 'result'
  requestId: number
  tools: SearchResultTool[]
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

const toSearchResultTool = (tool: ToolInfo): SearchResultTool => ({
  toolID: tool.toolID,
  meta: tool.meta,
  tags: tool.tags,
  features: tool.features,
  path: tool.path,
  external: tool.external,
  thirdParty: tool.thirdParty,
  collection: tool.collection,
})

let searchableTools: SearchableTool[] = []
let toolsByID = new Map<string, SearchResultTool>()
let loadedPromise: Promise<void> | null = null

const ensureToolsLoaded = (): Promise<void> => {
  if (loadedPromise) {
    return loadedPromise
  }

  loadedPromise = (async () => {
    const { tools } = await import('@registry/tools')
    searchableTools = toSearchableTools(tools)
    toolsByID = new Map(tools.map((tool) => [tool.toolID, toSearchResultTool(tool)]))
  })()

  return loadedPromise
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<SearchWorkerRequest>) => void) | null
  postMessage: (payload: SearchWorkerResponse) => void
}

workerScope.onmessage = async (event: MessageEvent<SearchWorkerRequest>) => {
  const payload = event.data

  try {
    await ensureToolsLoaded()
    const toolIDs = searchToolIDs(searchableTools, payload.query, payload.locale)
    const tools = toolIDs
      .map((toolID) => toolsByID.get(toolID))
      .filter((tool): tool is SearchResultTool => !!tool)

    workerScope.postMessage({
      type: 'result',
      requestId: payload.requestId,
      tools,
    })
  } catch {
    workerScope.postMessage({
      type: 'result',
      requestId: payload.requestId,
      tools: [],
    })
  }
}
