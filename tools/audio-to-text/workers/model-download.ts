type ModelAsset = { url: string; size: number }
type DownloadModelAsset = (
  asset: ModelAsset
) => Promise<Uint8Array<ArrayBuffer>>

async function openLargeModelFile(name: string, url: string) {
  try {
    const storage = await navigator.storage.getDirectory()
    const folder = await storage.getDirectoryHandle(name, { create: true })
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(url)
    )
    const filename = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("")
    return await folder.getFileHandle(filename, { create: true })
  } catch {
    // Storage can be unavailable in private browsing or have insufficient space.
    return undefined
  }
}

function modelDownloader(
  name: string,
  assets: readonly ModelAsset[],
  onProgress: (progress: number) => void
): DownloadModelAsset {
  const cachePromise = self.caches?.open(name).catch(() => undefined)
  const total = assets.reduce((bytes, { size }) => bytes + size, 0)
  let received = 0
  let lastPercent = 0

  return async ({ url, size }) => {
    const cache = await cachePromise
    // Large model files can exceed the browser's per-entry Cache Storage limit.
    const fileHandle =
      size >= 500_000_000 ? await openLargeModelFile(name, url) : undefined
    const file = await fileHandle?.getFile().catch(() => undefined)
    const cached =
      file?.size === size
        ? new Response(file)
        : await cache?.match(url).catch(() => undefined)
    const response =
      cached ?? (await fetch(url, { referrerPolicy: "no-referrer" }))
    if (!response.ok || !response.body) throw new Error("Model download failed")

    const writer = !cached
      ? await fileHandle?.createWritable?.().catch(() => undefined)
      : undefined
    const store =
      !cached &&
      (writer
        ? response
            .clone()
            .body!.pipeTo(writer)
            .catch(() => undefined)
        : cache?.put(url, response.clone()).catch(() => undefined))
    const bytes = new Uint8Array(size)
    let offset = 0
    try {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes.set(value, offset)
        offset += value.byteLength
        received += value.byteLength
        const percent = Math.min(99, Math.floor((received / total) * 100))
        if (percent !== lastPercent) {
          lastPercent = percent
          onProgress(percent / 100)
        }
      }
      if (offset !== size) throw new Error("Model download is incomplete")
    } catch (error) {
      await store
      await cache?.delete(url).catch(() => undefined)
      throw error
    }
    await store
    return bytes
  }
}

export { modelDownloader }
export type { DownloadModelAsset, ModelAsset }
