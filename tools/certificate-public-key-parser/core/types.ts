/* v8 ignore file */

type AlgorithmInfo = Algorithm & {
  hash?: Algorithm
  modulusLength?: number
  namedCurve?: string
}

type Fingerprints = Readonly<{
  sha1: string
  sha256: string
}>

type CertificateExtensions = {
  subjectAlternativeNames?: readonly string[]
  keyUsage?: readonly string[]
  extendedKeyUsage?: readonly string[]
  basicConstraints?: string
  subjectKeyIdentifier?: string
  authorityKeyIdentifier?: string
}

type CertificateEntry = Readonly<{
  type: "certificate"
  label: string
  subject: string
  issuer: string
  serialNumber: string
  notBefore: string
  notAfter: string
  signatureAlgorithm: string
  publicKeyAlgorithm: string
  publicKeySize?: number
  publicKeyCurve?: string
  fingerprints: Fingerprints
  extensions: CertificateExtensions
}>

type PublicKeyEntry = Readonly<{
  type: "publicKey"
  label: string
  algorithm: string
  keySize?: number
  curve?: string
  fingerprints: Fingerprints
}>

type ParsedCertificateEntry = CertificateEntry | PublicKeyEntry

type CertificateParserMessages = Readonly<{
  invalidInput: string
  invalidPem: string
  parseFailed: string
  notAvailable: string
  webCryptoUnavailable: string
  unsupportedPemBlock: (label: string) => string
  certificateLabel: (index: number) => string
  publicKeyLabel: (index: number) => string
}>

type CertificateParseResult = Readonly<{
  entries: readonly ParsedCertificateEntry[]
  warnings: readonly string[]
}>

export type {
  AlgorithmInfo,
  CertificateEntry,
  CertificateExtensions,
  CertificateParseResult,
  CertificateParserMessages,
  ParsedCertificateEntry,
  PublicKeyEntry,
}
