import { beforeEach, describe, expect, it, vi } from 'vitest'
import { removeOwnerPassword } from './remove-owner-password-with-worker'

const { WorkerMock, workerInstances } = vi.hoisted(() => {
  const workerInstances: {
    onmessage: ((e: MessageEvent<Blob>) => void) | null
    onerror: ((e: ErrorEvent) => void) | null
    postMessage: ReturnType<typeof vi.fn>
    terminate: ReturnType<typeof vi.fn>
  }[] = []

  class WorkerMock {
    onmessage: ((e: MessageEvent<Blob>) => void) | null = null
    onerror: ((e: ErrorEvent) => void) | null = null
    postMessage = vi.fn()
    terminate = vi.fn()

    constructor() {
      workerInstances.push(this)
    }
  }

  return {
    WorkerMock,
    workerInstances,
  }
})

vi.mock('./remove-owner-password.worker.ts?worker', () => ({
  default: WorkerMock,
}))

describe('removeOwnerPassword with worker', () => {
  beforeEach(() => {
    workerInstances.length = 0
  })

  it('resolves with worker response and terminates worker', async () => {
    const originalWorker = window.Worker
    Object.defineProperty(window, 'Worker', {
      value: class WorkerSupport {},
      configurable: true,
    })

    const blob = new Blob(['encrypted'])
    const promise = removeOwnerPassword(blob)

    const worker = workerInstances[0]
    expect(worker).toBeDefined()
    expect(worker?.postMessage).toHaveBeenCalledWith(blob)

    const output = new Blob(['decrypted'])
    worker?.onmessage?.({ data: output } as MessageEvent<Blob>)

    await expect(promise).resolves.toBe(output)
    expect(worker?.terminate).toHaveBeenCalled()

    Object.defineProperty(window, 'Worker', {
      value: originalWorker,
      configurable: true,
    })
  })

  it('rejects when worker dispatches error event', async () => {
    const originalWorker = window.Worker
    Object.defineProperty(window, 'Worker', {
      value: class WorkerSupport {},
      configurable: true,
    })

    const promise = removeOwnerPassword(new Blob(['encrypted']))
    const worker = workerInstances[0]
    const error = new Error('worker-failed')

    worker?.onerror?.({ error } as ErrorEvent)

    await expect(promise).rejects.toBe(error)

    Object.defineProperty(window, 'Worker', {
      value: originalWorker,
      configurable: true,
    })
  })

  it('throws when worker is unsupported', async () => {
    const originalWorker = window.Worker
    Object.defineProperty(window, 'Worker', {
      value: undefined,
      configurable: true,
    })

    await expect(removeOwnerPassword(new Blob(['encrypted']))).rejects.toThrow(
      'Web Worker is not supported',
    )

    Object.defineProperty(window, 'Worker', {
      value: originalWorker,
      configurable: true,
    })
  })
})
