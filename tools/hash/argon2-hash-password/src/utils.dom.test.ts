import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  bytesToBase64,
  decodeBase64,
  generateArgon2Hash,
  generateRandomSaltBytes,
  isValidBase64,
  normalizeBase64Input,
} from './utils'

const { argon2idMock, argon2iMock, argon2dMock } = vi.hoisted(() => ({
  argon2idMock: vi.fn(async () => '$argon2id$mock'),
  argon2iMock: vi.fn(async () => '$argon2i$mock'),
  argon2dMock: vi.fn(async () => '$argon2d$mock'),
}))

vi.mock('hash-wasm', () => ({
  argon2id: argon2idMock,
  argon2i: argon2iMock,
  argon2d: argon2dMock,
}))

describe('argon2 utils', () => {
  beforeEach(() => {
    argon2idMock.mockClear()
    argon2iMock.mockClear()
    argon2dMock.mockClear()
  })

  it('normalizes base64 input', () => {
    expect(normalizeBase64Input(' AQID\nBA== ')).toBe('AQIDBA==')
    expect(normalizeBase64Input('AQID-_')).toBe('AQID+/')
  })

  it('decodes base64 values', () => {
    expect(decodeBase64('AQID')).toEqual(new Uint8Array([1, 2, 3]))
  })

  it('returns empty bytes for blank base64 input', () => {
    expect(decodeBase64('')).toEqual(new Uint8Array())
    expect(decodeBase64(' \n\t ')).toEqual(new Uint8Array())
  })

  it('throws on invalid base64 values', () => {
    expect(() => decodeBase64('abcde')).toThrow('Invalid base64 length')
    expect(() => decodeBase64('***')).toThrow('Invalid base64')
  })

  it('throws invalid base64 when decoder fails', () => {
    const atobSpy = vi.spyOn(globalThis, 'atob').mockImplementation(() => {
      throw new Error('bad input')
    })

    expect(() => decodeBase64('AQID')).toThrow('Invalid base64')

    atobSpy.mockRestore()
  })

  it('validates base64 values', () => {
    expect(isValidBase64('AQID')).toBe(true)
    expect(isValidBase64('***')).toBe(false)
  })

  it('converts bytes to base64', () => {
    expect(bytesToBase64(new Uint8Array())).toBe('')
    expect(bytesToBase64(new Uint8Array([1, 2, 3]))).toBe('AQID')
  })

  it('creates random salt bytes', () => {
    const bytes = generateRandomSaltBytes(16)
    expect(bytes).toHaveLength(16)

    const minLengthBytes = generateRandomSaltBytes(0)
    expect(minLengthBytes).toHaveLength(1)
  })

  it('uses argon2id by default', async () => {
    const hash = await generateArgon2Hash({
      algorithm: 'argon2id',
      password: 'secret',
      salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
      iterations: 3,
      parallelism: 1,
      memorySize: 64,
      hashLength: 32,
    })

    expect(hash).toBe('$argon2id$mock')
    expect(argon2idMock).toHaveBeenCalledOnce()
    expect(argon2idMock).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'secret',
        iterations: 3,
        parallelism: 1,
        memorySize: 64,
        hashLength: 32,
        outputType: 'encoded',
      }),
    )
  })

  it('uses argon2i and argon2d when selected', async () => {
    await generateArgon2Hash({
      algorithm: 'argon2i',
      password: 'secret',
      salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
      iterations: 3,
      parallelism: 1,
      memorySize: 64,
      hashLength: 32,
    })

    await generateArgon2Hash({
      algorithm: 'argon2d',
      password: 'secret',
      salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
      iterations: 3,
      parallelism: 1,
      memorySize: 64,
      hashLength: 32,
    })

    expect(argon2iMock).toHaveBeenCalledOnce()
    expect(argon2dMock).toHaveBeenCalledOnce()
  })

  it('omits empty secret and includes provided secret', async () => {
    await generateArgon2Hash({
      algorithm: 'argon2id',
      password: 'secret',
      salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
      secret: '',
      iterations: 3,
      parallelism: 1,
      memorySize: 64,
      hashLength: 32,
    })

    expect(argon2idMock).toHaveBeenLastCalledWith(expect.objectContaining({ secret: undefined }))

    await generateArgon2Hash({
      algorithm: 'argon2id',
      password: 'secret',
      salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
      secret: 'pepper',
      iterations: 3,
      parallelism: 1,
      memorySize: 64,
      hashLength: 32,
    })

    expect(argon2idMock).toHaveBeenLastCalledWith(expect.objectContaining({ secret: 'pepper' }))
  })

  it('returns empty hash for blank password', async () => {
    await expect(
      generateArgon2Hash({
        algorithm: 'argon2id',
        password: '',
        salt: 'AQIDBAUGBwgJCgsMDQ4PEA==',
        iterations: 3,
        parallelism: 1,
        memorySize: 64,
        hashLength: 32,
      }),
    ).resolves.toBe('')

    expect(argon2idMock).not.toHaveBeenCalled()
  })

  it('rejects invalid parameters', async () => {
    await expect(
      generateArgon2Hash({
        algorithm: 'argon2id',
        password: 'secret',
        salt: '',
        iterations: 3,
        parallelism: 1,
        memorySize: 64,
        hashLength: 32,
      }),
    ).rejects.toThrow('Salt is required')

    await expect(
      generateArgon2Hash({
        algorithm: 'argon2id',
        password: 'secret',
        salt: 'AQID',
        iterations: 0,
        parallelism: 1,
        memorySize: 64,
        hashLength: 32,
      }),
    ).rejects.toThrow('Invalid Argon2 parameters')

    await expect(
      generateArgon2Hash({
        algorithm: 'argon2id',
        password: 'secret',
        salt: 'AQID',
        iterations: 1,
        parallelism: 4,
        memorySize: 16,
        hashLength: 32,
      }),
    ).rejects.toThrow('Memory size should be at least 8 * parallelism.')
  })
})
