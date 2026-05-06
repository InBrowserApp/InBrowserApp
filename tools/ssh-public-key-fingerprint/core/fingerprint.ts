import MD5 from "crypto-js/md5"
import WordArray from "crypto-js/lib-typedarrays"

import { bytesToBase64 } from "./base64"

type Fingerprints = Readonly<{
  sha256: string
  md5: string
}>

type Sha256Digest = Pick<SubtleCrypto, "digest">

async function createSshPublicKeyFingerprints(
  bytes: Uint8Array,
  subtle: Sha256Digest
): Promise<Fingerprints> {
  const [sha256, md5] = await Promise.all([
    sha256Fingerprint(bytes, subtle),
    Promise.resolve(md5Fingerprint(bytes)),
  ])

  return { sha256, md5 }
}

async function sha256Fingerprint(bytes: Uint8Array, subtle: Sha256Digest) {
  const digest = await subtle.digest("SHA-256", toArrayBuffer(bytes))
  const base64 = bytesToBase64(new Uint8Array(digest)).replace(/=+$/u, "")

  return `SHA256:${base64}`
}

function md5Fingerprint(bytes: Uint8Array) {
  const wordArray = WordArray.create(bytes)
  const digest = MD5(wordArray).toString()

  return `MD5:${colonizeHex(digest)}`
}

function colonizeHex(hex: string) {
  const parts: string[] = []

  for (let index = 0; index < hex.length; index += 2) {
    parts.push(hex.slice(index, index + 2))
  }

  return parts.join(":")
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

export { colonizeHex, createSshPublicKeyFingerprints, md5Fingerprint }
export type { Fingerprints, Sha256Digest }
