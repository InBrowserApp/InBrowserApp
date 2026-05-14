import { afterEach, describe, expect, it, vi } from "vitest"

import {
  decryptAesEnvelope,
  decryptAesJson,
  expectedRawKeyHexLength,
  getEnvelopeKeySource,
  parseAesEnvelope,
  validateAesEnvelope,
  validateRawKeyHex,
  type AesEncryptedEnvelope,
  type AesMode,
  type KeyLengthBits,
} from "./aes-decryptor"
import { getCrypto, getSubtleCrypto } from "./web-crypto"

const PASSWORD = "correct horse battery staple"
const RAW_128_KEY = "00112233445566778899aabbccddeeff"

describe("AES envelope decryption", () => {
  it("decrypts a password-derived AES-GCM JSON envelope", async () => {
    const envelope = await createPasswordEnvelope({
      plaintext: new TextEncoder().encode("secret message"),
      mode: "GCM",
      keyLengthBits: 256,
      password: PASSWORD,
      salt: bytes(16, 1),
      iv: bytes(12, 17),
    })

    const result = await decryptAesJson(JSON.stringify(envelope), {
      password: PASSWORD,
    })

    expect(new TextDecoder().decode(result.plaintext)).toBe("secret message")
    expect(result.envelope.key).toMatchObject({
      source: "password",
      hash: "SHA-256",
      iterations: 1000,
    })
    expect(getEnvelopeKeySource(result.envelope)).toBe("password")
  })

  it("decrypts a raw-key AES-CBC file envelope", async () => {
    const plaintext = Uint8Array.from([1, 2, 3, 4, 5])
    const envelope = await createRawEnvelope({
      plaintext,
      mode: "CBC",
      keyLengthBits: 128,
      rawKeyHex: RAW_128_KEY,
      iv: bytes(16, 3),
      metadata: {
        type: "file",
        name: "sample.bin",
        mimeType: "application/octet-stream",
        size: plaintext.byteLength,
      },
    })

    const result = await decryptAesEnvelope(envelope, {
      rawKeyHex: RAW_128_KEY,
    })

    expect(Array.from(result.plaintext)).toEqual([1, 2, 3, 4, 5])
    expect(result.envelope.plaintext).toEqual({
      type: "file",
      name: "sample.bin",
      mimeType: "application/octet-stream",
      size: 5,
    })
    expect(getEnvelopeKeySource(result.envelope)).toBe("raw")
  })

  it("decrypts an AES-CTR envelope", async () => {
    const envelope = await createRawEnvelope({
      plaintext: new TextEncoder().encode("counter mode"),
      mode: "CTR",
      keyLengthBits: 192,
      rawKeyHex: "00".repeat(24),
      iv: bytes(16, 9),
    })

    const result = await decryptAesEnvelope(envelope, {
      rawKeyHex: "00".repeat(24),
    })

    expect(new TextDecoder().decode(result.plaintext)).toBe("counter mode")
  })

  it("rejects missing or invalid key material", async () => {
    const passwordEnvelope = await createPasswordEnvelope({
      plaintext: new TextEncoder().encode("secret"),
      mode: "GCM",
      keyLengthBits: 128,
      password: PASSWORD,
      salt: bytes(16, 1),
      iv: bytes(12, 2),
    })

    await expect(decryptAesEnvelope(passwordEnvelope, {})).rejects.toThrow(
      "Password is required"
    )
    await expect(
      decryptAesEnvelope(passwordEnvelope, { password: "wrong" })
    ).rejects.toThrow("AES decryption failed")

    const rawEnvelope = await createRawEnvelope({
      plaintext: new TextEncoder().encode("secret"),
      mode: "GCM",
      keyLengthBits: 128,
      rawKeyHex: RAW_128_KEY,
      iv: bytes(12, 2),
    })

    await expect(decryptAesEnvelope(rawEnvelope, {})).rejects.toThrow(
      "Invalid raw AES key"
    )
    await expect(
      decryptAesEnvelope(rawEnvelope, { rawKeyHex: "abcd" })
    ).rejects.toThrow("Invalid raw AES key")
  })
})

