/// <reference lib="webworker" />
import { encodeWav } from "../core/audio"
import type { EncodeRequest, EncodeResponse } from "../types"

self.onmessage = async (event: MessageEvent<EncodeRequest>) => {
  try {
    let previous = -1
    const progress = (value: number) => {
      if (value !== previous) {
        self.postMessage({ progress: value } satisfies EncodeResponse)
        previous = value
      }
    }
    progress(0)
    const { clips, settings } = event.data
    const buffer =
      settings.format === "wav"
        ? encodeWav(clips, settings.smooth, settings.join, progress)
        : await (
            await import("./compressed")
          ).encodeCompressed(event.data, progress)
    self.postMessage({ buffer } satisfies EncodeResponse, {
      transfer: [buffer],
    })
  } catch {
    self.postMessage({ error: true } satisfies EncodeResponse)
  }
}
