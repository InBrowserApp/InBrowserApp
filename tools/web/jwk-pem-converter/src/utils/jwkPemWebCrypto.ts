import { JwkPemError, type PemOutputType, type WebCryptoAlgorithm } from './jwkPemTypes'

export function getKeyUsages(algorithm: WebCryptoAlgorithm, outputType: PemOutputType): KeyUsage[] {
  const name = (algorithm as { name?: string }).name
  if (name === 'RSA-OAEP') {
    return outputType === 'public' ? ['encrypt'] : ['decrypt']
  }
  if (name === 'ECDSA') {
    return outputType === 'public' ? ['verify'] : ['sign']
  }
  return []
}

export async function exportDerFromJwk(
  jwk: JsonWebKey,
  outputType: PemOutputType,
  algorithm: WebCryptoAlgorithm,
): Promise<Uint8Array> {
  const subtle = getWebCrypto()
  try {
    const key = await subtle.importKey(
      'jwk',
      jwk,
      algorithm,
      true,
      getKeyUsages(algorithm, outputType),
    )
    const format = outputType === 'public' ? 'spki' : 'pkcs8'
    const exported = await subtle.exportKey(format, key)
    return new Uint8Array(exported)
  } catch {
    throw new JwkPemError('errorWebCryptoFailed')
  }
}

export async function exportJwkFromDer(
  der: Uint8Array,
  format: 'spki' | 'pkcs8',
  algorithm: WebCryptoAlgorithm,
): Promise<JsonWebKey> {
  const subtle = getWebCrypto()
  try {
    const outputType: PemOutputType = format === 'spki' ? 'public' : 'private'
    const derBuffer = der.buffer.slice(
      der.byteOffset,
      der.byteOffset + der.byteLength,
    ) as ArrayBuffer
    const key = await subtle.importKey(
      format,
      derBuffer,
      algorithm,
      true,
      getKeyUsages(algorithm, outputType),
    )
    return (await subtle.exportKey('jwk', key)) as JsonWebKey
  } catch {
    throw new JwkPemError('errorWebCryptoFailed')
  }
}

function getWebCrypto(): SubtleCrypto {
  if (!globalThis.crypto?.subtle) {
    throw new JwkPemError('errorWebCryptoUnavailable')
  }
  return globalThis.crypto.subtle
}
