import {
  AuthorityKeyIdentifierExtension,
  BasicConstraintsExtension,
  ExtendedKeyUsageExtension,
  KeyUsagesExtension,
  PublicKey,
  SubjectAlternativeNameExtension,
  SubjectKeyIdentifierExtension,
  X509Certificate,
} from '@peculiar/x509'
import {
  base64ToArrayBuffer,
  computeFingerprints,
  extractPemBlocks,
  extendedKeyUsageLabels,
  formatGeneralName,
  formatHexString,
  isBase64Input,
  isCertificateLabel,
  keyUsageLabels,
} from './parsing'
import type {
  AlgorithmInfo,
  CertificateEntry,
  CertificateExtensions,
  ParsedEntry,
  ParseState,
  PublicKeyEntry,
} from './types'

export type ParserMessages = {
  invalidInput: string
  invalidPem: string
  parseFailed: string
  notAvailable: string
  unsupportedPemBlock: (label: string) => string
  certificateTab: (index: number) => string
  publicKeyTab: (index: number) => string
}

export async function parseCertificateInput(
  input: string | File,
  messages: ParserMessages,
): Promise<ParseState> {
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed) {
      return { state: 'empty' }
    }

    if (trimmed.includes('-----BEGIN')) {
      const { entries: parsedEntries, warnings: parsedWarnings } = await parsePem(trimmed, messages)
      return { state: 'parsed', entries: parsedEntries, warnings: parsedWarnings }
    }

    if (isBase64Input(trimmed)) {
      const buffer = base64ToArrayBuffer(trimmed)
      const parsedEntries = await parseDer(buffer, messages.certificateTab(1), messages)
      return { state: 'parsed', entries: parsedEntries, warnings: [] }
    }

    throw new Error(messages.invalidInput)
  }

  const preview = await input.slice(0, 2048).text()
  if (preview.includes('-----BEGIN')) {
    const text = await input.text()
    const { entries: parsedEntries, warnings: parsedWarnings } = await parsePem(text, messages)
    return { state: 'parsed', entries: parsedEntries, warnings: parsedWarnings }
  }

  const buffer = await input.arrayBuffer()
  const parsedEntries = await parseDer(buffer, input.name || messages.certificateTab(1), messages)
  return { state: 'parsed', entries: parsedEntries, warnings: [] }
}

async function parsePem(
  text: string,
  messages: ParserMessages,
): Promise<{ entries: ParsedEntry[]; warnings: string[] }> {
  const blocks = extractPemBlocks(text)
  if (blocks.length === 0) {
    throw new Error(messages.invalidPem)
  }

  const entries: ParsedEntry[] = []
  const warnings: string[] = []
  let certificateIndex = 0
  let publicKeyIndex = 0

  for (const block of blocks) {
    const label = block.label.toUpperCase()
    if (isCertificateLabel(label)) {
      certificateIndex += 1
      const entryLabel = messages.certificateTab(certificateIndex)
      try {
        entries.push(await parseCertificate(block.der, entryLabel, messages))
      } catch {
        warnings.push(`${messages.parseFailed} (${block.label})`)
      }
      continue
    }

    if (label === 'PUBLIC KEY') {
      publicKeyIndex += 1
      const entryLabel = messages.publicKeyTab(publicKeyIndex)
      try {
        entries.push(await parsePublicKey(block.der, entryLabel, messages))
      } catch {
        warnings.push(`${messages.parseFailed} (${block.label})`)
      }
      continue
    }

    warnings.push(messages.unsupportedPemBlock(block.label))
  }

  if (entries.length === 0) {
    throw new Error(warnings[0] ?? messages.parseFailed)
  }

  return { entries, warnings }
}

async function parseDer(
  buffer: ArrayBuffer,
  label: string,
  messages: ParserMessages,
): Promise<ParsedEntry[]> {
  try {
    const cert = await parseCertificate(buffer, label, messages)
    return [cert]
  } catch {
    // Continue to public key parsing.
  }

  try {
    const key = await parsePublicKey(buffer, label, messages)
    return [key]
  } catch {
    throw new Error(messages.parseFailed)
  }
}

