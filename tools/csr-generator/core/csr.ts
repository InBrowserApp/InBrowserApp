import {
  DNS,
  EMAIL,
  GeneralName,
  IP,
  PemConverter,
  Pkcs10CertificateRequestGenerator,
  SubjectAlternativeNameExtension,
  URL as URI_NAME,
  type JsonName,
} from "@peculiar/x509"
import { isIP } from "is-ip"

type KeySource = "generate" | "import"
type KeyAlgorithm = "rsa" | "ecdsa"
type RsaKeySize = 2048 | 3072 | 4096
type EcCurve = "P-256" | "P-384" | "P-521"
type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512"

type SubjectInput = Readonly<{
  commonName: string
  organization: string
  organizationalUnit: string
  country: string
  state: string
  locality: string
  emailAddress: string
}>

type SanInput = Readonly<{
  dns: readonly string[]
  ip: readonly string[]
  email: readonly string[]
  uri: readonly string[]
}>

type CsrGenerationInput = Readonly<{
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
  keyPem: string
  subject: SubjectInput
  san: SanInput
}>

type CsrResult = Readonly<{
  csrPem: string
  privateKeyPem?: string
  keyAlgorithmLabel: string
}>

type CsrGenerationRuntime = Readonly<{
  crypto?: Crypto
}>

type CsrErrorCode =
  | "MISSING_SUBJECT_OR_SAN"
  | "INVALID_SAN_IP"
  | "MISSING_PRIVATE_KEY"
  | "INVALID_PEM"
  | "UNSUPPORTED_PEM"
  | "LEGACY_PEM"
  | "ENCRYPTED_KEY"
  | "UNSUPPORTED_KEY_TYPE"
  | "UNSUPPORTED_CURVE"
  | "WEB_CRYPTO_UNAVAILABLE"
  | "IMPORT_FAILED"
  | "GENERATION_FAILED"

class CsrGeneratorError extends Error {
  readonly code: CsrErrorCode
  readonly detail?: string

  constructor(code: CsrErrorCode, detail?: string) {
    super(detail ? `${code}: ${detail}` : code)
    this.code = code
    this.detail = detail
  }
}

const RSA_KEY_SIZES = [2048, 3072, 4096] as const
const RSA_HASHES = ["SHA-256", "SHA-384", "SHA-512"] as const
const EC_CURVES = ["P-256", "P-384", "P-521"] as const

const EC_CURVE_HASH: Readonly<Record<EcCurve, HashAlgorithm>> = {
  "P-256": "SHA-256",
  "P-384": "SHA-384",
  "P-521": "SHA-512",
}

const LEGACY_KEY_LABELS = new Set(["RSA PRIVATE KEY", "EC PRIVATE KEY"])

async function generateCsr(
  input: CsrGenerationInput,
  runtime: CsrGenerationRuntime = {}
): Promise<CsrResult> {
  const crypto = getCrypto(runtime)
  const subject = buildSubjectJson(input.subject)
  const sanNames = buildSanNames(input.san)

  if (!subject && sanNames.length === 0) {
    throw new CsrGeneratorError("MISSING_SUBJECT_OR_SAN")
  }

  let keyResult: KeyResult
  try {
    keyResult =
      input.keySource === "generate"
        ? await generateKeyPair(input, crypto)
        : await importKeyPair(input, crypto)
  } catch (error) {
    if (error instanceof CsrGeneratorError) throw error
    throw new CsrGeneratorError(
      "GENERATION_FAILED",
      error instanceof Error ? error.message : String(error)
    )
  }

  const extensions = sanNames.length
    ? [new SubjectAlternativeNameExtension(sanNames)]
    : undefined

  let csr
  try {
    csr = await Pkcs10CertificateRequestGenerator.create(
      {
        name: subject ?? undefined,
        keys: keyResult.keys,
        signingAlgorithm: keyResult.signingAlgorithm,
        extensions,
      },
      crypto
    )
  } catch (error) {
    throw new CsrGeneratorError(
      "GENERATION_FAILED",
      error instanceof Error ? error.message : String(error)
    )
  }

  const csrPem = csr.toString("pem")

  let privateKeyPem: string | undefined
  if (input.keySource === "generate") {
    const pkcs8 = await crypto.subtle.exportKey(
      "pkcs8",
      keyResult.keys.privateKey
    )
    privateKeyPem = PemConverter.encode(pkcs8, PemConverter.PrivateKeyTag)
  }

  return {
    csrPem,
    privateKeyPem,
    keyAlgorithmLabel: keyResult.keyAlgorithmLabel,
  }
}

