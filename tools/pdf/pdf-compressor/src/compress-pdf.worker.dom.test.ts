import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const { compressPdfMock } = vi.hoisted(() => ({
  compressPdfMock: vi.fn(),
}))

vi.mock('@utils/pdf', () => ({
  compressPdf: (...args: unknown[]) => compressPdfMock(...args),
}))

const postMessageMock = vi.fn()

describe('compress-pdf worker', () => {
  beforeEach(() => {
    vi.resetModules()
    compressPdfMock.mockReset()
    postMessageMock.mockReset()
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('posts success payload when compression succeeds', async () => {
    const blob = new Blob(['out'], { type: 'application/pdf' })
    compressPdfMock.mockResolvedValue(blob)

    await import('./compress-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['pdf'], 'test.pdf', { type: 'application/pdf' }),
        options: {
          compressStreams: true,
          recompressFlate: true,
          compressionLevel: 6,
          objectStreams: 'generate',
          linearize: false,
        },
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      blob,
    })
  })

  it('posts generic compression error when compression fails', async () => {
    compressPdfMock.mockRejectedValueOnce(new Error('boom'))

    await import('./compress-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['pdf'], 'test.pdf', { type: 'application/pdf' }),
        options: {
          compressStreams: true,
          recompressFlate: true,
          compressionLevel: 6,
          objectStreams: 'generate',
          linearize: false,
        },
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.CompressionFailed,
    })
  })
})
