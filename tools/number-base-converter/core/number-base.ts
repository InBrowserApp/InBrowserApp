const STANDARD_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

const FIELD_SPECS = {
  binary: { alphabet: "standard", base: 2, caseSensitive: false },
  octal: { alphabet: "standard", base: 8, caseSensitive: false },
  decimal: { alphabet: "standard", base: 10, caseSensitive: false },
  hexadecimal: { alphabet: "standard", base: 16, caseSensitive: false },
  base32: { alphabet: "standard", base: 32, caseSensitive: false },
  base36: { alphabet: "standard", base: 36, caseSensitive: false },
  base62: { alphabet: "standard", base: 62, caseSensitive: true },
  base64: { alphabet: "base64", base: 64, caseSensitive: true },
} as const

type BuiltInFieldId = keyof typeof FIELD_SPECS

type BaseSpec = Readonly<{
  alphabet: "standard" | "base64"
  base: number
  caseSensitive: boolean
}>

type FieldParseResult =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid" }>
  | Readonly<{ kind: "valid"; value: bigint }>

type ConversionValues = Record<BaseFieldId, string>

type BaseFieldId = BuiltInFieldId | "custom"

const BASE_FIELD_IDS = [
  "binary",
  "octal",
  "decimal",
  "hexadecimal",
  "base32",
  "base36",
  "base62",
  "base64",
  "custom",
] as const satisfies readonly BaseFieldId[]

const STANDARD_LOOKUP = buildLookup(STANDARD_ALPHABET)
const BASE64_LOOKUP = buildLookup(BASE64_ALPHABET)

function buildLookup(alphabet: string) {
  const map = new Map<string, number>()

  for (let index = 0; index < alphabet.length; index += 1) {
    map.set(alphabet[index]!, index)
  }

  return map
}

function clampCustomBase(value: number) {
  if (!Number.isFinite(value)) {
    return 58
  }

  return Math.min(64, Math.max(2, Math.trunc(value)))
}

function getFieldSpec(field: BaseFieldId, customBase: number): BaseSpec {
  if (field === "custom") {
    const normalizedBase = clampCustomBase(customBase)

    return {
      alphabet: "standard",
      base: normalizedBase,
      caseSensitive: normalizedBase > 36,
    }
  }

  return FIELD_SPECS[field]
}

function getAlphabet(spec: BaseSpec) {
  return spec.alphabet === "standard" ? STANDARD_ALPHABET : BASE64_ALPHABET
}

function getLookup(spec: BaseSpec) {
  return spec.alphabet === "standard" ? STANDARD_LOOKUP : BASE64_LOOKUP
}

function createEmptyValues(): ConversionValues {
  return {
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: "",
    base32: "",
    base36: "",
    base62: "",
    base64: "",
    custom: "",
  }
}

function parseFieldInput(
  field: BaseFieldId,
  rawValue: string,
  customBase: number
): FieldParseResult {
  const trimmedValue = rawValue.trim()

  if (trimmedValue.length === 0) {
    return { kind: "empty" }
  }

  const spec = getFieldSpec(field, customBase)
  const lookup = getLookup(spec)
  const normalizedValue =
    !spec.caseSensitive && spec.alphabet === "standard"
      ? trimmedValue.toLowerCase()
      : trimmedValue

  let result = 0n

  for (const character of normalizedValue) {
    const digit = lookup.get(character)

    if (digit === undefined || digit >= spec.base) {
      return { kind: "invalid" }
    }

    result = result * BigInt(spec.base) + BigInt(digit)
  }

  return { kind: "valid", value: result }
}

function formatValue(value: bigint, spec: BaseSpec) {
  if (value === 0n) {
    return "0"
  }

  const alphabet = getAlphabet(spec)
  const base = BigInt(spec.base)
  let remaining = value
  let result = ""

  while (remaining > 0n) {
    const digit = Number(remaining % base)

    result = alphabet[digit] + result
    remaining /= base
  }

  return result
}

function formatAllBaseValues(
  value: bigint,
  customBase: number
): ConversionValues {
  const values = createEmptyValues()

  for (const field of BASE_FIELD_IDS) {
    values[field] = formatValue(value, getFieldSpec(field, customBase))
  }

  return values
}

export {
  BASE64_ALPHABET,
  BASE_FIELD_IDS,
  STANDARD_ALPHABET,
  clampCustomBase,
  createEmptyValues,
  formatAllBaseValues,
  parseFieldInput,
}
export type { BaseFieldId }
