import {
  AuthorityKeyIdentifierExtension,
  BasicConstraintsExtension,
  ExtendedKeyUsage,
  ExtendedKeyUsageExtension,
  KeyUsageFlags,
  KeyUsagesExtension,
  PublicKey,
  SubjectAlternativeNameExtension,
  SubjectKeyIdentifierExtension,
  X509Certificate,
} from "@peculiar/x509"

import type {
  AlgorithmInfo,
  CertificateExtensions,
  CertificateParserMessages,
} from "./types"

type PemBlock = Readonly<{
  label: string
  der: ArrayBuffer
}>

const KEY_USAGE_LABELS = [
  [KeyUsageFlags.digitalSignature, "Digital Signature"],
  [KeyUsageFlags.nonRepudiation, "Non Repudiation"],
  [KeyUsageFlags.keyEncipherment, "Key Encipherment"],
  [KeyUsageFlags.dataEncipherment, "Data Encipherment"],
  [KeyUsageFlags.keyAgreement, "Key Agreement"],
  [KeyUsageFlags.keyCertSign, "Key Cert Sign"],
  [KeyUsageFlags.cRLSign, "CRL Sign"],
  [KeyUsageFlags.encipherOnly, "Encipher Only"],
  [KeyUsageFlags.decipherOnly, "Decipher Only"],
] as const

const EXTENDED_KEY_USAGE_LABELS: Readonly<Record<string, string>> = {
  [ExtendedKeyUsage.serverAuth]: "TLS Web Server Authentication",
  [ExtendedKeyUsage.clientAuth]: "TLS Web Client Authentication",
  [ExtendedKeyUsage.codeSigning]: "Code Signing",
  [ExtendedKeyUsage.emailProtection]: "Email Protection",
  [ExtendedKeyUsage.timeStamping]: "Time Stamping",
  [ExtendedKeyUsage.ocspSigning]: "OCSP Signing",
}

const GENERAL_NAME_LABELS: Readonly<Record<string, string>> = {
  dns: "DNS",
  dn: "DN",
  email: "Email",
  ip: "IP",
  url: "URI",
  guid: "GUID",
  upn: "UPN",
  id: "Registered ID",
}

function extractPemBlocks(input: string): readonly PemBlock[] {
  const blocks: PemBlock[] = []
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g

  for (const match of input.matchAll(pattern)) {
    const label = match[1]?.trim()
    const body = match[2]?.replace(/[\r\n\s]/g, "")
    if (!label || !body) {
      continue
    }

    try {
      blocks.push({ label, der: base64ToArrayBuffer(body) })
    } catch {
      // Invalid PEM blocks are ignored so other blocks can still be parsed.
    }
  }

  return blocks
}

function isCertificateLabel(label: string) {
  const normalized = label.toUpperCase()
  return normalized.includes("CERTIFICATE") && !normalized.includes("REQUEST")
}

function isBase64Input(input: string) {
  const cleanedInput = input.replace(/\s+/g, "")
  return cleanedInput.length > 0 && /^[A-Za-z0-9+/=]+$/.test(cleanedInput)
}

function base64ToArrayBuffer(base64: string) {
  const binary = globalThis.atob(base64.replace(/\s+/g, ""))
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes.buffer
}

async function computeFingerprints(
  buffer: BufferSource,
  messages: CertificateParserMessages
) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error(messages.webCryptoUnavailable)
  }

  const [sha1, sha256] = await Promise.all([
    subtle.digest("SHA-1", buffer),
    subtle.digest("SHA-256", buffer),
  ])

  return {
    sha1: formatHex(sha1),
    sha256: formatHex(sha256),
  }
}

function describeKey(
  publicKey: PublicKey,
  messages: CertificateParserMessages
) {
  const algorithm = publicKey.algorithm as AlgorithmInfo

  return {
    algorithm: formatAlgorithm(algorithm, messages),
    size:
      typeof algorithm.modulusLength === "number"
        ? algorithm.modulusLength
        : undefined,
    curve: algorithm.namedCurve,
  }
}

function extractExtensions(
  certificate: X509Certificate
): CertificateExtensions {
  const extensions: CertificateExtensions = {}
  const subjectAltName = certificate.getExtension(
    SubjectAlternativeNameExtension
  )
  const keyUsage = certificate.getExtension(KeyUsagesExtension)
  const extendedKeyUsage = certificate.getExtension(ExtendedKeyUsageExtension)
  const basicConstraints = certificate.getExtension(BasicConstraintsExtension)
  const subjectKeyIdentifier = certificate.getExtension(
    SubjectKeyIdentifierExtension
  )
  const authorityKeyIdentifier = certificate.getExtension(
    AuthorityKeyIdentifierExtension
  )

  if (subjectAltName?.names?.items?.length) {
    extensions.subjectAlternativeNames = subjectAltName.names.items.map(
      (item) => formatGeneralName(item.type, item.value)
    )
  }

  if (keyUsage) {
    const usageList = KEY_USAGE_LABELS.filter(
      ([flag]) => (keyUsage.usages & flag) === flag
    ).map(([, usageLabel]) => usageLabel)

    if (usageList.length) {
      extensions.keyUsage = usageList
    }
  }

  if (extendedKeyUsage) {
    const usageList = extendedKeyUsage.usages.map(
      (usage) => EXTENDED_KEY_USAGE_LABELS[String(usage)] ?? String(usage)
    )

    if (usageList.length) {
      extensions.extendedKeyUsage = usageList
    }
  }

  if (basicConstraints) {
    const pathLength =
      typeof basicConstraints.pathLength === "number"
        ? `, Path Length: ${basicConstraints.pathLength}`
        : ""
    extensions.basicConstraints = `CA: ${basicConstraints.ca}${pathLength}`
  }

  if (subjectKeyIdentifier?.keyId) {
    extensions.subjectKeyIdentifier = formatHexString(
      subjectKeyIdentifier.keyId
    )
  }

  if (authorityKeyIdentifier?.keyId) {
    extensions.authorityKeyIdentifier = formatHexString(
      authorityKeyIdentifier.keyId
    )
  }

  return extensions
}

function formatGeneralName(type: string, value: string) {
  const label = GENERAL_NAME_LABELS[type] ?? type
  return `${label}: ${value}`
}

function formatAlgorithm(
  algorithm: AlgorithmInfo,
  messages: CertificateParserMessages
) {
  if (!algorithm || typeof algorithm !== "object" || !("name" in algorithm)) {
    return messages.notAvailable
  }

  const { name } = algorithm
  if (algorithm.hash && "name" in algorithm.hash) {
    return `${name} (${algorithm.hash.name})`
  }

  return name
}

function formatHexString(value: string) {
  const cleanedValue = value.replace(/^0x/i, "").replace(/[:\s]/g, "")
  if (!cleanedValue || !/^[0-9a-fA-F]+$/.test(cleanedValue)) {
    return value
  }

  const pairs = cleanedValue.match(/.{1,2}/g)
  return pairs!.join(":").toUpperCase()
}

function formatHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(":")
    .toUpperCase()
}

export {
  base64ToArrayBuffer,
  computeFingerprints,
  describeKey,
  extractExtensions,
  extractPemBlocks,
  formatAlgorithm,
  formatHexString,
  isBase64Input,
  isCertificateLabel,
}
