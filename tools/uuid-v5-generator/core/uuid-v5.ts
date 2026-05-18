const CANONICAL_UUID_PATTERN =
  /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/u
const COMPACT_UUID_PATTERN = /^[0-9a-f]{32}$/u
const UUID_HEX_PAIR_PATTERN = /[0-9a-f]{2}/gu
const UUID_BYTE_LENGTH = 16

const DEFAULT_UUID_V5_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
const UUID_V5_DEFAULT_NAME = "example.com"

const UUID_V5_NAMESPACE_PRESETS = [
  {
    id: "dns",
    value: DEFAULT_UUID_V5_NAMESPACE,
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

type UuidV5NamespacePreset = (typeof UUID_V5_NAMESPACE_PRESETS)[number]
type UuidV5NamespacePresetId = UuidV5NamespacePreset["id"]

type GenerateUuidV5Result =
  | Readonly<{
      ok: true
      uuid: string
    }>
  | Readonly<{
      ok: false
      code: "invalid-namespace"
    }>

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

function stripUuidWrappers(value: string): string {
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

function isValidNamespaceUuid(value: string): boolean {
  return normalizeNamespaceUuid(value) !== null
}

function parseUuidBytes(value: string): Uint8Array | null {
  const normalized = normalizeNamespaceUuid(value)

  if (!normalized) {
    return null
  }

  const pairs = [
    ...normalized.replaceAll("-", "").matchAll(UUID_HEX_PAIR_PATTERN),
  ]

  return Uint8Array.from(pairs, (pair) => Number.parseInt(pair[0]!, 16))
}

function formatUuidBytes(bytes: Uint8Array): string {
  if (bytes.length !== UUID_BYTE_LENGTH) {
    throw new TypeError("UUID byte arrays must contain 16 bytes.")
  }

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-")
}

function resolveNamespacePresetId(
  namespace: string
): UuidV5NamespacePresetId | null {
  const normalized = normalizeNamespaceUuid(namespace)

  return (
    UUID_V5_NAMESPACE_PRESETS.find((preset) => preset.value === normalized)
      ?.id ?? null
  )
}

async function sha1(bytes: Uint8Array): Promise<Uint8Array> {
  const input = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(input).set(bytes)

  const digest = await globalThis.crypto.subtle.digest("SHA-1", input)

  return new Uint8Array(digest)
}

async function generateUuidV5(
  namespace: string,
  name: string
): Promise<GenerateUuidV5Result> {
  const namespaceBytes = parseUuidBytes(namespace)

  if (!namespaceBytes) {
    return {
      ok: false,
      code: "invalid-namespace",
    }
  }

  const nameBytes = new TextEncoder().encode(name)
  const hashInput = new Uint8Array(namespaceBytes.length + nameBytes.length)
  hashInput.set(namespaceBytes)
  hashInput.set(nameBytes, namespaceBytes.length)

  const uuidBytes = (await sha1(hashInput)).slice(0, UUID_BYTE_LENGTH)
  uuidBytes[6] = (uuidBytes[6]! & 0x0f) | 0x50
  uuidBytes[8] = (uuidBytes[8]! & 0x3f) | 0x80

  return {
    ok: true,
    uuid: formatUuidBytes(uuidBytes),
  }
}

export {
  DEFAULT_UUID_V5_NAMESPACE,
  UUID_V5_NAMESPACE_PRESETS,
  UUID_V5_DEFAULT_NAME,
  formatUuidBytes,
  generateUuidV5,
  isValidNamespaceUuid,
  normalizeNamespaceUuid,
  parseUuidBytes,
  resolveNamespacePresetId,
}
export type { UuidV5NamespacePresetId }
