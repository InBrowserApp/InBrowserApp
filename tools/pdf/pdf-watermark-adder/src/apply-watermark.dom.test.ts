import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyWatermarkWithWorker } from './apply-watermark'
import { PDF_ERROR } from './pdf-errors'
import type { ApplyWatermarkWorkerResponse } from './types'

class MockWorker {
  onmessage: ((event: MessageEvent<ApplyWatermarkWorkerResponse>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./apply-watermark.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

describe('apply-watermark', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('throws when worker is unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      applyWatermarkWithWorker({
        file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
        pages: [1],
        mode: 'text',
        text: 'CONFIDENTIAL',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 18,
        rotation: -35,
        position: 'center',
        layoutMode: 'single',
        offsetX: 0,
        offsetY: 0,
        tileGapX: 70,
        tileGapY: 60,
        imageFile: null,
        imageScale: 28,
        outputFileName: 'sample-watermarked.pdf',
      }),
    ).rejects.toThrow(PDF_ERROR.WorkerUnsupported)
  })

  it('resolves worker success payloads', async () => {
    const payload = {
      file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
      pages: [1, 2],
      mode: 'image' as const,
      text: '',
      fontFamily: 'sans-serif' as const,
      fontSize: 48,
      color: '#000000',
      opacity: 18,
      rotation: -35,
      position: 'center' as const,
      layoutMode: 'single' as const,
      offsetX: 0,
      offsetY: 0,
      tileGapX: 70,
      tileGapY: 60,
      imageFile: new File(['png'], 'logo.png', { type: 'image/png' }),
      imageScale: 28,
      outputFileName: 'sample-watermarked.pdf',
    }

    const promise = applyWatermarkWithWorker(payload)

    expect(lastWorker?.postMessage).toHaveBeenCalledWith(payload)

    lastWorker?.onmessage?.({
      data: {
        ok: true,
        result: {
          file: {
            name: 'sample-watermarked.pdf',
            blob: new Blob(['ok']),
          },
        },
      },
    } as MessageEvent<ApplyWatermarkWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: true,
      result: {
        file: {
          name: 'sample-watermarked.pdf',
          blob: expect.any(Blob),
        },
      },
    })
    expect(lastWorker?.terminate).toHaveBeenCalledOnce()
  })

  it('resolves worker error payloads', async () => {
    const promise = applyWatermarkWithWorker({
      file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
      pages: [1],
      mode: 'text',
      text: 'DRAFT',
      fontFamily: 'serif',
      fontSize: 36,
      color: '#336699',
      opacity: 30,
      rotation: 15,
      position: 'bottom-right',
      layoutMode: 'single',
      offsetX: 8,
      offsetY: 10,
      tileGapX: 70,
      tileGapY: 60,
      imageFile: null,
      imageScale: 28,
      outputFileName: 'sample-watermarked.pdf',
    })

    lastWorker?.onmessage?.({
      data: {
        ok: false,
        code: PDF_ERROR.ApplyFailed,
      },
    } as MessageEvent<ApplyWatermarkWorkerResponse>)

    await expect(promise).resolves.toEqual({
      ok: false,
      code: PDF_ERROR.ApplyFailed,
    })
    expect(lastWorker?.terminate).toHaveBeenCalledOnce()
  })

  it('rejects on worker runtime errors', async () => {
    const promise = applyWatermarkWithWorker({
      file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
      pages: [1],
      mode: 'text',
      text: 'INTERNAL',
      fontFamily: 'sans-serif',
      fontSize: 48,
      color: '#000000',
      opacity: 18,
      rotation: -35,
      position: 'center',
      layoutMode: 'single',
      offsetX: 0,
      offsetY: 0,
      tileGapX: 70,
      tileGapY: 60,
      imageFile: null,
      imageScale: 28,
      outputFileName: 'sample-watermarked.pdf',
    })

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)

    await expect(promise).rejects.toThrow(PDF_ERROR.ApplyFailed)
    expect(lastWorker?.terminate).toHaveBeenCalledOnce()
  })
})
