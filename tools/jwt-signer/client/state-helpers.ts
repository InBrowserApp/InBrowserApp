import {
  JwtSignerError,
  isJwtAlgorithm,
  type JwtAlgorithm,
  type JwtKeyFormat,
} from "../core/jwt-signer"
import { setNumericDateClaim } from "../payload-claims"

import type { JwtSignerMessages } from "./types"
import type { NumericDateValue } from "../payload-claims"

const DEFAULT_PAYLOAD = `{
  "sub": "user_123",
  "name": "Ada Lovelace",
  "role": "admin",
  "iat": 1713139200
}`
const DEFAULT_HEADER = `{
  "kid": "local-demo-key"
}`
const SAMPLE_SECRET = "correct horse battery staple"
const STORAGE_KEYS = {
  payload: "tools:jwt-signer:payload",
  header: "tools:jwt-signer:header",
  algorithm: "tools:jwt-signer:algorithm",
  keyFormat: "tools:jwt-signer:key-format",
  useCurrentIat: "tools:jwt-signer:use-current-iat",
} as const

function validateJsonObject(
  input: string,
  invalidMessage: string,
  typeMessage: string
) {
  try {
    const value = JSON.parse(input)
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return typeMessage
    }
    return ""
  } catch {
    return invalidMessage
  }
}

function createCurrentIatPayload(payloadText: string, nowSeconds: number) {
  return setNumericDateClaim(payloadText, "iat", nowSeconds) ?? payloadText
}

function formatSignerError(messages: JwtSignerMessages, error: unknown) {
  if (error instanceof JwtSignerError) {
    return messages[error.code]
  }

  return messages.errorSigningFailed
}

function isStoredAlgorithm(value: string | null): value is JwtAlgorithm {
  return Boolean(value && isJwtAlgorithm(value))
}

function isStoredKeyFormat(value: string | null): value is JwtKeyFormat {
  return value === "secret" || value === "pem" || value === "jwk"
}

function resolveRelativeExpiration({
  iatValue,
  nowSeconds,
  offsetSeconds,
  useCurrentIat,
}: Readonly<{
  iatValue: NumericDateValue
  nowSeconds: number
  offsetSeconds: number
  useCurrentIat: boolean
}>) {
  if (useCurrentIat || iatValue.status !== "valid") {
    return nowSeconds + offsetSeconds
  }

  return iatValue.value + offsetSeconds
}

function getRelativeExpirationSigningValue({
  iatValue,
  nowSeconds,
  offsetSeconds,
  useCurrentIat,
}: Readonly<{
  iatValue: NumericDateValue
  nowSeconds: number | null
  offsetSeconds: number
  useCurrentIat: boolean
}>): NumericDateValue {
  if (!useCurrentIat && iatValue.status === "valid") {
    return { status: "valid", value: iatValue.value + offsetSeconds }
  }

  if (nowSeconds === null) {
    return { status: "missing" }
  }

  return { status: "valid", value: nowSeconds + offsetSeconds }
}

export {
  DEFAULT_HEADER,
  DEFAULT_PAYLOAD,
  SAMPLE_SECRET,
  STORAGE_KEYS,
  createCurrentIatPayload,
  formatSignerError,
  getRelativeExpirationSigningValue,
  isStoredAlgorithm,
  isStoredKeyFormat,
  resolveRelativeExpiration,
  validateJsonObject,
}
