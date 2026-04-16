const BASE58_ALPHABETS = {
  bitcoin: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  flickr: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
  ripple: "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",
} as const

type Base58AlphabetKey = keyof typeof BASE58_ALPHABETS

type Base58EncodeOptions = Readonly<{
  alphabet?: string
}>

const DEFAULT_BASE58_ALPHABET = BASE58_ALPHABETS.bitcoin

function isBase58AlphabetKey(value: string): value is Base58AlphabetKey {
  return value in BASE58_ALPHABETS
}

function getBase58Alphabet(key: Base58AlphabetKey) {
  return BASE58_ALPHABETS[key]
}

function resolveAlphabet(alphabet?: string) {
  const resolved = alphabet ?? DEFAULT_BASE58_ALPHABET

  if (resolved.length !== 58) {
    throw new Error("Invalid Base58 alphabet")
  }

  const characters = new Set(resolved)

  if (characters.size !== resolved.length) {
    throw new Error("Invalid Base58 alphabet")
  }

  return resolved
}

function encodeBase58(
  input: Uint8Array | ArrayBuffer,
  options: Base58EncodeOptions = {}
) {
  const alphabet = resolveAlphabet(options.alphabet)
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input

  if (bytes.length === 0) {
    return ""
  }

  const digits = [0]

  for (const byte of bytes) {
    let carry = byte

    for (let index = 0; index < digits.length; index += 1) {
      carry += digits[index]! << 8
      digits[index] = carry % 58
      carry = Math.floor(carry / 58)
    }

    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  let output = ""

  for (
    let index = 0;
    index < bytes.length && bytes[index] === 0 && index < bytes.length - 1;
    index += 1
  ) {
    output += alphabet[0]
  }

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    output += alphabet[digits[index]!]
  }

  return output
}

export {
  BASE58_ALPHABETS,
  encodeBase58,
  getBase58Alphabet,
  isBase58AlphabetKey,
}
export type { Base58AlphabetKey }
