import {
  base64ToBytes,
  bytesToArrayBuffer,
  hexToBytes,
  normalizeHex,
} from "./encoding"
import {
  parseAesEnvelope,
  parseEnvelopeAlgorithm,
  validateAesEnvelope,
} from "./envelope"
import { getSubtleCrypto } from "./web-crypto"
import {
  type AesDecryptKeyMaterial,
  type AesDecryptResult,
  type AesEncryptedEnvelope,
  type AesMode,
  type KeyLengthBits,
} from "./types"

async function decryptAesJson(
  input: string,
  keyMaterial: AesDecryptKeyMaterial
): Promise<AesDecryptResult> {
  return decryptAesEnvelope(parseAesEnvelope(input), keyMaterial)
}

async function decryptAesEnvelope(
  envelope: AesEncryptedEnvelope,
  keyMaterial: AesDecryptKeyMaterial
): Promise<AesDecryptResult> {
  const mode = parseEnvelopeAlgorithm(envelope.algorithm)
  const iv = hexToBytes(envelope.iv)
  const ciphertext = base64ToBytes(envelope.ciphertext)
  const key = await createCryptoKey(envelope, mode, keyMaterial)

  try {
    const plaintext = await getSubtleCrypto().decrypt(
      createAesParams(mode, iv),
      key,
      bytesToArrayBuffer(ciphertext)
    )

    return { envelope, plaintext: new Uint8Array(plaintext) }
  } catch {
    throw new Error("AES decryption failed")
  }
}

function validateRawKeyHex(rawKeyHex: string, keyLengthBits: KeyLengthBits) {
  const cleanHex = normalizeHex(rawKeyHex)
  return cleanHex.length === keyLengthBits / 4 && /^[0-9a-f]+$/i.test(cleanHex)
}

function expectedRawKeyHexLength(keyLengthBits: KeyLengthBits) {
  return keyLengthBits / 4
}

function getEnvelopeKeySource(envelope: AesEncryptedEnvelope) {
  return envelope.key.source
}

async function createCryptoKey(
  envelope: AesEncryptedEnvelope,
  mode: AesMode,
  keyMaterial: AesDecryptKeyMaterial
): Promise<CryptoKey> {
  const algorithmName = `AES-${mode}`

  if (envelope.key.source === "raw") {
    if (
      !validateRawKeyHex(keyMaterial.rawKeyHex ?? "", envelope.key.lengthBits)
    ) {
      throw new Error("Invalid raw AES key")
    }

    return getSubtleCrypto().importKey(
      "raw",
      bytesToArrayBuffer(hexToBytes(keyMaterial.rawKeyHex!)),
      { name: algorithmName },
      false,
      ["decrypt"]
    )
  }

  if (!keyMaterial.password) {
    throw new Error("Password is required")
  }

  const passwordKey = await getSubtleCrypto().importKey(
    "raw",
    bytesToArrayBuffer(new TextEncoder().encode(keyMaterial.password)),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return getSubtleCrypto().deriveKey(
    {
      name: "PBKDF2",
      salt: bytesToArrayBuffer(hexToBytes(envelope.key.salt)),
      iterations: envelope.key.iterations,
      hash: envelope.key.hash,
    },
    passwordKey,
    { name: algorithmName, length: envelope.key.lengthBits },
    false,
    ["decrypt"]
  )
}

function createAesParams(
  mode: AesMode,
  iv: Uint8Array
): AesGcmParams | AesCbcParams | AesCtrParams {
  if (mode === "GCM") return { name: "AES-GCM", iv: bytesToArrayBuffer(iv) }
  if (mode === "CBC") return { name: "AES-CBC", iv: bytesToArrayBuffer(iv) }
  return { name: "AES-CTR", counter: bytesToArrayBuffer(iv), length: 64 }
}

export {
  decryptAesEnvelope,
  decryptAesJson,
  expectedRawKeyHexLength,
  getEnvelopeKeySource,
  parseAesEnvelope,
  validateAesEnvelope,
  validateRawKeyHex,
}
export type { AesEncryptedEnvelope, AesMode, KeyLengthBits } from "./types"
