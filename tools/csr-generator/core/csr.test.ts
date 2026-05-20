import { webcrypto } from "node:crypto"

import { PemConverter } from "@peculiar/x509"
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest"

import {
  CsrGeneratorError,
  EC_CURVES,
  EC_CURVE_HASH,
  RSA_HASHES,
  RSA_KEY_SIZES,
  buildSanNames,
  buildSubjectJson,
  classifyRsaKeySize,
  generateCsr,
  parsePrivateKeyPem,
  type CsrGenerationInput,
  type EcCurve,
  type HashAlgorithm,
  type RsaKeySize,
} from "./csr"

const realCrypto = webcrypto as unknown as Crypto

beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: realCrypto,
    })
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

const emptySubject = {
  commonName: "",
  organization: "",
  organizationalUnit: "",
  country: "",
  state: "",
  locality: "",
  emailAddress: "",
}

const emptySan = { dns: [], ip: [], email: [], uri: [] }

function buildInput(
  overrides: Partial<CsrGenerationInput> = {}
): CsrGenerationInput {
  return {
    keySource: "generate",
    algorithm: "rsa",
    rsaKeySize: 2048,
    rsaHash: "SHA-256",
    ecCurve: "P-256",
    keyPem: "",
    subject: {
      ...emptySubject,
      commonName: "example.com",
    },
    san: emptySan,
    ...overrides,
  }
}

async function exportPkcs8Pem(key: CryptoKey): Promise<string> {
  const pkcs8 = await realCrypto.subtle.exportKey("pkcs8", key)
  return PemConverter.encode(pkcs8, PemConverter.PrivateKeyTag)
}

describe("constants", () => {
  test("exports the supported algorithm enumerations", () => {
    expect(RSA_KEY_SIZES).toEqual([2048, 3072, 4096])
    expect(RSA_HASHES).toEqual(["SHA-256", "SHA-384", "SHA-512"])
    expect(EC_CURVES).toEqual(["P-256", "P-384", "P-521"])
    expect(EC_CURVE_HASH).toEqual({
      "P-256": "SHA-256",
      "P-384": "SHA-384",
      "P-521": "SHA-512",
    })
  })
})

describe("buildSubjectJson", () => {
  test("returns null when every field is blank", () => {
    expect(buildSubjectJson(emptySubject)).toBeNull()
    expect(buildSubjectJson({ ...emptySubject, commonName: "   " })).toBeNull()
  })

  test("includes only the fields that have a trimmed value", () => {
    const result = buildSubjectJson({
      commonName: "  example.com  ",
      organization: "Example Org",
      organizationalUnit: "",
      country: "US",
      state: "",
      locality: "San Francisco",
      emailAddress: "admin@example.com",
    })

    expect(result).toEqual([
      {
        CN: ["example.com"],
        O: ["Example Org"],
        C: ["US"],
        L: ["San Francisco"],
        emailAddress: ["admin@example.com"],
      },
    ])
  })
})

describe("buildSanNames", () => {
  test("trims and filters out blank values", () => {
    const names = buildSanNames({
      dns: ["  example.com  ", ""],
      ip: [],
      email: [" admin@example.com "],
      uri: ["https://example.com", "   "],
    })

    expect(names).toHaveLength(3)
  })

  test("accepts valid IPv4 and IPv6 addresses and skips blanks", () => {
    const names = buildSanNames({
      dns: [],
      ip: ["10.0.0.1", "::1", "   "],
      email: [],
      uri: [],
    })

    expect(names).toHaveLength(2)
  })

  test("rejects invalid IP entries with the dedicated error code", () => {
    try {
      buildSanNames({
        dns: [],
        ip: ["not-an-ip"],
        email: [],
        uri: [],
      })
      throw new Error("expected error")
    } catch (error) {
      expect(error).toBeInstanceOf(CsrGeneratorError)
      expect((error as CsrGeneratorError).code).toBe("INVALID_SAN_IP")
      expect((error as CsrGeneratorError).detail).toBe("not-an-ip")
    }
  })
})

