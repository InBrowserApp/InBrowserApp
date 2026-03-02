import { searchToolIDs, type SearchableTool } from '../composables/toolSearchCore'

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

let searchableTools: SearchableTool[] = []

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<SearchWorkerRequest>) => void) | null
  postMessage: (payload: SearchWorkerResponse) => void
}

workerScope.onmessage = (event: MessageEvent<SearchWorkerRequest>) => {
  const payload = event.data

  if (payload.type === 'init') {
    searchableTools = payload.tools
    return
  }

  const toolIDs = searchToolIDs(searchableTools, payload.query, payload.locale)

  workerScope.postMessage({
    type: 'result',
    requestId: payload.requestId,
    toolIDs,
  })
}
