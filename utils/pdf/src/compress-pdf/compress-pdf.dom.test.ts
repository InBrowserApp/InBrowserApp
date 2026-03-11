import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildCompressPdfArgs, compressPdf } from './compress-pdf'

const { moduleFactoryMock, mkdirMock, mountMock, readFileMock, callMainMock } = vi.hoisted(() => ({
  moduleFactoryMock: vi.fn(),
  mkdirMock: vi.fn(),
  mountMock: vi.fn(),
  readFileMock: vi.fn(),
  callMainMock: vi.fn(),
}))

vi.mock('@jspawn/qpdf-wasm/qpdf.js', () => ({
  default: moduleFactoryMock,
}))

vi.mock('@jspawn/qpdf-wasm/qpdf.wasm?url', () => ({
  default: 'mock-wasm-url',
}))

describe('compressPdf utils', () => {
  beforeEach(() => {
    mkdirMock.mockReset()
    mountMock.mockReset()
    readFileMock.mockReset()
    callMainMock.mockReset()
    moduleFactoryMock.mockReset()

    readFileMock.mockReturnValue(new Uint8Array([1, 2, 3]))
    callMainMock.mockResolvedValue(0)
    moduleFactoryMock.mockResolvedValue({
      WORKERFS: Symbol('workerfs'),
      FS: {
        mkdir: mkdirMock,
        mount: mountMock,
        readFile: readFileMock,
      },
      callMain: callMainMock,
    })
  })

  it('builds custom qpdf arguments and clamps compression level', () => {
    expect(
      buildCompressPdfArgs(
        {
          compressStreams: false,
          recompressFlate: false,
          compressionLevel: 99,
          objectStreams: 'preserve',
          linearize: true,
        },
        '/input.pdf',
        '/output.pdf',
      ),
    ).toEqual([
      '--compress-streams=n',
      '--object-streams=preserve',
      '--compression-level=9',
      '--linearize',
      '/input.pdf',
      '/output.pdf',
    ])
  })

  it('mounts input file and returns compressed blob', async () => {
    const blob = new Blob(['pdf'])

    const result = await compressPdf(blob, {
      compressStreams: true,
      recompressFlate: true,
      compressionLevel: 4,
      objectStreams: 'generate',
      linearize: true,
    })

    expect(moduleFactoryMock).toHaveBeenCalledWith({
      locateFile: expect.any(Function),
    })
    expect(moduleFactoryMock.mock.calls[0]?.[0]?.locateFile()).toBe('mock-wasm-url')
    expect(mkdirMock).toHaveBeenCalledWith('/working')
    expect(mountMock).toHaveBeenCalledWith(
      expect.anything(),
      {
        blobs: [{ name: 'input.pdf', data: blob }],
      },
      '/working',
    )
    expect(callMainMock).toHaveBeenCalledWith([
      '--compress-streams=y',
      '--object-streams=generate',
      '--compression-level=4',
      '--recompress-flate',
      '--linearize',
      '/working/input.pdf',
      '/output.pdf',
    ])
    expect(readFileMock).toHaveBeenCalledWith('/output.pdf', {
      encoding: 'binary',
    })
    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('application/pdf')
    expect(new Uint8Array(await result.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]))
  })

  it('throws when qpdf exits with non-zero code', async () => {
    callMainMock.mockResolvedValueOnce(1)

    await expect(
      compressPdf(new Blob(['bad']), {
        compressStreams: true,
        recompressFlate: false,
        compressionLevel: 6,
        objectStreams: 'preserve',
        linearize: false,
      }),
    ).rejects.toThrow('Failed to compress PDF')
  })
})
