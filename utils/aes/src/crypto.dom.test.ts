import { describe, it, expect } from 'vitest'
import {
  encryptWithPassword,
  decryptWithPassword,
  encryptWithRawKey,
  decryptWithRawKey,
  deriveKey,
  importRawKey,
  pack,
  unpack,
  generateRandomKey,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  arrayBufferToHex,
  hexToArrayBuffer,
  isValidHex,
  isValidBase64,
  arrayBufferToString,
} from './crypto'
import type { AesMode, KeyLength } from './types'

describe('AES-GCM encryption with password', () => {
  it('encrypts and decrypts text correctly', async () => {
    const plaintext = 'Hello, World!'
    const password = 'test-password-123'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('handles Unicode text', async () => {
    const plaintext = '你好，世界！🌍 Привет мир!'
    const password = 'unicode-test'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('handles empty string', async () => {
    const plaintext = ''
    const password = 'empty-test'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('encrypts and decrypts ArrayBuffer plaintext', async () => {
    const plaintext = new TextEncoder().encode('buffer-text').buffer
    const password = 'buffer-password'

    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'base64')

    expect(arrayBufferToString(decrypted)).toBe('buffer-text')
  })

  it('fails with wrong password', async () => {
    const plaintext = 'Secret message'
    const result = await encryptWithPassword(plaintext, 'correct-password', 'GCM', 256, 'base64')
    await expect(
      decryptWithPassword(result.output, 'wrong-password', 'GCM', 256, 'base64'),
    ).rejects.toThrow()
  })

  it('produces different ciphertext each time due to random IV', async () => {
    const plaintext = 'Same message'
    const password = 'same-password'
    const result1 = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    const result2 = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    expect(result1.output).not.toBe(result2.output)
  })
})

describe('AES-CBC encryption with password', () => {
  it('encrypts and decrypts text correctly', async () => {
    const plaintext = 'Hello, CBC World!'
    const password = 'cbc-test-password'
    const result = await encryptWithPassword(plaintext, password, 'CBC', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'CBC', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('handles various text lengths', async () => {
    const testCases = ['a', 'ab', '1234567890123456', 'Long text that spans multiple blocks...']
    const password = 'cbc-length-test'

    for (const plaintext of testCases) {
      const result = await encryptWithPassword(plaintext, password, 'CBC', 256, 'base64')
      const decrypted = await decryptWithPassword(result.output, password, 'CBC', 256, 'base64')
      expect(arrayBufferToString(decrypted)).toBe(plaintext)
    }
  })
})

describe('AES-CTR encryption with password', () => {
  it('encrypts and decrypts text correctly', async () => {
    const plaintext = 'Hello, CTR World!'
    const password = 'ctr-test-password'
    const result = await encryptWithPassword(plaintext, password, 'CTR', 256, 'base64')
    const decrypted = await decryptWithPassword(result.output, password, 'CTR', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })
})

describe('Key lengths', () => {
  const keyLengths: KeyLength[] = [128, 192, 256]
  const modes: AesMode[] = ['GCM', 'CBC', 'CTR']

  for (const keyLength of keyLengths) {
    for (const mode of modes) {
      it(`works with ${keyLength}-bit key in ${mode} mode`, async () => {
        const plaintext = `Testing ${keyLength}-bit ${mode}`
        const password = 'key-length-test'
        const result = await encryptWithPassword(plaintext, password, mode, keyLength, 'base64')
        const decrypted = await decryptWithPassword(
          result.output,
          password,
          mode,
          keyLength,
          'base64',
        )
        expect(arrayBufferToString(decrypted)).toBe(plaintext)
      })
    }
  }
})

describe('Raw key encryption', () => {
  it('encrypts and decrypts with 256-bit raw key', async () => {
    const plaintext = 'Raw key test'
    const keyHex = generateRandomKey(256)
    const result = await encryptWithRawKey(plaintext, keyHex, 'GCM', 256, 'base64')
    const decrypted = await decryptWithRawKey(result.output, keyHex, 'GCM', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('encrypts and decrypts with 128-bit raw key', async () => {
    const plaintext = 'Raw key 128-bit test'
    const keyHex = generateRandomKey(128)
    const result = await encryptWithRawKey(plaintext, keyHex, 'GCM', 128, 'base64')
    const decrypted = await decryptWithRawKey(result.output, keyHex, 'GCM', 128, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('supports ArrayBuffer plaintext and hex output with raw keys', async () => {
    const plaintext = new TextEncoder().encode('raw-buffer').buffer
    const keyHex = generateRandomKey(128)

    const result = await encryptWithRawKey(plaintext, keyHex, 'CBC', 128, 'hex')
    expect(isValidHex(result.output)).toBe(true)

    const decrypted = await decryptWithRawKey(result.output, keyHex, 'CBC', 128, 'hex')
    expect(arrayBufferToString(decrypted)).toBe('raw-buffer')
  })

  it('fails with wrong key', async () => {
    const plaintext = 'Secret with raw key'
    const correctKey = generateRandomKey(256)
    const wrongKey = generateRandomKey(256)
    const result = await encryptWithRawKey(plaintext, correctKey, 'GCM', 256, 'base64')
    await expect(decryptWithRawKey(result.output, wrongKey, 'GCM', 256, 'base64')).rejects.toThrow()
  })
})

describe('Output formats', () => {
  it('works with Base64 output', async () => {
    const plaintext = 'Base64 format test'
    const password = 'format-test'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')
    expect(isValidBase64(result.output)).toBe(true)
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'base64')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('works with Hex output', async () => {
    const plaintext = 'Hex format test'
    const password = 'format-test'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'hex')
    expect(isValidHex(result.output)).toBe(true)
    const decrypted = await decryptWithPassword(result.output, password, 'GCM', 256, 'hex')
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })
})

describe('Data packing', () => {
  it('packs and unpacks correctly for GCM (12-byte IV)', () => {
    const salt = new Uint8Array(16).fill(1)
    const iv = new Uint8Array(12).fill(2)
    const ciphertext = new Uint8Array([3, 4, 5, 6, 7])

    const packed = pack(salt, iv, ciphertext.buffer)
    const unpacked = unpack(packed, 'GCM')

    expect(new Uint8Array(unpacked.salt)).toEqual(salt)
    expect(new Uint8Array(unpacked.iv)).toEqual(iv)
    expect(new Uint8Array(unpacked.ciphertext)).toEqual(ciphertext)
  })

  it('packs and unpacks correctly for CBC (16-byte IV)', () => {
    const salt = new Uint8Array(16).fill(10)
    const iv = new Uint8Array(16).fill(20)
    const ciphertext = new Uint8Array([30, 40, 50])

    const packed = pack(salt, iv, ciphertext.buffer)
    const unpacked = unpack(packed, 'CBC')

    expect(new Uint8Array(unpacked.salt)).toEqual(salt)
    expect(new Uint8Array(unpacked.iv)).toEqual(iv)
    expect(new Uint8Array(unpacked.ciphertext)).toEqual(ciphertext)
  })

  it('throws on too short data', () => {
    const shortData = new Uint8Array(10).buffer
    expect(() => unpack(shortData, 'GCM')).toThrow('Invalid encrypted data: too short')
  })
})

describe('Encoding utilities', () => {
  describe('Base64', () => {
    it('round-trips correctly', () => {
      const original = new Uint8Array([0, 1, 127, 128, 255])
      const base64 = arrayBufferToBase64(original.buffer)
      const decoded = base64ToArrayBuffer(base64)
      expect(new Uint8Array(decoded)).toEqual(original)
    })

    it('validates Base64 strings', () => {
      expect(isValidBase64('SGVsbG8=')).toBe(true)
      expect(isValidBase64('not valid base64!@#')).toBe(false)
    })
  })

  describe('Hex', () => {
    it('round-trips correctly', () => {
      const original = new Uint8Array([0, 1, 127, 128, 255])
      const hex = arrayBufferToHex(original)
      const decoded = hexToArrayBuffer(hex)
      expect(new Uint8Array(decoded)).toEqual(original)
    })

    it('validates hex strings', () => {
      expect(isValidHex('0123456789abcdef')).toBe(true)
      expect(isValidHex('ABCDEF')).toBe(true)
      expect(isValidHex('0123456789abcdefg')).toBe(false)
      expect(isValidHex('123')).toBe(false) // odd length
    })

    it('handles hex with spaces', () => {
      expect(isValidHex('01 23 45')).toBe(true)
    })

    it('throws when hex input length is odd', () => {
      expect(() => hexToArrayBuffer('abc')).toThrow('Invalid hex string')
    })
  })
})

describe('generateRandomKey', () => {
  it('generates correct length keys', () => {
    expect(generateRandomKey(128).length).toBe(32) // 128 bits = 16 bytes = 32 hex chars
    expect(generateRandomKey(192).length).toBe(48) // 192 bits = 24 bytes = 48 hex chars
    expect(generateRandomKey(256).length).toBe(64) // 256 bits = 32 bytes = 64 hex chars
  })

  it('generates different keys each time', () => {
    const key1 = generateRandomKey(256)
    const key2 = generateRandomKey(256)
    expect(key1).not.toBe(key2)
  })

  it('generates valid hex', () => {
    const key = generateRandomKey(256)
    expect(isValidHex(key)).toBe(true)
  })
})

describe('Key validation', () => {
  it('rejects invalid PBKDF2 iteration counts', async () => {
    const salt = new Uint8Array(16)

    await expect(deriveKey('password', salt, 256, 'GCM', { iterations: 0 })).rejects.toThrow(
      'Invalid PBKDF2 iterations',
    )
  })

  it('rejects mismatched raw key lengths', async () => {
    await expect(importRawKey('00'.repeat(15), 128, 'GCM')).rejects.toThrow(
      'Invalid key length: expected 16 bytes, got 15',
    )
  })

  it('imports CBC and CTR raw keys with valid lengths', async () => {
    await expect(importRawKey(generateRandomKey(128), 128, 'CBC')).resolves.toBeDefined()
    await expect(importRawKey(generateRandomKey(128), 128, 'CTR')).resolves.toBeDefined()
  })
})

describe('Error handling', () => {
  it('throws on corrupted ciphertext', async () => {
    const plaintext = 'Test message'
    const password = 'test-password'
    const result = await encryptWithPassword(plaintext, password, 'GCM', 256, 'base64')

    // Corrupt the ciphertext by modifying the last character
    const corrupted = result.output.slice(0, -4) + 'AAAA'

    await expect(decryptWithPassword(corrupted, password, 'GCM', 256, 'base64')).rejects.toThrow()
  })

  it('throws on invalid Base64 input', async () => {
    const password = 'test-password'
    await expect(
      decryptWithPassword('not-valid-base64!!!', password, 'GCM', 256, 'base64'),
    ).rejects.toThrow()
  })

  it('throws on invalid hex input', async () => {
    const password = 'test-password'
    await expect(
      decryptWithPassword('not-valid-hex!!!', password, 'GCM', 256, 'hex'),
    ).rejects.toThrow()
  })
})
