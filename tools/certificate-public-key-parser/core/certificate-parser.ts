import { PublicKey, X509Certificate } from "@peculiar/x509"

import {
  base64ToArrayBuffer,
  computeFingerprints,
  describeKey,
  extractExtensions,
  extractPemBlocks,
  formatAlgorithm,
  formatHexString,
  isBase64Input,
  isCertificateLabel,
} from "./certificate-helpers"
import type {
  AlgorithmInfo,
  CertificateEntry,
  CertificateParseResult,
  CertificateParserMessages,
  ParsedCertificateEntry,
  PublicKeyEntry,
} from "./types"

async function parseCertificateInput(
  input: string | File,
  messages: CertificateParserMessages
): Promise<CertificateParseResult> {
  if (typeof input === "string") {
    return parseTextInput(input, messages)
  }

  const preview = await input.slice(0, 2048).text()
  if (preview.includes("-----BEGIN")) {
    return parsePem(await input.text(), messages)
  }

  return {
    entries: await parseDer(
      await input.arrayBuffer(),
      input.name || messages.certificateLabel(1),
      messages
    ),
    warnings: [],
  }
}

async function parseTextInput(
  input: string,
  messages: CertificateParserMessages
): Promise<CertificateParseResult> {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return { entries: [], warnings: [] }
  }

  if (trimmedInput.includes("-----BEGIN")) {
    return parsePem(trimmedInput, messages)
  }

  if (!isBase64Input(trimmedInput)) {
    throw new Error(messages.invalidInput)
  }

  let buffer: ArrayBuffer
  try {
    buffer = base64ToArrayBuffer(trimmedInput)
  } catch {
    throw new Error(messages.invalidInput)
  }

  return {
    entries: await parseDer(buffer, messages.certificateLabel(1), messages),
    warnings: [],
  }
}

async function parsePem(
  input: string,
  messages: CertificateParserMessages
): Promise<CertificateParseResult> {
  const blocks = extractPemBlocks(input)

  if (blocks.length === 0) {
    throw new Error(messages.invalidPem)
  }

  const entries: ParsedCertificateEntry[] = []
  const warnings: string[] = []
  let certificateIndex = 0
  let publicKeyIndex = 0

  for (const block of blocks) {
    const label = block.label.toUpperCase()

    if (isCertificateLabel(label)) {
      certificateIndex += 1
      try {
        entries.push(
          await parseCertificate(
            block.der,
            messages.certificateLabel(certificateIndex),
            messages
          )
        )
      } catch (error) {
        if (isWebCryptoError(error, messages)) {
          throw error
        }
        warnings.push(`${messages.parseFailed} (${block.label})`)
      }
      continue
    }

    if (label === "PUBLIC KEY") {
      publicKeyIndex += 1
      try {
        entries.push(
          await parsePublicKey(
            block.der,
            messages.publicKeyLabel(publicKeyIndex),
            messages
          )
        )
      } catch (error) {
        if (isWebCryptoError(error, messages)) {
          throw error
        }
        warnings.push(`${messages.parseFailed} (${block.label})`)
      }
      continue
    }

    warnings.push(messages.unsupportedPemBlock(block.label))
  }

  if (entries.length === 0) {
    throw new Error(warnings[0] || messages.parseFailed)
  }

  return { entries, warnings }
}

async function parseDer(
  buffer: ArrayBuffer,
  label: string,
  messages: CertificateParserMessages
): Promise<readonly ParsedCertificateEntry[]> {
  try {
    return [await parseCertificate(buffer, label, messages)]
  } catch (error) {
    if (isWebCryptoError(error, messages)) {
      throw error
    }
    // DER input can be either a full certificate or a SubjectPublicKeyInfo key.
  }

  try {
    return [await parsePublicKey(buffer, label, messages)]
  } catch (error) {
    if (isWebCryptoError(error, messages)) {
      throw error
    }
    throw new Error(messages.parseFailed)
  }
}

async function parseCertificate(
  buffer: ArrayBuffer,
  label: string,
  messages: CertificateParserMessages
): Promise<CertificateEntry> {
  const certificate = new X509Certificate(buffer)
  const keyInfo = describeKey(certificate.publicKey, messages)

  return {
    type: "certificate",
    label,
    subject: certificate.subject,
    issuer: certificate.issuer,
    serialNumber: formatHexString(certificate.serialNumber),
    notBefore: certificate.notBefore.toISOString(),
    notAfter: certificate.notAfter.toISOString(),
    signatureAlgorithm: formatAlgorithm(
      certificate.signatureAlgorithm as AlgorithmInfo,
      messages
    ),
    publicKeyAlgorithm: keyInfo.algorithm,
    publicKeySize: keyInfo.size,
    publicKeyCurve: keyInfo.curve,
    fingerprints: await computeFingerprints(certificate.rawData, messages),
    extensions: extractExtensions(certificate),
  }
}

async function parsePublicKey(
  buffer: ArrayBuffer,
  label: string,
  messages: CertificateParserMessages
): Promise<PublicKeyEntry> {
  const publicKey = new PublicKey(buffer)
  const keyInfo = describeKey(publicKey, messages)

  return {
    type: "publicKey",
    label,
    algorithm: keyInfo.algorithm,
    keySize: keyInfo.size,
    curve: keyInfo.curve,
    fingerprints: await computeFingerprints(publicKey.rawData, messages),
  }
}

function isWebCryptoError(error: unknown, messages: CertificateParserMessages) {
  return (
    error instanceof Error && error.message === messages.webCryptoUnavailable
  )
}

export { parseCertificateInput }
