import { webcrypto } from "node:crypto"

import {
  AuthorityKeyIdentifierExtension,
  BasicConstraintsExtension,
  ExtendedKeyUsageExtension,
  KeyUsagesExtension,
  SubjectAlternativeNameExtension,
  SubjectKeyIdentifierExtension,
  type PublicKey,
  type X509Certificate,
} from "@peculiar/x509"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { DEFAULT_INPUT } from "../client/constants"
import {
  base64ToArrayBuffer,
  computeFingerprints,
  describeKey,
  extractPemBlocks,
  extractExtensions,
  formatAlgorithm,
  formatHexString,
  isBase64Input,
  isCertificateLabel,
} from "./certificate-helpers"
import { parseCertificateInput } from "./certificate-parser"
import type { CertificateParserMessages } from "./types"

const messages: CertificateParserMessages = {
  invalidInput: "Invalid input.",
  invalidPem: "Invalid PEM.",
  parseFailed: "Parse failed.",
  notAvailable: "Not available",
  webCryptoUnavailable: "Web Crypto unavailable.",
  unsupportedPemBlock: (label) => `Unsupported PEM block: ${label}`,
  certificateLabel: (index) => `Certificate ${index}`,
  publicKeyLabel: (index) => `Public Key ${index}`,
}

const certificatePem = extractBlock(DEFAULT_INPUT, "CERTIFICATE")
const publicKeyPem = extractBlock(DEFAULT_INPUT, "PUBLIC KEY")
const certificateBase64 = extractBody(certificatePem)
const publicKeyBase64 = extractBody(publicKeyPem)

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("parseCertificateInput", () => {
  test("parses a PEM certificate and public key with extensions", async () => {
    const result = await parseCertificateInput(DEFAULT_INPUT, messages)

    expect(result.warnings).toEqual([])
    expect(result.entries).toHaveLength(2)

    const certificate = result.entries[0]
    expect(certificate?.type).toBe("certificate")
    if (certificate?.type !== "certificate") {
      throw new Error("Expected certificate")
    }

    expect(certificate.label).toBe("Certificate 1")
    expect(certificate.subject).toContain("CN=example.com")
    expect(certificate.issuer).toContain("O=InBrowser Test")
    expect(certificate.serialNumber).toMatch(/^[0-9A-F]{2}(:[0-9A-F]{2})+$/)
    expect(certificate.notBefore).toBe("2026-05-14T06:03:49.000Z")
    expect(certificate.notAfter).toBe("2027-05-14T06:03:49.000Z")
    expect(certificate.signatureAlgorithm).toContain("ECDSA")
    expect(certificate.publicKeyAlgorithm).toContain("ECDSA")
    expect(certificate.publicKeyCurve).toBe("P-256")
    expect(certificate.fingerprints.sha256).toMatch(
      /^[0-9A-F]{2}(:[0-9A-F]{2}){31}$/
    )
    expect(certificate.extensions.subjectAlternativeNames).toEqual([
      "DNS: example.com",
      "DNS: www.example.com",
      "IP: 127.0.0.1",
    ])
    expect(certificate.extensions.keyUsage).toEqual([
      "Digital Signature",
      "Key Encipherment",
    ])
    expect(certificate.extensions.extendedKeyUsage).toEqual([
      "TLS Web Server Authentication",
      "TLS Web Client Authentication",
    ])
    expect(certificate.extensions.basicConstraints).toBe("CA: false")
    expect(certificate.extensions.subjectKeyIdentifier).toMatch(
      /^[0-9A-F]{2}(:[0-9A-F]{2})+$/
    )
    expect(certificate.extensions.authorityKeyIdentifier).toBe(
      certificate.extensions.subjectKeyIdentifier
    )

    const publicKey = result.entries[1]
    expect(publicKey?.type).toBe("publicKey")
    if (publicKey?.type !== "publicKey") {
      throw new Error("Expected public key")
    }

    expect(publicKey.label).toBe("Public Key 1")
    expect(publicKey.algorithm).toContain("ECDSA")
    expect(publicKey.curve).toBe("P-256")
    expect(publicKey.fingerprints.sha1).toMatch(
      /^[0-9A-F]{2}(:[0-9A-F]{2}){19}$/
    )
  })

  test("parses base64 DER text as a certificate", async () => {
    const result = await parseCertificateInput(certificateBase64, messages)

    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]).toMatchObject({
      type: "certificate",
      label: "Certificate 1",
    })
  })

  test("parses DER and PEM files", async () => {
    const der = base64ToArrayBuffer(publicKeyBase64)
    const derFile = new File([der], "public-key.der")
    const unnamedDerFile = new File([der], "")
    const pemFile = new File([certificatePem], "certificate.pem", {
      type: "application/x-pem-file",
    })

    await expect(parseCertificateInput(derFile, messages)).resolves.toEqual(
      expect.objectContaining({
        entries: [
          expect.objectContaining({
            type: "publicKey",
            label: "public-key.der",
          }),
        ],
      })
    )
    await expect(parseCertificateInput(pemFile, messages)).resolves.toEqual(
      expect.objectContaining({
        entries: [
          expect.objectContaining({
            type: "certificate",
            label: "Certificate 1",
          }),
        ],
      })
    )
    await expect(
      parseCertificateInput(unnamedDerFile, messages)
    ).resolves.toEqual(
      expect.objectContaining({
        entries: [
          expect.objectContaining({
            label: "Certificate 1",
            type: "publicKey",
          }),
        ],
      })
    )
  })

  test("returns an empty result for blank input", async () => {
    await expect(parseCertificateInput(" \n\t ", messages)).resolves.toEqual({
      entries: [],
      warnings: [],
    })
  })

  test("reports invalid and unsupported input", async () => {
    await expect(
      parseCertificateInput("not a certificate!", messages)
    ).rejects.toThrow(messages.invalidInput)
    await expect(
      parseCertificateInput(
        "-----BEGIN CERTIFICATE-----\n%%%%\n-----END CERTIFICATE-----",
        messages
      )
    ).rejects.toThrow(messages.invalidPem)
    await expect(
      parseCertificateInput(
        "-----BEGIN PRIVATE KEY-----\nQUJD\n-----END PRIVATE KEY-----",
        messages
      )
    ).rejects.toThrow("Unsupported PEM block: PRIVATE KEY")
    await expect(
      parseCertificateInput(
        "-----BEGIN FOO-----\nQUJD\n-----END FOO-----\n-----BEGIN BAR-----\nQUJD\n-----END BAR-----",
        {
          ...messages,
          unsupportedPemBlock: () => "",
        }
      )
    ).rejects.toThrow(messages.parseFailed)
    await expect(
      parseCertificateInput(
        "-----BEGIN PUBLIC KEY-----\nQUJD\n-----END PUBLIC KEY-----",
        messages
      )
    ).rejects.toThrow("Parse failed. (PUBLIC KEY)")
    await expect(parseCertificateInput("QUJD", messages)).rejects.toThrow(
      messages.parseFailed
    )
    await expect(parseCertificateInput("%%%%", messages)).rejects.toThrow(
      messages.invalidInput
    )
    await expect(parseCertificateInput("A", messages)).rejects.toThrow(
      messages.invalidInput
    )
  })

  test("keeps valid entries while warning about other PEM blocks", async () => {
    const result = await parseCertificateInput(
      `${publicKeyPem}\n-----BEGIN PRIVATE KEY-----\nQUJD\n-----END PRIVATE KEY-----`,
      messages
    )

    expect(result.entries).toHaveLength(1)
    expect(result.warnings).toEqual(["Unsupported PEM block: PRIVATE KEY"])
  })

  test("surfaces parse failures and Web Crypto availability", async () => {
    await expect(
      parseCertificateInput(
        "-----BEGIN CERTIFICATE-----\nQUJD\n-----END CERTIFICATE-----",
        messages
      )
    ).rejects.toThrow("Parse failed. (CERTIFICATE)")

    vi.stubGlobal("crypto", undefined)
    await expect(
      parseCertificateInput(certificatePem, messages)
    ).rejects.toThrow(messages.webCryptoUnavailable)
    await expect(
      parseCertificateInput(certificateBase64, messages)
    ).rejects.toThrow(messages.webCryptoUnavailable)
    await expect(parseCertificateInput(publicKeyPem, messages)).rejects.toThrow(
      messages.webCryptoUnavailable
    )
    await expect(
      parseCertificateInput(publicKeyBase64, messages)
    ).rejects.toThrow(messages.webCryptoUnavailable)
  })
})

