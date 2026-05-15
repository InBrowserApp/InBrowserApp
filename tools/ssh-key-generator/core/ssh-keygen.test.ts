import { createHash, webcrypto } from "node:crypto"

import { beforeAll, describe, expect, test, vi } from "vitest"

import {
  DEFAULT_RSA_KEY_SIZE,
  RSA_KEY_SIZES,
  generateSshKeyPair,
  isRsaKeySize,
  type RsaKeySize,
  type SshKeygenRuntime,
} from "./ssh-keygen"

const testCrypto = webcrypto as unknown as NonNullable<
  SshKeygenRuntime["crypto"]
>

class SshReader {
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {}

  get remaining() {
    return this.bytes.slice(this.offset)
  }

  readBytes(length: number) {
    const value = this.bytes.slice(this.offset, this.offset + length)
    this.offset += length
    return value
  }

  readUint32() {
    const value = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4
    ).getUint32(0, false)
    this.offset += 4
    return value
  }

  readString() {
    return this.readBytes(this.readUint32())
  }

  readStringText() {
    return new TextDecoder().decode(this.readString())
  }

  readMagic() {
    const end = this.bytes.indexOf(0, this.offset)
    const value = new TextDecoder().decode(
      this.bytes.slice(this.offset, end + 1)
    )
    this.offset = end + 1
    return value
  }
}

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: testCrypto,
    configurable: true,
  })
})

function decodeBase64(value: string) {
  return new Uint8Array(Buffer.from(value, "base64"))
}

function decodePublicKey(publicKey: string) {
  const [keyType, encoded, ...commentParts] = publicKey.split(" ")
  const blob = decodeBase64(encoded!)
  const reader = new SshReader(blob)

  return {
    blob,
    comment: commentParts.join(" "),
    keyType,
    reader,
  }
}

function decodePrivateKey(privateKey: string) {
  const base64 = privateKey
    .replace(/-----BEGIN OPENSSH PRIVATE KEY-----/u, "")
    .replace(/-----END OPENSSH PRIVATE KEY-----/u, "")
    .replace(/\s+/gu, "")

  return new SshReader(decodeBase64(base64))
}

function parsePrivateEnvelope(privateKey: string) {
  const reader = decodePrivateKey(privateKey)

  expect(reader.readMagic()).toBe("openssh-key-v1\0")
  expect(reader.readStringText()).toBe("none")
  expect(reader.readStringText()).toBe("none")
  expect(reader.readString()).toHaveLength(0)
  expect(reader.readUint32()).toBe(1)

  return {
    publicBlob: reader.readString(),
    privateSection: new SshReader(reader.readString()),
  }
}

function expectMatchingCheckints(privateSection: SshReader) {
  const firstCheckint = privateSection.readBytes(4)
  const secondCheckint = privateSection.readBytes(4)

  expect(secondCheckint).toEqual(firstCheckint)
}

function expectValidPadding(privateSection: SshReader) {
  expect([...privateSection.remaining]).toEqual(
    Array.from(
      { length: privateSection.remaining.length },
      (_, index) => index + 1
    )
  )
}

function expectedFingerprint(blob: Uint8Array) {
  return `SHA256:${createHash("sha256")
    .update(blob)
    .digest("base64")
    .replace(/=+$/u, "")}`
}

function mpintBitLength(bytes: Uint8Array) {
  let start = 0

  while (start < bytes.length && bytes[start] === 0) {
    start += 1
  }

  if (start === bytes.length) {
    return 0
  }

  const firstByte = bytes[start]!
  return (bytes.length - start - 1) * 8 + (8 - Math.clz32(firstByte) + 24)
}

