import { base64ToBytes, isBase64Input } from "./jwk-pem-base64"
import {
  encodeNull,
  encodeOid,
  encodeSequence,
  readAsn1Children,
  readAsn1Element,
} from "./jwk-pem-asn1"
import { RSA_OID } from "./jwk-pem-constants"
import {
  JwkPemError,
  type PemBlock,
  type PemConversionResult,
  type WarningEntry,
} from "./jwk-pem-types"
import { exportJwkFromDer } from "./jwk-pem-webcrypto"
import {
  buildPkcs8FromSec1,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
} from "./jwk-pem-pem-algorithms"

export function parsePemBlocks(input: string): PemBlock[] {
  const blocks: PemBlock[] = []
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g

  for (const match of input.matchAll(pattern)) {
    const label = match[1]?.trim()
    const body = match[2]?.replace(/[\r\n\s]/g, "")
    if (!label || !body) {
      continue
    }
    try {
      blocks.push({ label, der: base64ToBytes(body) })
    } catch {
      continue
    }
  }

  return blocks
}

export async function pemToJwk(input: string): Promise<PemConversionResult> {
  const blocks = parsePemBlocks(input)
  if (!blocks.length) {
    if (isBase64Input(input.trim())) {
      return convertDerInput(base64ToBytes(input.trim()))
    }
    throw new JwkPemError("errorInvalidPem")
  }

  const jwkKeys: JsonWebKey[] = []
  const warnings: WarningEntry[] = []

  for (const block of blocks) {
    try {
      const jwk = await convertPemBlock(block)
      jwkKeys.push(jwk)
    } catch (error) {
      if (error instanceof JwkPemError) {
        warnings.push({ key: error.key, params: error.params })
      } else {
        warnings.push({ key: "errorUnsupportedPemLabel" })
      }
    }
  }

  if (!jwkKeys.length) {
    throw new JwkPemError("errorInvalidPem")
  }

  if (jwkKeys.length === 1) {
    return { jwk: jwkKeys[0]!, warnings }
  }

  return { jwk: { keys: jwkKeys }, warnings }
}

async function convertDerInput(der: Uint8Array): Promise<PemConversionResult> {
  const kind = detectDerKeyType(der)
  if (kind === "pkcs8") {
    return { jwk: await convertPkcs8(der), warnings: [] }
  }
  if (kind === "spki") {
    return { jwk: await convertSpki(der), warnings: [] }
  }
  throw new JwkPemError("errorInvalidPem")
}

async function convertPemBlock(block: PemBlock): Promise<JsonWebKey> {
  const label = block.label.toUpperCase()
  if (label === "PUBLIC KEY") {
    return convertSpki(block.der)
  }
  if (label === "PRIVATE KEY") {
    return convertPkcs8(block.der)
  }
  if (label === "RSA PRIVATE KEY") {
    const wrapped = buildPkcs8FromPkcs1(block.der)
    return convertPkcs8(wrapped)
  }
  if (label === "RSA PUBLIC KEY") {
    const wrapped = buildSpkiFromRsaPublicKey(block.der)
    return convertSpki(wrapped)
  }
  if (label === "EC PRIVATE KEY") {
    const wrapped = buildPkcs8FromSec1(block.der)
    return convertPkcs8(wrapped)
  }
  throw new JwkPemError("errorUnsupportedPemLabel", { label: block.label })
}

async function convertSpki(der: Uint8Array): Promise<JsonWebKey> {
  const algorithm = parseSpkiAlgorithm(der)
  if (algorithm.type === "OKP") {
    return parseOkpSpki(der)
  }
  if (algorithm.type === "RSA") {
    return exportJwkFromDer(der, "spki", {
      name: "RSA-OAEP",
      hash: "SHA-256",
    } as RsaHashedImportParams)
  }
  if (algorithm.type === "EC") {
    return exportJwkFromDer(der, "spki", {
      name: "ECDSA",
      namedCurve: algorithm.curve,
    } as EcKeyImportParams)
  }
  throw new JwkPemError("errorUnsupportedAlgorithm", {
    algorithm: algorithm.oid,
  })
}

async function convertPkcs8(der: Uint8Array): Promise<JsonWebKey> {
  const algorithm = parsePkcs8Algorithm(der)
  if (algorithm.type === "OKP") {
    return parseOkpPkcs8(der)
  }
  if (algorithm.type === "RSA") {
    return exportJwkFromDer(der, "pkcs8", {
      name: "RSA-OAEP",
      hash: "SHA-256",
    } as RsaHashedImportParams)
  }
  if (algorithm.type === "EC") {
    return exportJwkFromDer(der, "pkcs8", {
      name: "ECDSA",
      namedCurve: algorithm.curve,
    } as EcKeyImportParams)
  }
  throw new JwkPemError("errorUnsupportedAlgorithm", {
    algorithm: algorithm.oid,
  })
}

export function detectDerKeyType(
  der: Uint8Array
): "spki" | "pkcs8" | "unknown" {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  if (!children.length) return "unknown"
  const first = children[0]!
  if (first.tag === 0x02) {
    return "pkcs8"
  }
  if (first.tag === 0x30) {
    return "spki"
  }
  return "unknown"
}

function buildPkcs8FromPkcs1(pkcs1: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(RSA_OID), encodeNull())
  const version = new Uint8Array([0x02, 0x01, 0x00])
  const privateKey = new Uint8Array([
    0x04,
    ...encodeLength(pkcs1.length),
    ...pkcs1,
  ])
  return encodeSequence(version, alg, privateKey)
}

function buildSpkiFromRsaPublicKey(pkcs1Public: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(RSA_OID), encodeNull())
  const bitString = new Uint8Array([
    0x03,
    ...encodeLength(pkcs1Public.length + 1),
    0x00,
    ...pkcs1Public,
  ])
  return encodeSequence(alg, bitString)
}

function encodeLength(length: number): number[] {
  if (length < 0x80) {
    return [length]
  }

  const bytes: number[] = []
  let value = length
  while (value > 0) {
    bytes.unshift(value & 0xff)
    value >>= 8
  }

  return [0x80 | bytes.length, ...bytes]
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
} from "./jwk-pem-pem-algorithms"
