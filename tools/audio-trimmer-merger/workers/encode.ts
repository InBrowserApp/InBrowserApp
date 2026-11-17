/// <reference lib="webworker" />
import { encodeWav } from "../core/audio"
import { nativeSupport, supportsNative } from "./native-support"
import type {
  CapabilityRequest,
  CapabilityResponse,
  EncodeRequest,
  EncodeResponse,
} from "../types"

self.onmessage = async (
  event: MessageEvent<EncodeRequest | CapabilityRequest>
) => {
  try {
    if (!("clips" in event.data)) {
      self.postMessage({
        capabilities: await nativeSupport(event.data),
      } satisfies CapabilityResponse)
      return
    }
    let previous = -1
    const progress = (value: number) => {
      if (value !== previous) {
        self.postMessage({ progress: value } satisfies EncodeResponse)
        previous = value
      }
    }
    progress(0)
    const { clips, settings } = event.data
    let buffer: ArrayBuffer
    if (settings.format === "wav")
      buffer = encodeWav(clips, settings.smooth, settings.join, progress)
    else if (
      await supportsNative(settings.format, {
        channels: Math.max(...clips.map((clip) => clip.channels.length)),
        quality: settings.quality,
      })
    ) {
      buffer = await (
        await import("./native")
      ).encodeNative(event.data, progress)
    } else if (settings.format === "mp3" || settings.format === "ogg") {
      buffer = await (
        await import("./compressed")
      ).encodeCompressed(event.data, progress)
    } else throw new Error("Native encoding unavailable")
    self.postMessage({ buffer } satisfies EncodeResponse, {
      transfer: [buffer],
    })
  } catch {
    self.postMessage({ error: true } satisfies EncodeResponse)
  }
}
