const ZL = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15,
  3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11,
  5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7,
  12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
] as const

const ZR = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
  10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0,
  4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1,
  5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
] as const

const SL = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7,
  15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5,
  12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5,
  11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
] as const

const SR = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
  9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
  13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
  12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
] as const

type Ripemd320Digest = Readonly<{
  hex: string
  base64: string
  decimal: string
  binary: string
}>

abstract class Hasher32le {
  protected readonly blockSizeInBytes = 64
  protected state = {
    message: "",
    length: 0,
    hash: [] as number[],
  }

  update(message: string) {
    this.state.message += message
    this.state.length += message.length
    this.process()
  }

  protected process() {
    while (this.state.message.length >= this.blockSizeInBytes) {
      const block: number[] = []

      for (let index = 0; index < this.blockSizeInBytes; index += 4) {
        block.push(
          this.state.message.charCodeAt(index) |
            (this.state.message.charCodeAt(index + 1) << 8) |
            (this.state.message.charCodeAt(index + 2) << 16) |
            (this.state.message.charCodeAt(index + 3) << 24)
        )
      }

      this.state.message = this.state.message.slice(this.blockSizeInBytes)
      this.processBlock(block)
    }
  }

  protected abstract processBlock(block: number[]): void

  protected addPaddingISO7816(length: number) {
    this.state.message += "\x80" + "\x00".repeat(Math.max(0, length - 1))
  }

  protected addLengthBits() {
    this.state.message += encodeLittleEndianBitLength(this.state.length)
  }

  protected getStateHash() {
    let hash = ""

    for (const chunk of this.state.hash) {
      hash +=
        String.fromCharCode(chunk & 0xff) +
        String.fromCharCode((chunk >> 8) & 0xff) +
        String.fromCharCode((chunk >> 16) & 0xff) +
        String.fromCharCode((chunk >> 24) & 0xff)
    }

    return hash
  }
}

class Ripemd320Hasher extends Hasher32le {
  constructor() {
    super()
    this.state.hash = [
      0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0, 0x76543210,
      0xfedcba98, 0x89abcdef, 0x01234567, 0x3c2d1e0f,
    ]
  }

  finalize() {
    this.addPaddingISO7816(
      this.state.message.length < 56
        ? 56 - this.state.message.length
        : 120 - this.state.message.length
    )
    this.addLengthBits()
    this.process()

    return this.getStateHash()
  }

  protected override processBlock(block: number[]) {
    let al = this.state.hash[0]! | 0
    let bl = this.state.hash[1]! | 0
    let cl = this.state.hash[2]! | 0
    let dl = this.state.hash[3]! | 0
    let el = this.state.hash[4]! | 0
    let ar = this.state.hash[5]! | 0
    let br = this.state.hash[6]! | 0
    let cr = this.state.hash[7]! | 0
    let dr = this.state.hash[8]! | 0
    let er = this.state.hash[9]! | 0

    for (let index = 0; index < 80; index += 1) {
      const zl = ZL[index]!
      const zr = ZR[index]!
      const sl = SL[index]!
      const sr = SR[index]!

      let next = (al + block[zl]!) | 0
      next = (next + leftRound(index, bl, cl, dl)) | 0
      next = rotateLeft(next, sl)
      next = (next + el) | 0
      al = el
      el = dl
      dl = rotateLeft(cl, 10)
      cl = bl
      bl = next

      next = (ar + block[zr]!) | 0
      next = (next + rightRound(index, br, cr, dr)) | 0
      next = rotateLeft(next, sr)
      next = (next + er) | 0
      ar = er
      er = dr
      dr = rotateLeft(cr, 10)
      cr = br
      br = next

      switch (index) {
        case 15:
          ;[bl, br] = [br, bl]
          break
        case 31:
          ;[dl, dr] = [dr, dl]
          break
        case 47:
          ;[al, ar] = [ar, al]
          break
        case 63:
          ;[cl, cr] = [cr, cl]
          break
        case 79:
          ;[el, er] = [er, el]
          break
      }
    }

    this.state.hash[0] = (this.state.hash[0]! + al) | 0
    this.state.hash[1] = (this.state.hash[1]! + bl) | 0
    this.state.hash[2] = (this.state.hash[2]! + cl) | 0
    this.state.hash[3] = (this.state.hash[3]! + dl) | 0
    this.state.hash[4] = (this.state.hash[4]! + el) | 0
    this.state.hash[5] = (this.state.hash[5]! + ar) | 0
    this.state.hash[6] = (this.state.hash[6]! + br) | 0
    this.state.hash[7] = (this.state.hash[7]! + cr) | 0
    this.state.hash[8] = (this.state.hash[8]! + dr) | 0
    this.state.hash[9] = (this.state.hash[9]! + er) | 0
  }
}

async function hashRipemd320(source: Blob) {
  const hasher = new Ripemd320Hasher()

  hasher.update(fromArrayBuffer(await source.arrayBuffer()))

  return formatRipemd320Digest(binaryStringToArrayBuffer(hasher.finalize()))
}

function formatRipemd320Digest(digest: ArrayBuffer): Ripemd320Digest {
  const bytes = new Uint8Array(digest)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    decimal: bytesToDecimal(bytes),
    binary: bytesToBinary(bytes),
  }
}

function rotateLeft(value: number, shift: number) {
  return (value << shift) | (value >>> (32 - shift)) | 0
}

function leftRound(index: number, x: number, y: number, z: number) {
  if (index < 16) return x ^ y ^ z
  if (index < 32) return (((x & y) | (~x & z)) + 0x5a827999) | 0
  if (index < 48) return (((x | ~y) ^ z) + 0x6ed9eba1) | 0
  if (index < 64) return (((x & z) | (y & ~z)) + 0x8f1bbcdc) | 0

  return ((x ^ (y | ~z)) + 0xa953fd4e) | 0
}

function rightRound(index: number, x: number, y: number, z: number) {
  if (index < 16) return ((x ^ (y | ~z)) + 0x50a28be6) | 0
  if (index < 32) return (((x & z) | (y & ~z)) + 0x5c4dd124) | 0
  if (index < 48) return (((x | ~y) ^ z) + 0x6d703ef3) | 0
  if (index < 64) return (((x & y) | (~x & z)) + 0x7a6d76e9) | 0

  return x ^ y ^ z
}

function fromArrayBuffer(buffer: ArrayBuffer) {
  let value = ""
  const bytes = new Uint8Array(buffer)

  for (const byte of bytes) {
    value += String.fromCharCode(byte)
  }

  return value
}

function binaryStringToArrayBuffer(value: string) {
  const bytes = new Uint8Array(value.length)

  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index)
  }

  return bytes.buffer
}

function encodeLittleEndianBitLength(byteLength: number) {
  let bitLength = BigInt(byteLength) * 8n
  let value = ""

  for (let index = 0; index < 8; index += 1) {
    value += String.fromCharCode(Number(bitLength & 0xffn))
    bitLength >>= 8n
  }

  return value
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    ""
  )
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary)
}

function bytesToBinary(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(2).padStart(8, "0")).join(
    ""
  )
}

function bytesToDecimal(bytes: Uint8Array) {
  let value = 0n

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte)
  }

  return value.toString()
}

export { encodeLittleEndianBitLength, formatRipemd320Digest, hashRipemd320 }
export type { Ripemd320Digest }
