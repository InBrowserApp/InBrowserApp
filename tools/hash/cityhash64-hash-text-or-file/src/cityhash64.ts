import { cityHash64 } from '@anglinb/city-hash'

const K2 = 0x9ae16a3b2f90404fn
const KMUL = 0x9ddfea08eb382d69n

const toUint64 = (value: bigint) => BigInt.asUintN(64, value)

const hash128To64 = (low: bigint, high: bigint) => {
  let a = toUint64((low ^ high) * KMUL)
  a = toUint64(a ^ (a >> 47n))
  let b = toUint64((high ^ a) * KMUL)
  b = toUint64(b ^ (b >> 47n))
  b = toUint64(b * KMUL)
  return b
}

const hashLen16 = (u: bigint, v: bigint) => hash128To64(u, v)

export const cityHash64WithSeed = (input: Uint8Array | string, seed: bigint) => {
  const baseHash = toUint64(cityHash64(input))
  const seedValue = toUint64(seed)
  return hashLen16(toUint64(baseHash - K2), seedValue)
}

export const parseCityHash64Seed = (input: string) => {
  const trimmed = input.trim()
  if (!trimmed) {
    return { value: 0n, isValid: true }
  }

  let parsed: bigint
  try {
    parsed = BigInt(trimmed)
  } catch {
    return { value: 0n, isValid: false }
  }

  const isHex = /^(0x|0X)[0-9a-fA-F]+$/.test(trimmed)
  const isDecimal = /^[0-9]+$/.test(trimmed)

  if (!isHex && !isDecimal) {
    return { value: 0n, isValid: false }
  }
  return { value: toUint64(parsed), isValid: true }
}