describe("generateCsr - new key generation", () => {
  test("generates an RSA CSR with subject only", async () => {
    const result = await generateCsr(buildInput())

    expect(result.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
    expect(result.csrPem).toContain("END CERTIFICATE REQUEST")
    expect(result.privateKeyPem).toContain("BEGIN PRIVATE KEY")
    expect(result.keyAlgorithmLabel).toBe("RSA 2048 (SHA-256)")
  })

  test.each(
    RSA_KEY_SIZES.flatMap((size) => RSA_HASHES.map((hash) => ({ size, hash })))
  )("generates RSA $size/$hash", async ({ size, hash }) => {
    const result = await generateCsr(
      buildInput({
        rsaKeySize: size as RsaKeySize,
        rsaHash: hash as HashAlgorithm,
      })
    )

    expect(result.keyAlgorithmLabel).toBe(`RSA ${size} (${hash})`)
  })

  test.each(EC_CURVES)("generates ECDSA on curve %s", async (curve) => {
    const result = await generateCsr(
      buildInput({ algorithm: "ecdsa", ecCurve: curve as EcCurve })
    )

    expect(result.keyAlgorithmLabel).toBe(
      `ECDSA ${curve} (${EC_CURVE_HASH[curve as EcCurve]})`
    )
    expect(result.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
  })

  test("includes SAN extension when SAN entries are provided", async () => {
    const result = await generateCsr(
      buildInput({
        san: {
          dns: ["example.com", "www.example.com"],
          ip: ["10.0.0.1"],
          email: ["admin@example.com"],
          uri: ["https://example.com"],
        },
      })
    )

    expect(result.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
  })

  test("succeeds when SAN is provided but subject is empty", async () => {
    const result = await generateCsr(
      buildInput({
        subject: emptySubject,
        san: { dns: ["example.com"], ip: [], email: [], uri: [] },
      })
    )

    expect(result.csrPem).toContain("BEGIN CERTIFICATE REQUEST")
  })

  test("fails when both subject and SAN are empty", async () => {
    await expect(
      generateCsr(buildInput({ subject: emptySubject, san: emptySan }))
    ).rejects.toMatchObject({ code: "MISSING_SUBJECT_OR_SAN" })
  })

  test("propagates INVALID_SAN_IP errors", async () => {
    await expect(
      generateCsr(
        buildInput({
          san: { dns: [], ip: ["definitely-not-ip"], email: [], uri: [] },
        })
      )
    ).rejects.toMatchObject({ code: "INVALID_SAN_IP" })
  })

  test("wraps key generation errors with GENERATION_FAILED", async () => {
    const provider = createGenerationFailureCrypto()

    await expect(
      generateCsr(buildInput(), { crypto: provider })
    ).rejects.toMatchObject({ code: "GENERATION_FAILED" })
  })

  test("wraps non-Error key generation throwables with GENERATION_FAILED", async () => {
    const provider = createGenerationFailureCrypto({ throwValue: "non-error" })

    await expect(
      generateCsr(buildInput(), { crypto: provider })
    ).rejects.toMatchObject({ code: "GENERATION_FAILED" })
  })

  test("wraps CSR signing errors with GENERATION_FAILED", async () => {
    const subtle = {
      ...realCrypto.subtle,
      generateKey: realCrypto.subtle.generateKey.bind(realCrypto.subtle),
      importKey: realCrypto.subtle.importKey.bind(realCrypto.subtle),
      exportKey: realCrypto.subtle.exportKey.bind(realCrypto.subtle),
      digest: realCrypto.subtle.digest.bind(realCrypto.subtle),
      verify: realCrypto.subtle.verify.bind(realCrypto.subtle),
      sign: vi.fn(() => Promise.reject(new Error("signing broke"))),
    } as unknown as SubtleCrypto

    const provider: Crypto = {
      ...realCrypto,
      subtle,
      getRandomValues: realCrypto.getRandomValues.bind(realCrypto),
    } as Crypto

    await expect(
      generateCsr(buildInput(), { crypto: provider })
    ).rejects.toMatchObject({ code: "GENERATION_FAILED" })
  })

  test("wraps non-Error CSR signing throwables with GENERATION_FAILED", async () => {
    const subtle = {
      ...realCrypto.subtle,
      generateKey: realCrypto.subtle.generateKey.bind(realCrypto.subtle),
      importKey: realCrypto.subtle.importKey.bind(realCrypto.subtle),
      exportKey: realCrypto.subtle.exportKey.bind(realCrypto.subtle),
      digest: realCrypto.subtle.digest.bind(realCrypto.subtle),
      verify: realCrypto.subtle.verify.bind(realCrypto.subtle),
      sign: vi.fn(() => Promise.reject("opaque-failure")),
    } as unknown as SubtleCrypto

    const provider: Crypto = {
      ...realCrypto,
      subtle,
      getRandomValues: realCrypto.getRandomValues.bind(realCrypto),
    } as Crypto

    await expect(
      generateCsr(buildInput(), { crypto: provider })
    ).rejects.toMatchObject({ code: "GENERATION_FAILED" })
  })

  test("throws WEB_CRYPTO_UNAVAILABLE when subtle is missing", async () => {
    await expect(
      generateCsr(buildInput(), { crypto: {} as Crypto })
    ).rejects.toMatchObject({ code: "WEB_CRYPTO_UNAVAILABLE" })
  })
})

describe("generateCsr - importing keys", () => {
  test("imports a PKCS#8 RSA key and signs with the requested hash", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    const result = await generateCsr(
      buildInput({ keySource: "import", keyPem, rsaHash: "SHA-384" })
    )

    expect(result.privateKeyPem).toBeUndefined()
    expect(result.keyAlgorithmLabel).toBe("RSA 2048 (SHA-384)")
  })

  test("derives the RSA key size from the imported modulus", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 3072,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    const result = await generateCsr(
      buildInput({ keySource: "import", keyPem })
    )

    expect(result.keyAlgorithmLabel).toBe("RSA 3072 (SHA-256)")
  })

  test("classifies the RSA key size bucket from the modulus length", () => {
    expect(classifyRsaKeySize(undefined)).toBe(2048)
    expect(classifyRsaKeySize(2048)).toBe(2048)
    expect(classifyRsaKeySize(3072)).toBe(3072)
    expect(classifyRsaKeySize(4096)).toBe(4096)
    expect(classifyRsaKeySize(8192)).toBe(4096)
  })

  test("imports a PKCS#8 ECDSA key", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-384" },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    const result = await generateCsr(
      buildInput({
        keySource: "import",
        algorithm: "ecdsa",
        ecCurve: "P-384",
        keyPem,
      })
    )

    expect(result.keyAlgorithmLabel).toBe("ECDSA P-384 (SHA-384)")
  })

  test("rejects an empty private key input", async () => {
    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem: "   " }))
    ).rejects.toMatchObject({ code: "MISSING_PRIVATE_KEY" })
  })

  test("rejects non-PEM input", async () => {
    await expect(
      generateCsr(
        buildInput({ keySource: "import", keyPem: "definitely not a pem" })
      )
    ).rejects.toMatchObject({ code: "INVALID_PEM" })
  })

  test("rejects encrypted PKCS#8 keys", async () => {
    const encryptedPem =
      "-----BEGIN ENCRYPTED PRIVATE KEY-----\nYWJjZGVm\n-----END ENCRYPTED PRIVATE KEY-----\n"

    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem: encryptedPem }))
    ).rejects.toMatchObject({ code: "ENCRYPTED_KEY" })
  })

  test("rejects legacy PKCS#1 RSA PEM with a dedicated code", async () => {
    const legacyPem =
      "-----BEGIN RSA PRIVATE KEY-----\nYWJjZGVm\n-----END RSA PRIVATE KEY-----\n"

    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem: legacyPem }))
    ).rejects.toMatchObject({ code: "LEGACY_PEM" })
  })

  test("rejects legacy SEC1 EC PEM with a dedicated code", async () => {
    const legacyPem =
      "-----BEGIN EC PRIVATE KEY-----\nYWJjZGVm\n-----END EC PRIVATE KEY-----\n"

    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem: legacyPem }))
    ).rejects.toMatchObject({ code: "LEGACY_PEM" })
  })

  test("rejects PEM blocks that are not private keys", async () => {
    const certPem =
      "-----BEGIN CERTIFICATE-----\nYWJjZGVm\n-----END CERTIFICATE-----\n"

    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem: certPem }))
    ).rejects.toMatchObject({ code: "UNSUPPORTED_PEM" })
  })

  test("flags unknown key types", async () => {
    // X25519 has a different OID and is not supported
    const sourceKeys = (await realCrypto.subtle
      .generateKey({ name: "X25519" }, true, ["deriveKey", "deriveBits"])
      .catch(() => null)) as CryptoKeyPair | null

    if (!sourceKeys) {
      // Skip if the runtime does not support X25519
      return
    }

    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    await expect(
      generateCsr(buildInput({ keySource: "import", keyPem }))
    ).rejects.toMatchObject({ code: "UNSUPPORTED_KEY_TYPE" })
  })

  test("wraps importKey errors with IMPORT_FAILED", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    const subtle = {
      ...realCrypto.subtle,
      importKey: vi.fn(() => {
        return Promise.reject(new Error("not a real key"))
      }),
    } as unknown as SubtleCrypto

    const provider: Crypto = {
      ...realCrypto,
      subtle,
      getRandomValues: realCrypto.getRandomValues.bind(realCrypto),
    } as Crypto

    await expect(
      generateCsr(
        buildInput({
          keySource: "import",
          algorithm: "ecdsa",
          ecCurve: "P-256",
          keyPem,
        }),
        { crypto: provider }
      )
    ).rejects.toMatchObject({ code: "IMPORT_FAILED" })
  })

  test("wraps non-Error import throwables with IMPORT_FAILED", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const keyPem = await exportPkcs8Pem(sourceKeys.privateKey)

    const subtle = {
      ...realCrypto.subtle,
      importKey: vi.fn(() => {
        throw "broke"
      }),
    } as unknown as SubtleCrypto

    const provider: Crypto = {
      ...realCrypto,
      subtle,
      getRandomValues: realCrypto.getRandomValues.bind(realCrypto),
    } as Crypto

    await expect(
      generateCsr(
        buildInput({
          keySource: "import",
          algorithm: "ecdsa",
          ecCurve: "P-256",
          keyPem,
        }),
        { crypto: provider }
      )
    ).rejects.toMatchObject({ code: "IMPORT_FAILED" })
  })
})

