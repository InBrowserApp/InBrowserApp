import type { LoadedImage } from "./types"

export function decodeImage(
  blob: Blob,
  signal: AbortSignal
): Promise<LoadedImage> {
  signal.throwIfAborted()
  const url = URL.createObjectURL(blob)
  return new Promise((resolve, reject) => {
    const image = new Image()
    function finish(error?: unknown) {
      signal.removeEventListener("abort", cancel)
      image.onload = image.onerror = null
      image.removeAttribute("src")
      if (error) {
        URL.revokeObjectURL(url)
        reject(error)
      }
    }
    function cancel() {
      finish(signal.reason)
    }
    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image
      if (!width || !height) {
        finish(new Error("Empty image"))
        return
      }
      finish()
      resolve({ url, width, height })
    }
    image.onerror = () => finish(new Error("Image decoding failed"))
    signal.addEventListener("abort", cancel, { once: true })
    image.src = url
  })
}
