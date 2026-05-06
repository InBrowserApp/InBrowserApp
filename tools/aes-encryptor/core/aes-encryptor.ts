import {
  base64ToBytes,
  bytesToArrayBuffer,
  bytesToBase64,
  bytesToHex,
  hexToBytes,
  normalizeHex,
} from "./encoding"
import { createRandomBytes, getSubtleCrypto } from "./web-crypto"
import {
  AES_MODES,
  DEFAULT_PBKDF2_ITERATIONS,
  IV_LENGTH_BYTES,
  KEY_LENGTHS,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  PBKDF2_HASHES,
  SALT_LENGTH_BYTES,
  type AesDecryptKeyMaterial,
  type AesEncryptedEnvelope,
  type AesEncryptOptions,
  type AesEncryptResult,
  type AesKeyEnvelope,
  type AesMode,
  type KeyLengthBits,
  type Pbkdf2Hash,
} from "./types"

async function encryptAes(
  options: AesEncryptOptions
): Promise<AesEncryptResult> {
  const mode = normalizeMode(options.mode)
  const keyLengthBits = normalizeKeyLength(options.keyLengthBits)
  const plaintext = normalizePlaintext(options.plaintext)
  const iv = createRandomBytes(options.randomBytes, IV_LENGTH_BYTES[mode])
  const key = await createCryptoKey({
    keyLengthBits,
    keySource: options.keySource,
    mode,
    password: options.password,
    rawKeyHex: options.rawKeyHex,
    pbkdf2Hash: options.pbkdf2Hash,
    pbkdf2Iterations: options.pbkdf2Iterations,
    randomBytes: options.randomBytes,
  })
  const ciphertext = await getSubtleCrypto().encrypt(
    createAesParams(mode, iv),
    key.cryptoKey,
    bytesToArrayBuffer(plaintext)
  )
  const envelope: AesEncryptedEnvelope = {
    version: "inbrowser-aes-v1",
    algorithm: `AES-${mode}`,
    key: key.envelope,
    iv: bytesToHex(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    encoding: "base64",
    plaintext: options.metadata ?? { type: "text" },
  }

  return { envelope, json: `${JSON.stringify(envelope, null, 2)}\n` }
}

async function decryptAesEnvelope(
  envelope: AesEncryptedEnvelope,
  keyMaterial: AesDecryptKeyMaterial
) {
  const mode = envelope.algorithm.replace("AES-", "") as AesMode
  const iv = hexToBytes(envelope.iv)
  const key = await createCryptoKey({
    keyLengthBits: envelope.key.lengthBits,
    keySource: envelope.key.source,
    mode,
    password: keyMaterial.password,
    rawKeyHex: keyMaterial.rawKeyHex,
    pbkdf2Hash:
      envelope.key.source === "password" ? envelope.key.hash : undefined,
    pbkdf2Iterations:
      envelope.key.source === "password" ? envelope.key.iterations : undefined,
    salt:
      envelope.key.source === "password"
        ? hexToBytes(envelope.key.salt)
        : undefined,
  })
  const plaintext = await getSubtleCrypto().decrypt(
    createAesParams(mode, iv),
    key.cryptoKey,
    bytesToArrayBuffer(base64ToBytes(envelope.ciphertext))
  )

  return new Uint8Array(plaintext)
}

function validateRawKeyHex(rawKeyHex: string, keyLengthBits: KeyLengthBits) {
  const cleanHex = normalizeHex(rawKeyHex)
  return cleanHex.length === keyLengthBits / 4 && /^[0-9a-f]+$/i.test(cleanHex)
}

function expectedRawKeyHexLength(keyLengthBits: KeyLengthBits) {
  return keyLengthBits / 4
}

async function createCryptoKey(options: {
  mode: AesMode
  keyLengthBits: KeyLengthBits
  keySource: "password" | "raw"
  password?: string
  rawKeyHex?: string
  pbkdf2Iterations?: number
  pbkdf2Hash?: Pbkdf2Hash
  randomBytes?: (length: number) => Uint8Array
  salt?: Uint8Array
}): Promise<Readonly<{ cryptoKey: CryptoKey; envelope: AesKeyEnvelope }>> {
  const algorithmName = getAesAlgorithmName(options.mode)

  if (options.keySource === "raw") {
    return createRawCryptoKey(options, algorithmName)
  }

  return createPasswordCryptoKey(options, algorithmName)
}

async function createRawCryptoKey(
  options: Parameters<typeof createCryptoKey>[0],
  algorithmName: string
) {
  if (
    !options.rawKeyHex ||
    !validateRawKeyHex(options.rawKeyHex, options.keyLengthBits)
  ) {
    throw new Error("Invalid raw AES key")
  }

  return {
    cryptoKey: await getSubtleCrypto().importKey(
      "raw",
      bytesToArrayBuffer(hexToBytes(options.rawKeyHex)),
      { name: algorithmName },
      false,
      ["encrypt", "decrypt"]
    ),
    envelope: { source: "raw", lengthBits: options.keyLengthBits } as const,
  }
}

async function createPasswordCryptoKey(
  options: Parameters<typeof createCryptoKey>[0],
  algorithmName: string
) {
  if (!options.password) {
    throw new Error("Password is required")
  }

  const hash = normalizePbkdf2Hash(options.pbkdf2Hash ?? "SHA-256")
  const iterations = normalizeIterations(
    options.pbkdf2Iterations ?? DEFAULT_PBKDF2_ITERATIONS
  )
  const salt =
    options.salt ?? createRandomBytes(options.randomBytes, SALT_LENGTH_BYTES)
  const passwordKey = await getSubtleCrypto().importKey(
    "raw",
    bytesToArrayBuffer(new TextEncoder().encode(options.password)),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return {
    cryptoKey: await getSubtleCrypto().deriveKey(
      { name: "PBKDF2", salt: bytesToArrayBuffer(salt), iterations, hash },
      passwordKey,
      { name: algorithmName, length: options.keyLengthBits },
      false,
      ["encrypt", "decrypt"]
    ),
    envelope: {
      source: "password",
      derivation: "PBKDF2",
      hash,
      iterations,
      lengthBits: options.keyLengthBits,
      salt: bytesToHex(salt),
    } as const,
  }
}

function normalizePlaintext(
  plaintext: string | ArrayBuffer | Uint8Array
): Uint8Array {
  if (typeof plaintext === "string") {
    return new TextEncoder().encode(plaintext)
  }

  return plaintext instanceof Uint8Array ? plaintext : new Uint8Array(plaintext)
}

function normalizeMode(mode: AesMode): AesMode {
  if (!AES_MODES.includes(mode)) throw new Error("Unsupported AES mode")
  return mode
}

function normalizeKeyLength(keyLengthBits: KeyLengthBits): KeyLengthBits {
  if (!KEY_LENGTHS.includes(keyLengthBits)) {
    throw new Error("Unsupported AES key length")
  }
  return keyLengthBits
}

function normalizePbkdf2Hash(hash: Pbkdf2Hash): Pbkdf2Hash {
  if (!PBKDF2_HASHES.includes(hash)) {
    throw new Error("Unsupported PBKDF2 hash")
  }
  return hash
}

function normalizeIterations(iterations: number) {
  if (
    !Number.isInteger(iterations) ||
    iterations < MIN_PBKDF2_ITERATIONS ||
    iterations > MAX_PBKDF2_ITERATIONS
  ) {
    throw new Error("Invalid PBKDF2 iterations")
  }
  return iterations
}

function createAesParams(
  mode: AesMode,
  iv: Uint8Array
): AesGcmParams | AesCbcParams | AesCtrParams {
  if (mode === "GCM") return { name: "AES-GCM", iv: bytesToArrayBuffer(iv) }
  if (mode === "CBC") return { name: "AES-CBC", iv: bytesToArrayBuffer(iv) }
  return { name: "AES-CTR", counter: bytesToArrayBuffer(iv), length: 64 }
}

function getAesAlgorithmName(mode: AesMode) {
  return `AES-${mode}` as const
}

export {
  DEFAULT_PBKDF2_ITERATIONS,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  decryptAesEnvelope,
  encryptAes,
  expectedRawKeyHexLength,
  validateRawKeyHex,
}
export type {
  AesEncryptedEnvelope,
  AesMode,
  KeyLengthBits,
  KeySource,
  Pbkdf2Hash,
} from "./types"
