import { beforeEach, describe, expect, it, vi } from 'vitest'
import { removeOwnerPassword } from './remove-owner-password'

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

describe('removeOwnerPassword', () => {
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

  it('mounts input file and returns decrypted blob', async () => {
    const blob = new Blob(['encrypted'])

    const result = await removeOwnerPassword(blob)

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
    expect(callMainMock).toHaveBeenCalledWith(['--decrypt', '/working/input.pdf', '/output.pdf'])
    expect(readFileMock).toHaveBeenCalledWith('/output.pdf', {
      encoding: 'binary',
    })
    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('application/pdf')
    expect(new Uint8Array(await result.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]))
  })

  it('throws when qpdf exits with non-zero code', async () => {
    callMainMock.mockResolvedValueOnce(1)

    await expect(removeOwnerPassword(new Blob(['bad']))).rejects.toThrow(
      'Failed to remove owner password',
    )
  })
})
