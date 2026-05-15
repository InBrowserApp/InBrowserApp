type Argon2Algorithm = "argon2id" | "argon2i" | "argon2d"

type RangeValidation = Readonly<{
  value: number
  isValid: boolean
}>

type SaltValidation = "" | "base64" | "tooShort"

type Argon2HashParams = Readonly<{
  algorithm: Argon2Algorithm
  password: string
  salt: string
  secret?: string
  iterations: number
  memorySize: number
  parallelism: number
  hashLength: number
}>

type Argon2HashOptions = Readonly<{
  password: string
  salt: Uint8Array
  secret?: string
  iterations: number
  memorySize: number
  parallelism: number
  hashLength: number
  outputType: "encoded"
}>

type Argon2Implementation = (options: Argon2HashOptions) => Promise<string>

type Argon2Implementations = Readonly<
  Record<Argon2Algorithm, Argon2Implementation>
>

type RandomSource = Pick<Crypto, "getRandomValues">

const MIN_SALT_BYTES = 8
const DEFAULT_RANDOM_SALT_BYTES = 16
const MAX_ARGON2_MEMORY_SIZE = 262144

async function generateArgon2Hash(
  params: Argon2HashParams,
  implementations?: Argon2Implementations
) {
  assertArgon2Params(params)

  const saltBytes = decodeBase64(params.salt)
  const nextImplementations = implementations ?? (await loadHashWasmArgon2())
  const hash = selectArgon2Implementation(params.algorithm, nextImplementations)

  return hash({
    password: params.password,
    salt: saltBytes,
    secret: params.secret?.trim() ? params.secret : undefined,
    iterations: params.iterations,
    memorySize: params.memorySize,
    parallelism: params.parallelism,
    hashLength: params.hashLength,
    outputType: "encoded",
  })
}

async function loadHashWasmArgon2(): Promise<Argon2Implementations> {
  const { argon2d, argon2i, argon2id } = await import("hash-wasm")

  return {
    argon2d,
    argon2i,
    argon2id,
  }
}

function selectArgon2Implementation(
  algorithm: Argon2Algorithm,
  implementations: Argon2Implementations
) {
  switch (algorithm) {
    case "argon2i":
      return implementations.argon2i
    case "argon2d":
      return implementations.argon2d
    default:
      return implementations.argon2id
  }
}

function assertArgon2Params(params: Argon2HashParams) {
  if (!params.password) {
    throw new Error("Password is required.")
  }

  const saltBytes = decodeBase64(params.salt)

  if (saltBytes.length < MIN_SALT_BYTES) {
    throw new Error("Salt must decode to at least 8 bytes.")
  }

  if (
    !isPositiveInteger(params.iterations) ||
    !isPositiveInteger(params.memorySize) ||
    !isPositiveInteger(params.parallelism) ||
    !isPositiveInteger(params.hashLength)
  ) {
    throw new Error("Argon2 parameters must be positive whole numbers.")
  }

  if (params.hashLength < 4) {
    throw new Error("Hash length must be at least 4 bytes.")
  }

  if (params.memorySize < params.parallelism * 8) {
    throw new Error("Memory size must be at least 8 KiB per lane.")
  }

  if (params.memorySize > MAX_ARGON2_MEMORY_SIZE) {
    throw new Error("Memory size exceeds the browser limit.")
  }
}

function isPositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0
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

function validateBase64Salt(value: string): SaltValidation {
  try {
    const bytes = decodeBase64(value)
    return bytes.length >= MIN_SALT_BYTES ? "" : "tooShort"
  } catch {
    return "base64"
  }
}

function normalizeBase64Input(value: string) {
  return value.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
}

function decodeBase64(value: string) {
  const normalized = normalizeBase64Input(value)

  if (!normalized) {
    return new Uint8Array()
  }

  const remainder = normalized.length % 4

  if (remainder === 1) {
    throw new Error("Invalid base64 length.")
  }

  const padded = normalized + "=".repeat((4 - remainder) % 4)

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(padded)) {
    throw new Error("Invalid base64 input.")
  }

  let binary = ""

  try {
    binary = atob(padded)
  } catch {
    throw new Error("Invalid base64 input.")
  }

  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

function generateRandomSalt(
  lengthBytes = DEFAULT_RANDOM_SALT_BYTES,
  randomSource: RandomSource | null | undefined = globalThis.crypto
) {
  if (!randomSource) {
    throw new Error("Random salt generation requires Web Crypto support.")
  }

  const finalLength = Math.max(MIN_SALT_BYTES, Math.floor(lengthBytes))
  const bytes = new Uint8Array(finalLength)
  randomSource.getRandomValues(bytes)
  return bytesToBase64(bytes)
}

function formatMemorySize(kib: number) {
  if (!Number.isFinite(kib) || kib <= 0) {
    return "0 KiB"
  }

  if (kib < 1024) {
    return `${formatNumber(kib)} KiB`
  }

  const mib = kib / 1024

  if (mib < 1024) {
    return `${formatNumber(mib)} MiB`
  }

  return `${formatNumber(mib / 1024)} GiB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export {
  MAX_ARGON2_MEMORY_SIZE,
  MIN_SALT_BYTES,
  assertArgon2Params,
  bytesToBase64,
  decodeBase64,
  formatMemorySize,
  generateArgon2Hash,
  generateRandomSalt,
  normalizeBase64Input,
  parseIntegerRangeInput,
  selectArgon2Implementation,
  validateBase64Salt,
}
export type { Argon2Algorithm, Argon2Implementations, SaltValidation }
