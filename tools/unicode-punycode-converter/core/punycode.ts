import punycode from "punycode/"

const ASCII_LABEL_PATTERN = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/
const WHITESPACE_PATTERN = /\s/

function hasNonAsciiCharacters(value: string) {
  return Array.from(value).some((character) => character.codePointAt(0)! > 0x7f)
}

function encodeDomainToPunycode(value: string) {
  return punycode.toASCII(value)
}

function decodePunycodeDomain(value: string) {
  return punycode.toUnicode(value)
}

function isValidAsciiDomain(value: string) {
  if (value.trim() === "") {
    return true
  }

  if (hasNonAsciiCharacters(value)) {
    return false
  }

  const labels = value.split(".")

  if (labels.some((label) => label.length === 0)) {
    return false
  }

  return labels.every((label) => {
    if (!ASCII_LABEL_PATTERN.test(label)) {
      return false
    }

    if (!label.toLowerCase().startsWith("xn--")) {
      return true
    }

    try {
      return (
        encodeDomainToPunycode(decodePunycodeDomain(label)).toLowerCase() ===
        label.toLowerCase()
      )
    } catch {
      return false
    }
  })
}

function isValidUnicodeDomain(value: string) {
  if (value.trim() === "") {
    return true
  }

  if (WHITESPACE_PATTERN.test(value)) {
    return false
  }

  try {
    return isValidAsciiDomain(encodeDomainToPunycode(value))
  } catch {
    return false
  }
}

export {
  decodePunycodeDomain,
  encodeDomainToPunycode,
  isValidAsciiDomain,
  isValidUnicodeDomain,
}
