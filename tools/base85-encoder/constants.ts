import type { Base85Variant } from "./core/base85"
import type { Base85EncoderMessages } from "./types"

const DEFAULT_TEXT = "Base85 demo!"
const STORAGE_KEYS = {
  alphabet: "tools:base85-encoder:alphabet",
  text: "tools:base85-encoder:text",
} as const
const ALPHABET_KEYS = ["ascii85", "z85"] as const

function getAlphabetLabel(
  messages: Base85EncoderMessages,
  value: Base85Variant
) {
  switch (value) {
    case "ascii85":
      return messages.alphabetAscii85
    case "z85":
      return messages.alphabetZ85
  }
}

function getEncodedExtension(value: Base85Variant) {
  return value === "z85" ? "z85" : "a85"
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
  getEncodedExtension,
}
