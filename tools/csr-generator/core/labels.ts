import { EC_CURVE_HASH } from "./types"
import type { EcCurve, HashAlgorithm, KeyAlgorithm } from "./types"

function formatKeyAlgorithmLabel(params: {
  algorithm: KeyAlgorithm
  rsaKeySize?: number
  rsaHash?: HashAlgorithm
  ecCurve?: EcCurve
}): string {
  switch (params.algorithm) {
    case "rsa": {
      const size = params.rsaKeySize ? ` ${params.rsaKeySize}` : ""
      const hash = params.rsaHash ? ` (${params.rsaHash})` : ""
      return `RSA${size}${hash}`
    }
    case "ecdsa": {
      const curve = params.ecCurve ? ` ${params.ecCurve}` : ""
      const hash = params.ecCurve ? ` (${EC_CURVE_HASH[params.ecCurve]})` : ""
      return `ECDSA${curve}${hash}`
    }
    default:
      return params.algorithm
  }
}

function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const padding =
    base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4))
  const binary = atob(`${base64}${padding}`)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export { base64UrlToBytes, formatKeyAlgorithmLabel }
