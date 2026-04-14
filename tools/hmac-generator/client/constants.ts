import { HMAC_ALGORITHMS, type HmacAlgorithm } from "../core/hmac"

const DEFAULT_TEXT = "Hello, authenticated browser-native world!"
const DEFAULT_SECRET_KEY = "super-secret-key"
const DEFAULT_ALGORITHM = "SHA-256" satisfies HmacAlgorithm

const STORAGE_KEYS = {
  text: "tools:hmac-generator:text",
  secretKey: "tools:hmac-generator:secret-key",
  algorithm: "tools:hmac-generator:algorithm",
} as const

const HMAC_ALGORITHM_OPTIONS = HMAC_ALGORITHMS.map((algorithm) => ({
  label: algorithm,
  value: algorithm,
}))

export {
  DEFAULT_ALGORITHM,
  DEFAULT_SECRET_KEY,
  DEFAULT_TEXT,
  HMAC_ALGORITHM_OPTIONS,
  STORAGE_KEYS,
}