function buildSubjectJson(subject: SubjectInput): JsonName | null {
  const name: Record<string, string[]> = {}

  function addField(key: string, value: string) {
    const trimmed = value.trim()
    if (trimmed) {
      name[key] = [trimmed]
    }
  }

  addField("CN", subject.commonName)
  addField("O", subject.organization)
  addField("OU", subject.organizationalUnit)
  addField("C", subject.country)
  addField("ST", subject.state)
  addField("L", subject.locality)
  addField("emailAddress", subject.emailAddress)

  return Object.keys(name).length > 0 ? [name] : null
}

function buildSanNames(san: SanInput): GeneralName[] {
  const names: GeneralName[] = []

  function addNames(
    values: readonly string[],
    build: (value: string) => GeneralName
  ) {
    for (const value of values) {
      const trimmed = value.trim()
      if (trimmed) {
        names.push(build(trimmed))
      }
    }
  }

  addNames(san.dns, (value) => new GeneralName(DNS, value))
  addNames(san.email, (value) => new GeneralName(EMAIL, value))
  addNames(san.uri, (value) => new GeneralName(URI_NAME, value))

  for (const value of san.ip) {
    const trimmed = value.trim()
    if (!trimmed) continue
    if (!isIP(trimmed)) {
      throw new CsrGeneratorError("INVALID_SAN_IP", trimmed)
    }
    names.push(new GeneralName(IP, trimmed))
  }

  return names
}

type KeyResult = Readonly<{
  keys: CryptoKeyPair
  signingAlgorithm: Algorithm | EcdsaParams
  keyAlgorithmLabel: string
}>

async function generateKeyPair(
  input: CsrGenerationInput,
  crypto: Crypto
): Promise<KeyResult> {
  if (input.algorithm === "rsa") {
    const signingAlgorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: input.rsaHash },
    }
    const keys = (await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: input.rsaKeySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: input.rsaHash },
      },
      true,
      ["sign", "verify"]
    )) as CryptoKeyPair

    return {
      keys,
      signingAlgorithm,
      keyAlgorithmLabel: formatKeyLabel({
        algorithm: "rsa",
        rsaKeySize: input.rsaKeySize,
        rsaHash: input.rsaHash,
      }),
    }
  }

  const signingAlgorithm = {
    name: "ECDSA",
    hash: { name: EC_CURVE_HASH[input.ecCurve] },
  }
  const keys = (await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: input.ecCurve },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair

  return {
    keys,
    signingAlgorithm,
    keyAlgorithmLabel: formatKeyLabel({
      algorithm: "ecdsa",
      ecCurve: input.ecCurve,
    }),
  }
}

async function importKeyPair(
  input: CsrGenerationInput,
  crypto: Crypto
): Promise<KeyResult> {
  if (!input.keyPem.trim()) {
    throw new CsrGeneratorError("MISSING_PRIVATE_KEY")
  }

  const parsed = parsePrivateKeyPem(input.keyPem)
  const privateKey = await importPrivateKey(parsed, input, crypto)
  const publicKey = await derivePublicKey(privateKey, crypto)

  const signingAlgorithm: Algorithm | EcdsaParams =
    parsed.algorithm.type === "rsa"
      ? { name: "RSASSA-PKCS1-v1_5", hash: { name: input.rsaHash } }
      : {
          name: "ECDSA",
          hash: { name: EC_CURVE_HASH[parsed.algorithm.curve] },
        }

  const rsaModulusLength =
    parsed.algorithm.type === "rsa"
      ? (privateKey.algorithm as RsaHashedKeyAlgorithm).modulusLength
      : undefined

  const keyAlgorithmLabel =
    parsed.algorithm.type === "rsa"
      ? formatKeyLabel({
          algorithm: "rsa",
          rsaKeySize: classifyRsaKeySize(rsaModulusLength),
          rsaHash: input.rsaHash,
        })
      : formatKeyLabel({
          algorithm: "ecdsa",
          ecCurve: parsed.algorithm.curve,
        })

  return {
    keys: { privateKey, publicKey },
    signingAlgorithm,
    keyAlgorithmLabel,
  }
}

async function importPrivateKey(
  parsed: ParsedPemKey,
  input: CsrGenerationInput,
  crypto: Crypto
): Promise<CryptoKey> {
  const algorithm =
    parsed.algorithm.type === "rsa"
      ? { name: "RSASSA-PKCS1-v1_5", hash: { name: input.rsaHash } }
      : { name: "ECDSA", namedCurve: parsed.algorithm.curve }

  try {
    return await crypto.subtle.importKey("pkcs8", parsed.pkcs8, algorithm, true, [
      "sign",
    ])
  } catch (error) {
    throw new CsrGeneratorError(
      "IMPORT_FAILED",
      error instanceof Error ? error.message : String(error)
    )
  }
}

