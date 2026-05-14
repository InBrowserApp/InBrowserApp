import {
  validateRawKeyHex,
  type AesEncryptedEnvelope,
} from "../core/aes-decryptor"

import type { AesDecryptorMessages, ParsedEnvelopeState } from "./types"

function getValidationMessage({
  messages,
  password,
  parsedEnvelope,
  rawKeyHex,
}: Readonly<{
  messages: AesDecryptorMessages
  password: string
  parsedEnvelope: ParsedEnvelopeState
  rawKeyHex: string
}>) {
  if (parsedEnvelope.status === "empty") return messages.validationInputRequired
  if (parsedEnvelope.status === "invalid") {
    return messages.validationEnvelopeInvalid
  }

  const { envelope } = parsedEnvelope

  if (envelope.key.source === "password" && password.length === 0) {
    return messages.validationPasswordRequired
  }

  if (envelope.key.source === "raw" && rawKeyHex.trim().length === 0) {
    return messages.validationRawKeyRequired
  }

  if (
    envelope.key.source === "raw" &&
    !validateRawKeyHex(rawKeyHex, envelope.key.lengthBits)
  ) {
    return messages.validationRawKeyInvalid
  }

  return ""
}

function createDownloadName(envelope: AesEncryptedEnvelope) {
  if (envelope.plaintext.type === "file") return envelope.plaintext.name
  return "aes-decrypted.txt"
}

function createMimeType(envelope: AesEncryptedEnvelope) {
  if (envelope.plaintext.type === "file") {
    return envelope.plaintext.mimeType || "application/octet-stream"
  }

  return "text/plain;charset=utf-8"
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getDisplayError(error: unknown, messages: AesDecryptorMessages) {
  if (error instanceof Error && error.message === "AES decryption failed") {
    return messages.errorDecryptFailed
  }

  return error instanceof Error ? error.message : String(error)
}

export {
  createDownloadName,
  createMimeType,
  formatBytes,
  getDisplayError,
  getValidationMessage,
}
