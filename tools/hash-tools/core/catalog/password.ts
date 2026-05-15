import type { HashTool } from "../types"

const PASSWORD_HASH_TOOLS = [
  {
    slug: "argon2-hash-password",
    label: "Argon2 password hash",
    group: "password",
    kind: "passwordHash",
    tags: ["argon2", "password", "phc", "kdf"],
  },
  {
    slug: "argon2-hash-password-verifier",
    label: "Argon2 password verifier",
    group: "password",
    kind: "passwordVerify",
    tags: ["argon2", "password", "verify", "phc"],
  },
  {
    slug: "bcrypt-hash-password",
    label: "bcrypt password hash",
    group: "password",
    kind: "passwordHash",
    tags: ["bcrypt", "password", "salt"],
  },
  {
    slug: "bcrypt-hash-password-verifier",
    label: "bcrypt password verifier",
    group: "password",
    kind: "passwordVerify",
    tags: ["bcrypt", "password", "verify"],
  },
  {
    slug: "pbkdf2-key-derivation",
    label: "PBKDF2 key derivation",
    group: "password",
    kind: "keyDerivation",
    tags: ["pbkdf2", "password", "kdf", "key"],
  },
  {
    slug: "scrypt-key-derivation",
    label: "scrypt key derivation",
    group: "password",
    kind: "keyDerivation",
    tags: ["scrypt", "password", "kdf", "key"],
  },
] as const satisfies readonly HashTool[]

export { PASSWORD_HASH_TOOLS }
