import type { GenerateKeyOptions, UserID } from 'openpgp'

export type KeyAlgorithm = 'ecc' | 'rsa'
export type RsaKeySize = 2048 | 3072 | 4096

export interface PgpKeyOptions {
  name: string
  email: string
  comment: string
  passphrase: string
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  expirationDays: number
}

export interface PgpKeyPair {
  publicKey: string
  privateKey: string
  revocationCertificate: string
  fingerprint: string
  keyID: string
  userID: string
}

const defaultCurve: GenerateKeyOptions['curve'] = 'curve25519Legacy'

function normalizeInput(value: string): string {
  return value.trim()
}

function buildUserID(options: Pick<PgpKeyOptions, 'name' | 'email' | 'comment'>): UserID {
  const name = normalizeInput(options.name)
  const email = normalizeInput(options.email)
  const comment = normalizeInput(options.comment)

  if (!name && !email) {
    throw new Error('Name or email is required')
  }

  const userID: UserID = {}
  if (name) userID.name = name
  if (email) userID.email = email
  if (comment) userID.comment = comment
  return userID
}

export function formatUserID(options: Pick<PgpKeyOptions, 'name' | 'email' | 'comment'>): string {
  const name = normalizeInput(options.name)
  const email = normalizeInput(options.email)
  const comment = normalizeInput(options.comment)

  const segments: string[] = []
  if (name) segments.push(name)
  if (comment) segments.push(`(${comment})`)
  if (email) segments.push(`<${email}>`)

  return segments.join(' ').trim()
}

export function formatFingerprint(fingerprint: string): string {
  const normalized = fingerprint.replace(/\s+/g, '').toUpperCase()
  return normalized.replace(/(.{4})/g, '$1 ').trim()
}

export async function generatePgpKeyPair(options: PgpKeyOptions): Promise<PgpKeyPair> {
  const userID = buildUserID(options)
  const displayUserID = formatUserID(options)

  const keyOptions: GenerateKeyOptions = {
    userIDs: [userID],
    format: 'armored',
  }

  if (options.passphrase) {
    keyOptions.passphrase = options.passphrase
  }

  if (options.expirationDays > 0) {
    keyOptions.keyExpirationTime = options.expirationDays * 24 * 60 * 60
  }

  if (options.algorithm === 'rsa') {
    keyOptions.type = 'rsa'
    keyOptions.rsaBits = options.rsaKeySize
  } else {
    keyOptions.type = 'ecc'
    keyOptions.curve = defaultCurve
  }

  const openpgp = await import('openpgp')
  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey(keyOptions)

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