describe("AES envelope validation", () => {
  it("normalizes valid envelope fields", () => {
    const envelope = validateAesEnvelope({
      version: "inbrowser-aes-v1",
      algorithm: "AES-GCM",
      key: {
        source: "password",
        derivation: "PBKDF2",
        hash: "SHA-384",
        iterations: 2000,
        lengthBits: 192,
        salt: "00:11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff",
      },
      iv: "01 02 03 04 05 06 07 08 09 0a 0b 0c",
      ciphertext: "AA==",
      encoding: "base64",
    })

    expect(envelope.key).toMatchObject({
      source: "password",
      hash: "SHA-384",
      salt: "00112233445566778899aabbccddeeff",
    })
    expect(envelope.iv).toBe("0102030405060708090a0b0c")
    expect(envelope.plaintext).toEqual({ type: "text" })
  })

  it("normalizes file plaintext metadata", () => {
    const envelope = validateAesEnvelope({
      ...createMinimalEnvelope(),
      plaintext: {
        type: "file",
        name: "payload.txt",
        mimeType: "text/plain",
        size: 12,
      },
    })

    expect(envelope.plaintext).toEqual({
      type: "file",
      name: "payload.txt",
      mimeType: "text/plain",
      size: 12,
    })
  })

  it("rejects malformed envelope structure", () => {
    expect(() => parseAesEnvelope("{")).toThrow("Invalid AES JSON envelope")
    expect(() => validateAesEnvelope([])).toThrow("Invalid AES JSON envelope")
    expect(() => validateAesEnvelope({ version: "other" })).toThrow(
      "Unsupported AES envelope version"
    )
    expect(() =>
      validateAesEnvelope({ version: "inbrowser-aes-v1", algorithm: "DES" })
    ).toThrow("Unsupported AES algorithm")
    expect(() =>
      validateAesEnvelope({ version: "inbrowser-aes-v1", algorithm: "AES-ECB" })
    ).toThrow("Unsupported AES algorithm")
  })

  it("rejects malformed key envelopes", () => {
    const base = createMinimalEnvelope()

    expect(() => validateAesEnvelope({ ...base, key: null })).toThrow(
      "Invalid AES key envelope"
    )
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: { source: "secret", lengthBits: 128 },
      })
    ).toThrow("Invalid AES key source")
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: { source: "raw", lengthBits: 512 },
      })
    ).toThrow("Unsupported AES key length")
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: {
          source: "password",
          derivation: "scrypt",
          hash: "SHA-256",
          iterations: 1000,
          lengthBits: 128,
          salt: "00".repeat(16),
        },
      })
    ).toThrow("Unsupported key derivation")
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: {
          source: "password",
          derivation: "PBKDF2",
          hash: "SHA-1",
          iterations: 1000,
          lengthBits: 128,
          salt: "00".repeat(16),
        },
      })
    ).toThrow("Unsupported PBKDF2 hash")
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: {
          source: "password",
          derivation: "PBKDF2",
          hash: "SHA-256",
          iterations: 999,
          lengthBits: 128,
          salt: "00".repeat(16),
        },
      })
    ).toThrow("Invalid PBKDF2 iterations")
    expect(() =>
      validateAesEnvelope({
        ...base,
        key: {
          source: "password",
          derivation: "PBKDF2",
          hash: "SHA-256",
          iterations: 10000001,
          lengthBits: 128,
          salt: "00".repeat(16),
        },
      })
    ).toThrow("Invalid PBKDF2 iterations")
  })

  it("rejects malformed payload fields", () => {
    const base = createMinimalEnvelope()

    expect(() => validateAesEnvelope({ ...base, encoding: "hex" })).toThrow(
      "Unsupported ciphertext encoding"
    )
    expect(() => validateAesEnvelope({ ...base, iv: null })).toThrow(
      "Invalid IV"
    )
    expect(() => validateAesEnvelope({ ...base, iv: "abcd" })).toThrow(
      "Invalid IV"
    )
    expect(() => validateAesEnvelope({ ...base, iv: "zz".repeat(12) })).toThrow(
      "Invalid hex string"
    )
    expect(() => validateAesEnvelope({ ...base, ciphertext: "" })).toThrow(
      "Invalid Ciphertext"
    )
    expect(() =>
      validateAesEnvelope({ ...base, ciphertext: "not valid base64!" })
    ).toThrow("Invalid Ciphertext")
    expect(() =>
      validateAesEnvelope({
        ...base,
        plaintext: { type: "file", name: "bad", mimeType: "text/plain" },
      })
    ).toThrow("Invalid plaintext metadata")
  })
})

