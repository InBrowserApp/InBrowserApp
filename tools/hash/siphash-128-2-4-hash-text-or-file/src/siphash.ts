const MASK_64 = 0xffffffffffffffffn

const add64 = (a: bigint, b: bigint) => (a + b) & MASK_64

const rotl64 = (value: bigint, shift: bigint) =>
  ((value << shift) | (value >> (64n - shift))) & MASK_64

const sipRound = (state: [bigint, bigint, bigint, bigint]) => {
  let [v0, v1, v2, v3] = state

  v0 = add64(v0, v1)
  v1 = rotl64(v1, 13n)
  v1 ^= v0
  v0 = rotl64(v0, 32n)

  v2 = add64(v2, v3)
  v3 = rotl64(v3, 16n)
  v3 ^= v2

  v0 = add64(v0, v3)
  v3 = rotl64(v3, 21n)
  v3 ^= v0

  v2 = add64(v2, v1)
  v1 = rotl64(v1, 17n)
  v1 ^= v2
  v2 = rotl64(v2, 32n)

  return [v0, v1, v2, v3] as [bigint, bigint, bigint, bigint]
}

const sipRounds = (state: [bigint, bigint, bigint, bigint], rounds: number) => {
  let result = state
  for (let i = 0; i < rounds; i += 1) {
    result = sipRound(result)
  }
  return result
}

const readUint64LE = (data: Uint8Array, offset: number) => {
  let value = 0n
  for (let i = 0; i < 8; i += 1) {
    value |= BigInt(data[offset + i] ?? 0) << (8n * BigInt(i))
  }
  return value
}

const writeUint64BE = (value: bigint) => {
  const output = new Uint8Array(8)
  for (let i = 0; i < 8; i += 1) {
    output[7 - i] = Number((value >> (8n * BigInt(i))) & 0xffn)
  }
  return output
}

const packFinalBlock = (data: Uint8Array, start: number) => {
  let block = BigInt(data.length & 0xff) << 56n
  for (let i = start; i < data.length; i += 1) {
    block |= BigInt(data[i] ?? 0) << (8n * BigInt(i - start))
  }
  return block
}

export const siphash24 = (data: Uint8Array, key: Uint8Array) => {
  const k0 = readUint64LE(key, 0)
  const k1 = readUint64LE(key, 8)

  let v0 = 0x736f6d6570736575n ^ k0
  let v1 = 0x646f72616e646f6dn ^ k1
  let v2 = 0x6c7967656e657261n ^ k0
  let v3 = 0x7465646279746573n ^ k1

  const last = data.length - (data.length % 8)
  for (let i = 0; i < last; i += 8) {
    const m = readUint64LE(data, i)
    v3 ^= m
    ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 2)
    v0 ^= m
  }

  const finalBlock = packFinalBlock(data, last)
  v3 ^= finalBlock
  ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 2)
  v0 ^= finalBlock

  v2 ^= 0xffn
  ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 4)

  const result = (v0 ^ v1 ^ v2 ^ v3) & MASK_64
  return writeUint64BE(result)
}

export const siphash128 = (data: Uint8Array, key: Uint8Array) => {
  const k0 = readUint64LE(key, 0)
  const k1 = readUint64LE(key, 8)

  let v0 = 0x736f6d6570736575n ^ k0
  let v1 = 0x646f72616e646f6dn ^ k1
  let v2 = 0x6c7967656e657261n ^ k0
  let v3 = 0x7465646279746573n ^ k1

  const last = data.length - (data.length % 8)
  for (let i = 0; i < last; i += 8) {
    const m = readUint64LE(data, i)
    v3 ^= m
    ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 2)
    v0 ^= m
  }

  const finalBlock = packFinalBlock(data, last)
  v3 ^= finalBlock
  ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 2)
  v0 ^= finalBlock

  v2 ^= 0xeen
  ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 4)
  const output1 = (v0 ^ v1 ^ v2 ^ v3) & MASK_64

  v1 ^= 0xddn
  ;[v0, v1, v2, v3] = sipRounds([v0, v1, v2, v3], 4)
  const output2 = (v0 ^ v1 ^ v2 ^ v3) & MASK_64

  const bytes1 = writeUint64BE(output1)
  const bytes2 = writeUint64BE(output2)
  const output = new Uint8Array(16)
  output.set(bytes1, 0)
  output.set(bytes2, 8)
  return output
}
