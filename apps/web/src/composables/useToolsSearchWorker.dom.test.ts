import { mount } from '@vue/test-utils'
import type { ToolInfo } from '@shared/tools'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type SearchWorkerRequest = {
  type: 'init' | 'search'
  requestId?: number
}

type MockSearchWorker = {
  onmessage:
    | ((event: MessageEvent<{ type: 'result'; requestId: number; toolIDs: string[] }>) => void)
    | null
  onerror: ((event: ErrorEvent) => void) | null
  messages: SearchWorkerRequest[]
  terminate: ReturnType<typeof vi.fn>
  emitResult: (requestId: number, toolIDs: string[]) => void
}

const { language, workerInstances } = vi.hoisted(() => ({
  language: { value: 'en' as string | undefined },
  workerInstances: [] as MockSearchWorker[],
}))

vi.mock('@shared/locale', () => ({
  useSiteLanguage: () => ({ language }),
}))

vi.mock('../workers/tools-search.worker.ts?worker', () => ({
  default: class MockWorker {
    onmessage:
      | ((event: MessageEvent<{ type: 'result'; requestId: number; toolIDs: string[] }>) => void)
      | null = null
    onerror: ((event: ErrorEvent) => void) | null = null
    messages: SearchWorkerRequest[] = []
    terminate = vi.fn()

    constructor() {
      workerInstances.push(this as unknown as MockSearchWorker)
    }

    postMessage(payload: SearchWorkerRequest): void {
      this.messages.push(payload)
    }

    emitResult(requestId: number, toolIDs: string[]): void {
      this.onmessage?.({
        data: {
          type: 'result',
          requestId,
          toolIDs,
        },
      } as MessageEvent<{ type: 'result'; requestId: number; toolIDs: string[] }>)
    }
  },
}))

import { useToolsSearchWorker } from './useToolsSearchWorker'

describe('useToolsSearchWorker', () => {
  let originalWorker: typeof window.Worker | undefined

  beforeEach(() => {
    vi.useRealTimers()
    originalWorker = window.Worker
    Object.defineProperty(window, 'Worker', {
      value: class Worker {},
      configurable: true,
      writable: true,
    })

    workerInstances.length = 0
    language.value = 'en'
  })

  afterEach(() => {
    if (originalWorker) {
      Object.defineProperty(window, 'Worker', {
        value: originalWorker,
        configurable: true,
        writable: true,
      })
      return
    }

    Reflect.deleteProperty(window, 'Worker')
  })

  it('ignores stale worker results after query is cleared', async () => {
    const sourceTools = [
      {
        toolID: 'one',
        path: '/tools/one',
        tags: [],
        features: [],
        meta: { en: { name: 'One', description: 'first' } },
      },
      {
        toolID: 'two',
        path: '/tools/two',
        tags: [],
        features: [],
        meta: { en: { name: 'Two', description: 'second' } },
      },
    ] as unknown as ToolInfo[]
    const tools = ref<ToolInfo[] | undefined>(sourceTools)
    const query = ref('')

    let toolsResults!: Ref<ToolInfo[] | undefined>
    let searching!: Ref<boolean>

    const Harness = defineComponent({
      setup() {
        const state = useToolsSearchWorker({
          tools,
          query,
          immediateFirstSearch: true,
        })
        toolsResults = state.toolsResults
        searching = state.searching
        return () => h('div')
      },
    })

    const wrapper = mount(Harness)
    await nextTick()

    expect(workerInstances).toHaveLength(1)
    expect(toolsResults.value).toEqual(sourceTools)

    query.value = 'two'
    await nextTick()

    expect(searching.value).toBe(true)
    const worker = workerInstances[0]!
    const searchRequest = worker.messages.find((message) => message.type === 'search')
    expect(searchRequest?.requestId).toBeTypeOf('number')

    query.value = ''
    await nextTick()

    expect(searching.value).toBe(false)
    expect(toolsResults.value).toEqual(sourceTools)

    worker.emitResult(searchRequest!.requestId!, ['two'])
    await nextTick()

    expect(toolsResults.value).toEqual(sourceTools)

    wrapper.unmount()
  })

  it('ignores previous non-empty result while next search is waiting for debounce', async () => {
    vi.useFakeTimers()

    const sourceTools = [
      {
        toolID: 'one',
        path: '/tools/one',
        tags: [],
        features: [],
        meta: { en: { name: 'One', description: 'first' } },
      },
      {
        toolID: 'two',
        path: '/tools/two',
        tags: [],
        features: [],
        meta: { en: { name: 'Two', description: 'second' } },
      },
    ] as unknown as ToolInfo[]
    const tools = ref<ToolInfo[] | undefined>(sourceTools)
    const query = ref('')

    let toolsResults!: Ref<ToolInfo[] | undefined>
    let searching!: Ref<boolean>

    const Harness = defineComponent({
      setup() {
        const state = useToolsSearchWorker({
          tools,
          query,
          debounceMs: 300,
          immediateFirstSearch: true,
        })
        toolsResults = state.toolsResults
        searching = state.searching
        return () => h('div')
      },
    })

    const wrapper = mount(Harness)
    await nextTick()

    const worker = workerInstances[0]!
    expect(toolsResults.value).toEqual(sourceTools)

    query.value = 't'
    await nextTick()

    const firstSearch = worker.messages.find((message) => message.type === 'search')
    expect(firstSearch?.requestId).toBeTypeOf('number')
    expect(searching.value).toBe(true)

    query.value = 'tw'
    await nextTick()

    const pendingSearches = worker.messages.filter((message) => message.type === 'search')
    expect(pendingSearches).toHaveLength(1)

    worker.emitResult(firstSearch!.requestId!, ['two'])
    await nextTick()

    // The stale result from the previous query must be ignored.
    expect(toolsResults.value).toEqual(sourceTools)
    expect(searching.value).toBe(true)

    await vi.advanceTimersByTimeAsync(301)

    const allSearches = worker.messages.filter((message) => message.type === 'search')
    expect(allSearches).toHaveLength(2)
    const secondSearch = allSearches[1]!
    expect(secondSearch.requestId).toBeTypeOf('number')

    worker.emitResult(secondSearch.requestId!, ['two'])
    await nextTick()

    expect(searching.value).toBe(false)
    expect(toolsResults.value?.map((tool) => tool.toolID)).toEqual(['two'])

    wrapper.unmount()
  })
})
