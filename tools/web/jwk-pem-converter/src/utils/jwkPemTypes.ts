export type KeyType = 'RSA' | 'EC' | 'OKP' | 'Unknown'
export type OkpCurve = 'Ed25519' | 'Ed448' | 'X25519' | 'X448'
export type EcCurve = 'P-256' | 'P-384' | 'P-521'
export type PemOutputType = 'public' | 'private'
export type WebCryptoAlgorithm = RsaHashedImportParams | EcKeyImportParams | AesKeyAlgorithm

export class JwkPemError extends Error {
  constructor(
    public key: string,
    public params?: Record<string, string>,
  ) {
    super(key)
  }
}

export type PemBlock = {
  label: string
  der: Uint8Array
}

export type WarningEntry = {
  key: string
  params?: Record<string, string>
}

export type PemConversionResult = {
  jwk: JsonWebKey | { keys: JsonWebKey[] }
  warnings: WarningEntry[]
}

export type Asn1Element = {
  tag: number
  length: number
  headerLength: number
  start: number
  valueStart: number
  valueEnd: number
  end: number
}