type ParsedPemKey = Readonly<{
  pkcs8: ArrayBuffer
  algorithm: { type: "rsa" } | { type: "ecdsa"; curve: EcCurve }
}>

function parsePrivateKeyPem(pem: string): ParsedPemKey {
  if (!PemConverter.isPem(pem)) {
    throw new CsrGeneratorError("INVALID_PEM")
  }

  const blocks = PemConverter.decodeWithHeaders(pem)

  if (blocks.some((block) => block.type === "ENCRYPTED PRIVATE KEY")) {
    throw new CsrGeneratorError("ENCRYPTED_KEY")
  }

  const legacy = blocks.find((block) => LEGACY_KEY_LABELS.has(block.type))
  if (legacy) {
    throw new CsrGeneratorError("LEGACY_PEM", legacy.type)
  }

  const pkcs8 = blocks.find((block) => block.type === "PRIVATE KEY")
  if (!pkcs8) {
    throw new CsrGeneratorError("UNSUPPORTED_PEM")
  }

  return identifyPkcs8(pkcs8.rawData)
}

const RSA_OID_BYTES = [
  0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
] as const
const EC_OID_BYTES = [
  0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
] as const
const EC_CURVE_OID_BYTES: Readonly<Record<EcCurve, readonly number[]>> = {
  "P-256": [0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07],
  "P-384": [0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22],
  "P-521": [0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x23],
}

function identifyPkcs8(raw: ArrayBuffer): ParsedPemKey {
  const bytes = new Uint8Array(raw)

  if (indexOfBytes(bytes, RSA_OID_BYTES) >= 0) {
    return { pkcs8: raw, algorithm: { type: "rsa" } }
  }

  if (indexOfBytes(bytes, EC_OID_BYTES) >= 0) {
    for (const curve of EC_CURVES) {
      if (indexOfBytes(bytes, EC_CURVE_OID_BYTES[curve]) >= 0) {
        return { pkcs8: raw, algorithm: { type: "ecdsa", curve } }
      }
    }
    throw new CsrGeneratorError("UNSUPPORTED_CURVE")
  }

  throw new CsrGeneratorError("UNSUPPORTED_KEY_TYPE")
}

function indexOfBytes(haystack: Uint8Array, needle: readonly number[]): number {
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        continue outer
      }
    }
    return i
  }
  return -1
}

async function derivePublicKey(
  privateKey: CryptoKey,
  crypto: Crypto
): Promise<CryptoKey> {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey)
  const publicJwk = toPublicJwk(jwk)
  return crypto.subtle.importKey(
    "jwk",
    publicJwk,
    privateKey.algorithm as Algorithm,
    true,
    ["verify"]
  )
}

function toPublicJwk(jwk: JsonWebKey): JsonWebKey {
  const publicJwk: JsonWebKey = { ...jwk }
  delete publicJwk.d
  delete publicJwk.p
  delete publicJwk.q
  delete publicJwk.dp
  delete publicJwk.dq
  delete publicJwk.qi
  delete publicJwk.oth
  publicJwk.key_ops = ["verify"]
  publicJwk.ext = true
  return publicJwk
}

function classifyRsaKeySize(modulusLength: number | undefined): RsaKeySize {
  if (!modulusLength) return 2048
  if (modulusLength >= 4096) return 4096
  if (modulusLength >= 3072) return 3072
  return 2048
}

type KeyLabelParams =
  | { algorithm: "rsa"; rsaKeySize: number; rsaHash: HashAlgorithm }
  | { algorithm: "ecdsa"; ecCurve: EcCurve }

function formatKeyLabel(params: KeyLabelParams): string {
  if (params.algorithm === "rsa") {
    return `RSA ${params.rsaKeySize} (${params.rsaHash})`
  }
  return `ECDSA ${params.ecCurve} (${EC_CURVE_HASH[params.ecCurve]})`
}

function getCrypto(runtime: CsrGenerationRuntime): Crypto {
  const crypto = runtime.crypto ?? globalThis.crypto
  if (!crypto?.subtle) {
    throw new CsrGeneratorError("WEB_CRYPTO_UNAVAILABLE")
  }
  return crypto
}

export {
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
}
export type {
  CsrErrorCode,
  CsrGenerationInput,
  CsrGenerationRuntime,
  CsrResult,
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
  SanInput,
  SubjectInput,
}
