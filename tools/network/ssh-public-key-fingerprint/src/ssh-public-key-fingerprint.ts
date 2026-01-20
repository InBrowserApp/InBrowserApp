import MD5 from 'crypto-js/md5'
import WordArray from 'crypto-js/lib-typedarrays'

export type Fingerprints = {
  sha256: string
  md5: string
}

export type ParsedSshPublicKey = {
  keyType: string
  keySize?: number
  curve?: string
  comment?: string
  fingerprints: Fingerprints
}

type RawKeyEntry = {
  base64: string
  keyType?: string
  comment?: string
}

const keyTypePattern = /^(ssh|ecdsa|sk-ssh|sk-ecdsa)-[A-Za-z0-9@.-]+$/
const beginSsh2Pattern = /^-+ BEGIN SSH2 PUBLIC KEY -+$/i
const endSsh2Pattern = /^-+ END SSH2 PUBLIC KEY -+$/i
const curveSizes: Record<string, number> = {
  nistp256: 256,
  nistp384: 384,
  nistp521: 521,
}

export async function parseSshPublicKeys(input: string): Promise<ParsedSshPublicKey[]> {
  const trimmedInput = input.trim()
  if (!trimmedInput) return []

  const { blocks, remainingLines } = splitSsh2Blocks(trimmedInput)
  const openSshEntries = extractOpenSshEntries(remainingLines)
  const rawEntries = [...blocks, ...openSshEntries]

  if (!rawEntries.length) return []

  const results = await Promise.allSettled(
    rawEntries.map(async (entry) => {
      const bytes = decodeBase64(entry.base64)
      const keyInfo = parseKeyBlob(bytes)
      const keyType = keyInfo.keyType || entry.keyType || 'unknown'
      const fingerprints = {
        sha256: await sha256Fingerprint(bytes),
        md5: md5Fingerprint(bytes),
      }

      return {
        keyType,
        keySize: keyInfo.keySize,
        curve: keyInfo.curve,
        comment: entry.comment,
        fingerprints,
      }
    }),
  )

  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
}

function splitSsh2Blocks(input: string): { blocks: RawKeyEntry[]; remainingLines: string[] } {
  const lines = input.split(/\r?\n/)
  const blocks: RawKeyEntry[] = []
  const remainingLines: string[] = []

  let inBlock = false
  let base64Lines: string[] = []
  let comment: string | undefined

  for (const line of lines) {
    const trimmed = line.trim()

    if (!inBlock && beginSsh2Pattern.test(trimmed)) {
      inBlock = true
      base64Lines = []
      comment = undefined
      continue
    }

    if (inBlock) {
      if (endSsh2Pattern.test(trimmed)) {
        if (base64Lines.length) {
          blocks.push({ base64: base64Lines.join(''), comment })
        }
        inBlock = false
        base64Lines = []
        comment = undefined
        continue
      }

      const lowerTrimmed = trimmed.toLowerCase()
      if (lowerTrimmed.startsWith('comment:')) {
        const commentText = trimmed.slice('comment:'.length).trim()
        if (commentText) {
          comment = stripQuotes(commentText)
        }
        continue
      }

      if (lowerTrimmed.startsWith('subject:')) {
        continue
      }

      if (trimmed) {
        base64Lines.push(trimmed)
      }
      continue
    }

    remainingLines.push(line)
  }

  return { blocks, remainingLines }
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

function extractOpenSshEntries(lines: string[]): RawKeyEntry[] {
  const entries: RawKeyEntry[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const tokens = trimmed.split(/\s+/)
    let keyIndex = -1
    for (let i = 0; i < tokens.length - 1; i += 1) {
      const token = tokens[i]!
      const candidate = tokens[i + 1]!
      if (isKeyType(token) && looksLikeBase64(candidate)) {
        keyIndex = i
        break
      }
    }

    if (keyIndex === -1) continue

    const keyType = tokens[keyIndex]!
    const base64 = tokens[keyIndex + 1]!
    const comment = tokens.slice(keyIndex + 2).join(' ') || undefined

    entries.push({ keyType, base64, comment })
  }

  return entries
}

function isKeyType(token: string): boolean {
  return keyTypePattern.test(token)
}

function looksLikeBase64(token: string): boolean {
  if (token.length < 16) return false
  return /^[A-Za-z0-9+/=]+$/.test(token)
}

function decodeBase64(data: string): Uint8Array {
  const cleaned = data.replace(/\s+/g, '')
  if (typeof atob === 'function') {
    const binary = atob(cleaned)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(cleaned, 'base64'))
  }

  throw new Error('Base64 decoder not available')
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  if (typeof btoa === 'function') {
    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]!)
    }
    return btoa(binary)
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }

  throw new Error('Base64 encoder not available')
}

