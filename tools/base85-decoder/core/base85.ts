type Base85Variant = "ascii85" | "z85"

type DecodeBase85PreviewResult =
  | { state: "empty" }
  | { state: "invalid-base85" }
  | {
      state: "decoded"
      bytes: Uint8Array
      text: string
      previewText: string
      isPreviewTruncated: boolean
    }

type DecodeBase85Options = Readonly<{
  variant?: Base85Variant
}>

const BASE85_ALPHABETS = {
  ascii85: Array.from({ length: 85 }, (_, index) =>
    String.fromCharCode(33 + index)
  ).join(""),
  z85: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
} as const
const PREVIEW_CHARACTER_LIMIT = 2000
const MAX_UINT32 = 0xffffffff

const BASE85_MAPS = {
  ascii85: new Map<string, number>(),
  z85: new Map<string, number>(),
} as const satisfies Record<Base85Variant, Map<string, number>>

for (const variant of Object.keys(BASE85_ALPHABETS) as Base85Variant[]) {
  const alphabet = BASE85_ALPHABETS[variant]

  for (let index = 0; index < alphabet.length; index += 1) {
    BASE85_MAPS[variant].set(alphabet[index]!, index)
  }
}

function isBase85Variant(value: string): value is Base85Variant {
  return value === "ascii85" || value === "z85"
}

function normalizeBase85Input(value: string, variant: Base85Variant) {
  let normalized = value.replace(/\s+/g, "")

  if (variant !== "ascii85" || normalized.length === 0) {
    return normalized
  }

  const hasStartDelimiter = normalized.startsWith("<~")
  const hasEndDelimiter = normalized.endsWith("~>")

  if (hasStartDelimiter || hasEndDelimiter) {
    if (!hasStartDelimiter || !hasEndDelimiter) {
      throw new Error("Invalid Base85 delimiter")
    }

    normalized = normalized.slice(2, -2)
  }

  return normalized
}

function valueToBytes(value: number): [number, number, number, number] {
  const b0 = Math.floor(value / 256 ** 3) % 256
  const b1 = Math.floor(value / 256 ** 2) % 256
  const b2 = Math.floor(value / 256) % 256
  const b3 = Math.floor(value) % 256

  return [b0, b1, b2, b3]
}

function decodeDigitsToBytes(digits: number[]) {
  let valueSum = 0

  for (const part of digits) {
    valueSum = valueSum * 85 + part
  }

  if (valueSum > MAX_UINT32) {
    throw new Error("Invalid Base85 value")
  }

  return valueToBytes(valueSum)
}

function decodeBase85(value: string, options: DecodeBase85Options = {}) {
  const variant = options.variant ?? "ascii85"
  const normalized = normalizeBase85Input(value, variant)

  if (normalized.length === 0) {
    return new Uint8Array()
  }

  if (variant === "z85" && normalized.length % 5 !== 0) {
    throw new Error("Invalid Base85 length")
  }

  const bytes: number[] = []
  const digits: number[] = []
  const map = BASE85_MAPS[variant]

  for (const character of normalized) {
    if (variant === "ascii85" && character === "z") {
      if (digits.length !== 0) {
        throw new Error("Invalid Base85 length")
      }

      bytes.push(0, 0, 0, 0)
      continue
    }

    const digit = map.get(character)

    if (digit === undefined) {
      throw new Error("Invalid Base85 character")
    }

    digits.push(digit)

    if (digits.length === 5) {
      bytes.push(...decodeDigitsToBytes(digits))
      digits.length = 0
    }
  }

  if (digits.length > 0) {
    if (variant === "z85" || digits.length === 1) {
      throw new Error("Invalid Base85 length")
    }

    const finalLength = digits.length

    while (digits.length < 5) {
      digits.push(84)
    }

    bytes.push(...decodeDigitsToBytes(digits).slice(0, finalLength - 1))
  }

  return new Uint8Array(bytes)
}

function decodeBase85Preview(
  value: string,
  variant: Base85Variant
): DecodeBase85PreviewResult {
  if (value.trim() === "") {
    return { state: "empty" }
  }

  try {
    const bytes = decodeBase85(value, { variant })
    const text = new TextDecoder().decode(bytes)
    const isPreviewTruncated = text.length > PREVIEW_CHARACTER_LIMIT

    return {
      state: "decoded",
      bytes,
      text,
      previewText: isPreviewTruncated
        ? `${text.slice(0, PREVIEW_CHARACTER_LIMIT)}...`
        : text,
      isPreviewTruncated,
    }
  } catch {
    return { state: "invalid-base85" }
  }
}

function deriveDecodedFileName(fileName?: string | null) {
  if (!fileName) {
    return "decoded.bin"
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.bin` : "decoded.bin"
}

export {
  PREVIEW_CHARACTER_LIMIT,
  decodeBase85,
  decodeBase85Preview,
  deriveDecodedFileName,
  isBase85Variant,
}
export type { Base85Variant, DecodeBase85PreviewResult }
