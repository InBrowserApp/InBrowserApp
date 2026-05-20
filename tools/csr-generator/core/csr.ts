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

import { CsrGeneratorError, type CsrErrorCode } from "./errors"
import {
  EC_CURVES,
  EC_CURVE_HASH,
  RSA_HASHES,
  RSA_KEY_SIZES,
  classifyRsaKeySize,
  generateKeyPair,
  importKeyPair,
  parsePrivateKeyPem,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeyResult,
  type RsaKeySize,
} from "./keys"

type KeySource = "generate" | "import"

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

  const keyResult = await resolveKeyResult(input, crypto)

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

async function resolveKeyResult(
  input: CsrGenerationInput,
  crypto: Crypto
): Promise<KeyResult> {
  try {
    return input.keySource === "generate"
      ? await generateKeyPair(input, crypto)
      : await importKeyPair(
          { keyPem: input.keyPem, rsaHash: input.rsaHash },
          crypto
        )
  } catch (error) {
    if (error instanceof CsrGeneratorError) throw error
    throw new CsrGeneratorError(
      "GENERATION_FAILED",
      error instanceof Error ? error.message : String(error)
    )
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
