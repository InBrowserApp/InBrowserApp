import * as ed25519 from "@noble/ed25519"

import { bytesToBase64Url } from "./jwk-pem-base64"
import {
  decodeOid,
  encodeInteger,
  encodeOctetString,
  encodeOid,
  encodeSequence,
  extractBitString,
  readAsn1Children,
  readAsn1Element,
} from "./jwk-pem-asn1"
import { EC_OID, EC_OID_TO_CURVE, OKP_OIDS, RSA_OID } from "./jwk-pem-constants"
import {
  JwkPemError,
  type Asn1Element,
  type EcCurve,
  type KeyType,
  type OkpCurve,
} from "./jwk-pem-types"

type ParsedKeyAlgorithm = {
  type: KeyType
  curve?: EcCurve
  oid: string
}

function parseSpkiAlgorithm(der: Uint8Array): ParsedKeyAlgorithm {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[0])

  return parseAlgorithm(alg.oid, alg.paramsOid)
}

function parsePkcs8Algorithm(der: Uint8Array): ParsedKeyAlgorithm {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[1])

  return parseAlgorithm(alg.oid, alg.paramsOid)
}

function parseOkpSpki(der: Uint8Array): JsonWebKey {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[0])
  const curve = OKP_OIDS[alg.oid]

  if (!curve) {
    throw new JwkPemError("errorUnsupportedAlgorithm", { algorithm: alg.oid })
  }

  const publicKeyElement = children[1]
  if (!publicKeyElement || publicKeyElement.tag !== 0x03) {
    throw new JwkPemError("errorInvalidPem")
  }

  const publicKey = extractBitString(der, publicKeyElement)

  return {
    kty: "OKP",
    crv: curve,
    x: bytesToBase64Url(publicKey),
  }
}

async function parseOkpPkcs8(der: Uint8Array): Promise<JsonWebKey> {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[1])
  const curve = OKP_OIDS[alg.oid]

  if (!curve) {
    throw new JwkPemError("errorUnsupportedAlgorithm", { algorithm: alg.oid })
  }

  const privateKeyElement = children[2]
  if (!privateKeyElement || privateKeyElement.tag !== 0x04) {
    throw new JwkPemError("errorInvalidPem")
  }

  const privateKeyWrapper = der.slice(
    privateKeyElement.valueStart,
    privateKeyElement.valueEnd
  )
  const innerElement = readAsn1Element(privateKeyWrapper, 0)
  if (innerElement.tag !== 0x04) {
    throw new JwkPemError("errorInvalidPem")
  }

  const privateKey = privateKeyWrapper.slice(
    innerElement.valueStart,
    innerElement.valueEnd
  )
  const publicKey = extractOkpPublicKey(children, der)
  const publicKeyBytes =
    publicKey ?? (await deriveOkpPublicKey(curve, privateKey))

  if (!publicKeyBytes) {
    throw new JwkPemError("errorOkpPublicKeyMissing")
  }

  return {
    kty: "OKP",
    crv: curve,
    d: bytesToBase64Url(privateKey),
    x: bytesToBase64Url(publicKeyBytes),
  }
}

function extractOkpPublicKey(children: Asn1Element[], der: Uint8Array) {
  const candidate = children.find((child) => child.tag === 0xa1)
  if (!candidate) {
    return undefined
  }

  const inner = readAsn1Children(der, candidate)
  const bitString = inner[0]
  if (!bitString || bitString.tag !== 0x03) {
    return undefined
  }

  return extractBitString(der, bitString)
}

function buildPkcs8FromSec1(sec1: Uint8Array) {
  const curveOid = extractSec1CurveOid(sec1)
  if (!curveOid) {
    throw new JwkPemError("errorUnsupportedCurve", { crv: "unknown" })
  }

  const alg = encodeSequence(encodeOid(EC_OID), encodeOid(curveOid))
  const version = encodeInteger(0)
  const privateKey = encodeOctetString(sec1)

  return encodeSequence(version, alg, privateKey)
}

function extractSec1CurveOid(sec1: Uint8Array) {
  const top = readAsn1Element(sec1, 0)
  const children = readAsn1Children(sec1, top)

  for (const child of children) {
    if (child.tag !== 0xa0) {
      continue
    }

    const inner = readAsn1Children(sec1, child)
    const oidElement = inner[0]
    if (!oidElement || oidElement.tag !== 0x06) {
      return undefined
    }

    const oidBytes = sec1.slice(oidElement.valueStart, oidElement.valueEnd)
    return decodeOid(oidBytes)
  }

  return undefined
}

function parseAlgorithmIdentifier(der: Uint8Array, element?: Asn1Element) {
  if (!element || element.tag !== 0x30) {
    throw new JwkPemError("errorInvalidPem")
  }

  const children = readAsn1Children(der, element)
  const oidElement = children[0]
  if (!oidElement || oidElement.tag !== 0x06) {
    throw new JwkPemError("errorInvalidPem")
  }

  const oid = decodeOid(der.slice(oidElement.valueStart, oidElement.valueEnd))
  const paramsElement = children[1]
  if (!paramsElement || paramsElement.tag !== 0x06) {
    return { oid }
  }

  const paramsOid = decodeOid(
    der.slice(paramsElement.valueStart, paramsElement.valueEnd)
  )

  return { oid, paramsOid }
}

async function deriveOkpPublicKey(curve: OkpCurve, privateKey: Uint8Array) {
  if (curve === "Ed25519") {
    return await ed25519.getPublicKeyAsync(privateKey)
  }

  return null
}

function parseAlgorithm(oid: string, paramsOid?: string): ParsedKeyAlgorithm {
  if (oid === RSA_OID) {
    return { type: "RSA", oid }
  }

  if (oid === EC_OID) {
    const curve = paramsOid ? EC_OID_TO_CURVE[paramsOid] : undefined
    if (!curve) {
      throw new JwkPemError("errorUnsupportedCurve", {
        crv: paramsOid ?? "unknown",
      })
    }

    return { type: "EC", curve, oid }
  }

  if (oid in OKP_OIDS) {
    return { type: "OKP", oid }
  }

  return { type: "Unknown", oid }
}

export {
  buildPkcs8FromSec1,
  extractOkpPublicKey,
  extractSec1CurveOid,
  parseAlgorithmIdentifier,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
}
