import {
  DNS,
  EMAIL,
  GeneralName,
  IP,
  PemConverter,
  Pkcs10CertificateRequestGenerator,
  SubjectAlternativeNameExtension,
  URL,
  type JsonName,
} from "@peculiar/x509"
import { isIP } from "is-ip"

import { CsrGeneratorError } from "./errors"
import { createKeyResult, ensureCryptoProvider } from "./keys"
import type { CsrCreateInput, CsrOutput, SanInput, SubjectInput } from "./types"

async function createCsr(
  input: CsrCreateInput,
  cryptoProvider: Crypto | undefined = globalThis.crypto
): Promise<CsrOutput> {
  const crypto = ensureCryptoProvider(cryptoProvider)
  const subject = buildSubjectJson(input.subject)
  const sanNames = buildSanNames(input.san)

  if (!subject && sanNames.length === 0) {
    throw new CsrGeneratorError("errorMissingSubjectOrSan")
  }

  const keyResult = await createKeyResult(input, crypto)
  const extensions = sanNames.length
    ? [new SubjectAlternativeNameExtension(sanNames)]
    : undefined
  const csr = await Pkcs10CertificateRequestGenerator.create(
    {
      name: subject ?? undefined,
      keys: keyResult.keys,
      signingAlgorithm: keyResult.signingAlgorithm,
      extensions,
    },
    crypto
  )

  let privateKeyPem: string | undefined
  if (input.keySource === "generate") {
    const pkcs8 = await crypto.subtle.exportKey(
      "pkcs8",
      keyResult.keys.privateKey
    )
    privateKeyPem = PemConverter.encode(pkcs8, PemConverter.PrivateKeyTag)
  }

  return {
    csrPem: csr.toString("pem"),
    privateKeyPem,
    keyAlgorithmLabel: keyResult.keyAlgorithmLabel,
  }
}

function buildSubjectJson(subject: SubjectInput): JsonName | null {
  const name: Record<string, string[]> = {}

  addSubjectField(name, "CN", subject.commonName)
  addSubjectField(name, "O", subject.organization)
  addSubjectField(name, "OU", subject.organizationalUnit)
  addSubjectField(name, "C", subject.country)
  addSubjectField(name, "ST", subject.state)
  addSubjectField(name, "L", subject.locality)
  addSubjectField(name, "emailAddress", subject.emailAddress)

  return Object.keys(name).length ? [name] : null
}

function addSubjectField(
  name: Record<string, string[]>,
  key: string,
  value: string
) {
  const trimmed = value.trim()
  if (trimmed) {
    name[key] = [trimmed]
  }
}

function buildSanNames(san: SanInput): GeneralName[] {
  const names: GeneralName[] = []
  addNames(san.dns, (value) => new GeneralName(DNS, value), names)
  addNames(san.email, (value) => new GeneralName(EMAIL, value), names)
  addNames(san.uri, (value) => new GeneralName(URL, value), names)

  for (const value of cleanList(san.ip)) {
    if (!isIP(value)) {
      throw new CsrGeneratorError("errorInvalidSanIp", { message: value })
    }
    names.push(new GeneralName(IP, value))
  }

  return names
}

function addNames(
  values: readonly string[],
  builder: (value: string) => GeneralName,
  names: GeneralName[]
) {
  for (const value of cleanList(values)) {
    names.push(builder(value))
  }
}

function cleanList(values: readonly string[]): readonly string[] {
  return values.map((value) => value.trim()).filter(Boolean)
}

function splitSanInput(value: string): readonly string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export { buildSanNames, buildSubjectJson, createCsr, splitSanInput }
export { CsrGeneratorError }
export { base64UrlToBytes, formatKeyAlgorithmLabel } from "./labels"
export type {
  CsrCreateInput,
  CsrOutput,
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
  SubjectInput,
} from "./types"
