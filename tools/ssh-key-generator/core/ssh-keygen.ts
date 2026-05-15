import * as ed25519 from "@noble/ed25519"

import {
  addOpenSshPadding,
  base64UrlToBytes,
  bytesToBase64,
  concatBytes,
  encodeBytes,
  encodeMpint,
  encodeString,
  encodeUint32,
  textBytes,
  toArrayBuffer,
  wrapPem,
} from "./ssh-wire"

type SshKeyAlgorithm = "ed25519" | "rsa"
type RsaKeySize = 2048 | 3072 | 4096

type SshKeyGenerationOptions = Readonly<{
  algorithm: SshKeyAlgorithm
  comment?: string
  rsaKeySize?: RsaKeySize
}>

type SshKeyPair = Readonly<{
  algorithm: SshKeyAlgorithm
  keyType: "ssh-ed25519" | "ssh-rsa"
  bits: number
  comment: string
  publicKey: string
  privateKey: string
  fingerprintSha256: string
}>

type SshKeygenRuntime = Readonly<{
  crypto?: Pick<Crypto, "getRandomValues" | "subtle">
}>

const RSA_KEY_SIZES = [2048, 3072, 4096] as const
const DEFAULT_RSA_KEY_SIZE = 4096 satisfies RsaKeySize
const OPENSSH_PRIVATE_KEY_MAGIC = "openssh-key-v1\0"
const OPENSSH_PRIVATE_KEY_LABEL = "OPENSSH PRIVATE KEY"

async function generateSshKeyPair(
  options: SshKeyGenerationOptions,
  runtime: SshKeygenRuntime = {}
): Promise<SshKeyPair> {
  if (options.algorithm === "ed25519") {
    return generateEd25519KeyPair(options.comment ?? "", runtime)
  }

  if (options.algorithm === "rsa") {
    return generateRsaKeyPair(
      options.rsaKeySize ?? DEFAULT_RSA_KEY_SIZE,
      options.comment ?? "",
      runtime
    )
  }

  throw new Error("UNSUPPORTED_ALGORITHM")
}

async function generateEd25519KeyPair(
  comment: string,
  runtime: SshKeygenRuntime = {}
): Promise<SshKeyPair> {
  const crypto = getCrypto(runtime)
  const normalizedComment = normalizeComment(comment)
  const privateKeyBytes = randomBytes(32, crypto)
  const publicKeyBytes = await ed25519.getPublicKeyAsync(privateKeyBytes)
  const keyType = "ssh-ed25519"
  const publicBlob = concatBytes(
    encodeString(keyType),
    encodeBytes(publicKeyBytes)
  )
  const privateSection = buildPrivateSection(
    concatBytes(
      encodeString(keyType),
      encodeBytes(publicKeyBytes),
      encodeBytes(concatBytes(privateKeyBytes, publicKeyBytes)),
      encodeString(normalizedComment)
    ),
    crypto
  )

  return {
    algorithm: "ed25519",
    keyType,
    bits: 256,
    comment: normalizedComment,
    publicKey: formatPublicKey(keyType, publicBlob, normalizedComment),
    privateKey: buildOpenSshPrivateKey(publicBlob, privateSection),
    fingerprintSha256: await sha256Fingerprint(publicBlob, crypto.subtle),
  }
}

async function generateRsaKeyPair(
  rsaKeySize: RsaKeySize,
  comment: string,
  runtime: SshKeygenRuntime = {}
): Promise<SshKeyPair> {
  if (!isRsaKeySize(rsaKeySize)) {
    throw new Error("INVALID_RSA_KEY_SIZE")
  }

  const crypto = getCrypto(runtime)
  const normalizedComment = normalizeComment(comment)
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: rsaKeySize,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  )
  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey)
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey)
  const keyType = "ssh-rsa"
  const n = base64UrlToBytes(requireJwkField(publicJwk.n))
  const e = base64UrlToBytes(requireJwkField(publicJwk.e))
  const d = base64UrlToBytes(requireJwkField(privateJwk.d))
  const iqmp = base64UrlToBytes(requireJwkField(privateJwk.qi))
  const p = base64UrlToBytes(requireJwkField(privateJwk.p))
  const q = base64UrlToBytes(requireJwkField(privateJwk.q))
  const publicBlob = concatBytes(
    encodeString(keyType),
    encodeMpint(e),
    encodeMpint(n)
  )
  const privateSection = buildPrivateSection(
    concatBytes(
      encodeString(keyType),
      encodeMpint(n),
      encodeMpint(e),
      encodeMpint(d),
      encodeMpint(iqmp),
      encodeMpint(p),
      encodeMpint(q),
      encodeString(normalizedComment)
    ),
    crypto
  )

  return {
    algorithm: "rsa",
    keyType,
    bits: rsaKeySize,
    comment: normalizedComment,
    publicKey: formatPublicKey(keyType, publicBlob, normalizedComment),
    privateKey: buildOpenSshPrivateKey(publicBlob, privateSection),
    fingerprintSha256: await sha256Fingerprint(publicBlob, crypto.subtle),
  }
}

function buildPrivateSection(fields: Uint8Array, crypto: SshKeygenCrypto) {
  const checkint = randomBytes(4, crypto)

  return addOpenSshPadding(concatBytes(checkint, checkint, fields))
}

function buildOpenSshPrivateKey(
  publicBlob: Uint8Array,
  privateSection: Uint8Array
) {
  const blob = concatBytes(
    textBytes(OPENSSH_PRIVATE_KEY_MAGIC),
    encodeString("none"),
    encodeString("none"),
    encodeBytes(new Uint8Array()),
    encodeUint32(1),
    encodeBytes(publicBlob),
    encodeBytes(privateSection)
  )

  return wrapPem(OPENSSH_PRIVATE_KEY_LABEL, blob)
}

function formatPublicKey(
  keyType: SshKeyPair["keyType"],
  publicBlob: Uint8Array,
  comment: string
) {
  const suffix = comment ? ` ${comment}` : ""

  return `${keyType} ${bytesToBase64(publicBlob)}${suffix}`
}

async function sha256Fingerprint(bytes: Uint8Array, subtle: SubtleCrypto) {
  const digest = await subtle.digest("SHA-256", toArrayBuffer(bytes))

  return `SHA256:${bytesToBase64(new Uint8Array(digest)).replace(/=+$/u, "")}`
}

function normalizeComment(comment: string) {
  return comment.trim().replace(/\s+/gu, " ")
}

function isRsaKeySize(value: number): value is RsaKeySize {
  return RSA_KEY_SIZES.includes(value as RsaKeySize)
}

function requireJwkField(value: string | undefined) {
  if (!value) {
    throw new Error("INVALID_JWK")
  }

  return value
}

type SshKeygenCrypto = Pick<Crypto, "getRandomValues" | "subtle">

function getCrypto(runtime: SshKeygenRuntime) {
  const crypto = runtime.crypto ?? globalThis.crypto

  if (!crypto?.subtle || typeof crypto.getRandomValues !== "function") {
    throw new Error("WEB_CRYPTO_UNAVAILABLE")
  }

  return crypto
}

function randomBytes(length: number, crypto: SshKeygenCrypto) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

export { DEFAULT_RSA_KEY_SIZE, RSA_KEY_SIZES, generateSshKeyPair, isRsaKeySize }
export type { RsaKeySize, SshKeyAlgorithm, SshKeyPair, SshKeygenRuntime }