describe("certificate parser helpers", () => {
  test("extracts PEM blocks and recognizes labels", () => {
    const blocks = extractPemBlocks(DEFAULT_INPUT)

    expect(blocks).toHaveLength(2)
    expect(
      extractPemBlocks("-----BEGIN EMPTY-----\n-----END EMPTY-----")
    ).toHaveLength(0)
    expect(isCertificateLabel("TRUSTED CERTIFICATE")).toBe(true)
    expect(isCertificateLabel("CERTIFICATE REQUEST")).toBe(false)
  })

  test("converts base64 and formats fingerprints and hexadecimal values", async () => {
    const buffer = base64ToArrayBuffer("AQID")
    const fingerprints = await computeFingerprints(buffer, messages)

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([1, 2, 3]))
    expect(fingerprints.sha1).toMatch(/^[0-9A-F:]+$/)
    expect(formatHexString("0x0abc")).toBe("0A:BC")
    expect(formatHexString("not hex")).toBe("not hex")
  })

  test("detects base64-shaped input and formats unknown algorithms", () => {
    expect(isBase64Input(certificateBase64)).toBe(true)
    expect(isBase64Input("hello world!")).toBe(false)
    expect(
      formatAlgorithm(
        { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
        messages
      )
    ).toBe("RSASSA-PKCS1-v1_5 (SHA-256)")
    expect(formatAlgorithm(undefined as never, messages)).toBe(
      messages.notAvailable
    )
  })

  test("describes keys and sparse extension objects defensively", () => {
    expect(
      describeKey(
        {
          algorithm: { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048 },
        } as unknown as PublicKey,
        messages
      )
    ).toEqual({
      algorithm: "RSASSA-PKCS1-v1_5",
      size: 2048,
      curve: undefined,
    })
    expect(
      describeKey(
        {
          algorithm: { name: "ECDSA", namedCurve: "P-384" },
        } as unknown as PublicKey,
        messages
      )
    ).toEqual({
      algorithm: "ECDSA",
      size: undefined,
      curve: "P-384",
    })

    expect(extractExtensions(fakeCertificateWithNoExtensions())).toEqual({})
    expect(extractExtensions(fakeCertificateWithSparseExtensions())).toEqual({
      basicConstraints: "CA: true, Path Length: 2",
    })
    expect(extractExtensions(fakeCertificateWithUnknownExtensions())).toEqual({
      subjectAlternativeNames: ["URI: https://example.com", "other: value"],
      extendedKeyUsage: ["1.2.3.4"],
    })
  })
})

