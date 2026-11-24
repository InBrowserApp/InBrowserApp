import { create as createHasher } from "@hugomrdias/commp-wasm"
import { CID } from "multiformats/cid"
import { create as createDigest } from "multiformats/hashes/digest"

import { legacyCodec, legacyHash } from "./compare"

const chunkSize = 1024 * 1024

export interface PieceCommitment {
  pieceCid: string
  legacyCid: string
  paddedSize: bigint
}

export async function calculatePiece(
  file: Blob,
  onProgress: (bytesRead: number) => void
): Promise<PieceCommitment> {
  const hasher = createHasher()
  try {
    for (let offset = 0; offset < file.size; offset += chunkSize) {
      const end = Math.min(offset + chunkSize, file.size)
      hasher.write(new Uint8Array(await file.slice(offset, end).arrayBuffer()))
      onProgress(end)
    }
    const digest = hasher.digest()
    return {
      pieceCid: CID.createV1(
        0x55,
        createDigest(digest.code, digest.digest)
      ).toString(),
      legacyCid: CID.createV1(
        legacyCodec,
        createDigest(legacyHash, digest.root)
      ).toString(),
      paddedSize: 32n << BigInt(digest.height),
    }
  } finally {
    hasher.free()
  }
}
