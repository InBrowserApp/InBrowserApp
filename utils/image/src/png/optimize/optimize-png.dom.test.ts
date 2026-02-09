import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optimizePNG } from './optimize-png'

const { WorkerMock, workerInstances } = vi.hoisted(() => {
  const workerInstances: {
    onmessage: ((event: MessageEvent<Blob>) => void) | null
    onerror: ((event: ErrorEvent) => void) | null
    postMessage: ReturnType<typeof vi.fn>
  }[] = []

  class WorkerMock {
    onmessage: ((event: MessageEvent<Blob>) => void) | null = null
    onerror: ((event: ErrorEvent) => void) | null = null
    postMessage = vi.fn()

    constructor() {
      workerInstances.push(this)
    }
  }

  return {
    WorkerMock,
    workerInstances,
  }
})

vi.mock('./optimize-png.worker.raw?worker', () => ({
  default: WorkerMock,
}))

vi.mock('@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm?url', () => ({
  default: 'wasm://oxipng',
}))

describe('optimizePNG', () => {
  beforeEach(() => {
    workerInstances.length = 0
  })

  it('posts data to worker and resolves with optimized blob', async () => {
    const source = new Blob([Uint8Array.from([1, 2, 3])], { type: 'image/png' })
    const promise = optimizePNG(source, { level: 4, interlace: false, optimiseAlpha: true })

    const worker = workerInstances[0]
    expect(worker).toBeDefined()
    expect(worker?.postMessage).toHaveBeenCalledWith({
      wasmURL: 'wasm://oxipng',
      blob: source,
      options: { level: 4, interlace: false, optimiseAlpha: true },
    })

    const optimized = new Blob([Uint8Array.from([9, 9])], { type: 'image/png' })
    worker?.onmessage?.({ data: optimized } as MessageEvent<Blob>)

    await expect(promise).resolves.toBe(optimized)
  })

  it('rejects when worker emits an error', async () => {
    const promise = optimizePNG(new Blob(['png']))
    const worker = workerInstances[0]
    const error = new Error('worker failed')

    worker?.onerror?.({ error } as ErrorEvent)

    await expect(promise).rejects.toBe(error)
  })
})
