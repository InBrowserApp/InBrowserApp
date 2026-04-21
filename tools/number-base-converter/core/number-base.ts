const STANDARD_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"
const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

type AlphabetMode = "standard" | "base64"

function normalizeBase(base: number) {
  if (!Number.isFinite(base)) {
    return 2
  }

  return Math.min(64, Math.max(2, Math.trunc(base)))
}

function buildReverseMap(alphabet: string) {
  const map = new Map<string, number>()

  for (let index = 0; index < alphabet.length; index += 1) {
    const char = alphabet[index]

    /* v8 ignore start -- static alphabets never contain empty entries */
    if (char) {
      map.set(char, index)
    }
    /* v8 ignore stop */
  }

  return map
}

const STANDARD_ALPHABET_MAP = buildReverseMap(STANDARD_ALPHABET)
const BASE64_ALPHABET_MAP = buildReverseMap(BASE64_ALPHABET)

function resolveAlphabet(mode: AlphabetMode) {
  return mode === "base64" ? BASE64_ALPHABET : STANDARD_ALPHABET
}

function resolveAlphabetMap(mode: AlphabetMode) {
  return mode === "base64" ? BASE64_ALPHABET_MAP : STANDARD_ALPHABET_MAP
}

function normalizeChar(char: string, base: number, mode: AlphabetMode) {
  if (mode === "base64") {
    return char
  }

  return base <= 36 ? char.toLowerCase() : char
}

function isValidForBase(
  value: string,
  base: number,
  mode: AlphabetMode = "standard"
) {
  if (value.length === 0) {
    return true
  }

  const normalizedBase = normalizeBase(base)

  if (normalizedBase !== base) {
    return false
  }

  const alphabet = resolveAlphabet(mode)

  for (const char of value) {
    const normalizedChar = normalizeChar(char, normalizedBase, mode)

    if (!alphabet.slice(0, normalizedBase).includes(normalizedChar)) {
      return false
    }
  }

  return true
}

function parseBase(
  value: string,
  base: number,
  mode: AlphabetMode = "standard"
) {
  if (value.length === 0 || !isValidForBase(value, base, mode)) {
    return null
  }

  const normalizedBase = normalizeBase(base)
  const alphabetMap = resolveAlphabetMap(mode)

  try {
    let result = 0n
    const baseBigInt = BigInt(normalizedBase)

    for (const char of value) {
      const normalizedChar = normalizeChar(char, normalizedBase, mode)
      const digit = alphabetMap.get(normalizedChar)

      /* v8 ignore start -- guarded by upfront validation */
      if (digit === undefined || digit >= normalizedBase) {
        return null
      }
      /* v8 ignore stop */

      result = result * baseBigInt + BigInt(digit)
    }

    return result
  } catch {
    return null
  }
}

function toBase(value: bigint, base: number, mode: AlphabetMode = "standard") {
  const normalizedBase = normalizeBase(base)

  if (normalizedBase !== base) {
    return ""
  }

  if (value === 0n) {
    return "0"
  }

  const alphabet = resolveAlphabet(mode)
  const baseBigInt = BigInt(normalizedBase)
  let current = value
  let result = ""

  while (current > 0n) {
    const digit = Number(current % baseBigInt)
    result = `${alphabet[digit]}${result}`
    current /= baseBigInt
  }

  return result
}

function isValidBinary(value: string) {
  return isValidForBase(value, 2)
}

function isValidOctal(value: string) {
  return isValidForBase(value, 8)
}

function isValidDecimal(value: string) {
  return isValidForBase(value, 10)
}

function isValidHex(value: string) {
  return isValidForBase(value, 16)
}

function isValidBase32(value: string) {
  return isValidForBase(value, 32)
}

function isValidBase36(value: string) {
  return isValidForBase(value, 36)
}

function isValidBase62(value: string) {
  return isValidForBase(value, 62)
}

function isValidBase64(value: string) {
  return isValidForBase(value, 64, "base64")
}

function parseBinary(value: string) {
  return parseBase(value, 2)
}

function parseOctal(value: string) {
  return parseBase(value, 8)
}

function parseDecimal(value: string) {
  return parseBase(value, 10)
}

function parseHex(value: string) {
  return parseBase(value, 16)
}

function parseBase32(value: string) {
  return parseBase(value, 32)
}

function parseBase36(value: string) {
  return parseBase(value, 36)
}

function parseBase62(value: string) {
  return parseBase(value, 62)
}

function parseBase64Number(value: string) {
  return parseBase(value, 64, "base64")
}

function toBinary(value: bigint) {
  return toBase(value, 2)
}

function toOctal(value: bigint) {
  return toBase(value, 8)
}

function toDecimal(value: bigint) {
  return toBase(value, 10)
}

function toHex(value: bigint) {
  return toBase(value, 16)
}

function toBase32(value: bigint) {
  return toBase(value, 32)
}

function toBase36(value: bigint) {
  return toBase(value, 36)
}

function toBase62(value: bigint) {
  return toBase(value, 62)
}

function toBase64Number(value: bigint) {
  return toBase(value, 64, "base64")
}

export {
  normalizeBase,
  isValidBinary,
  isValidOctal,
  isValidDecimal,
  isValidHex,
  isValidBase32,
  isValidBase36,
  isValidBase62,
  isValidBase64,
  isValidForBase,
  parseBinary,
  parseOctal,
  parseDecimal,
  parseHex,
  parseBase32,
  parseBase36,
  parseBase62,
  parseBase64Number,
  parseBase,
  toBinary,
  toOctal,
  toDecimal,
  toHex,
  toBase32,
  toBase36,
  toBase62,
  toBase64Number,
  toBase,
}
