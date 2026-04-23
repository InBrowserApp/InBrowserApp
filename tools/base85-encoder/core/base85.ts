const ASCII85_ALPHABET = Array.from({ length: 85 }, (_, index) =>
  String.fromCharCode(33 + index)
).join("")

const BASE85_ALPHABETS = {
  ascii85: ASCII85_ALPHABET,
  z85: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
} as const

type Base85Variant = keyof typeof BASE85_ALPHABETS

type Base85EncodeOptions = Readonly<{
  variant?: Base85Variant
}>

function isBase85Variant(value: string): value is Base85Variant {
  return value in BASE85_ALPHABETS
}

function getBase85Alphabet(variant: Base85Variant) {
  return BASE85_ALPHABETS[variant]
}

function toUint8Array(input: Uint8Array | ArrayBuffer) {
  return input instanceof ArrayBuffer ? new Uint8Array(input) : input
}

function isZeroChunk(chunk: Uint8Array) {
  return (
    chunk.length === 4 &&
    chunk[0] === 0 &&
    chunk[1] === 0 &&
    chunk[2] === 0 &&
    chunk[3] === 0
  )
}

function encodeChunk(chunk: Uint8Array, alphabet: string) {
  let value = 0

  for (let index = 0; index < 4; index += 1) {
    value = value * 256 + (chunk[index] ?? 0)
  }

  const digits = Array.from({ length: 5 }, () => 0)

  for (let index = 4; index >= 0; index -= 1) {
    digits[index] = value % 85
    value = Math.floor(value / 85)
  }

  return digits.map((digit) => alphabet[digit]!).join("")
}

function encodeBase85(
  input: Uint8Array | ArrayBuffer,
  options: Base85EncodeOptions = {}
) {
  const variant = options.variant ?? "ascii85"
  const alphabet = getBase85Alphabet(variant)
  const bytes = toUint8Array(input)

  if (bytes.length === 0) {
    return ""
  }

  if (variant === "z85" && bytes.length % 4 !== 0) {
    throw new Error("Invalid Base85 length")
  }

  let output = ""

  for (let offset = 0; offset < bytes.length; offset += 4) {
    const chunk = bytes.subarray(offset, offset + 4)

    if (variant === "ascii85" && isZeroChunk(chunk)) {
      output += "z"
      continue
    }

    const encodedChunk = encodeChunk(chunk, alphabet)
    output +=
      variant === "ascii85" && chunk.length < 4
        ? encodedChunk.slice(0, chunk.length + 1)
        : encodedChunk
  }

  return output
}

export { encodeBase85, isBase85Variant }
export type { Base85Variant }
