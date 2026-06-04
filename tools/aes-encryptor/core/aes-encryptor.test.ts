import { afterEach, describe, expect, it, vi } from "vitest"

import {
  decryptAesEnvelope,
  encryptAes,
  expectedRawKeyHexLength,
  validateRawKeyHex,
  type AesEncryptedEnvelope,
} from "./aes-encryptor"
import { createRandomBytes, getCrypto, getSubtleCrypto } from "./web-crypto"

const FIXED_BYTES = Array.from({ length: 64 }, (_, index) => index + 1)

function createDeterministicRandom() {
  let offset = 0

  return (length: number) => {
    const bytes = Uint8Array.from(FIXED_BYTES.slice(offset, offset + length))
    offset += length
    return bytes
  }
}

describe("encryptAes", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("encrypts text with a password-derived AES-GCM key", async () => {
    const result = await encryptAes({
      plaintext: "secret message",
      mode: "GCM",
      keyLengthBits: 256,
      keySource: "password",
      password: "correct horse battery staple",
      pbkdf2Iterations: 1000,
      pbkdf2Hash: "SHA-256",
      randomBytes: createDeterministicRandom(),
    })

    expect(result.envelope).toMatchObject({
      version: "inbrowser-aes-v1",
      algorithm: "AES-GCM",
      encoding: "base64",
      iv: "0102030405060708090a0b0c",
      key: {
        source: "password",
        derivation: "PBKDF2",
        hash: "SHA-256",
        iterations: 1000,
        lengthBits: 256,
        salt: "0d0e0f101112131415161718191a1b1c",
      },
      plaintext: { type: "text" },
    })
    expect(result.json).toContain('"algorithm": "AES-GCM"')
    expect(result.json).not.toContain("correct horse")

    const decrypted = await decryptAesEnvelope(result.envelope, {
      password: "correct horse battery staple",
    })

    expect(new TextDecoder().decode(decrypted)).toBe("secret message")
  })

  it("uses default PBKDF2 options when they are omitted", async () => {
    const result = await encryptAes({
      plaintext: "default settings",
      mode: "GCM",
      keyLengthBits: 128,
      keySource: "password",
      password: "secret",
      randomBytes: createDeterministicRandom(),
    })

    expect(result.envelope.key).toMatchObject({
      source: "password",
      hash: "SHA-256",
      iterations: 210000,
    })
  })

  it("encrypts binary file data with a raw AES-CBC key", async () => {
    const plaintext = Uint8Array.from([1, 2, 3, 4, 5])
    const result = await encryptAes({
      plaintext,
      mode: "CBC",
      keyLengthBits: 128,
      keySource: "raw",
      rawKeyHex: "00112233445566778899aabbccddeeff",
      metadata: {
        type: "file",
        name: "sample.bin",
        mimeType: "application/octet-stream",
        size: plaintext.byteLength,
      },
      randomBytes: createDeterministicRandom(),
    })

    expect(result.envelope.key).toEqual({
      source: "raw",
      lengthBits: 128,
    })
    expect(result.envelope.plaintext).toEqual({
      type: "file",
      name: "sample.bin",
      mimeType: "application/octet-stream",
      size: 5,
    })

    const decrypted = await decryptAesEnvelope(result.envelope, {
      rawKeyHex: "00112233445566778899aabbccddeeff",
    })

    expect(Array.from(decrypted)).toEqual([1, 2, 3, 4, 5])
  })

  it("encrypts ArrayBuffer plaintext with AES-CTR", async () => {
    const plaintext = new TextEncoder().encode("counter mode").buffer
    const result = await encryptAes({
      plaintext,
      mode: "CTR",
      keyLengthBits: 192,
      keySource: "raw",
      rawKeyHex: "00".repeat(24),
      randomBytes: createDeterministicRandom(),
    })

    expect(result.envelope.algorithm).toBe("AES-CTR")
    expect(result.envelope.iv).toHaveLength(32)

    const decrypted = await decryptAesEnvelope(result.envelope, {
      rawKeyHex: "00".repeat(24),
    })

    expect(new TextDecoder().decode(decrypted)).toBe("counter mode")
  })

  it("rejects invalid key material and PBKDF2 settings", async () => {
    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "GCM",
        keyLengthBits: 256,
        keySource: "password",
        password: "",
      })
    ).rejects.toThrow("Password is required")

    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "GCM",
        keyLengthBits: 256,
        keySource: "raw",
        rawKeyHex: "abcd",
      })
    ).rejects.toThrow("Invalid raw AES key")

    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "GCM",
        keyLengthBits: 256,
        keySource: "password",
        password: "secret",
        pbkdf2Iterations: 999,
      })
    ).rejects.toThrow("Invalid PBKDF2 iterations")

    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "GCM",
        keyLengthBits: 512 as never,
        keySource: "password",
        password: "secret",
      })
    ).rejects.toThrow("Unsupported AES key length")

    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "GCM",
        keyLengthBits: 256,
        keySource: "password",
        password: "secret",
        pbkdf2Hash: "SHA-1" as never,
      })
    ).rejects.toThrow("Unsupported PBKDF2 hash")

    await expect(
      encryptAes({
        plaintext: "secret",
        mode: "ECB" as never,
        keyLengthBits: 256,
        keySource: "password",
        password: "secret",
      })
    ).rejects.toThrow("Unsupported AES mode")
  })
})

describe("raw key helpers", () => {
  it("validates exact-length hexadecimal raw keys", () => {
    expect(expectedRawKeyHexLength(128)).toBe(32)
    expect(expectedRawKeyHexLength(192)).toBe(48)
    expect(expectedRawKeyHexLength(256)).toBe(64)
    expect(validateRawKeyHex("00 11 22 33 44 55 66 77", 128)).toBe(false)
    expect(validateRawKeyHex("00".repeat(16), 128)).toBe(true)
    expect(validateRawKeyHex("00".repeat(31), 256)).toBe(false)
    expect(validateRawKeyHex("zz".repeat(32), 256)).toBe(false)
  })
})

describe("decryptAesEnvelope", () => {
  it("rejects tampered AES-GCM ciphertext", async () => {
    const result = await encryptAes({
      plaintext: "authenticated",
      mode: "GCM",
      keyLengthBits: 128,
      keySource: "password",
      password: "secret",
      pbkdf2Iterations: 1000,
      randomBytes: createDeterministicRandom(),
    })
    const tamperedEnvelope: AesEncryptedEnvelope = {
      ...result.envelope,
      ciphertext: `${result.envelope.ciphertext.slice(0, -2)}aa`,
    }

    await expect(
      decryptAesEnvelope(tamperedEnvelope, { password: "secret" })
    ).rejects.toThrow(/operation failed/i)
  })

  it("rejects malformed hexadecimal envelope fields", async () => {
    const result = await encryptAes({
      plaintext: "secret",
      mode: "GCM",
      keyLengthBits: 128,
      keySource: "password",
      password: "secret",
      pbkdf2Iterations: 1000,
      randomBytes: createDeterministicRandom(),
    })

    await expect(
      decryptAesEnvelope(
        { ...result.envelope, iv: "not-hex" },
        { password: "secret" }
      )
    ).rejects.toThrow("Invalid hex string")
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

  it("validates random byte sources", () => {
    expect(createRandomBytes(undefined, 2)).toHaveLength(2)
    expect(() => createRandomBytes(() => new Uint8Array(1), 2)).toThrow(
      "Random byte source returned the wrong length"
    )
  })
})
