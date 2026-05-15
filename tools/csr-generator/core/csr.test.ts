import { webcrypto } from "node:crypto"

import { ECParameters, ECPrivateKey, id_ecPublicKey } from "@peculiar/asn1-ecc"
import { PrivateKey, PrivateKeyInfo, Version } from "@peculiar/asn1-pkcs8"
import { AsnConvert } from "@peculiar/asn1-schema"
import { AlgorithmIdentifier } from "@peculiar/asn1-x509"
import { Pkcs10CertificateRequest } from "@peculiar/x509"
import { beforeAll, describe, expect, test } from "vitest"

import {
  CsrGeneratorError,
  base64UrlToBytes,
  buildSanNames,
  buildSubjectJson,
  createCsr,
  formatKeyAlgorithmLabel,
  splitSanInput,
  type CsrCreateInput,
  type KeyAlgorithm,
} from "./csr"
import {
  ensureCryptoProvider,
  ensureKeyPair,
  formatKeyLabelFromJwk,
  getImportAlgorithm,
  getSigningAlgorithm,
} from "./keys"
import { parsePrivateKeyPem } from "./pem"

const cryptoProvider = webcrypto as unknown as Crypto

const baseSubject = {
  commonName: "example.com",
  organization: "",
  organizationalUnit: "",
  country: "",
  state: "",
  locality: "",
  emailAddress: "",
}

const emptySubject = {
  commonName: "",
  organization: "",
  organizationalUnit: "",
  country: "",
  state: "",
  locality: "",
  emailAddress: "",
}

const baseSan = {
  dns: ["example.com"],
  ip: [],
  email: [],
  uri: [],
}

const baseInput: CsrCreateInput = {
  keySource: "generate",
  algorithm: "rsa",
  rsaKeySize: 2048,
  rsaHash: "SHA-256",
  ecCurve: "P-256",
  keyPem: "",
  subject: baseSubject,
  san: baseSan,
}

