/// <reference lib="webworker" />
import { encodeWav } from "../core/audio"
import type { PcmClip } from "../types"

self.onmessage = (
  event: MessageEvent<{ clips: PcmClip[]; smooth: boolean }>
) => {
  try {
    const buffer = encodeWav(event.data.clips, event.data.smooth)
    self.postMessage({ buffer }, { transfer: [buffer] })
  } catch {
    self.postMessage({ error: true })
  }
}
