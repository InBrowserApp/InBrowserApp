function getCrypto() {
  if (!globalThis.crypto) {
    throw new Error("Web Crypto is not available")
  }

  return globalThis.crypto
}

function getSubtleCrypto() {
  if (!getCrypto().subtle) {
    throw new Error("Web Crypto subtle API is not available")
  }

  return getCrypto().subtle
}

function createRandomBytes(
  randomBytes: ((length: number) => Uint8Array) | undefined,
  length: number
) {
  const bytes = randomBytes
    ? randomBytes(length)
    : getCrypto().getRandomValues(new Uint8Array(length))

  if (bytes.length !== length) {
    throw new Error("Random byte source returned the wrong length")
  }

  return bytes
}

export { createRandomBytes, getCrypto, getSubtleCrypto }
