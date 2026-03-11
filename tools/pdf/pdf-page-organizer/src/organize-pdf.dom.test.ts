import { beforeEach, describe, expect, it, vi } from 'vitest'
import { organizePdfWithWorker } from './organize-pdf'
import { PDF_ERROR } from './pdf-errors'
import type { OrganizePdfWorkerResponse } from './organize-pdf'

class MockWorker {
  onmessage: ((event: MessageEvent<OrganizePdfWorkerResponse>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./organize-pdf.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

describe('organize-pdf worker wrapper', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('throws when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      organizePdfWithWorker({
        file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
        pages: [{ sourcePageNumber: 1, rotation: 0 }],
        outputFileName: 'out.pdf',
      }),
    ).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
  })

  it('resolves success and error payloads from worker', async () => {
    const payload = {
      file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
      pages: [
        { sourcePageNumber: 2, rotation: 180 },
        { sourcePageNumber: 1, rotation: 90 },
      ],
      outputFileName: 'organized.pdf',
    }

    const successPromise = organizePdfWithWorker(payload)
    expect(lastWorker?.postMessage).toHaveBeenCalledWith(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        result: {
          file: {
            name: 'organized.pdf',
            blob: new Blob(['x']),
          },
        },
      },
    } as MessageEvent<OrganizePdfWorkerResponse>)

    await expect(successPromise).resolves.toEqual({
      ok: true,
      result: {
        file: {
          name: 'organized.pdf',
          blob: expect.any(Blob),
        },
      },
    })

    const errorPromise = organizePdfWithWorker(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.ExportFailed,
      },
    } as MessageEvent<OrganizePdfWorkerResponse>)

    await expect(errorPromise).resolves.toEqual({
      ok: false,
      code: PDF_ERROR.ExportFailed,
    })
  })

  it('rejects on worker runtime error', async () => {
    const promise = organizePdfWithWorker({
      file: new File(['x'], 'a.pdf', { type: 'application/pdf' }),
      pages: [{ sourcePageNumber: 1, rotation: 0 }],
      outputFileName: 'out.pdf',
    })

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.ExportFailed)
  })
})
