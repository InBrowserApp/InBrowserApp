import { ECParameters, ECPrivateKey, id_ecPublicKey } from "@peculiar/asn1-ecc"
import { PrivateKey, PrivateKeyInfo, Version } from "@peculiar/asn1-pkcs8"
import { RSAPrivateKey } from "@peculiar/asn1-rsa"
import { AsnConvert } from "@peculiar/asn1-schema"
import { AlgorithmIdentifier } from "@peculiar/asn1-x509"
import { PemConverter } from "@peculiar/x509"

import { CsrGeneratorError } from "./errors"
import type { EcCurve, ParsedPemKey } from "./types"

const RSA_OID = "1.2.840.113549.1.1.1"
const EC_OID = "1.2.840.10045.2.1"

const EC_CURVE_OIDS = {
  "P-256": "1.2.840.10045.3.1.7",
  "P-384": "1.3.132.0.34",
  "P-521": "1.3.132.0.35",
} as const satisfies Readonly<Record<EcCurve, string>>

const EC_OID_TO_CURVE = Object.fromEntries(
  Object.entries(EC_CURVE_OIDS).map(([curve, oid]) => [oid, curve])
) as Readonly<Record<string, EcCurve>>

const SUPPORTED_PRIVATE_KEY_TYPES = new Set([
  "PRIVATE KEY",
  "RSA PRIVATE KEY",
  "EC PRIVATE KEY",
])

function parsePrivateKeyPem(pem: string): ParsedPemKey {
  if (!PemConverter.isPem(pem)) {
    throw new CsrGeneratorError("errorInvalidPem")
  }

  const blocks = decodePemBlocks(pem)
  if (blocks.some((block) => block.type === "ENCRYPTED PRIVATE KEY")) {
    throw new CsrGeneratorError("errorEncryptedKey")
  }

  const block = blocks.find((item) =>
    SUPPORTED_PRIVATE_KEY_TYPES.has(item.type)
  )
  if (!block) {
    throw new CsrGeneratorError("errorUnsupportedPem")
  }

  if (block.type === "PRIVATE KEY") {
    return parsePkcs8(block.rawData)
  }

  if (block.type === "RSA PRIVATE KEY") {
    return convertPkcs1Rsa(block.rawData)
  }

  return convertEcPrivateKey(block.rawData)
}

function decodePemBlocks(pem: string) {
  try {
    return PemConverter.decodeWithHeaders(pem)
  } catch {
    throw new CsrGeneratorError("errorInvalidPem")
  }
}

function parsePkcs8(raw: ArrayBuffer): ParsedPemKey {
  let info: PrivateKeyInfo
  try {
    info = AsnConvert.parse(raw, PrivateKeyInfo)
  } catch {
    throw new CsrGeneratorError("errorInvalidPem")
  }

  const algorithm = info.privateKeyAlgorithm.algorithm

  if (algorithm === RSA_OID) {
    return { pkcs8: raw, algorithm: { type: "rsa" } }
  }

  if (algorithm === EC_OID) {
    const curveOid = info.privateKeyAlgorithm.parameters
      ? AsnConvert.parse(info.privateKeyAlgorithm.parameters, ECParameters)
          .namedCurve
      : undefined
    const curve = curveOid ? EC_OID_TO_CURVE[curveOid] : undefined
    if (!curve) {
      throw new CsrGeneratorError("errorUnsupportedCurve")
    }
    return { pkcs8: raw, algorithm: { type: "ecdsa", curve } }
  }

  throw new CsrGeneratorError("errorUnsupportedKeyType")
}

function convertPkcs1Rsa(raw: ArrayBuffer): ParsedPemKey {
  let rsa: RSAPrivateKey
  try {
    rsa = AsnConvert.parse(raw, RSAPrivateKey)
  } catch {
    throw new CsrGeneratorError("errorInvalidPem")
  }

  const info = new PrivateKeyInfo({
    version: Version.v1,
    privateKeyAlgorithm: new AlgorithmIdentifier({
      algorithm: RSA_OID,
      parameters: null,
    }),
    privateKey: new PrivateKey(AsnConvert.serialize(rsa)),
  })

  return {
    pkcs8: AsnConvert.serialize(info),
    algorithm: { type: "rsa" },
  }
}

function convertEcPrivateKey(raw: ArrayBuffer): ParsedPemKey {
  let ec: ECPrivateKey
  try {
    ec = AsnConvert.parse(raw, ECPrivateKey)
  } catch {
    throw new CsrGeneratorError("errorInvalidPem")
  }

  const curveOid = ec.parameters?.namedCurve
  const curve = curveOid ? EC_OID_TO_CURVE[curveOid] : undefined
  if (!curve) {
    throw new CsrGeneratorError("errorUnsupportedCurve")
  }

  const info = new PrivateKeyInfo({
    version: Version.v1,
    privateKeyAlgorithm: new AlgorithmIdentifier({
      algorithm: id_ecPublicKey,
      parameters: AsnConvert.serialize(
        new ECParameters({ namedCurve: curveOid })
      ),
    }),
    privateKey: new PrivateKey(AsnConvert.serialize(ec)),
  })

  return {
    pkcs8: AsnConvert.serialize(info),
    algorithm: { type: "ecdsa", curve },
  }
}

export { parsePrivateKeyPem }
