type AesMode = "GCM" | "CBC" | "CTR"
type KeyLengthBits = 128 | 192 | 256
type Pbkdf2Hash = "SHA-256" | "SHA-384" | "SHA-512"
type KeySource = "password" | "raw"

type PlaintextMetadata =
  | Readonly<{ type: "text" }>
  | Readonly<{
      type: "file"
      name: string
      mimeType: string
      size: number
    }>

type AesEncryptOptions = Readonly<{
  plaintext: string | ArrayBuffer | Uint8Array
  mode: AesMode
  keyLengthBits: KeyLengthBits
  keySource: KeySource
  password?: string
  rawKeyHex?: string
  pbkdf2Iterations?: number
  pbkdf2Hash?: Pbkdf2Hash
  metadata?: PlaintextMetadata
  randomBytes?: (length: number) => Uint8Array
}>

type AesKeyEnvelope =
  | Readonly<{
      source: "password"
      derivation: "PBKDF2"
      hash: Pbkdf2Hash
      iterations: number
      lengthBits: KeyLengthBits
      salt: string
    }>
  | Readonly<{
      source: "raw"
      lengthBits: KeyLengthBits
    }>

type AesEncryptedEnvelope = Readonly<{
  version: "inbrowser-aes-v1"
  algorithm: "AES-GCM" | "AES-CBC" | "AES-CTR"
  key: AesKeyEnvelope
  iv: string
  ciphertext: string
  encoding: "base64"
  plaintext: PlaintextMetadata
}>

type AesEncryptResult = Readonly<{
  envelope: AesEncryptedEnvelope
  json: string
}>

type AesDecryptKeyMaterial = Readonly<{
  password?: string
  rawKeyHex?: string
}>

const AES_MODES = ["GCM", "CBC", "CTR"] as const
const KEY_LENGTHS = [128, 192, 256] as const
const PBKDF2_HASHES = ["SHA-256", "SHA-384", "SHA-512"] as const
const DEFAULT_PBKDF2_ITERATIONS = 210000
const MIN_PBKDF2_ITERATIONS = 1000
const MAX_PBKDF2_ITERATIONS = 10000000
const SALT_LENGTH_BYTES = 16
const IV_LENGTH_BYTES: Record<AesMode, number> = {
  GCM: 12,
  CBC: 16,
  CTR: 16,
}

export {
  AES_MODES,
  DEFAULT_PBKDF2_ITERATIONS,
  IV_LENGTH_BYTES,
  KEY_LENGTHS,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  PBKDF2_HASHES,
  SALT_LENGTH_BYTES,
}
export type {
  AesDecryptKeyMaterial,
  AesEncryptedEnvelope,
  AesEncryptOptions,
  AesEncryptResult,
  AesKeyEnvelope,
  AesMode,
  KeyLengthBits,
  KeySource,
  Pbkdf2Hash,
}
