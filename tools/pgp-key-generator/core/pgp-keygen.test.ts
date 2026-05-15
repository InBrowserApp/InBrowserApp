import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  formatFingerprint,
  formatUserID,
  generatePgpKeyPair,
  normalizePgpKeyOptions,
} from "./pgp-keygen"

vi.mock("openpgp", () => ({
  generateKey: vi.fn(),
  readKey: vi.fn(),
}))

describe("PGP key generator helpers", () => {
  it("formats fingerprint groups with uppercase", () => {
    expect(formatFingerprint("abcd 1234")).toBe("ABCD 1234")
    expect(formatFingerprint("abcd123456")).toBe("ABCD 1234 56")
  })

  it("formats user IDs with optional comment and email", () => {
    expect(
      formatUserID({
        name: "Alice",
        email: "alice@example.com",
        comment: "work",
      })
    ).toBe("Alice (work) <alice@example.com>")

    expect(
      formatUserID({
        name: "",
        email: "bob@example.com",
        comment: "",
      })
    ).toBe("<bob@example.com>")

    expect(
      formatUserID({
        name: "Charlie",
        email: "",
        comment: "",
      })
    ).toBe("Charlie")
  })

  it("normalizes whitespace and accepts supported options", () => {
    expect(
      normalizePgpKeyOptions({
        name: " Alice ",
        email: " alice@example.com ",
        comment: " work ",
        passphrase: " secret ",
        algorithm: "ecc",
        rsaKeySize: 4096,
        expirationDays: 365,
      })
    ).toEqual({
      name: "Alice",
      email: "alice@example.com",
      comment: "work",
      passphrase: " secret ",
      algorithm: "ecc",
      rsaKeySize: 4096,
      expirationDays: 365,
    })
  })

  it("rejects unsupported expiration and RSA key sizes", () => {
    expect(() =>
      normalizePgpKeyOptions({
        name: "Alice",
        email: "",
        comment: "",
        passphrase: "",
        algorithm: "rsa",
        rsaKeySize: 4096,
        expirationDays: -1,
      })
    ).toThrow("Expiration must be a whole number")

    expect(() =>
      normalizePgpKeyOptions({
        name: "Alice",
        email: "",
        comment: "",
        passphrase: "",
        algorithm: "rsa",
        rsaKeySize: 1024 as 4096,
        expirationDays: 0,
      })
    ).toThrow("Unsupported RSA key size")
  })
})

describe("generatePgpKeyPair", () => {
  beforeEach(async () => {
    const openpgp = await import("openpgp")

    vi.mocked(openpgp.generateKey).mockResolvedValue({
      publicKey: "PUBLIC",
      privateKey: "PRIVATE",
      revocationCertificate: "REVOCATION",
    } as unknown as Awaited<ReturnType<typeof openpgp.generateKey>>)
    vi.mocked(openpgp.readKey).mockResolvedValue({
      getFingerprint: () => "abcd1234",
      getKeyID: () => ({ toHex: () => "deadbeef" }),
    } as Awaited<ReturnType<typeof openpgp.readKey>>)
  })

  it("builds ECC options and returns formatted output", async () => {
    const openpgp = await import("openpgp")

    const result = await generatePgpKeyPair({
      name: " Alice ",
      email: " alice@example.com ",
      comment: " work ",
      passphrase: "secret",
      algorithm: "ecc",
      rsaKeySize: 4096,
      expirationDays: 365,
    })

    expect(openpgp.generateKey).toHaveBeenCalledWith({
      userIDs: [{ name: "Alice", email: "alice@example.com", comment: "work" }],
      format: "armored",
      passphrase: "secret",
      keyExpirationTime: 365 * 24 * 60 * 60,
      type: "ecc",
      curve: "curve25519Legacy",
    })

    expect(result).toEqual({
      publicKey: "PUBLIC",
      privateKey: "PRIVATE",
      revocationCertificate: "REVOCATION",
      fingerprint: "ABCD 1234",
      keyID: "DEADBEEF",
      userID: "Alice (work) <alice@example.com>",
    })
  })

  it("builds RSA options when requested", async () => {
    const openpgp = await import("openpgp")

    await generatePgpKeyPair({
      name: "",
      email: "bob@example.com",
      comment: "",
      passphrase: "",
      algorithm: "rsa",
      rsaKeySize: 2048,
      expirationDays: 0,
    })

    expect(openpgp.generateKey).toHaveBeenCalledWith({
      userIDs: [{ email: "bob@example.com" }],
      format: "armored",
      type: "rsa",
      rsaBits: 2048,
    })
  })

  it("accepts name-only identities", async () => {
    const openpgp = await import("openpgp")

    await generatePgpKeyPair({
      name: "Charlie",
      email: "",
      comment: "",
      passphrase: "",
      algorithm: "ecc",
      rsaKeySize: 4096,
      expirationDays: 0,
    })

    expect(openpgp.generateKey).toHaveBeenCalledWith({
      userIDs: [{ name: "Charlie" }],
      format: "armored",
      type: "ecc",
      curve: "curve25519Legacy",
    })
  })

  it("rejects missing identities", async () => {
    await expect(
      generatePgpKeyPair({
        name: " ",
        email: " ",
        comment: "",
        passphrase: "",
        algorithm: "ecc",
        rsaKeySize: 4096,
        expirationDays: 0,
      })
    ).rejects.toThrow("Name or email is required")
  })
})
