import { scrypt as scryptHash } from "hash-wasm"

import {
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  decodeHex,
  formatDerivedKey,
  isValidBase64,
  isValidHex,
  normalizeBase64Input,
  saltToBytes,
  type DerivedKey,
  type SaltFormat,
} from "./encoding"

type RangeValidation = Readonly<{
  value: number
  isValid: boolean
}>

type CostFactorValidation = RangeValidation &
  Readonly<{
    error: "" | "range" | "power" | "memory"
  }>

type ScryptParams = Readonly<{
  password: string
  salt: string | Blob
  saltFormat: SaltFormat
  costFactor: number
  blockSize: number
  parallelism: number
  lengthBytes: number
}>

type RandomSource = Partial<Pick<Crypto, "randomUUID">> &
  Pick<Crypto, "getRandomValues">

const textEncoder = new TextEncoder()
const SCRYPT_MEMORY_MULTIPLIER = 128
const MAX_SCRYPT_MEMORY_BYTES = 64 * 1024 * 1024
const MAX_SCRYPT_COST_BLOCK_PRODUCT = Math.floor(
  MAX_SCRYPT_MEMORY_BYTES / SCRYPT_MEMORY_MULTIPLIER
)

async function deriveScrypt(params: ScryptParams) {
  const {
    password,
    salt,
    saltFormat,
    costFactor,
    blockSize,
    parallelism,
    lengthBytes,
  } = params

  assertScryptParams({
    costFactor,
    blockSize,
    parallelism,
    lengthBytes,
  })

  const saltBytes = await saltToBytes(salt, saltFormat)
  const derivedBytes = await scryptHash({
    password: textEncoder.encode(password),
    salt: saltBytes,
    costFactor,
    blockSize,
    parallelism,
    hashLength: lengthBytes,
    outputType: "binary",
  })

  return formatDerivedKey(Uint8Array.from(derivedBytes))
}

function generateRandomSalt(
  format: SaltFormat,
  lengthBytes = 16,
  randomSource: RandomSource | null | undefined = globalThis.crypto
) {
  if (!randomSource) {
    throw new Error("Random salt generation requires Web Crypto support.")
  }

  const bytes = new Uint8Array(lengthBytes)
  randomSource.getRandomValues(bytes)

  switch (format) {
    case "hex":
      return bytesToHex(bytes)
    case "base64":
      return bytesToBase64(bytes)
    default:
      return typeof randomSource.randomUUID === "function"
        ? randomSource.randomUUID()
        : bytesToBase64(bytes).replace(/=+$/, "")
  }
}

function parseIntegerRangeInput(
  value: string,
  min: number,
  max: number,
  fallback: number
): RangeValidation {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return { value: fallback, isValid: true }
  }

  if (!/^\d+$/.test(trimmed)) {
    return { value: fallback, isValid: false }
  }

  const parsed = Number.parseInt(trimmed, 10)

  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    return { value: fallback, isValid: false }
  }

  return { value: parsed, isValid: true }
}

function parseCostFactorInput(
  value: string,
  min: number,
  max: number,
  fallback: number,
  blockSize: number
): CostFactorValidation {
  const rangeState = parseIntegerRangeInput(value, min, max, fallback)

  if (!rangeState.isValid) {
    return { ...rangeState, error: "range" }
  }

  if (!isPowerOfTwo(rangeState.value)) {
    return { ...rangeState, isValid: false, error: "power" }
  }

  if (!isScryptMemoryWithinLimit(rangeState.value, blockSize)) {
    return { ...rangeState, isValid: false, error: "memory" }
  }

  return { ...rangeState, error: "" }
}

function isPowerOfTwo(value: number) {
  return Number.isInteger(value) && value > 1 && (value & (value - 1)) === 0
}

function isScryptMemoryWithinLimit(costFactor: number, blockSize: number) {
  if (!Number.isInteger(costFactor) || costFactor <= 0) return false
  if (!Number.isInteger(blockSize) || blockSize <= 0) return false

  return costFactor * blockSize <= MAX_SCRYPT_COST_BLOCK_PRODUCT
}

function estimateScryptMemoryBytes(costFactor: number, blockSize: number) {
  if (!Number.isInteger(costFactor) || !Number.isInteger(blockSize)) {
    return 0
  }

  if (costFactor <= 0 || blockSize <= 0) {
    return 0
  }

  return costFactor * blockSize * SCRYPT_MEMORY_MULTIPLIER
}

function getMaxCostFactorForBlockSize(blockSize: number) {
  if (!Number.isInteger(blockSize) || blockSize <= 0) {
    return 0
  }

  return Math.floor(MAX_SCRYPT_COST_BLOCK_PRODUCT / blockSize)
}

function assertScryptParams({
  costFactor,
  blockSize,
  parallelism,
  lengthBytes,
}: Pick<
  ScryptParams,
  "costFactor" | "blockSize" | "parallelism" | "lengthBytes"
>) {
  if (!isPowerOfTwo(costFactor)) {
    throw new Error("N must be a power of 2.")
  }

  if (
    !Number.isInteger(blockSize) ||
    blockSize <= 0 ||
    !Number.isInteger(parallelism) ||
    parallelism <= 0 ||
    !Number.isInteger(lengthBytes) ||
    lengthBytes <= 0
  ) {
    throw new Error("Invalid scrypt parameters.")
  }

  if (!isScryptMemoryWithinLimit(costFactor, blockSize)) {
    throw new Error("scrypt parameters exceed the browser memory limit.")
  }
}

export {
  MAX_SCRYPT_COST_BLOCK_PRODUCT,
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  decodeHex,
  deriveScrypt,
  estimateScryptMemoryBytes,
  formatDerivedKey,
  generateRandomSalt,
  getMaxCostFactorForBlockSize,
  isPowerOfTwo,
  isScryptMemoryWithinLimit,
  isValidBase64,
  isValidHex,
  normalizeBase64Input,
  parseCostFactorInput,
  parseIntegerRangeInput,
  saltToBytes,
}
export type { CostFactorValidation, DerivedKey, SaltFormat }