describe("parsePrivateKeyPem - synthetic", () => {
  test("rejects an EC key whose curve OID is unknown", () => {
    const ecOidBytes = [0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01]
    const padding = [0x00, 0x00, 0x00, 0x00, 0x00]
    const bytes = new Uint8Array([...ecOidBytes, ...padding])
    const base64 = Buffer.from(bytes).toString("base64")
    const syntheticPem = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----\n`

    expect(() => parsePrivateKeyPem(syntheticPem)).toThrow(
      expect.objectContaining({ code: "UNSUPPORTED_CURVE" })
    )
  })
})

describe("parsePrivateKeyPem", () => {
  test("parses a freshly generated RSA PKCS#8 key", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const pem = await exportPkcs8Pem(sourceKeys.privateKey)

    const parsed = parsePrivateKeyPem(pem)

    expect(parsed.algorithm.type).toBe("rsa")
    expect(parsed.pkcs8.byteLength).toBeGreaterThan(100)
  })

  test("parses an ECDSA PKCS#8 key and reports the curve", async () => {
    const sourceKeys = (await realCrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-521" },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair
    const pem = await exportPkcs8Pem(sourceKeys.privateKey)

    const parsed = parsePrivateKeyPem(pem)

    expect(parsed.algorithm).toEqual({ type: "ecdsa", curve: "P-521" })
  })
})

function createGenerationFailureCrypto(
  options: { throwValue?: unknown } = {}
): Crypto {
  const subtle = {
    generateKey: vi.fn(async () => {
      throw options.throwValue ?? new Error("nope")
    }),
    importKey: realCrypto.subtle.importKey.bind(realCrypto.subtle),
    exportKey: realCrypto.subtle.exportKey.bind(realCrypto.subtle),
    digest: realCrypto.subtle.digest.bind(realCrypto.subtle),
    sign: realCrypto.subtle.sign.bind(realCrypto.subtle),
    verify: realCrypto.subtle.verify.bind(realCrypto.subtle),
  } as unknown as SubtleCrypto

  return {
    ...realCrypto,
    subtle,
    getRandomValues: realCrypto.getRandomValues.bind(realCrypto),
  } as Crypto
}