function fakeCertificateWithNoExtensions() {
  return {
    getExtension() {
      return undefined
    },
  } as unknown as X509Certificate
}

function fakeCertificateWithSparseExtensions() {
  return {
    getExtension(extension: unknown) {
      if (extension === SubjectAlternativeNameExtension) {
        return { names: { items: [] } }
      }
      if (extension === KeyUsagesExtension) {
        return { usages: 0 }
      }
      if (extension === ExtendedKeyUsageExtension) {
        return { usages: [] }
      }
      if (extension === BasicConstraintsExtension) {
        return { ca: true, pathLength: 2 }
      }
      if (
        extension === SubjectKeyIdentifierExtension ||
        extension === AuthorityKeyIdentifierExtension
      ) {
        return { keyId: "" }
      }

      return undefined
    },
  } as unknown as X509Certificate
}

function fakeCertificateWithUnknownExtensions() {
  return {
    getExtension(extension: unknown) {
      if (extension === SubjectAlternativeNameExtension) {
        return {
          names: {
            items: [
              { type: "url", value: "https://example.com" },
              { type: "other", value: "value" },
            ],
          },
        }
      }
      if (extension === ExtendedKeyUsageExtension) {
        return { usages: ["1.2.3.4"] }
      }

      return undefined
    },
  } as unknown as X509Certificate
}

function extractBlock(input: string, label: string) {
  const pattern = new RegExp(
    `-----BEGIN ${label}-----[\\s\\S]*?-----END ${label}-----`
  )
  const match = input.match(pattern)
  if (!match) {
    throw new Error(`Missing ${label} block`)
  }

  return match[0]
}

function extractBody(pem: string) {
  return pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "")
}
