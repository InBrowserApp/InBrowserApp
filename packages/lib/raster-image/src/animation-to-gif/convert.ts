import type { AnimationFormat, ConversionReply } from "./types"

export type { AnimationFormat, ConversionReply } from "./types"

export async function convertAnimationToGif(
  file: File,
  format: AnimationFormat,
  signal: AbortSignal
): Promise<ConversionReply> {
  signal.throwIfAborted()
  const worker = new Worker(new URL("./convert.worker.ts", import.meta.url), {
    type: "module",
  })
  const listeners = new AbortController()
  const options = { signal: listeners.signal }
  try {
    return await new Promise<ConversionReply>((resolve, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), options)
      worker.addEventListener(
        "message",
        (event: MessageEvent<ConversionReply>) => resolve(event.data),
        options
      )
      worker.addEventListener("error", reject, options)
      worker.addEventListener("messageerror", reject, options)
      worker.postMessage({ file, format })
    })
  } finally {
    listeners.abort()
    worker.terminate()
  }
}
