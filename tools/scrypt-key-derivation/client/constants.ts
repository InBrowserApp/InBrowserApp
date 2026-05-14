import type { SaltFormat } from "../core/scrypt"

const DEFAULT_SALT_FORMAT = "utf-8" satisfies SaltFormat
const DEFAULT_COST_FACTOR = "16384"
const DEFAULT_BLOCK_SIZE = "8"
const DEFAULT_PARALLELISM = "1"
const DEFAULT_LENGTH = "32"

const MIN_COST_FACTOR = 2
const MAX_COST_FACTOR = 524_288
const MIN_BLOCK_SIZE = 1
const MAX_BLOCK_SIZE = 64
const MIN_PARALLELISM = 1
const MAX_PARALLELISM = 32
const MIN_LENGTH = 16
const MAX_LENGTH = 256

const STORAGE_KEYS = {
  saltFormat: "tools:scrypt-key-derivation:salt-format",
  costFactor: "tools:scrypt-key-derivation:cost-factor",
  blockSize: "tools:scrypt-key-derivation:block-size",
  parallelism: "tools:scrypt-key-derivation:parallelism",
  length: "tools:scrypt-key-derivation:length",
} as const

const SALT_FORMAT_OPTIONS = [
  { label: "UTF-8", value: "utf-8" },
  { label: "Hex", value: "hex" },
  { label: "Base64", value: "base64" },
] as const satisfies ReadonlyArray<{
  label: string
  value: SaltFormat
}>

export {
  DEFAULT_BLOCK_SIZE,
  DEFAULT_COST_FACTOR,
  DEFAULT_LENGTH,
  DEFAULT_PARALLELISM,
  DEFAULT_SALT_FORMAT,
  MAX_BLOCK_SIZE,
  MAX_COST_FACTOR,
  MAX_LENGTH,
  MAX_PARALLELISM,
  MIN_BLOCK_SIZE,
  MIN_COST_FACTOR,
  MIN_LENGTH,
  MIN_PARALLELISM,
  SALT_FORMAT_OPTIONS,
  STORAGE_KEYS,
}
