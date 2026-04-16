const ASCII85_ALPHABET = Array.from({ length: 85 }, (_, index) =>
  String.fromCharCode(33 + index)
).join("")

const BASE85_ALPHABETS = {
  ascii85: ASCII85_ALPHABET,
  z85: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
} as const

const INVALID_BASE85_LENGTH = "Invalid Base85 length"

type Base85Variant = keyof typeof BASE85_ALPHABETS

type Base85EncodeOptions = Readonly<{
  variant?: Base85Variant
}>

function encodeBytesAsBase85(
  input: Uint8Array | ArrayBuffer,
  options: Base85EncodeOptions = {}
) {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  const variant = options.variant ?? "ascii85"

  if (bytes.length === 0) {
    return ""
  }

  if (variant === "z85" && bytes.length % 4 !== 0) {
    throw new Error(INVALID_BASE85_LENGTH)
  }

  const alphabet = BASE85_ALPHABETS[variant]
  let output = ""

  for (let offset = 0; offset < bytes.length; offset += 4) {
    const chunk = bytes.subarray(offset, offset + 4)

    if (
      variant === "ascii85" &&
      chunk.length === 4 &&
      chunk[0] === 0 &&
      chunk[1] === 0 &&
      chunk[2] === 0 &&
      chunk[3] === 0
    ) {
      output += "z"
      continue
    }

    let value = 0

    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (chunk[index] ?? 0)
    }

    const digits = Array.from({ length: 5 }, () => 0)

    for (let index = 4; index >= 0; index -= 1) {
      digits[index] = value % 85
      value = Math.floor(value / 85)
    }

    const encoded = digits.map((digit) => alphabet[digit]).join("")

    output +=
      variant === "ascii85" && chunk.length < 4
        ? encoded.slice(0, chunk.length + 1)
        : encoded
  }

  return output
}

function encodeTextAsBase85(value: string, options: Base85EncodeOptions = {}) {
  return encodeBytesAsBase85(new TextEncoder().encode(value), options)
}

async function encodeBase85(source: Blob, options: Base85EncodeOptions = {}) {
  return encodeBytesAsBase85(await source.arrayBuffer(), options)
}

function deriveEncodedFileName(
  fileName?: string | null,
  variant: Base85Variant = "ascii85"
) {
  const extension = variant === "z85" ? "z85" : "a85"

  if (fileName === undefined) {
    return `encoded.${extension}.txt`
  }

  if (!fileName) {
    return `file.${extension}`
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.${extension}` : `file.${extension}`
}

export {
  BASE85_ALPHABETS,
  INVALID_BASE85_LENGTH,
  deriveEncodedFileName,
  encodeBase85,
  encodeBytesAsBase85,
  encodeTextAsBase85,
}
export type { Base85Variant }
