import { createEncoder } from "wasm-media-encoders"
import mp3Wasm from "wasm-media-encoders/wasm/mp3?url"
import oggWasm from "wasm-media-encoders/wasm/ogg?url"
import { audioLayout, mixBlocks } from "../core/mix"
import { MP3_BITRATES, OGG_QUALITIES, SAMPLE_RATE } from "../core/settings"
import type { EncodeRequest } from "../types"

export async function encodeCompressed(
  { clips, settings }: EncodeRequest,
  onProgress: (progress: number) => void
) {
  const channels = Math.max(...clips.map((clip) => clip.channels.length)) as
    | 1
    | 2
  const encoder =
    settings.format === "mp3"
      ? await createEncoder("audio/mpeg", mp3Wasm)
      : await createEncoder("audio/ogg", oggWasm)
  if (settings.format === "mp3") {
    encoder.configure({
      channels,
      sampleRate: SAMPLE_RATE,
      bitrate: MP3_BITRATES[settings.quality],
      outputSampleRate: SAMPLE_RATE,
    })
  } else
    encoder.configure({
      channels,
      sampleRate: SAMPLE_RATE,
      vbrQuality: OGG_QUALITIES[settings.quality],
    })
  const { frames } = audioLayout(
    clips.map((clip) => clip.channels[0]!.length),
    settings.join
  )
  const chunks: Uint8Array<ArrayBuffer>[] = []
  let completed = 0
  for (const block of mixBlocks(clips, settings.smooth, settings.join)) {
    // Encoder output points into reusable WASM memory; copy before the next call.
    chunks.push(new Uint8Array(encoder.encode(block)))
    completed += block[0]!.length
    onProgress(Math.min(99, Math.round((completed / frames) * 100)))
  }
  chunks.push(new Uint8Array(encoder.finalize()))
  const output = new Uint8Array(
    chunks.reduce((total, chunk) => total + chunk.length, 0)
  )
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output.buffer
}