describe("generateSshKeyPair", () => {
  test("generates an Ed25519 OpenSSH key pair", async () => {
    const result = await generateSshKeyPair(
      {
        algorithm: "ed25519",
        comment: " user@example.com\nlaptop ",
      },
      { crypto: testCrypto }
    )
    const publicKey = decodePublicKey(result.publicKey)
    const publicReader = publicKey.reader
    const envelope = parsePrivateEnvelope(result.privateKey)
    const privateSection = envelope.privateSection

    expect(result.algorithm).toBe("ed25519")
    expect(result.keyType).toBe("ssh-ed25519")
    expect(result.bits).toBe(256)
    expect(result.comment).toBe("user@example.com laptop")
    expect(publicKey.keyType).toBe("ssh-ed25519")
    expect(publicKey.comment).toBe("user@example.com laptop")
    expect(publicReader.readStringText()).toBe("ssh-ed25519")
    expect(publicReader.readString()).toHaveLength(32)
    expect(result.fingerprintSha256).toBe(expectedFingerprint(publicKey.blob))
    expect(envelope.publicBlob).toEqual(publicKey.blob)
    expectMatchingCheckints(privateSection)
    expect(privateSection.readStringText()).toBe("ssh-ed25519")
    expect(privateSection.readString()).toHaveLength(32)
    expect(privateSection.readString()).toHaveLength(64)
    expect(privateSection.readStringText()).toBe("user@example.com laptop")
    expectValidPadding(privateSection)
  })

  test("generates an RSA OpenSSH key pair", async () => {
    const result = await generateSshKeyPair(
      { algorithm: "rsa", rsaKeySize: 2048, comment: "" },
      { crypto: testCrypto }
    )
    const publicKey = decodePublicKey(result.publicKey)
    const publicReader = publicKey.reader
    const envelope = parsePrivateEnvelope(result.privateKey)
    const privateSection = envelope.privateSection

    expect(result.algorithm).toBe("rsa")
    expect(result.keyType).toBe("ssh-rsa")
    expect(result.bits).toBe(2048)
    expect(result.comment).toBe("")
    expect(publicKey.keyType).toBe("ssh-rsa")
    expect(publicReader.readStringText()).toBe("ssh-rsa")
    expect([...publicReader.readString()]).toEqual([1, 0, 1])
    expect(mpintBitLength(publicReader.readString())).toBe(2048)
    expect(result.fingerprintSha256).toBe(expectedFingerprint(publicKey.blob))
    expect(envelope.publicBlob).toEqual(publicKey.blob)
    expectMatchingCheckints(privateSection)
    expect(privateSection.readStringText()).toBe("ssh-rsa")
    expect(mpintBitLength(privateSection.readString())).toBe(2048)
    expect([...privateSection.readString()]).toEqual([1, 0, 1])
    expect(privateSection.readString()).not.toHaveLength(0)
    expect(privateSection.readString()).not.toHaveLength(0)
    expect(privateSection.readString()).not.toHaveLength(0)
    expect(privateSection.readString()).not.toHaveLength(0)
    expect(privateSection.readStringText()).toBe("")
    expectValidPadding(privateSection)
  })

  test("uses the default RSA size when none is provided", async () => {
    const result = await generateSshKeyPair(
      { algorithm: "rsa" },
      { crypto: testCrypto }
    )

    expect(result.bits).toBe(DEFAULT_RSA_KEY_SIZE)
  }, 20_000)

  test("uses global Web Crypto when runtime crypto is omitted", async () => {
    const result = await generateSshKeyPair({ algorithm: "ed25519" })

    expect(result.algorithm).toBe("ed25519")
    expect(result.keyType).toBe("ssh-ed25519")
  })

  test("validates key algorithm, RSA size, and crypto availability", async () => {
    expect(RSA_KEY_SIZES.every(isRsaKeySize)).toBe(true)
    expect(isRsaKeySize(1024)).toBe(false)

    await expect(
      generateSshKeyPair(
        { algorithm: "rsa", rsaKeySize: 1024 as RsaKeySize },
        { crypto: testCrypto }
      )
    ).rejects.toThrow("INVALID_RSA_KEY_SIZE")
    await expect(
      generateSshKeyPair({ algorithm: "bad" as never }, { crypto: testCrypto })
    ).rejects.toThrow("UNSUPPORTED_ALGORITHM")
    await expect(
      generateSshKeyPair(
        { algorithm: "ed25519" },
        { crypto: {} as NonNullable<SshKeygenRuntime["crypto"]> }
      )
    ).rejects.toThrow("WEB_CRYPTO_UNAVAILABLE")
  })

  test("surfaces invalid RSA JWK exports", async () => {
    const fakeSubtle = {
      generateKey: vi.fn(async () => ({
        privateKey: "private",
        publicKey: "public",
      })),
      exportKey: vi.fn(async () => ({})),
    } as unknown as SubtleCrypto
    const fakeCrypto = {
      getRandomValues: testCrypto.getRandomValues.bind(testCrypto),
      subtle: fakeSubtle,
    } as NonNullable<SshKeygenRuntime["crypto"]>

    await expect(
      generateSshKeyPair({ algorithm: "rsa" }, { crypto: fakeCrypto })
    ).rejects.toThrow("INVALID_JWK")
  })
})
