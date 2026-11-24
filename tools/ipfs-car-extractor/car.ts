import { CarIndexer } from "@ipld/car/indexer"
import {
  cidKey,
  IpfsFileError,
  verifyBlock,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import type { CID } from "multiformats/cid"

async function* readArchiveSlices(file: File, signal: AbortSignal) {
  const pageSize = 1024 * 1024
  for (let offset = 0; offset < file.size; offset += pageSize) {
    signal.throwIfAborted()
    yield new Uint8Array(
      await file.slice(offset, offset + pageSize).arrayBuffer()
    )
  }
}

export async function openCar(file: File, signal: AbortSignal) {
  const indexer = await CarIndexer.fromIterable(readArchiveSlices(file, signal))
  const roots = await indexer.getRoots()
  const blocks = new Map<string, { offset: number; length: number }>()
  for await (const { cid, blockLength, blockOffset } of indexer) {
    blocks.set(cidKey(cid), { offset: blockOffset, length: blockLength })
  }

  const store: ReadableStorage = {
    async *get(cid: CID, options) {
      options?.signal?.throwIfAborted()
      if (cid.multihash.code === 0) {
        yield cid.multihash.digest
        return
      }
      const block = blocks.get(cidKey(cid))
      if (!block) throw new IpfsFileError("missing")
      const bytes = new Uint8Array(
        await file
          .slice(block.offset, block.offset + block.length)
          .arrayBuffer()
      )
      await verifyBlock(cid, bytes)
      yield bytes
    },
  }

  return { roots, store }
}
