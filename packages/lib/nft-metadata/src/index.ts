import {
  openIpfsEntry,
  readIpfsFile,
  resolveIpfsPath,
} from "@workspace/ipfs-files"
import { gatewayStore, parseIpfsAddress } from "@workspace/ipfs-files/gateway"

import { gatewayUrl, parseNftUrl } from "./urls"

export { gatewayUrl, parseNftUrl } from "./urls"

export const maxMetadataBytes = 4 * 1024 * 1024

export class NftMetadataSourceError extends Error {
  constructor(readonly code: "badUri" | "unavailable" | "tooLarge") {
    super(code)
  }
}

async function readRemote(response: Response) {
  if (!response.ok) throw new NftMetadataSourceError("unavailable")
  if (!response.body) return ""
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ""
  let bytes = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return text + decoder.decode()
      bytes += value.byteLength
      if (bytes > maxMetadataBytes) {
        await reader.cancel().catch(() => {})
        throw new NftMetadataSourceError("tooLarge")
      }
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}

export async function readNftMetadata(
  source: string,
  fetcher: typeof fetch,
  signal: AbortSignal
) {
  const uri = parseNftUrl(source)
  if (
    !uri ||
    (uri.protocol === "data:" && !/^data:application\/json[;,]/i.test(uri.href))
  ) {
    throw new NftMetadataSourceError("badUri")
  }
  const store = gatewayStore(fetcher)
  if (uri.protocol === "ipfs:") {
    const address = parseIpfsAddress(uri.href)!
    const path = await resolveIpfsPath(
      address.cid,
      address.parts,
      store,
      signal
    )
    if (!path) throw new NftMetadataSourceError("unavailable")
    const entry = await openIpfsEntry(path.at(-1)!.cid, store, signal)
    if (entry.type === "directory")
      throw new NftMetadataSourceError("unavailable")
    if (entry.size > maxMetadataBytes)
      throw new NftMetadataSourceError("tooLarge")
    return {
      text: await (await readIpfsFile(entry, signal)).text(),
      base: uri,
    }
  }
  const url = gatewayUrl(uri)
  const response = await fetcher(url, {
    credentials: "omit",
    signal: signal,
  })
  return {
    text: await readRemote(response),
    base: new URL(response.url || url.href),
  }
}
