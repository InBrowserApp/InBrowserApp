export type {
  EcCurve,
  KeyType,
  OkpCurve,
  PemBlock,
  PemConversionResult,
  PemOutputType,
  WarningEntry,
} from "./jwk-pem-types"
export { JwkPemError } from "./jwk-pem-types"
export { parseJwkJson, jwkToPem, wrapPem } from "./jwk-pem-jwk"
export { parsePemBlocks, pemToJwk } from "./jwk-pem-pem"
export {
  base64ToBytes,
  base64UrlToBytes,
  bytesToBase64,
  bytesToBase64Url,
  isBase64Input,
} from "./jwk-pem-base64"

import {
  decodeOid,
  encodeBitString,
  encodeInteger,
  encodeNull,
  encodeOctetString,
  encodeOid,
  encodeSequence,
  encodeTag,
  extractBitString,
  readAsn1Children,
  readAsn1Element,
} from "./jwk-pem-asn1"
import {
  buildPkcs8FromSec1,
  extractOkpPublicKey,
  extractSec1CurveOid,
  parseAlgorithmIdentifier,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
} from "./jwk-pem-pem-algorithms"
import { detectDerKeyType } from "./jwk-pem-pem"
import { exportDerFromJwk, getKeyUsages } from "./jwk-pem-webcrypto"

export const __test__ = {
  buildPkcs8FromSec1,
  decodeOid,
  detectDerKeyType,
  encodeBitString,
  encodeInteger,
  encodeNull,
  encodeOctetString,
  encodeOid,
  encodeSequence,
  encodeTag,
  exportDerFromJwk,
  extractBitString,
  extractOkpPublicKey,
  extractSec1CurveOid,
  getKeyUsages,
  parseAlgorithmIdentifier,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
  readAsn1Children,
  readAsn1Element,
}
