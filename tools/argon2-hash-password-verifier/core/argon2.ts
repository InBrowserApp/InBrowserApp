import { argon2Verify } from "hash-wasm"

type Argon2Variant = "argon2d" | "argon2i" | "argon2id"

type Argon2HashInfo = Readonly<{
  variant: Argon2Variant
  version: number | null
  memoryCost: number
  iterations: number
  parallelism: number
  saltLength: number
  digestLength: number
}>

type Argon2VerifyParams = Readonly<{
  password: string
  hash: string
  secret?: string
}>

type Argon2VerifyResult = Readonly<{
  verified: boolean
  info: Argon2HashInfo
}>

type HashWasmArgon2Verifier = (params: {
  password: string
  hash: string
  secret?: string
}) => Promise<boolean>

const ARGON2_VARIANTS = new Set<Argon2Variant>([
  "argon2d",
  "argon2i",
  "argon2id",
])

class Argon2HashError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "Argon2HashError"
  }
}

async function verifyArgon2Password(
  params: Argon2VerifyParams,
  verifier: HashWasmArgon2Verifier = argon2Verify
): Promise<Argon2VerifyResult> {
  const hash = normalizeEncodedHash(params.hash)
  const info = parseArgon2EncodedHash(hash)

  try {
    const verified = await verifier({
      password: params.password,
      hash,
      secret:
        params.secret && params.secret.length > 0 ? params.secret : undefined,
    })

    return { verified, info }
  } catch {
    throw new Argon2HashError("The provided Argon2 hash could not be verified.")
  }
}

function parseArgon2EncodedHash(hash: string): Argon2HashInfo {
  const normalized = normalizeEncodedHash(hash)
  const parts = normalized.split("$")

  if (parts[0] !== "" || parts.length !== 6) {
    throw new Argon2HashError("Expected an encoded Argon2 PHC hash string.")
  }

  const [, rawVariant, rawVersion, rawParameters, salt, digest] = parts as [
    "",
    string,
    string,
    string,
    string,
    string,
  ]
  const variant = parseVariant(rawVariant)
  const version = parseVersion(rawVersion)
  const parameters = parseParameters(rawParameters)

  if (!salt || !digest) {
    throw new Argon2HashError(
      "The encoded Argon2 hash is missing salt or digest."
    )
  }

  return {
    variant,
    version,
    memoryCost: parameters.memoryCost,
    iterations: parameters.iterations,
    parallelism: parameters.parallelism,
    saltLength: estimateBase64ByteLength(salt),
    digestLength: estimateBase64ByteLength(digest),
  }
}

function normalizeEncodedHash(hash: string) {
  const normalized = hash.trim()

  if (!normalized) {
    throw new Argon2HashError("Enter an encoded Argon2 hash.")
  }

  return normalized
}

function parseVariant(value: string | undefined): Argon2Variant {
  if (!value || !ARGON2_VARIANTS.has(value as Argon2Variant)) {
    throw new Argon2HashError("Unsupported Argon2 variant.")
  }

  return value as Argon2Variant
}

function parseVersion(value: string) {
  if (!value.startsWith("v=")) {
    throw new Argon2HashError("Invalid Argon2 version.")
  }

  const version = Number.parseInt(value.slice(2), 10)

  if (!Number.isSafeInteger(version) || version !== 19) {
    throw new Argon2HashError("Invalid Argon2 version.")
  }

  return version
}

function parseParameters(value: string) {
  const fields = new Map(
    value.split(",").map((field) => {
      const [key, rawValue] = field.split("=")
      return [key, rawValue]
    })
  )
  const memoryCost = parsePositiveInteger(fields.get("m"), "memory cost")
  const iterations = parsePositiveInteger(fields.get("t"), "iteration count")
  const parallelism = parsePositiveInteger(fields.get("p"), "parallelism")

  return { memoryCost, iterations, parallelism }
}

function parsePositiveInteger(value: string | undefined, label: string) {
  if (!value || !/^\d+$/.test(value)) {
    throw new Argon2HashError(`Invalid Argon2 ${label}.`)
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Argon2HashError(`Invalid Argon2 ${label}.`)
  }

  return parsed
}

function estimateBase64ByteLength(value: string) {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0

  return Math.max(0, Math.floor((value.length * 3) / 4) - padding)
}

export {
  Argon2HashError,
  estimateBase64ByteLength,
  parseArgon2EncodedHash,
  verifyArgon2Password,
}
export type { Argon2HashInfo }
