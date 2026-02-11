import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mergePdfsWithWorker } from './merge-pdfs'
import { PDF_ERROR } from './pdf-errors'

type MergeWorkerMessage =
  | {
      ok: true
      blob: Blob
    }
  | {
      ok: false
      code: string
    }

class MockWorker {
  onmessage: ((event: MessageEvent<MergeWorkerMessage>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./merge-pdfs.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

describe('merge-pdfs', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('rejects when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(mergePdfsWithWorker([])).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('resolves merged blob from worker result', async () => {
    const file = new File(['a'], 'a.pdf', { type: 'application/pdf' })
    const mergedBlob = new Blob(['merged'], { type: 'application/pdf' })

    const promise = mergePdfsWithWorker([file])

    expect(lastWorker).toBeTruthy()
    expect(lastWorker?.postMessage).toHaveBeenCalledWith({ files: [file] })

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        blob: mergedBlob,
      },
    } as MessageEvent<MergeWorkerMessage>)

    await expect(promise).resolves.toBe(mergedBlob)
    expect(lastWorker?.terminate).toHaveBeenCalledTimes(1)
  })

  it('rejects with worker error payload', async () => {
    const file = new File(['a'], 'a.pdf', { type: 'application/pdf' })

    const promise = mergePdfsWithWorker([file])

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.MergeFailed,
      },
    } as MessageEvent<MergeWorkerMessage>)

    await expect(promise).rejects.toThrow(PDF_ERROR.MergeFailed)
    expect(lastWorker?.terminate).toHaveBeenCalledTimes(1)
  })

  it('rejects when worker throws runtime error', async () => {
    const file = new File(['a'], 'a.pdf', { type: 'application/pdf' })

    const promise = mergePdfsWithWorker([file])

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.MergeFailed)
    expect(lastWorker?.terminate).toHaveBeenCalledTimes(1)
  })
})
