import { imagePng } from "../image-png"

/** Snapshot images have already been decoded and sanitized by bookImages. */
export function epubImages(signal: AbortSignal) {
  const assets = new Map<string, { href: string; blob: Blob }>()
  return {
    assets,
    async add(url: string) {
      signal.throwIfAborted()
      const existing = assets.get(url)
      if (existing) return existing.href
      if (!url.startsWith("data:image/")) throw new Error("incomplete")
      let blob = await (await fetch(url, { signal })).blob()
      const media = blob.type.split(";")[0]!
      if (blob.type !== media) blob = new Blob([blob], { type: media })
      const extensions: Record<string, string> = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/gif": "gif",
        "image/svg+xml": "svg",
        "image/webp": "webp",
      }
      // Convert browser-readable foreign image formats to an EPUB core type.
      if (!extensions[blob.type]) blob = await imagePng(url, signal)
      signal.throwIfAborted()
      const href = `images/image-${assets.size}.${extensions[blob.type]}`
      assets.set(url, { href, blob })
      return href
    },
  }
}
