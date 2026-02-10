import { argon2d, argon2i, argon2id } from 'hash-wasm'
import type { Argon2Algorithm } from './types'

export type Argon2HashParams = {
  algorithm: Argon2Algorithm
  password: string
  salt: string
  secret?: string
  iterations: number
  parallelism: number
  memorySize: number
  hashLength: number
}

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

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(padded)) {
    throw new Error('Invalid base64')
  }

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

export function bytesToBase64(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''

  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }

  return btoa(binary)
}

export function generateRandomSaltBytes(length = 16): Uint8Array {
  const finalLength = Math.max(1, Math.floor(length))
  const bytes = new Uint8Array(finalLength)
  crypto.getRandomValues(bytes)
  return bytes
}

export async function generateArgon2Hash(params: Argon2HashParams): Promise<string> {
  const { algorithm, password, salt, secret, iterations, parallelism, memorySize, hashLength } =
    params

  if (!password) return ''

  const saltBytes = decodeBase64(salt)
  if (saltBytes.length === 0) {
    throw new Error('Salt is required')
  }

  if (iterations <= 0 || parallelism <= 0 || hashLength < 4) {
    throw new Error('Invalid Argon2 parameters')
  }

  if (memorySize < parallelism * 8) {
    throw new Error('Memory size should be at least 8 * parallelism.')
  }

  const options = {
    password,
    salt: saltBytes,
    secret: secret || undefined,
    iterations,
    parallelism,
    memorySize,
    hashLength,
    outputType: 'encoded' as const,
  }

  switch (algorithm) {
    case 'argon2i':
      return await argon2i(options)
    case 'argon2d':
      return await argon2d(options)
    default:
      return await argon2id(options)
  }
}
