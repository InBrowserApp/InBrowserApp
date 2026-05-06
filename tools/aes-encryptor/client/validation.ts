import {
  validateRawKeyHex,
  type KeyLengthBits,
  type KeySource,
} from "../core/aes-encryptor"

import type { AesEncryptorMessages } from "./types"

function getValidationMessage({
  messages,
  keyLengthBits,
  keySource,
  password,
  rawKeyHex,
  selectedFile,
  text,
  iterationsInvalid,
}: Readonly<{
  messages: AesEncryptorMessages
  keyLengthBits: KeyLengthBits
  keySource: KeySource
  password: string
  rawKeyHex: string
  selectedFile: File | null
  text: string
  iterationsInvalid: boolean
}>) {
  if (!selectedFile && text.length === 0) {
    return messages.validationInputRequired
  }

  if (keySource === "password" && password.length === 0) {
    return messages.validationPasswordRequired
  }

  if (keySource === "raw" && rawKeyHex.trim().length === 0) {
    return messages.validationRawKeyRequired
  }

  if (keySource === "raw" && !validateRawKeyHex(rawKeyHex, keyLengthBits)) {
    return messages.validationRawKeyInvalid
  }

  if (iterationsInvalid) {
    return messages.validationIterationsInvalid
  }

  return ""
}

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export { formatBytes, getValidationMessage }