async function parseCertificate(
  buffer: ArrayBuffer,
  label: string,
  messages: ParserMessages,
): Promise<CertificateEntry> {
  const cert = new X509Certificate(buffer)
  const publicKey = cert.publicKey
  const keyInfo = describeKey(publicKey, messages)

  return {
    type: 'certificate',
    label,
    subject: cert.subject,
    issuer: cert.issuer,
    serialNumber: formatHexString(cert.serialNumber),
    notBefore: cert.notBefore.toISOString(),
    notAfter: cert.notAfter.toISOString(),
    signatureAlgorithm: formatAlgorithm(cert.signatureAlgorithm as AlgorithmInfo, messages),
    publicKeyAlgorithm: keyInfo.algorithm,
    publicKeySize: keyInfo.size,
    publicKeyCurve: keyInfo.curve,
    fingerprints: await computeFingerprints(cert.rawData),
    extensions: extractExtensions(cert),
  }
}

async function parsePublicKey(
  buffer: ArrayBuffer,
  label: string,
  messages: ParserMessages,
): Promise<PublicKeyEntry> {
  const publicKey = new PublicKey(buffer)
  const keyInfo = describeKey(publicKey, messages)

  return {
    type: 'publicKey',
    label,
    algorithm: keyInfo.algorithm,
    keySize: keyInfo.size,
    curve: keyInfo.curve,
    fingerprints: await computeFingerprints(publicKey.rawData),
  }
}

function describeKey(
  publicKey: PublicKey,
  messages: ParserMessages,
): { algorithm: string; size?: number; curve?: string } {
  const algorithm = publicKey.algorithm as AlgorithmInfo

  return {
    algorithm: formatAlgorithm(algorithm, messages),
    size: typeof algorithm.modulusLength === 'number' ? algorithm.modulusLength : undefined,
    curve: algorithm.namedCurve,
  }
}

function extractExtensions(cert: X509Certificate): CertificateExtensions {
  const extensions: CertificateExtensions = {}

  const subjectAltName = cert.getExtension(SubjectAlternativeNameExtension)
  if (subjectAltName?.names?.items?.length) {
    extensions.subjectAlternativeNames = subjectAltName.names.items.map((item) =>
      formatGeneralName(item.type, item.value),
    )
  }

  const keyUsage = cert.getExtension(KeyUsagesExtension)
  if (keyUsage) {
    const usageList = keyUsageLabels
      .filter(([flag]) => (keyUsage.usages & flag) === flag)
      .map(([, label]) => label)

    if (usageList.length) {
      extensions.keyUsage = usageList
    }
  }

  const extendedKeyUsage = cert.getExtension(ExtendedKeyUsageExtension)
  if (extendedKeyUsage) {
    const usageList = extendedKeyUsage.usages.map(
      (usage) => extendedKeyUsageLabels[usage as string] ?? String(usage),
    )

    if (usageList.length) {
      extensions.extendedKeyUsage = usageList
    }
  }

  const basicConstraints = cert.getExtension(BasicConstraintsExtension)
  if (basicConstraints) {
    const pathLength =
      typeof basicConstraints.pathLength === 'number'
        ? `, Path Length: ${basicConstraints.pathLength}`
        : ''
    extensions.basicConstraints = `CA: ${basicConstraints.ca}${pathLength}`
  }

  const subjectKeyIdentifier = cert.getExtension(SubjectKeyIdentifierExtension)
  if (subjectKeyIdentifier?.keyId) {
    extensions.subjectKeyIdentifier = formatHexString(subjectKeyIdentifier.keyId)
  }

  const authorityKeyIdentifier = cert.getExtension(AuthorityKeyIdentifierExtension)
  if (authorityKeyIdentifier?.keyId) {
    extensions.authorityKeyIdentifier = formatHexString(authorityKeyIdentifier.keyId)
  }

  return extensions
}

function formatAlgorithm(algorithm: AlgorithmInfo, messages: ParserMessages): string {
  if (!algorithm || typeof algorithm !== 'object' || !('name' in algorithm)) {
    return messages.notAvailable
  }

  const name = algorithm.name
  if (algorithm.hash && typeof algorithm.hash === 'object' && 'name' in algorithm.hash) {
    return `${name} (${algorithm.hash.name})`
  }

  return name
}
