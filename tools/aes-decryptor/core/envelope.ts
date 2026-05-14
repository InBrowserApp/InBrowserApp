import { base64ToBytes, hexToBytes, normalizeHex } from "./encoding"
import {
  AES_MODES,
  IV_LENGTH_BYTES,
  KEY_LENGTHS,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  PBKDF2_HASHES,
  SALT_LENGTH_BYTES,
  type AesEncryptedEnvelope,
  type AesMode,
  type KeyLengthBits,
  type Pbkdf2Hash,
} from "./types"

function parseAesEnvelope(input: string): AesEncryptedEnvelope {
  let value: unknown

  try {
    value = JSON.parse(input)
  } catch {
    throw new Error("Invalid AES JSON envelope")
  }

  return validateAesEnvelope(value)
}

function validateAesEnvelope(value: unknown): AesEncryptedEnvelope {
  if (!isRecord(value)) throw new Error("Invalid AES JSON envelope")

  if (value.version !== "inbrowser-aes-v1") {
    throw new Error("Unsupported AES envelope version")
  }

  const mode = parseEnvelopeAlgorithm(value.algorithm)

  return {
    version: "inbrowser-aes-v1",
    algorithm: `AES-${mode}`,
    key: validateKeyEnvelope(value.key),
    iv: validateHexField(value.iv, "IV", IV_LENGTH_BYTES[mode]),
    ciphertext: validateBase64Field(value.ciphertext, "Ciphertext"),
    encoding: validateEncoding(value.encoding),
    plaintext: validatePlaintextMetadata(value.plaintext),
  }
}

function validateKeyEnvelope(value: unknown): AesEncryptedEnvelope["key"] {
  if (!isRecord(value)) throw new Error("Invalid AES key envelope")

  const lengthBits = validateKeyLength(value.lengthBits)

  if (value.source === "raw") return { source: "raw", lengthBits }

  if (value.source !== "password") throw new Error("Invalid AES key source")
  if (value.derivation !== "PBKDF2") {
    throw new Error("Unsupported key derivation")
  }

  return {
    source: "password",
    derivation: "PBKDF2",
    hash: validatePbkdf2Hash(value.hash),
    iterations: validateIterations(value.iterations),
    lengthBits,
    salt: validateHexField(value.salt, "Salt", SALT_LENGTH_BYTES),
  }
}

function validatePlaintextMetadata(
  value: unknown
): AesEncryptedEnvelope["plaintext"] {
  if (!isRecord(value)) return { type: "text" }
  if (value.type === "text") return { type: "text" }

  const size = value.size
  if (
    value.type === "file" &&
    typeof value.name === "string" &&
    typeof value.mimeType === "string" &&
    typeof size === "number" &&
    Number.isInteger(size) &&
    size >= 0
  ) {
    return {
      type: "file",
      name: value.name,
      mimeType: value.mimeType,
      size,
    }
  }

  throw new Error("Invalid plaintext metadata")
}

function parseEnvelopeAlgorithm(value: unknown): AesMode {
  if (typeof value !== "string" || !value.startsWith("AES-")) {
    throw new Error("Unsupported AES algorithm")
  }

  const mode = value.slice(4)
  if (!AES_MODES.includes(mode as AesMode)) {
    throw new Error("Unsupported AES algorithm")
  }

  return mode as AesMode
}

function validateEncoding(value: unknown) {
  if (value !== "base64") throw new Error("Unsupported ciphertext encoding")
  return "base64" as const
}

function validateKeyLength(value: unknown): KeyLengthBits {
  if (!KEY_LENGTHS.includes(value as KeyLengthBits)) {
    throw new Error("Unsupported AES key length")
  }

  return value as KeyLengthBits
}

function validatePbkdf2Hash(value: unknown): Pbkdf2Hash {
  if (!PBKDF2_HASHES.includes(value as Pbkdf2Hash)) {
    throw new Error("Unsupported PBKDF2 hash")
  }

  return value as Pbkdf2Hash
}

function validateIterations(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < MIN_PBKDF2_ITERATIONS ||
    value > MAX_PBKDF2_ITERATIONS
  ) {
    throw new Error("Invalid PBKDF2 iterations")
  }

  return value
}

function validateHexField(value: unknown, label: string, byteLength: number) {
  if (typeof value !== "string") throw new Error(`Invalid ${label}`)

  const normalized = normalizeHex(value)
  if (normalized.length !== byteLength * 2) {
    throw new Error(`Invalid ${label}`)
  }

  hexToBytes(normalized)
  return normalized
}

function validateBase64Field(value: unknown, label: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid ${label}`)
  }

  try {
    base64ToBytes(value)
  } catch {
    throw new Error(`Invalid ${label}`)
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export { parseAesEnvelope, parseEnvelopeAlgorithm, validateAesEnvelope }
