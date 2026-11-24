import {
  openIpfsEntry,
  readIpfsFile,
  resolveIpfsPath,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import { gatewayStore, parseIpfsAddress } from "@workspace/ipfs-files/gateway"

import { inspectMetadata, type Issue } from "./metadata"
import { gatewayUrl, parseNftUrl } from "./urls"

const limit = 4 * 1024 * 1024
const localRoot = "https://nft-metadata.local"
const parallel = 5

export type Item = { source: string; file?: File; tokenId?: string }
export interface Result {
  source: string
  name?: string
  issues: Issue[]
}

interface Options {
  signal: AbortSignal
  checkMedia: boolean
  localFiles: ReadonlySet<string>
  completeFolder: boolean
  fetcher?: typeof fetch
  onProgress: (complete: number) => void
}

class SourceError extends Error {
  constructor(readonly code: "badUri" | "unavailable" | "tooLarge") {
    super(code)
  }
}

function timeout(signal: AbortSignal) {
  return AbortSignal.any([signal, AbortSignal.timeout(15000)])
}

function localUrl(path: string) {
  return new URL(path.split("/").map(encodeURIComponent).join("/"), localRoot)
}

function relativeLocalPath(path: string, completeFolder: boolean) {
  return completeFolder ? path.slice(path.indexOf("/") + 1) : path
}

async function readRemote(response: Response) {
  if (!response.ok) throw new SourceError("unavailable")
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
      if (bytes > limit) {
        await reader.cancel().catch(() => {})
        throw new SourceError("tooLarge")
      }
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}

async function readSource(
  item: Item,
  fetcher: typeof fetch,
  store: ReadableStorage,
  { signal, completeFolder }: Options
) {
  if (item.file) {
    if (item.file.size > limit) throw new SourceError("tooLarge")
    return {
      text: await item.file.text(),
      base: localUrl(relativeLocalPath(item.source, completeFolder)),
    }
  }
  const uri = parseNftUrl(item.source)
  if (
    !uri ||
    (uri.protocol === "data:" && !/^data:application\/json[;,]/i.test(uri.href))
  ) {
    throw new SourceError("badUri")
  }
  const requestSignal = timeout(signal)
  if (uri.protocol === "ipfs:") {
    const address = parseIpfsAddress(uri.href)!
    const path = await resolveIpfsPath(
      address.cid,
      address.parts,
      store,
      requestSignal
    )
    if (!path) throw new SourceError("unavailable")
    const entry = await openIpfsEntry(path.at(-1)!.cid, store, requestSignal)
    if (entry.type === "directory") throw new SourceError("unavailable")
    if (entry.size > limit) throw new SourceError("tooLarge")
    return {
      text: await (await readIpfsFile(entry, requestSignal)).text(),
      base: uri,
    }
  }
  const url = gatewayUrl(uri)
  const response = await fetcher(url, {
    credentials: "omit",
    signal: requestSignal,
  })
  return {
    text: await readRemote(response),
    base: new URL(response.url || url.href),
  }
}

async function checkLink(
  url: URL,
  item: Item,
  fetcher: typeof fetch,
  options: Options
) {
  if (url.protocol === "data:") return
  try {
    if (item.file && url.origin === localRoot) {
      const path = decodeURIComponent(url.pathname.slice(1))
      if (options.localFiles.has(path)) return
      return options.completeFolder ? "missingMedia" : "unverifiedMedia"
    }
    const response = await fetcher(gatewayUrl(url), {
      method: "HEAD",
      credentials: "omit",
      signal: timeout(options.signal),
    })
    if (response.ok) return
    if (
      url.protocol !== "ipfs:" &&
      (response.status === 404 || response.status === 410)
    ) {
      return "missingMedia"
    }
  } catch {
    options.signal.throwIfAborted()
  }
  return "unverifiedMedia"
}

export async function checkBatch(items: readonly Item[], options: Options) {
  const { signal, fetcher = fetch } = options
  const store = gatewayStore(fetcher)
  const localOptions = {
    ...options,
    localFiles: new Set(
      Array.from(options.localFiles, (path) =>
        relativeLocalPath(path, options.completeFolder)
      )
    ),
  }
  const results: Result[] = []
  let next = 0
  let done = 0

  async function check(item: Item): Promise<Result> {
    const { source } = item
    try {
      const { text, base } = await readSource(item, fetcher, store, options)
      const { name, issues, media } = inspectMetadata(text, base, item.tokenId)
      if (options.checkMedia) {
        for (const { field, url, needsTokenId } of media) {
          const code = needsTokenId
            ? "unverifiedMedia"
            : await checkLink(url, item, fetcher, localOptions)
          if (code) issues.push({ code, field })
        }
      }
      return { source, name, issues }
    } catch (error) {
      signal.throwIfAborted()
      return {
        source,
        issues: [
          { code: error instanceof SourceError ? error.code : "unavailable" },
        ],
      }
    }
  }

  async function checkNext() {
    while (next < items.length) {
      signal.throwIfAborted()
      const index = next++
      results[index] = await check(items[index]!)
      signal.throwIfAborted()
      options.onProgress(++done)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(parallel, items.length) }, checkNext)
  )
  return results
}
