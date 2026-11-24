import {
  gatewayUrl,
  maxMetadataBytes,
  NftMetadataSourceError,
  readNftMetadata,
} from "@workspace/nft-metadata"

import { inspectMetadata, type Issue } from "./metadata"

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

function timeout(signal: AbortSignal) {
  return AbortSignal.any([signal, AbortSignal.timeout(15000)])
}

function localUrl(path: string) {
  return new URL(path.split("/").map(encodeURIComponent).join("/"), localRoot)
}

function relativeLocalPath(path: string, completeFolder: boolean) {
  return completeFolder ? path.slice(path.indexOf("/") + 1) : path
}

async function readSource(
  item: Item,
  fetcher: typeof fetch,
  { signal, completeFolder }: Options
) {
  if (item.file) {
    if (item.file.size > maxMetadataBytes)
      throw new NftMetadataSourceError("tooLarge")
    return {
      text: await item.file.text(),
      base: localUrl(relativeLocalPath(item.source, completeFolder)),
    }
  }
  return readNftMetadata(item.source, fetcher, timeout(signal))
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
      const { text, base } = await readSource(item, fetcher, options)
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
          {
            code:
              error instanceof NftMetadataSourceError
                ? error.code
                : "unavailable",
          },
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
