import { beforeEach, describe, expect, it, vi } from 'vitest'
import { splitPdfWithWorker } from './split-pdf'
import { PDF_ERROR } from './pdf-errors'

type SplitWorkerResponse =
  | {
      ok: true
      result:
        | {
            kind: 'single'
            file: {
              name: string
              blob: Blob
            }
          }
        | {
            kind: 'multiple'
            files: Array<{
              name: string
              blob: Blob
            }>
          }
    }
  | {
      ok: false
      code: string
    }

class MockWorker {
  onmessage: ((event: MessageEvent<SplitWorkerResponse>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./split-pdf.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

describe('split-pdf', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('rejects when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      splitPdfWithWorker({
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        segments: [[1]],
        outputMode: 'single',
        multipleMode: 'ranges',
        outputBaseName: 'output',
      }),
    ).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('resolves worker success payload', async () => {
    const payload = {
      file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1, 2],
      segments: [[1, 2]],
      outputMode: 'single' as const,
      multipleMode: 'ranges' as const,
      outputBaseName: 'result',
    }

    const promise = splitPdfWithWorker(payload)

    expect(lastWorker).toBeTruthy()
    expect(lastWorker?.postMessage).toHaveBeenCalledWith(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        result: {
          kind: 'single',
          file: {
            name: 'result.pdf',
            blob: new Blob(['r']),
          },
        },
      },
    } as MessageEvent<SplitWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: true,
      result: {
        kind: 'single',
        file: {
          name: 'result.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })

  it('resolves worker error payload', async () => {
    const payload = {
      file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1, 2],
      segments: [[1, 2]],
      outputMode: 'single' as const,
      multipleMode: 'ranges' as const,
      outputBaseName: 'result',
    }

    const promise = splitPdfWithWorker(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.SplitFailed,
      },
    } as MessageEvent<SplitWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: false,
      code: PDF_ERROR.SplitFailed,
    })
  })

  it('rejects on worker runtime error', async () => {
    const payload = {
      file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1],
      segments: [[1]],
      outputMode: 'single' as const,
      multipleMode: 'ranges' as const,
      outputBaseName: 'result',
    }

    const promise = splitPdfWithWorker(payload)

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.SplitFailed)
  })
})
