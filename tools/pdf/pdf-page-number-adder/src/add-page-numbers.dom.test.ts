import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addPageNumbersWithWorker } from './add-page-numbers'
import { PDF_ERROR } from './pdf-errors'
import type { AddPageNumbersWorkerResponse } from './types'

class MockWorker {
  onmessage: ((event: MessageEvent<AddPageNumbersWorkerResponse>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./add-page-numbers.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

describe('add-page-numbers', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('throws when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      addPageNumbersWithWorker({
        file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        startNumber: 1,
        format: 'n',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 24,
        marginY: 24,
        outputFileName: 'out.pdf',
      }),
    ).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('resolves success payload from worker', async () => {
    const payload = {
      file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1],
      startNumber: 1,
      format: 'n' as const,
      position: 'bottom-center' as const,
      fontSize: 12,
      marginX: 24,
      marginY: 24,
      outputFileName: 'out.pdf',
    }

    const promise = addPageNumbersWithWorker(payload)

    expect(lastWorker).toBeTruthy()
    expect(lastWorker?.postMessage).toHaveBeenCalledWith(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        result: {
          file: {
            name: 'out.pdf',
            blob: new Blob(['x']),
          },
        },
      },
    } as MessageEvent<AddPageNumbersWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: true,
      result: {
        file: {
          name: 'out.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })

  it('resolves error payload from worker', async () => {
    const promise = addPageNumbersWithWorker({
      file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1],
      startNumber: 1,
      format: 'n',
      position: 'bottom-center',
      fontSize: 12,
      marginX: 24,
      marginY: 24,
      outputFileName: 'out.pdf',
    })

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.AddFailed,
      },
    } as MessageEvent<AddPageNumbersWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: false,
      code: PDF_ERROR.AddFailed,
    })
  })

  it('rejects on worker runtime error', async () => {
    const promise = addPageNumbersWithWorker({
      file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
      pages: [1],
      startNumber: 1,
      format: 'n',
      position: 'bottom-center',
      fontSize: 12,
      marginX: 24,
      marginY: 24,
      outputFileName: 'out.pdf',
    })

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.AddFailed)
  })
})
