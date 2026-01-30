import type { EcCurve, OkpCurve } from './jwkPemTypes'

export const RSA_OID = '1.2.840.113549.1.1.1'
export const EC_OID = '1.2.840.10045.2.1'

export const OKP_OIDS: Record<string, OkpCurve> = {
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448',
  '1.3.101.110': 'X25519',
  '1.3.101.111': 'X448',
}

export const OKP_CURVE_OIDS: Record<OkpCurve, string> = {
  Ed25519: '1.3.101.112',
  Ed448: '1.3.101.113',
  X25519: '1.3.101.110',
  X448: '1.3.101.111',
}

export const EC_CURVE_OIDS: Record<EcCurve, string> = {
  'P-256': '1.2.840.10045.3.1.7',
  'P-384': '1.3.132.0.34',
  'P-521': '1.3.132.0.35',
}

export const EC_OID_TO_CURVE = Object.fromEntries(
  Object.entries(EC_CURVE_OIDS).map(([curve, oid]) => [oid, curve]),
) as Record<string, EcCurve>
