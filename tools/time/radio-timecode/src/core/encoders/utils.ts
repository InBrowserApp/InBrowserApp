export function countBits(value: number) {
  return (value & 1) + ((value >> 1) & 1) + ((value >> 2) & 1) + ((value >> 3) & 1)
}

export function evenParity(bits: Array<0 | 1>) {
  const ones = bits.reduce<number>((sum, bit) => sum + (bit === 1 ? 1 : 0), 0)
  return (ones % 2) as 0 | 1
}

export function setWeightedBits(
  bits: Array<0 | 1 | 'M'>,
  mapping: Array<{ pos: number; weight: number }>,
  value: number,
) {
  let remaining = value
  for (const { pos, weight } of mapping) {
    if (remaining >= weight) {
      bits[pos] = 1
      remaining -= weight
    } else {
      bits[pos] = 0
    }
  }
}

export function splitToPairs(value: number, totalBits: number) {
  const pairs: number[] = []
  for (let i = totalBits - 2; i >= 0; i -= 2) {
    pairs.push((value >> i) & 0b11)
  }
  return pairs
}

export function getPair(pairs: number[], index: number) {
  return pairs[index] ?? 0
}
