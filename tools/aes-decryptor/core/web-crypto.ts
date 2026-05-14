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

export { getCrypto, getSubtleCrypto }
