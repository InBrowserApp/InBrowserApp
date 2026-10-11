import { readableImage, staticSvg } from "@workspace/web-document"

const raster = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i

function dataUrl(bytes: Uint8Array, type: string) {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 32768)
    binary += String.fromCharCode(...bytes.subarray(i, i + 32768))
  return `data:${type};base64,${btoa(binary)}`
}

/** Only book-owned blob URLs or embedded data can reach a fetch or decoder. */
export function bookImages(signal: AbortSignal) {
  const cache = new Map<string, string | null>()
  let missing = false
  async function embed(
    source: string,
    parents = new Set<string>()
  ): Promise<string | null> {
    signal.throwIfAborted()
    if (cache.has(source)) return cache.get(source)!
    if (parents.has(source)) return null
    const chain = new Set(parents).add(source)
    let url: string | null = null
    try {
      if (raster.test(source)) url = source
      else if (/^(?:blob:|data:image\/svg\+xml[;,])/i.test(source)) {
        const response = await fetch(source, { signal })
        if (!response.ok) throw new Error("image")
        const blob = await response.blob()
        const bytes = new Uint8Array(await blob.arrayBuffer())
        const start = new TextDecoder().decode(bytes.subarray(0, 1024))
        if (
          /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[^]*?-->\s*)?<svg[\s>]/i.test(start)
        ) {
          const doc = new DOMParser().parseFromString(
            new TextDecoder().decode(bytes),
            "image/svg+xml"
          )
          if (doc.querySelector("parsererror")) throw new Error("image")
          for (const image of doc.querySelectorAll("image")) {
            const src =
              image.getAttribute("href") ||
              image.getAttribute("xlink:href") ||
              ""
            const embedded = await embed(src, chain)
            image.removeAttribute("xlink:href")
            if (embedded && raster.test(embedded))
              image.setAttribute("href", embedded)
            else {
              image.remove()
              missing = true
            }
          }
          const clean = staticSvg(
            new XMLSerializer().serializeToString(doc.documentElement)
          )
          missing ||= clean.notes.local || clean.notes.remote
          url = clean.url
        } else {
          const type =
            bytes[0] === 137 && start.slice(1, 4) === "PNG"
              ? "png"
              : bytes[0] === 255 && bytes[1] === 216
                ? "jpeg"
                : start.startsWith("GIF8")
                  ? "gif"
                  : start.startsWith("RIFF") && start.slice(8, 12) === "WEBP"
                    ? "webp"
                    : start.startsWith("BM")
                      ? "bmp"
                      : start.slice(4, 8) === "ftyp" &&
                          /avif|avis/.test(start.slice(8, 32))
                        ? "avif"
                        : null
          if (type) url = dataUrl(bytes, `image/${type}`)
        }
      }
      if (url && !(await readableImage(url, signal))) url = null
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof RangeError) throw error
      url = null
    }
    if (!url) missing = true
    cache.set(source, url)
    return url
  }
  return {
    embed,
    get missing() {
      return missing
    },
  }
}
