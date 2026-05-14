import type { Argon2Option } from "./types"

const DEFAULT_ALGORITHM = "argon2id"
const DEFAULT_ITERATIONS = "3"
const DEFAULT_MEMORY_SIZE = "65536"
const DEFAULT_PARALLELISM = "1"
const DEFAULT_HASH_LENGTH = "32"

const MIN_ITERATIONS = 1
const MAX_ITERATIONS = 12
const MIN_MEMORY_SIZE = 8
const MAX_MEMORY_SIZE = 262144
const MIN_PARALLELISM = 1
const MAX_PARALLELISM = 16
const MIN_HASH_LENGTH = 4
const MAX_HASH_LENGTH = 64

const ARGON2_OPTIONS = [
  { value: "argon2id", label: "Argon2id" },
  { value: "argon2i", label: "Argon2i" },
  { value: "argon2d", label: "Argon2d" },
] as const satisfies readonly Argon2Option[]

const STORAGE_KEYS = {
  algorithm: "tools:argon2-hash-password:algorithm",
  iterations: "tools:argon2-hash-password:iterations",
  memorySize: "tools:argon2-hash-password:memory-size",
  parallelism: "tools:argon2-hash-password:parallelism",
  hashLength: "tools:argon2-hash-password:hash-length",
} as const

export {
  ARGON2_OPTIONS,
  DEFAULT_ALGORITHM,
  DEFAULT_HASH_LENGTH,
  DEFAULT_ITERATIONS,
  DEFAULT_MEMORY_SIZE,
  DEFAULT_PARALLELISM,
  MAX_HASH_LENGTH,
  MAX_ITERATIONS,
  MAX_MEMORY_SIZE,
  MAX_PARALLELISM,
  MIN_HASH_LENGTH,
  MIN_ITERATIONS,
  MIN_MEMORY_SIZE,
  MIN_PARALLELISM,
  STORAGE_KEYS,
}