describe("raw key helpers", () => {
  it("validates exact-length hexadecimal raw keys", () => {
    expect(expectedRawKeyHexLength(128)).toBe(32)
    expect(expectedRawKeyHexLength(192)).toBe(48)
    expect(expectedRawKeyHexLength(256)).toBe(64)
    expect(validateRawKeyHex("00112233445566778899aabbccddeeff", 128)).toBe(
      true
    )
    expect(validateRawKeyHex("00".repeat(31), 256)).toBe(false)
    expect(validateRawKeyHex("zz".repeat(32), 256)).toBe(false)
  })
})

describe("web crypto helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("reports missing Web Crypto APIs", () => {
    vi.stubGlobal("crypto", undefined)
    expect(() => getCrypto()).toThrow("Web Crypto is not available")

    vi.stubGlobal("crypto", {})
    expect(() => getSubtleCrypto()).toThrow(
      "Web Crypto subtle API is not available"
    )
  })
})

async function createPasswordEnvelope(options: {
  plaintext: Uint8Array
  mode: AesMode
  keyLengthBits: KeyLengthBits
  password: string
  salt: Uint8Array
  iv: Uint8Array
}): Promise<AesEncryptedEnvelope> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(options.password),
    "PBKDF2",
    false,
    ["deriveKey"]
  )
  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(options.salt),
      iterations: 1000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: `AES-${options.mode}`, length: options.keyLengthBits },
    false,
    ["encrypt"]
  )
  const ciphertext = await crypto.subtle.encrypt(
    createAesParams(options.mode, options.iv),
    cryptoKey,
    toArrayBuffer(options.plaintext)
  )

  return {
    version: "inbrowser-aes-v1",
    algorithm: `AES-${options.mode}`,
    key: {
      source: "password",
      derivation: "PBKDF2",
      hash: "SHA-256",
      iterations: 1000,
      lengthBits: options.keyLengthBits,
      salt: toHex(options.salt),
    },
    iv: toHex(options.iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    encoding: "base64",
    plaintext: { type: "text" },
  }
}

async function createRawEnvelope(options: {
  plaintext: Uint8Array
  mode: AesMode
  keyLengthBits: KeyLengthBits
  rawKeyHex: string
  iv: Uint8Array
  metadata?: AesEncryptedEnvelope["plaintext"]
}): Promise<AesEncryptedEnvelope> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(fromHex(options.rawKeyHex)),
    { name: `AES-${options.mode}` },
    false,
    ["encrypt"]
  )
  const ciphertext = await crypto.subtle.encrypt(
    createAesParams(options.mode, options.iv),
    cryptoKey,
    toArrayBuffer(options.plaintext)
  )

  return {
    version: "inbrowser-aes-v1",
    algorithm: `AES-${options.mode}`,
    key: { source: "raw", lengthBits: options.keyLengthBits },
    iv: toHex(options.iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    encoding: "base64",
    plaintext: options.metadata ?? { type: "text" },
  }
}

function createMinimalEnvelope() {
  return {
    version: "inbrowser-aes-v1",
    algorithm: "AES-GCM",
    key: { source: "raw", lengthBits: 128 },
    iv: "00".repeat(12),
    ciphertext: "AA==",
    encoding: "base64",
    plaintext: { type: "text" },
  }
}

function createAesParams(
  mode: AesMode,
  iv: Uint8Array
): AesGcmParams | AesCbcParams | AesCtrParams {
  if (mode === "GCM") return { name: "AES-GCM", iv: toArrayBuffer(iv) }
  if (mode === "CBC") return { name: "AES-CBC", iv: toArrayBuffer(iv) }
  return { name: "AES-CTR", counter: toArrayBuffer(iv), length: 64 }
}

function bytes(length: number, start: number) {
  return Uint8Array.from({ length }, (_, index) => start + index)
}

function toArrayBuffer(bytesValue: Uint8Array) {
  return bytesValue.buffer.slice(
    bytesValue.byteOffset,
    bytesValue.byteOffset + bytesValue.byteLength
  ) as ArrayBuffer
}

function toHex(bytesValue: Uint8Array) {
  return Array.from(bytesValue, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
}

function fromHex(hex: string) {
  const bytesValue = new Uint8Array(hex.length / 2)
  for (let index = 0; index < hex.length; index += 2) {
    bytesValue[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16)
  }
  return bytesValue
}

function toBase64(bytesValue: Uint8Array) {
  let binary = ""
  for (const byte of bytesValue) binary += String.fromCharCode(byte)
  return btoa(binary)
}
