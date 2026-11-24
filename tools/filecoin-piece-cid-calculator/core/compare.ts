import { base16, base16upper } from "multiformats/bases/base16"
import { base32, base32upper } from "multiformats/bases/base32"
import { base36, base36upper } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"

import type { PieceCommitment } from "./commitment"

export const legacyCodec = 0xf101
export const legacyHash = 0x1012

const encodings = base32.decoder
  .or(base32upper.decoder)
  .or(base16.decoder)
  .or(base16upper.decoder)
  .or(base36.decoder)
  .or(base36upper.decoder)
  .or(base58btc.decoder)

// FRC-0069 requires a minimal unsigned varint of at most nine bytes and the
// smallest tree that holds the payload. The height and root take 33 bytes.
function validPieceDigest(digest: Uint8Array): boolean {
  const padding = digest.subarray(0, -33)
  const tail = padding.at(-1)
  if (
    tail === undefined ||
    padding.length > 9 ||
    tail >= 128 ||
    (padding.length > 1 && tail === 0) ||
    padding.subarray(0, -1).some((byte) => byte < 128)
  ) {
    return false
  }

  const height = digest[padding.length]!
  if (height < 2) return false
  const count = padding.reduceRight(
    (value, byte) => (value << 7n) | BigInt(byte & 0x7f),
    0n
  )
  return height === 2 ? count <= 127n : count < 127n << BigInt(height - 3)
}

export function comparePiece(
  input: string,
  result: PieceCommitment
): "match" | "different" | "invalid" {
  let cid: CID
  try {
    cid = CID.parse(input.trim(), encodings)
  } catch {
    return "invalid"
  }
  if (cid.version !== 1) return "invalid"

  const { code, digest } = cid.multihash
  if (cid.code === legacyCodec && code === legacyHash && digest.length === 32) {
    return cid.toString(base32) === result.legacyCid ? "match" : "different"
  }
  if (cid.code === 0x55 && code === 0x1011 && validPieceDigest(digest)) {
    return cid.toString(base32) === result.pieceCid ? "match" : "different"
  }
  return "invalid"
}
