// TODO: add more hash algorithms (e.g., BLAKE2, Keccak variants)
export type HmacAlgorithm =
  // Web Crypto API (native)
  | 'SHA-1'
  | 'SHA-256'
  | 'SHA-384'
  | 'SHA-512'
  // crypto-js
  | 'MD5'
  | 'SHA-224'
  | 'SHA3-256'
  | 'SHA3-384'
  | 'SHA3-512'
  | 'RIPEMD-160'

export const ALGORITHM_OPTIONS: { label: string; value: HmacAlgorithm }[] = [
  // SHA family (recommended)
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
  { label: 'SHA-224', value: 'SHA-224' },
  { label: 'SHA-1', value: 'SHA-1' },
  // SHA-3 (Keccak)
  { label: 'SHA3-256', value: 'SHA3-256' },
  { label: 'SHA3-384', value: 'SHA3-384' },
  { label: 'SHA3-512', value: 'SHA3-512' },
  // Others
  { label: 'MD5', value: 'MD5' },
  { label: 'RIPEMD-160', value: 'RIPEMD-160' },
]
