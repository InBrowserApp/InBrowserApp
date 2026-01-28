import { decodeBase16 } from '@utils/base16'
import type { Pbkdf2Algorithm, SaltFormat } from './types'

const textEncoder = new TextEncoder()

export function normalizeBase64Input(value: string): string {
  return value.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
}

export function decodeBase64(value: string): Uint8Array {
  const normalized = normalizeBase64Input(value)
  if (!normalized) return new Uint8Array()

  const remainder = normalized.length % 4
  if (remainder === 1) {
    throw new Error('Invalid base64 length')
  }

  const padded = normalized + '='.repeat((4 - remainder) % 4)

  let binary = ''
  try {
    binary = atob(padded)
  } catch {
    throw new Error('Invalid base64')
  }

  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function isValidBase64(value: string): boolean {
  try {
    decodeBase64(value)
    return true
  } catch {
    return false
  }
}

export async function saltToBytes(salt: string | File, format: SaltFormat): Promise<Uint8Array> {
  let bytes: Uint8Array

  if (salt instanceof File) {
    bytes = new Uint8Array(await salt.arrayBuffer())
  } else {
    switch (format) {
      case 'hex':
        bytes = decodeBase16(salt)
        break
      case 'base64':
        bytes = decodeBase64(salt)
        break
      default:
        bytes = textEncoder.encode(salt)
        break
    }
  }

  return Uint8Array.from(bytes)
}

export function bytesToHex(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

export async function derivePbkdf2(params: {
  password: string
  salt: string | File
  saltFormat: SaltFormat
  iterations: number
  lengthBytes: number
  hash: Pbkdf2Algorithm
}): Promise<Uint8Array> {
  const { password, salt, saltFormat, iterations, lengthBytes, hash } = params

  if (!password) {
    return new Uint8Array()
  }

  if (iterations <= 0 || lengthBytes <= 0) {
    throw new Error('Invalid PBKDF2 parameters')
  }

  const saltBytes = await saltToBytes(salt, saltFormat)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash,
    },
    keyMaterial,
    lengthBytes * 8,
  )

  return new Uint8Array(derivedBits)
}
