import type { EcCurve, HashAlgorithm, KeyAlgorithm } from './csr'

export const EC_CURVE_HASH: Record<EcCurve, HashAlgorithm> = {
  'P-256': 'SHA-256',
  'P-384': 'SHA-384',
  'P-521': 'SHA-512',
}

export function formatKeyAlgorithmLabel(params: {
  algorithm: KeyAlgorithm
  rsaKeySize?: number
  rsaHash?: HashAlgorithm
  ecCurve?: EcCurve
}): string {
  switch (params.algorithm) {
    case 'rsa': {
      const size = params.rsaKeySize ? ` ${params.rsaKeySize}` : ''
      const hash = params.rsaHash ? ` (${params.rsaHash})` : ''
      return `RSA${size}${hash}`
    }
    case 'ecdsa': {
      const curve = params.ecCurve ? ` ${params.ecCurve}` : ''
      const hash = params.ecCurve ? ` (${EC_CURVE_HASH[params.ecCurve]})` : ''
      return `ECDSA${curve}${hash}`
    }
    case 'ed25519':
      return 'Ed25519'
    case 'ed448':
      return 'Ed448'
    default:
      return params.algorithm
  }
}

export function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const binary = atob(`${base64}${padding}`)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
