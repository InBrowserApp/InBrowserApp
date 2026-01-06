import {
  type AesMode,
  type KeyLength,
  type OutputFormat,
  type EncryptOptions,
  type Pbkdf2Options,
  IV_LENGTH,
  SALT_LENGTH,
  PBKDF2_ITERATIONS,
  PBKDF2_HASH,
} from './types'

export interface RawEncryptResult {
  output: string // Encoded string (base64 or hex)
  salt: string // Hex
  iv: string // Hex
  binary: ArrayBuffer // Raw packed binary
}

/**
 * Generate random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

/**
 * Generate a random key in hex format
 */
export function generateRandomKey(keyLength: KeyLength): string {
  const bytes = generateRandomBytes(keyLength / 8)
  return arrayBufferToHex(bytes)
}

/**
 * Derive a CryptoKey from a password using PBKDF2
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  keyLength: KeyLength,
  mode: AesMode,
  options: Pbkdf2Options = {},
): Promise<CryptoKey> {
  const iterations = options.iterations ?? PBKDF2_ITERATIONS
  const hash = options.hash ?? PBKDF2_HASH

  if (!Number.isFinite(iterations) || iterations < 1) {
    throw new Error('Invalid PBKDF2 iterations')
  }

  const encoder = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  const algorithm = mode === 'CBC' ? 'AES-CBC' : mode === 'CTR' ? 'AES-CTR' : 'AES-GCM'

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: Math.floor(iterations),
      hash,
    },
    passwordKey,
    { name: algorithm, length: keyLength },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Import a raw key from hex string
 */
export async function importRawKey(
  keyHex: string,
  keyLength: KeyLength,
  mode: AesMode,
): Promise<CryptoKey> {
  const keyBytes = hexToArrayBuffer(keyHex)
  const expectedLength = keyLength / 8

  if (keyBytes.byteLength !== expectedLength) {
    throw new Error(
      `Invalid key length: expected ${expectedLength} bytes, got ${keyBytes.byteLength}`,
    )
  }

  const algorithm = mode === 'CBC' ? 'AES-CBC' : mode === 'CTR' ? 'AES-CTR' : 'AES-GCM'

  return crypto.subtle.importKey('raw', keyBytes, { name: algorithm }, false, [
    'encrypt',
    'decrypt',
  ])
}

/**
 * Encrypt data using AES
 */
export async function encrypt(
  data: ArrayBuffer | Uint8Array,
  key: CryptoKey,
  mode: AesMode,
  iv: Uint8Array,
): Promise<ArrayBuffer> {
  const payload =
    data instanceof ArrayBuffer
      ? data
      : data.buffer instanceof ArrayBuffer
        ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
        : new Uint8Array(data).buffer

  let algorithm: AesGcmParams | AesCbcParams | AesCtrParams

  switch (mode) {
    case 'GCM':
      algorithm = { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }
      break
    case 'CBC':
      algorithm = { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer }
      break
    case 'CTR':
      algorithm = { name: 'AES-CTR', counter: iv.buffer as ArrayBuffer, length: 64 }
      break
  }

  return crypto.subtle.encrypt(algorithm, key, payload)
}

/**
 * Decrypt data using AES
 */
export async function decrypt(
  data: ArrayBuffer,
  key: CryptoKey,
  mode: AesMode,
  iv: Uint8Array,
): Promise<ArrayBuffer> {
  let algorithm: AesGcmParams | AesCbcParams | AesCtrParams

  switch (mode) {
    case 'GCM':
      algorithm = { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }
      break
    case 'CBC':
      algorithm = { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer }
      break
    case 'CTR':
      algorithm = { name: 'AES-CTR', counter: iv.buffer as ArrayBuffer, length: 64 }
      break
  }

  return crypto.subtle.decrypt(algorithm, key, data)
}

/**
 * Pack salt, IV, and ciphertext into a single buffer
 * Format: [salt (16 bytes)][iv (12 or 16 bytes)][ciphertext]
 */
export function pack(salt: Uint8Array, iv: Uint8Array, ciphertext: ArrayBuffer): ArrayBuffer {
  const result = new Uint8Array(salt.length + iv.length + ciphertext.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(ciphertext), salt.length + iv.length)
  return result.buffer
}

/**
 * Unpack salt, IV, and ciphertext from a packed buffer
 */
