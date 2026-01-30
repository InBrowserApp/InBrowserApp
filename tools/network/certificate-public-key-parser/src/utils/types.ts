export type AlgorithmInfo = Algorithm & {
  hash?: Algorithm
  modulusLength?: number
  namedCurve?: string
}

export type Fingerprints = {
  sha1: string
  sha256: string
}

export type CertificateExtensions = {
  subjectAlternativeNames?: string[]
  keyUsage?: string[]
  extendedKeyUsage?: string[]
  basicConstraints?: string
  subjectKeyIdentifier?: string
  authorityKeyIdentifier?: string
}

export type CertificateEntry = {
  type: 'certificate'
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
}

export type PublicKeyEntry = {
  type: 'publicKey'
  label: string
  algorithm: string
  keySize?: number
  curve?: string
  fingerprints: Fingerprints
}

export type ParsedEntry = CertificateEntry | PublicKeyEntry

export type ParseState =
  | { state: 'empty' }
  | { state: 'error'; message: string }
  | { state: 'parsed'; entries: ParsedEntry[]; warnings: string[] }
