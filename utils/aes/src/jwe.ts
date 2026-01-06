import { CompactEncrypt, compactDecrypt, base64url } from 'jose'
import type { AesMode, KeyLength, Pbkdf2Options } from './types'
import { PBES2_ALG, JWE_ENC_GCM, JWE_ENC_CBC, PBKDF2_ITERATIONS } from './types'

// Allowed algorithms for decryption
const ALLOWED_KEY_ALGORITHMS = [
  'PBES2-HS256+A128KW',
  'PBES2-HS384+A192KW',
  'PBES2-HS512+A256KW',
  'dir',
]
const ALLOWED_CONTENT_ALGORITHMS = [
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512',
]

/**
 * Get JWE encryption algorithm based on AES mode and key length
 * Note: JWE standard doesn't support CTR mode
 */
function getJweEnc(mode: AesMode, keyLength: KeyLength): string {
  if (mode === 'CTR') {
    throw new Error('JWE format does not support CTR mode. Please use Raw format instead.')
  }
  if (mode === 'GCM') {
    return JWE_ENC_GCM[keyLength]
  }
  return JWE_ENC_CBC[keyLength]
}

/**
 * Encrypt data using JWE format with password (PBES2)
 */
export async function encryptJweWithPassword(
  plaintext: string | ArrayBuffer,
  password: string,
  mode: AesMode,
  keyLength: KeyLength,
  options: Pbkdf2Options = {},
): Promise<string> {
  const { iterations = PBKDF2_ITERATIONS } = options

  const data = typeof plaintext === 'string' ? new TextEncoder().encode(plaintext) : plaintext

  const alg = PBES2_ALG[keyLength]
  const enc = getJweEnc(mode, keyLength)

  const jwe = await new CompactEncrypt(new Uint8Array(data))
    .setProtectedHeader({
      alg,
      enc,
      p2c: iterations, // PBKDF2 iteration count
    })
    .encrypt(new TextEncoder().encode(password))

  return jwe
}

/**
 * Encrypt data using JWE format with raw key (direct encryption)
 */
export async function encryptJweWithRawKey(
  plaintext: string | ArrayBuffer,
  keyHex: string,
  mode: AesMode,
  keyLength: KeyLength,
): Promise<string> {
  const data = typeof plaintext === 'string' ? new TextEncoder().encode(plaintext) : plaintext

  const enc = getJweEnc(mode, keyLength)
  const keyBytes = hexToUint8Array(keyHex)

  // Validate key length
  // For CBC mode with HMAC, we need a longer key (enc key + mac key)
  // A128CBC-HS256 needs 32 bytes, A192CBC-HS384 needs 48 bytes, A256CBC-HS512 needs 64 bytes
  // For GCM mode, we need the standard AES key length
  const expectedLength =
    mode === 'CBC'
      ? (keyLength / 8) * 2 // CBC needs double (enc + mac)
      : keyLength / 8 // GCM uses standard length

  if (keyBytes.length !== expectedLength) {
    if (mode === 'CBC') {
      throw new Error(
        `For CBC mode with raw key, expected ${expectedLength} bytes (enc + mac key), got ${keyBytes.length}`,
      )
    }
    throw new Error(`Invalid key length: expected ${expectedLength} bytes, got ${keyBytes.length}`)
  }

  const jwe = await new CompactEncrypt(new Uint8Array(data))
    .setProtectedHeader({
      alg: 'dir', // Direct encryption
      enc,
    })
    .encrypt(keyBytes)

  return jwe
}

/**
 * Decrypt JWE with password
 */
export async function decryptJweWithPassword(jwe: string, password: string): Promise<ArrayBuffer> {
  const { plaintext } = await compactDecrypt(jwe, new TextEncoder().encode(password), {
    keyManagementAlgorithms: ALLOWED_KEY_ALGORITHMS,
    contentEncryptionAlgorithms: ALLOWED_CONTENT_ALGORITHMS,
  })
  // Copy to a new ArrayBuffer to avoid SharedArrayBuffer issues
  return new Uint8Array(plaintext).buffer as ArrayBuffer
}

/**
 * Decrypt JWE with raw key
 */
export async function decryptJweWithRawKey(jwe: string, keyHex: string): Promise<ArrayBuffer> {
  const keyBytes = hexToUint8Array(keyHex)
  const { plaintext } = await compactDecrypt(jwe, keyBytes, {
    keyManagementAlgorithms: ALLOWED_KEY_ALGORITHMS,
    contentEncryptionAlgorithms: ALLOWED_CONTENT_ALGORITHMS,
  })
  // Copy to a new ArrayBuffer to avoid SharedArrayBuffer issues
  return new Uint8Array(plaintext).buffer as ArrayBuffer
}

/**
 * Check if a string is a valid JWE compact serialization
 */
export function isJweFormat(input: string): boolean {
  // JWE compact format has 5 parts separated by dots
  const parts = input.trim().split('.')
  if (parts.length !== 5) return false

  // Try to decode and parse the header
  try {
    const headerPart = parts[0]
    if (!headerPart) return false
    const header = JSON.parse(new TextDecoder().decode(base64url.decode(headerPart)))
    return typeof header.alg === 'string' && typeof header.enc === 'string'
  } catch {
    return false
  }
}

/**
 * Parse JWE header to get algorithm info
 */
export function parseJweHeader(jwe: string): {
  alg: string
  enc: string
  p2c?: number // PBKDF2 iteration count
  p2s?: string // PBKDF2 salt (base64url)
} | null {
  try {
    const parts = jwe.trim().split('.')
    if (parts.length !== 5) return null

    const headerPart = parts[0]
    if (!headerPart) return null
    const header = JSON.parse(new TextDecoder().decode(base64url.decode(headerPart)))
    return {
      alg: header.alg,
      enc: header.enc,
      p2c: header.p2c,
      p2s: header.p2s,
    }
  } catch {
    return null
  }
}

/**
 * Get mode and key length from JWE enc value
 */
export function getConfigFromJweEnc(enc: string): { mode: AesMode; keyLength: KeyLength } | null {
  const gcmMap: Record<string, KeyLength> = {
    A128GCM: 128,
    A192GCM: 192,
    A256GCM: 256,
  }
  const cbcMap: Record<string, KeyLength> = {
    'A128CBC-HS256': 128,
    'A192CBC-HS384': 192,
    'A256CBC-HS512': 256,
  }

  const gcmKeyLength = gcmMap[enc]
  if (gcmKeyLength !== undefined) {
    return { mode: 'GCM', keyLength: gcmKeyLength }
  }
  const cbcKeyLength = cbcMap[enc]
  if (cbcKeyLength !== undefined) {
    return { mode: 'CBC', keyLength: cbcKeyLength }
  }
  return null
}

// Helper function
function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, '')
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes
}
