import type { KeyOptions, UserID } from "openpgp"

export const RSA_KEY_SIZES = [2048, 3072, 4096] as const
export const MAX_EXPIRATION_DAYS = 36500

export type KeyAlgorithm = "ecc" | "rsa"
export type RsaKeySize = (typeof RSA_KEY_SIZES)[number]

type PgpKeyOptions = Readonly<{
  name: string
  email: string
  comment: string
  passphrase: string
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  expirationDays: number
}>

type NormalizedPgpKeyOptions = Readonly<{
  name: string
  email: string
  comment: string
  passphrase: string
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  expirationDays: number
}>

export type PgpKeyPair = Readonly<{
  publicKey: string
  privateKey: string
  revocationCertificate: string
  fingerprint: string
  keyID: string
  userID: string
}>

const defaultCurve: KeyOptions["curve"] = "curve25519Legacy"

function normalizeInput(value: string): string {
  return value.trim()
}

function isRsaKeySize(value: number): value is RsaKeySize {
  return RSA_KEY_SIZES.includes(value as RsaKeySize)
}

function buildUserID(
  options: Pick<NormalizedPgpKeyOptions, "name" | "email" | "comment">
): UserID {
  if (!options.name && !options.email) {
    throw new Error("Name or email is required")
  }

  const userID: UserID = {}
  if (options.name) userID.name = options.name
  if (options.email) userID.email = options.email
  if (options.comment) userID.comment = options.comment
  return userID
}

export function normalizePgpKeyOptions(
  options: PgpKeyOptions
): NormalizedPgpKeyOptions {
  const expirationDays = Number(options.expirationDays)

  if (
    !Number.isInteger(expirationDays) ||
    expirationDays < 0 ||
    expirationDays > MAX_EXPIRATION_DAYS
  ) {
    throw new Error("Expiration must be a whole number from 0 to 36500 days")
  }

  if (!isRsaKeySize(options.rsaKeySize)) {
    throw new Error("Unsupported RSA key size")
  }

  return {
    name: normalizeInput(options.name),
    email: normalizeInput(options.email),
    comment: normalizeInput(options.comment),
    passphrase: options.passphrase,
    algorithm: options.algorithm,
    rsaKeySize: options.rsaKeySize,
    expirationDays,
  }
}

export function formatUserID(
  options: Pick<PgpKeyOptions, "name" | "email" | "comment">
): string {
  const name = normalizeInput(options.name)
  const email = normalizeInput(options.email)
  const comment = normalizeInput(options.comment)

  const segments: string[] = []
  if (name) segments.push(name)
  if (comment) segments.push(`(${comment})`)
  if (email) segments.push(`<${email}>`)

  return segments.join(" ").trim()
}

export function formatFingerprint(fingerprint: string): string {
  const normalized = fingerprint.replace(/\s+/g, "").toUpperCase()
  return normalized.replace(/(.{4})/g, "$1 ").trim()
}

export async function generatePgpKeyPair(
  options: PgpKeyOptions
): Promise<PgpKeyPair> {
  const normalizedOptions = normalizePgpKeyOptions(options)
  const userID = buildUserID(normalizedOptions)
  const displayUserID = formatUserID(normalizedOptions)

  const keyOptions: KeyOptions & { format: "armored" } = {
    userIDs: [userID],
    format: "armored",
  }

  if (normalizedOptions.passphrase) {
    keyOptions.passphrase = normalizedOptions.passphrase
  }

  if (normalizedOptions.expirationDays > 0) {
    keyOptions.keyExpirationTime =
      normalizedOptions.expirationDays * 24 * 60 * 60
  }

  if (normalizedOptions.algorithm === "rsa") {
    keyOptions.type = "rsa"
    keyOptions.rsaBits = normalizedOptions.rsaKeySize
  } else {
    keyOptions.type = "ecc"
    keyOptions.curve = defaultCurve
  }

  const openpgp = await import("openpgp")
  const { privateKey, publicKey, revocationCertificate } =
    await openpgp.generateKey(keyOptions)

  const key = await openpgp.readKey({ armoredKey: publicKey })
  const fingerprint = formatFingerprint(key.getFingerprint())
  const keyID = key.getKeyID().toHex().toUpperCase()

  return {
    publicKey,
    privateKey,
    revocationCertificate,
    fingerprint,
    keyID,
    userID: displayUserID,
  }
}
