import type { Base58AlphabetKey } from "./core/base58"
import type { Base58EncoderMessages } from "./types"

const DEFAULT_TEXT = "Hello World"
const STORAGE_KEYS = {
  alphabet: "tools:base58-encoder:alphabet",
  text: "tools:base58-encoder:text",
} as const
const ALPHABET_KEYS = ["bitcoin", "flickr", "ripple"] as const

function getAlphabetLabel(
  messages: Base58EncoderMessages,
  value: Base58AlphabetKey
) {
  switch (value) {
    case "bitcoin":
      return messages.alphabetBitcoin
    case "flickr":
      return messages.alphabetFlickr
    case "ripple":
      return messages.alphabetRipple
  }
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getBaseName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".")

  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName
}

export {
  ALPHABET_KEYS,
  DEFAULT_TEXT,
  STORAGE_KEYS,
  formatFileSize,
  getAlphabetLabel,
  getBaseName,
}