function toPem(raw: ArrayBuffer, label: string) {
  const base64 = Buffer.from(raw).toString("base64")
  const lines = base64.match(/.{1,64}/g) ?? []
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`
}

function extractPrivateKeyBytes(pkcs8: ArrayBuffer) {
  const info = AsnConvert.parse(pkcs8, PrivateKeyInfo) as unknown as {
    privateKey: { buffer?: ArrayBuffer }
  }
  const buffer = info.privateKey.buffer
  if (!buffer) {
    throw new Error("Unable to extract private key bytes")
  }

  return buffer
}

let rsaPkcs8: ArrayBuffer
let ecdsaPkcs8: ArrayBuffer
let rsaPrivatePem: string
let rsaPkcs1Pem: string
let ecdsaPrivatePem: string
let ecdsaLegacyPem: string

beforeAll(async () => {
  const rsaKeys = (await cryptoProvider.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: "SHA-256" },
    },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair
  rsaPkcs8 = await cryptoProvider.subtle.exportKey("pkcs8", rsaKeys.privateKey)
  rsaPrivatePem = toPem(rsaPkcs8, "PRIVATE KEY")
  rsaPkcs1Pem = toPem(extractPrivateKeyBytes(rsaPkcs8), "RSA PRIVATE KEY")

  const ecdsaKeys = (await cryptoProvider.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair
  ecdsaPkcs8 = await cryptoProvider.subtle.exportKey(
    "pkcs8",
    ecdsaKeys.privateKey
  )
  ecdsaPrivatePem = toPem(ecdsaPkcs8, "PRIVATE KEY")
  const ecPrivateKey = AsnConvert.parse(
    extractPrivateKeyBytes(ecdsaPkcs8),
    ECPrivateKey
  )
  if (!ecPrivateKey.parameters) {
    ecPrivateKey.parameters = new ECParameters({
      namedCurve: "1.2.840.10045.3.1.7",
    })
  }
  ecdsaLegacyPem = toPem(AsnConvert.serialize(ecPrivateKey), "EC PRIVATE KEY")
})

describe("subject and SAN helpers", () => {
  test("builds a trimmed subject name and returns null for blank input", () => {
    expect(buildSubjectJson(emptySubject)).toBeNull()
    expect(
      buildSubjectJson({
        ...emptySubject,
        commonName: " example.com ",
        organization: "Acme",
        country: "US",
      })
    ).toEqual([{ CN: ["example.com"], O: ["Acme"], C: ["US"] }])
  })

  test("collects SAN entries and rejects invalid IP addresses", () => {
    const names = buildSanNames({
      dns: [" example.com "],
      ip: ["192.0.2.1"],
      email: ["admin@example.com"],
      uri: ["https://example.com"],
    })

    expect(names).toHaveLength(4)
    expect(() =>
      buildSanNames({ dns: [], ip: ["not-an-ip"], email: [], uri: [] })
    ).toThrowError(CsrGeneratorError)
  })

  test("splits SAN text by new lines and commas", () => {
    expect(
      splitSanInput("example.com, www.example.com\n api.example.com ")
    ).toEqual(["example.com", "www.example.com", "api.example.com"])
  })
})

describe("labels", () => {
  test("formats key algorithm labels", () => {
    expect(
      formatKeyAlgorithmLabel({
        algorithm: "rsa",
        rsaKeySize: 2048,
        rsaHash: "SHA-256",
      })
    ).toBe("RSA 2048 (SHA-256)")
    expect(formatKeyAlgorithmLabel({ algorithm: "rsa" })).toBe("RSA")
    expect(formatKeyAlgorithmLabel({ algorithm: "ecdsa" })).toBe("ECDSA")
    expect(
      formatKeyAlgorithmLabel({ algorithm: "ecdsa", ecCurve: "P-384" })
    ).toBe("ECDSA P-384 (SHA-384)")
    expect(
      formatKeyAlgorithmLabel({ algorithm: "unknown" as KeyAlgorithm })
    ).toBe("unknown")
  })

  test("decodes base64url strings and formats imported key labels", () => {
    expect(Array.from(base64UrlToBytes("AQI"))).toEqual([1, 2])
    expect(
      formatKeyLabelFromJwk({ type: "rsa" }, { n: "AQID" }, "SHA-512")
    ).toBe("RSA 24 (SHA-512)")
    expect(formatKeyLabelFromJwk({ type: "rsa" }, {}, "SHA-256")).toBe(
      "RSA (SHA-256)"
    )
    expect(
      formatKeyLabelFromJwk({ type: "ecdsa", curve: "P-521" }, {}, "SHA-256")
    ).toBe("ECDSA P-521 (SHA-512)")
  })
})

describe("PEM private key parsing", () => {
  test("rejects invalid, encrypted, and unsupported PEM blocks", () => {
    expect(() => parsePrivateKeyPem("not pem")).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN PRIVATE KEY-----\n%%%%\n-----END PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN PRIVATE KEY-----\nA\n-----END PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN PRIVATE KEY-----\nQUJD\n-----END PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN CERTIFICATE-----\nZm9v\n-----END CERTIFICATE-----"
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN ENCRYPTED PRIVATE KEY-----\nZm9v\n-----END ENCRYPTED PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
  })

  test("parses PKCS#8, PKCS#1 RSA, and legacy EC private keys", () => {
    expect(parsePrivateKeyPem(rsaPrivatePem).algorithm).toEqual({ type: "rsa" })
    expect(parsePrivateKeyPem(rsaPkcs1Pem).algorithm).toEqual({ type: "rsa" })
    expect(parsePrivateKeyPem(ecdsaPrivatePem).algorithm).toEqual({
      type: "ecdsa",
      curve: "P-256",
    })
    expect(parsePrivateKeyPem(ecdsaLegacyPem).algorithm).toEqual({
      type: "ecdsa",
      curve: "P-256",
    })
  })

  test("rejects unsupported and malformed key algorithms", () => {
    const unknownAlgorithm = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({
        algorithm: "1.2.3.4.5",
      }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })
    const ecWithoutParameters = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({
        algorithm: id_ecPublicKey,
      }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })
    const ecBadCurve = AsnConvert.parse(
      extractPrivateKeyBytes(ecdsaPkcs8),
      ECPrivateKey
    )
    ecBadCurve.parameters = new ECParameters({ namedCurve: "1.2.3.4.5" })
    const ecWithoutLegacyParameters = AsnConvert.parse(
      extractPrivateKeyBytes(ecdsaPkcs8),
      ECPrivateKey
    )
    ecWithoutLegacyParameters.parameters = undefined

    expect(() =>
      parsePrivateKeyPem(
        toPem(AsnConvert.serialize(unknownAlgorithm), "PRIVATE KEY")
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        toPem(AsnConvert.serialize(ecWithoutParameters), "PRIVATE KEY")
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        toPem(AsnConvert.serialize(ecBadCurve), "EC PRIVATE KEY")
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        toPem(AsnConvert.serialize(ecWithoutLegacyParameters), "EC PRIVATE KEY")
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN RSA PRIVATE KEY-----\nQUJD\n-----END RSA PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        "-----BEGIN EC PRIVATE KEY-----\nQUJD\n-----END EC PRIVATE KEY-----"
      )
    ).toThrowError(CsrGeneratorError)
  })
})

describe("CSR generation", () => {
  test("requires Web Crypto and at least one Subject or SAN value", async () => {
    expect(() => ensureCryptoProvider(undefined)).toThrowError(
      CsrGeneratorError
    )
    await expect(
      createCsr(
        { ...baseInput, subject: emptySubject, san: emptySan() },
        cryptoProvider
      )
    ).rejects.toThrowError(CsrGeneratorError)
  })

  test("creates CSRs for generated RSA and ECDSA keys", async () => {
    const rsaResult = await createCsr(baseInput, cryptoProvider)
    const ecdsaResult = await createCsr(
      { ...baseInput, algorithm: "ecdsa", ecCurve: "P-384" },
      cryptoProvider
    )

    expect(rsaResult.privateKeyPem).toContain("BEGIN PRIVATE KEY")
    expect(ecdsaResult.privateKeyPem).toContain("BEGIN PRIVATE KEY")
    await expect(
      new Pkcs10CertificateRequest(rsaResult.csrPem).verify()
    ).resolves.toBe(true)
    await expect(
      new Pkcs10CertificateRequest(ecdsaResult.csrPem).verify()
    ).resolves.toBe(true)
  }, 30000)

  test("creates CSRs with SAN-only input and imported keys", async () => {
    const sanOnlyResult = await createCsr(
      { ...baseInput, subject: emptySubject },
      cryptoProvider
    )
    const subjectOnlyResult = await createCsr(
      { ...baseInput, san: emptySan() },
      cryptoProvider
    )
    const importedRsa = await createCsr(
      { ...baseInput, keySource: "import", keyPem: rsaPrivatePem },
      cryptoProvider
    )
    const importedEc = await createCsr(
      {
        ...baseInput,
        keySource: "import",
        keyPem: ecdsaPrivatePem,
        algorithm: "ecdsa",
      },
      cryptoProvider
    )

    expect(sanOnlyResult.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
    expect(subjectOnlyResult.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
    expect(importedRsa.privateKeyPem).toBeUndefined()
    expect(importedEc.privateKeyPem).toBeUndefined()
  }, 30000)

  test("rejects missing private keys, unknown algorithms, and bad key results", async () => {
    await expect(
      createCsr(
        { ...baseInput, keySource: "import", keyPem: " " },
        cryptoProvider
      )
    ).rejects.toThrowError(CsrGeneratorError)
    await expect(
      createCsr(
        { ...baseInput, algorithm: "unknown" as KeyAlgorithm },
        cryptoProvider
      )
    ).rejects.toThrowError(CsrGeneratorError)
    expect(() => ensureKeyPair({} as CryptoKey)).toThrowError(CsrGeneratorError)
  })

  test("exposes import and signing algorithm helpers", () => {
    expect(getImportAlgorithm({ type: "rsa" }, baseInput)).toMatchObject({
      name: "RSASSA-PKCS1-v1_5",
    })
    expect(
      getImportAlgorithm({ type: "ecdsa", curve: "P-256" }, baseInput)
    ).toMatchObject({ name: "ECDSA", namedCurve: "P-256" })
    expect(getSigningAlgorithm({ type: "rsa" }, baseInput)).toMatchObject({
      name: "RSASSA-PKCS1-v1_5",
    })
    expect(
      getSigningAlgorithm({ type: "ecdsa", curve: "P-384" }, baseInput)
    ).toMatchObject({ name: "ECDSA", hash: { name: "SHA-384" } })
  })
})

function emptySan() {
  return {
    dns: [],
    ip: [],
    email: [],
    uri: [],
  }
}
