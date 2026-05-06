function countBits(value: number) {
  return (
    (value & 1) + ((value >> 1) & 1) + ((value >> 2) & 1) + ((value >> 3) & 1)
  )
}

function evenParity(bits: ReadonlyArray<0 | 1>) {
  const ones = bits.reduce<number>((sum, bit) => sum + bit, 0)

  return (ones % 2) as 0 | 1
}

function setWeightedBits(
  bits: Array<0 | 1 | "M">,
  mapping: ReadonlyArray<{ pos: number; weight: number }>,
  value: number
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

function splitToPairs(value: number, totalBits: number) {
  const pairs: number[] = []

  for (let i = totalBits - 2; i >= 0; i -= 2) {
    pairs.push((value >> i) & 0b11)
  }

  return pairs
}

function getPair(pairs: readonly number[], index: number) {
  return pairs[index] ?? 0
}

export { countBits, evenParity, getPair, setWeightedBits, splitToPairs }
