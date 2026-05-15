import { DEFAULT_RSA_KEY_SIZE } from "../core/ssh-keygen"

const STORAGE_KEYS = {
  algorithm: "tools:ssh-key-generator:algorithm",
  rsaKeySize: "tools:ssh-key-generator:rsa-key-size",
} as const

export { DEFAULT_RSA_KEY_SIZE, STORAGE_KEYS }
