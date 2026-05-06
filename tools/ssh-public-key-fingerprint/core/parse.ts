import { decodeBase64 } from "./base64"
import {
  createSshPublicKeyFingerprints,
  type Fingerprints,
  type Sha256Digest,
} from "./fingerprint"
import { SshReader } from "./ssh-reader"

type ParsedSshPublicKey = Readonly<{
  keyType: string
  keySize?: number
  curve?: string
  comment?: string
  fingerprints: Fingerprints
}>

type RawKeyEntry = Readonly<{
  base64: string
  keyType?: string
  comment?: string
}>

type KeyBlobInfo = Readonly<{
  keyType: string
  keySize?: number
  curve?: string
}>

const KEY_TYPE_PATTERN = /^(ssh|ecdsa|sk-ssh|sk-ecdsa)-[A-Za-z0-9@.-]+$/u
const BEGIN_SSH2_PATTERN = /^-+ BEGIN SSH2 PUBLIC KEY -+$/iu
const END_SSH2_PATTERN = /^-+ END SSH2 PUBLIC KEY -+$/iu

const CURVE_SIZES: Record<string, number> = {
  nistp256: 256,
  nistp384: 384,
  nistp521: 521,
}

async function parseSshPublicKeys(
  input: string,
  subtle: Sha256Digest | null | undefined = globalThis.crypto?.subtle
) {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return []
  }

  const { blocks, remainingLines } = splitSsh2Blocks(trimmedInput)
  const rawEntries = [...blocks, ...extractOpenSshEntries(remainingLines)]

  if (rawEntries.length === 0) {
    return []
  }

  if (!subtle) {
    throw new Error("SHA-256 fingerprinting requires Web Crypto support.")
  }

  const results = await Promise.allSettled(
    rawEntries.map((entry) => parseRawEntry(entry, subtle))
  )

  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  )
}

async function parseRawEntry(
  entry: RawKeyEntry,
  subtle: Sha256Digest
): Promise<ParsedSshPublicKey> {
  const bytes = decodeBase64(entry.base64)
  const keyInfo = parseKeyBlob(bytes)
  const keyType = keyInfo.keyType || entry.keyType || "unknown"
  const fingerprints = await createSshPublicKeyFingerprints(bytes, subtle)

  return {
    keyType,
    ...(keyInfo.keySize !== undefined ? { keySize: keyInfo.keySize } : {}),
    ...(keyInfo.curve ? { curve: keyInfo.curve } : {}),
    ...(entry.comment ? { comment: entry.comment } : {}),
    fingerprints,
  }
}

function splitSsh2Blocks(input: string) {
  const lines = input.split(/\r?\n/u)
  const blocks: RawKeyEntry[] = []
  const remainingLines: string[] = []
  let inBlock = false
  let base64Lines: string[] = []
  let comment: string | undefined

  for (const line of lines) {
    const trimmed = line.trim()

    if (!inBlock && BEGIN_SSH2_PATTERN.test(trimmed)) {
      inBlock = true
      base64Lines = []
      comment = undefined
      continue
    }

    if (!inBlock) {
      remainingLines.push(line)
      continue
    }

    if (END_SSH2_PATTERN.test(trimmed)) {
      if (base64Lines.length > 0) {
        blocks.push({ base64: base64Lines.join(""), comment })
      }
      inBlock = false
      base64Lines = []
      comment = undefined
      continue
    }

    const lowerTrimmed = trimmed.toLowerCase()

    if (lowerTrimmed.startsWith("comment:")) {
      const commentText = trimmed.slice("comment:".length).trim()
      comment = commentText ? stripQuotes(commentText) : undefined
      continue
    }

    if (lowerTrimmed.startsWith("subject:")) {
      continue
    }

    if (trimmed) {
      base64Lines.push(trimmed)
    }
  }

  return { blocks, remainingLines }
}

function extractOpenSshEntries(lines: string[]) {
  const entries: RawKeyEntry[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const tokens = trimmed.split(/\s+/u)
    const keyIndex = findOpenSshKeyIndex(tokens)

    if (keyIndex === -1) {
      continue
    }

    entries.push({
      keyType: tokens[keyIndex]!,
      base64: tokens[keyIndex + 1]!,
      comment: tokens.slice(keyIndex + 2).join(" ") || undefined,
    })
  }

  return entries
}

function findOpenSshKeyIndex(tokens: string[]) {
  for (let index = 0; index < tokens.length - 1; index += 1) {
    if (isKeyType(tokens[index]!) && looksLikeBase64(tokens[index + 1]!)) {
      return index
    }
  }

  return -1
}

function parseKeyBlob(bytes: Uint8Array): KeyBlobInfo {
  const reader = new SshReader(bytes)
  const keyType = reader.readStringAsText()

  switch (keyType) {
    case "ssh-rsa": {
      reader.readMpint()
      return { keyType, keySize: mpintBitLength(reader.readMpint()) }
    }
    case "ssh-dss": {
      const p = reader.readMpint()
      reader.readMpint()
      reader.readMpint()
      reader.readMpint()
      return { keyType, keySize: mpintBitLength(p) }
    }
    case "ssh-ed25519": {
      return parseFixedLengthPublicKey(reader, keyType, "ed25519")
    }
    case "sk-ssh-ed25519@openssh.com": {
      const result = parseFixedLengthPublicKey(reader, keyType, "ed25519")
      reader.readString()
      return result
    }
    case "ecdsa-sha2-nistp256":
    case "ecdsa-sha2-nistp384":
    case "ecdsa-sha2-nistp521": {
      return parseEcdsaPublicKey(reader, keyType)
    }
    case "sk-ecdsa-sha2-nistp256@openssh.com": {
      const result = parseEcdsaPublicKey(reader, keyType)
      reader.readString()
      return result
    }
    default:
      return { keyType }
  }
}

function parseFixedLengthPublicKey(
  reader: SshReader,
  keyType: string,
  curve: string
) {
  const publicKey = reader.readString()

  return { keyType, keySize: publicKey.length * 8, curve }
}

function parseEcdsaPublicKey(reader: SshReader, keyType: string) {
  const curve = reader.readStringAsText()
  reader.readString()

  return { keyType, keySize: CURVE_SIZES[curve], curve }
}

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function isKeyType(token: string) {
  return KEY_TYPE_PATTERN.test(token)
}

function looksLikeBase64(token: string) {
  return token.length >= 16 && /^[A-Za-z0-9+/=]+$/u.test(token)
}

function mpintBitLength(bytes: Uint8Array) {
  let start = 0

  while (start < bytes.length && bytes[start] === 0) {
    start += 1
  }

  if (start === bytes.length) {
    return 0
  }

  const first = bytes[start]!
  const remainingBytes = bytes.length - start - 1
  const firstBits = 32 - Math.clz32(first)

  return remainingBytes * 8 + firstBits
}

export { parseSshPublicKeys }
export type { ParsedSshPublicKey }