export function unpack(
  data: ArrayBuffer,
  mode: AesMode,
): { salt: Uint8Array; iv: Uint8Array; ciphertext: ArrayBuffer } {
  const bytes = new Uint8Array(data)
  const ivLength = IV_LENGTH[mode]

  if (bytes.length < SALT_LENGTH + ivLength + 1) {
    throw new Error('Invalid encrypted data: too short')
  }

  const salt = bytes.slice(0, SALT_LENGTH)
  const iv = bytes.slice(SALT_LENGTH, SALT_LENGTH + ivLength)
  const ciphertext = bytes.slice(SALT_LENGTH + ivLength).buffer

  return { salt, iv, ciphertext }
}

/**
 * High-level encrypt function with password
 */
export async function encryptWithPassword(
  plaintext: string | ArrayBuffer,
  password: string,
  mode: AesMode,
  keyLength: KeyLength,
  outputFormat: OutputFormat,
  options?: EncryptOptions,
): Promise<RawEncryptResult> {
  const salt = options?.salt ?? generateRandomBytes(SALT_LENGTH)
  const iv = options?.iv ?? generateRandomBytes(IV_LENGTH[mode])
  const key = await deriveKey(password, salt, keyLength, mode, options)

  const data = typeof plaintext === 'string' ? new TextEncoder().encode(plaintext) : plaintext

  const ciphertext = await encrypt(data, key, mode, iv)
  const packed = pack(salt, iv, ciphertext)

  return {
    output: outputFormat === 'base64' ? arrayBufferToBase64(packed) : arrayBufferToHex(packed),
    salt: arrayBufferToHex(salt),
    iv: arrayBufferToHex(iv),
    binary: packed,
  }
}

/**
 * High-level decrypt function with password
 */
export async function decryptWithPassword(
  encrypted: string,
  password: string,
  mode: AesMode,
  keyLength: KeyLength,
  inputFormat: OutputFormat,
  options?: Pbkdf2Options,
): Promise<ArrayBuffer> {
  const data =
    inputFormat === 'base64' ? base64ToArrayBuffer(encrypted) : hexToArrayBuffer(encrypted)

  const { salt, iv, ciphertext } = unpack(data, mode)
  const key = await deriveKey(password, salt, keyLength, mode, options)

  return decrypt(ciphertext, key, mode, iv)
}

/**
 * High-level encrypt function with raw key
 */
export async function encryptWithRawKey(
  plaintext: string | ArrayBuffer,
  keyHex: string,
  mode: AesMode,
  keyLength: KeyLength,
  outputFormat: OutputFormat,
  options?: { iv?: Uint8Array },
): Promise<RawEncryptResult> {
  const key = await importRawKey(keyHex, keyLength, mode)
  const iv = options?.iv ?? generateRandomBytes(IV_LENGTH[mode])
  // Use empty salt for raw key mode (still pack it for consistent format)
  const salt = new Uint8Array(SALT_LENGTH)

  const data = typeof plaintext === 'string' ? new TextEncoder().encode(plaintext) : plaintext

  const ciphertext = await encrypt(data, key, mode, iv)
  const packed = pack(salt, iv, ciphertext)

  return {
    output: outputFormat === 'base64' ? arrayBufferToBase64(packed) : arrayBufferToHex(packed),
    salt: arrayBufferToHex(salt),
    iv: arrayBufferToHex(iv),
    binary: packed,
  }
}

/**
 * High-level decrypt function with raw key
 */
export async function decryptWithRawKey(
  encrypted: string,
  keyHex: string,
  mode: AesMode,
  keyLength: KeyLength,
  inputFormat: OutputFormat,
): Promise<ArrayBuffer> {
  const data =
    inputFormat === 'base64' ? base64ToArrayBuffer(encrypted) : hexToArrayBuffer(encrypted)

  const { iv, ciphertext } = unpack(data, mode)
  const key = await importRawKey(keyHex, keyLength, mode)

  return decrypt(ciphertext, key, mode, iv)
}

// Utility functions for encoding/decoding

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export function arrayBufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const cleanHex = hex.replace(/\s/g, '')
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes.buffer
}

export function isValidHex(hex: string): boolean {
  const cleanHex = hex.replace(/\s/g, '')
  return /^[0-9a-fA-F]*$/.test(cleanHex) && cleanHex.length % 2 === 0
}

export function isValidBase64(base64: string): boolean {
  try {
    atob(base64)
    return true
  } catch {
    return false
  }
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer)
}
