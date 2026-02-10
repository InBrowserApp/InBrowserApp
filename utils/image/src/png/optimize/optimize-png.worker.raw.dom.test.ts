import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { initMock, optimiseRawMock } = vi.hoisted(() => ({
  initMock: vi.fn(),
  optimiseRawMock: vi.fn(),
}))

vi.mock('@jsquash/oxipng/optimise', () => ({
  default: (...args: unknown[]) => optimiseRawMock(...args),
  init: (...args: unknown[]) => initMock(...args),
}))

beforeAll(async () => {
  Object.defineProperty(globalThis, 'onmessage', {
    configurable: true,
    writable: true,
    value: null,
  })

  await import('./optimize-png.worker.raw')
})

describe('optimize-png worker module', () => {
  beforeEach(() => {
    initMock.mockReset()
    optimiseRawMock.mockReset()
  })

  it('initializes wasm and posts optimized PNG data', async () => {
    initMock.mockResolvedValue(undefined)
    optimiseRawMock.mockResolvedValue(Uint8Array.from([7, 8, 9]).buffer)

    const postMessage = vi.fn()
    const source = new Blob([Uint8Array.from([1, 2, 3])], { type: 'image/png' })
    const onWorkerMessage = globalThis.onmessage as ((event: MessageEvent) => Promise<void>) | null

    expect(onWorkerMessage).toBeTypeOf('function')

    await onWorkerMessage?.call({ postMessage }, {
      data: {
        wasmURL: 'wasm://oxipng',
        blob: source,
        options: { level: 6 },
      },
    } as MessageEvent)

    expect(initMock).toHaveBeenCalledWith('wasm://oxipng')
    expect(optimiseRawMock).toHaveBeenCalledTimes(1)
    expect(optimiseRawMock).toHaveBeenCalledWith(expect.any(ArrayBuffer), { level: 6 })

    const optimizedBlob = postMessage.mock.calls[0]?.[0] as Blob
    expect(optimizedBlob).toBeInstanceOf(Blob)
    expect(optimizedBlob.type).toBe('image/png')
    expect(new Uint8Array(await optimizedBlob.arrayBuffer())).toEqual(Uint8Array.from([7, 8, 9]))
  })

  it('propagates optimization failures', async () => {
    const error = new Error('optimize failed')
    initMock.mockResolvedValue(undefined)
    optimiseRawMock.mockRejectedValue(error)

    const postMessage = vi.fn()
    const onWorkerMessage = globalThis.onmessage as ((event: MessageEvent) => Promise<void>) | null

    await expect(
      onWorkerMessage?.call({ postMessage }, {
        data: {
          wasmURL: 'wasm://oxipng',
          blob: new Blob([Uint8Array.from([1])], { type: 'image/png' }),
        },
      } as MessageEvent),
    ).rejects.toBe(error)

    expect(postMessage).not.toHaveBeenCalled()
  })
})
