import { beforeEach, describe, expect, it, vi } from 'vitest'
import { compressPdfWithWorker } from './compress-pdf'
import { PDF_ERROR } from './pdf-errors'
import type { PdfCompressionOptions } from '@utils/pdf'

type CompressWorkerMessage =
  | {
      ok: true
      blob: Blob
    }
  | {
      ok: false
      code: string
    }

class MockWorker {
  onmessage: ((event: MessageEvent<CompressWorkerMessage>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./compress-pdf.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

const options: PdfCompressionOptions = {
  compressStreams: true,
  recompressFlate: true,
  compressionLevel: 6,
  objectStreams: 'generate',
  linearize: false,
}

describe('compressPdfWithWorker', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('rejects when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      compressPdfWithWorker(new File(['pdf'], 'test.pdf', { type: 'application/pdf' }), options),
    ).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
  })

  it('resolves compressed blob from worker result', async () => {
    const file = new File(['pdf'], 'test.pdf', { type: 'application/pdf' })
    const compressedBlob = new Blob(['out'], { type: 'application/pdf' })

    const promise = compressPdfWithWorker(file, options)

    expect(lastWorker?.postMessage).toHaveBeenCalledWith({ file, options })

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        blob: compressedBlob,
      },
    } as MessageEvent<CompressWorkerMessage>)

    await expect(promise).resolves.toBe(compressedBlob)
    expect(lastWorker?.terminate).toHaveBeenCalledTimes(1)
  })

  it('rejects with worker payload error', async () => {
    const file = new File(['pdf'], 'test.pdf', { type: 'application/pdf' })

    const promise = compressPdfWithWorker(file, options)

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.CompressionFailed,
      },
    } as MessageEvent<CompressWorkerMessage>)

    await expect(promise).rejects.toThrow(PDF_ERROR.CompressionFailed)
  })

  it('rejects when worker throws runtime error', async () => {
    const file = new File(['pdf'], 'test.pdf', { type: 'application/pdf' })

    const promise = compressPdfWithWorker(file, options)
    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.CompressionFailed)
  })
})
