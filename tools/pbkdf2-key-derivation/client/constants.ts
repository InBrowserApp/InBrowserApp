import type { Pbkdf2Algorithm, SaltFormat } from "../core/pbkdf2"

const DEFAULT_ALGORITHM = "SHA-256" satisfies Pbkdf2Algorithm
const DEFAULT_SALT_FORMAT = "utf-8" satisfies SaltFormat
const DEFAULT_ITERATIONS = "100000"
const DEFAULT_LENGTH = "32"

const MIN_ITERATIONS = 1
const MAX_ITERATIONS = 1_000_000
const MIN_LENGTH = 16
const MAX_LENGTH = 256

const STORAGE_KEYS = {
  algorithm: "tools:pbkdf2-key-derivation:algorithm",
  saltFormat: "tools:pbkdf2-key-derivation:salt-format",
  iterations: "tools:pbkdf2-key-derivation:iterations",
  length: "tools:pbkdf2-key-derivation:length",
} as const

const PBKDF2_ALGORITHM_OPTIONS = [
  { label: "SHA-1", value: "SHA-1" },
  { label: "SHA-256", value: "SHA-256" },
  { label: "SHA-384", value: "SHA-384" },
  { label: "SHA-512", value: "SHA-512" },
] as const satisfies ReadonlyArray<{
  label: string
  value: Pbkdf2Algorithm
}>

const SALT_FORMAT_OPTIONS = [
  { label: "UTF-8", value: "utf-8" },
  { label: "Hex", value: "hex" },
  { label: "Base64", value: "base64" },
] as const satisfies ReadonlyArray<{
  label: string
  value: SaltFormat
}>

export {
  DEFAULT_ALGORITHM,
  DEFAULT_ITERATIONS,
  DEFAULT_LENGTH,
  DEFAULT_SALT_FORMAT,
  MAX_ITERATIONS,
  MAX_LENGTH,
  MIN_ITERATIONS,
  MIN_LENGTH,
  PBKDF2_ALGORITHM_OPTIONS,
  SALT_FORMAT_OPTIONS,
  STORAGE_KEYS,
}
