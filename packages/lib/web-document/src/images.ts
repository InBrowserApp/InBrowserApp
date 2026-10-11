/** Only sanitized, embedded images reach the browser decoder. */
export async function readableImage(src: string, signal: AbortSignal) {
  signal.throwIfAborted()
  if (
    !/^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i.test(src) &&
    !src.startsWith("data:image/svg+xml;charset=utf-8,")
  )
    return false
  return new Promise<boolean>((resolve, reject) => {
    const image = new Image()
    const clean = () => {
      signal.removeEventListener("abort", abort)
      image.onload = image.onerror = null
      image.removeAttribute("src")
    }
    const abort = () => {
      clean()
      reject(signal.reason)
    }
    signal.addEventListener("abort", abort, { once: true })
    const finish = (readable: boolean) => {
      if (signal.aborted) return
      clean()
      resolve(readable)
    }
    image.onload = () => {
      // A decoder can discover truncated/corrupt pixels after the load event.
      // Wait for complete decoding before calling an image portable.
      void image.decode().then(
        () => finish(image.naturalWidth > 0),
        () => finish(false)
      )
    }
    image.onerror = () => {
      clean()
      resolve(false)
    }
    try {
      image.src = src
    } catch (reason) {
      clean()
      reject(reason)
    }
  })
}