async function sha256Fingerprint(bytes: Uint8Array): Promise<string> {
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  const base64 = arrayBufferToBase64(hash)
  return `SHA256:${base64.replace(/=+$/, '')}`
}

function md5Fingerprint(bytes: Uint8Array): string {
  const wordArray = WordArray.create(bytes)
  const hex = MD5(wordArray).toString()
  const parts = hex.match(/.{2}/g) ?? []
  return `MD5:${parts.join(':')}`
}

function parseKeyBlob(bytes: Uint8Array): { keyType: string; keySize?: number; curve?: string } {
  const reader = new SshReader(bytes)
  const keyType = reader.readStringAsText()

  switch (keyType) {
    case 'ssh-rsa': {
      reader.readMpint()
      const modulus = reader.readMpint()
      return { keyType, keySize: mpintBitLength(modulus) }
    }
    case 'ssh-dss': {
      const p = reader.readMpint()
      reader.readMpint()
      reader.readMpint()
      reader.readMpint()
      return { keyType, keySize: mpintBitLength(p) }
    }
    case 'ssh-ed25519': {
      const publicKey = reader.readString()
      return { keyType, keySize: publicKey.length * 8, curve: 'ed25519' }
    }
    case 'sk-ssh-ed25519@openssh.com': {
      const publicKey = reader.readString()
      reader.readString()
      return { keyType, keySize: publicKey.length * 8, curve: 'ed25519' }
    }
    case 'ecdsa-sha2-nistp256':
    case 'ecdsa-sha2-nistp384':
    case 'ecdsa-sha2-nistp521': {
      const curve = reader.readStringAsText()
      reader.readString()
      return { keyType, keySize: curveSizes[curve], curve }
    }
    case 'sk-ecdsa-sha2-nistp256@openssh.com': {
      const curve = reader.readStringAsText()
      reader.readString()
      reader.readString()
      return { keyType, keySize: curveSizes[curve], curve }
    }
    default:
      return { keyType }
  }
}

function mpintBitLength(bytes: Uint8Array): number {
  let start = 0
  while (start < bytes.length && bytes[start] === 0) {
    start += 1
  }

  if (start === bytes.length) return 0

  const first = bytes[start]!
  const remainingBytes = bytes.length - start - 1
  const firstBits = 32 - Math.clz32(first)
  return remainingBytes * 8 + firstBits
}

class SshReader {
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {}

  readUint32(): number {
    if (this.offset + 4 > this.bytes.length) {
      throw new Error('Unexpected end of data')
    }

    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset + this.offset, 4)
    const value = view.getUint32(0, false)
    this.offset += 4
    return value
  }

  readString(): Uint8Array {
    const length = this.readUint32()
    if (this.offset + length > this.bytes.length) {
      throw new Error('Unexpected end of data')
    }
    const value = this.bytes.slice(this.offset, this.offset + length)
    this.offset += length
    return value
  }

  readStringAsText(): string {
    const data = this.readString()
    return new TextDecoder().decode(data)
  }

  readMpint(): Uint8Array {
    return this.readString()
  }
}
