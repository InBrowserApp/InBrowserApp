export type {
  EcCurve,
  KeyType,
  OkpCurve,
  PemBlock,
  PemConversionResult,
  PemOutputType,
  WarningEntry,
} from './jwkPemTypes'
export { JwkPemError } from './jwkPemTypes'
export { parseJwkJson, jwkToPem, wrapPem } from './jwkPemJwk'
export { parsePemBlocks, pemToJwk } from './jwkPemPem'
export {
  base64ToBytes,
  base64UrlToBytes,
  bytesToBase64,
  bytesToBase64Url,
  isBase64Input,
} from './jwkPemBase64'

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
} from './jwkPemAsn1'
import {
  buildPkcs8FromSec1,
  detectDerKeyType,
  extractOkpPublicKey,
  extractSec1CurveOid,
  parseAlgorithmIdentifier,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
} from './jwkPemPem'
import { exportDerFromJwk, getKeyUsages } from './jwkPemWebCrypto'

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
