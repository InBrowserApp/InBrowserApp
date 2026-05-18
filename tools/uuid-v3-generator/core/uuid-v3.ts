import MD5 from "crypto-js/md5"
import WordArray from "crypto-js/lib-typedarrays"

const DEFAULT_UUID_V3_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
const DEFAULT_UUID_V3_NAME = "example.com"

const UUID_V3_NAMESPACE_PRESETS = [
  {
    id: "dns",
    value: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  },
  {
    id: "url",
    value: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  },
  {
    id: "oid",
    value: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  },
  {
    id: "x500",
    value: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
  },
] as const

const CANONICAL_UUID_PATTERN =
  /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/u
const COMPACT_UUID_PATTERN = /^[0-9a-f]{32}$/u
const UUID_BYTE_LENGTH = 16

type UuidV3NamespacePreset = (typeof UUID_V3_NAMESPACE_PRESETS)[number]
type UuidV3NamespacePresetId = UuidV3NamespacePreset["id"]

function normalizeNamespaceUuid(value: string): string | null {
  const prepared = stripUuidWrappers(value)

  if (!prepared) {
    return null
  }

  const canonicalMatch = CANONICAL_UUID_PATTERN.exec(prepared)

  if (canonicalMatch) {
    return canonicalMatch
      .slice(1)
      .join("")
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/u, "$1-$2-$3-$4-$5")
  }

  if (!COMPACT_UUID_PATTERN.test(prepared)) {
    return null
  }

  return prepared.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/u,
    "$1-$2-$3-$4-$5"
  )
}

function stripUuidWrappers(value: string) {
  let prepared = value.trim().toLowerCase()

  if (prepared.startsWith("urn:uuid:")) {
    prepared = prepared.slice("urn:uuid:".length)
  }

  const startsWithBrace = prepared.startsWith("{")
  const endsWithBrace = prepared.endsWith("}")

  if (startsWithBrace !== endsWithBrace) {
    return ""
  }

  if (startsWithBrace && endsWithBrace) {
    prepared = prepared.slice(1, -1)
  }

  return prepared
}

function isValidNamespaceUuid(value: string) {
  return normalizeNamespaceUuid(value) !== null
}

function resolveNamespacePresetId(
  value: string
): UuidV3NamespacePresetId | null {
  const normalized = normalizeNamespaceUuid(value)

  return (
    UUID_V3_NAMESPACE_PRESETS.find((preset) => preset.value === normalized)
      ?.id ?? null
  )
}

function generateUuidV3(namespace: string, name: string): string {
  const normalizedNamespace = normalizeNamespaceUuid(namespace)

  if (!normalizedNamespace) {
    throw new TypeError("Namespace must be a valid UUID")
  }

  const namespaceBytes = uuidToBytes(normalizedNamespace)
  const nameBytes = new TextEncoder().encode(name)
  const input = new Uint8Array(namespaceBytes.length + nameBytes.length)

  input.set(namespaceBytes)
  input.set(nameBytes, namespaceBytes.length)

  const digest = wordArrayToBytes(MD5(WordArray.create(input)))

  digest[6] = (digest[6]! & 0x0f) | 0x30
  digest[8] = (digest[8]! & 0x3f) | 0x80

  return bytesToUuid(digest)
}

function uuidToBytes(uuid: string) {
  const compact = uuid.replaceAll("-", "")
  const bytes = new Uint8Array(UUID_BYTE_LENGTH)

  for (let index = 0; index < UUID_BYTE_LENGTH; index += 1) {
    bytes[index] = Number.parseInt(compact.slice(index * 2, index * 2 + 2), 16)
  }

  return bytes
}

function bytesToUuid(bytes: Uint8Array) {
  if (bytes.length !== UUID_BYTE_LENGTH) {
    throw new RangeError("UUID byte array must contain exactly 16 bytes")
  }

  return bytesToHex(bytes).replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/u,
    "$1-$2-$3-$4-$5"
  )
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    ""
  )
}

function wordArrayToBytes(wordArray: { words: number[]; sigBytes: number }) {
  const bytes = new Uint8Array(wordArray.sigBytes)

  for (let index = 0; index < wordArray.sigBytes; index += 1) {
    const word = wordArray.words[index >>> 2]!
    bytes[index] = (word >>> (24 - (index % 4) * 8)) & 0xff
  }

  return bytes
}

export {
  DEFAULT_UUID_V3_NAME,
  DEFAULT_UUID_V3_NAMESPACE,
  UUID_V3_NAMESPACE_PRESETS,
  bytesToUuid,
  generateUuidV3,
  isValidNamespaceUuid,
  normalizeNamespaceUuid,
  resolveNamespacePresetId,
}
export type { UuidV3NamespacePresetId }
