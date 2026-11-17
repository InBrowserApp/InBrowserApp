import { audioLayout, mixBlocks } from "./mix"
import { SAMPLE_RATE } from "./settings"
import type { JoinSettings, PcmClip } from "../types"

export { SAMPLE_RATE } from "./settings"

export function frameRange(start: number, end: number, length: number) {
  const first = Math.max(0, Math.min(length, Math.round(start * SAMPLE_RATE)))
  const last = Math.max(first, Math.min(length, Math.round(end * SAMPLE_RATE)))
  return [first, last] as const
}

export function validRange(start: number, end: number, duration: number) {
  return (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start >= 0 &&
    end <= duration &&
    end > start &&
    Math.round(end * SAMPLE_RATE) > Math.round(start * SAMPLE_RATE)
  )
}

export function waveform(channels: Float32Array[], bars = 180) {
  const length = channels[0]!.length
  return Array.from({ length: bars }, (_, bar) => {
    let peak = 0
    const start = Math.floor((bar * length) / bars)
    const end = Math.max(start + 1, Math.floor(((bar + 1) * length) / bars))
    for (const channel of channels) {
      for (let i = start; i < Math.min(end, length); i++) {
        peak = Math.max(peak, Math.abs(channel[i]!))
      }
    }
    return peak
  })
}

export function formatDuration(seconds: number) {
  const millis = Math.round(seconds * 1000)
  return `${Math.floor(millis / 60000)}:${(Math.floor(millis / 1000) % 60).toString().padStart(2, "0")}.${(millis % 1000).toString().padStart(3, "0")}`
}

export function encodeWav(
  clips: PcmClip[],
  smooth: boolean,
  join: JoinSettings = { mode: "none", seconds: 0 },
  onProgress?: (progress: number) => void
) {
  const channels = Math.max(...clips.map((clip) => clip.channels.length))
  const { frames } = audioLayout(
    clips.map((clip) => clip.channels[0]!.length),
    join
  )
  const bytes = frames * channels * 2
  if (!frames || channels > 2 || bytes > 0xffffffff - 36) {
    throw new Error("Invalid WAV size or channel count")
  }
  const buffer = new ArrayBuffer(44 + bytes)
  const view = new DataView(buffer)
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++)
      view.setUint8(offset + i, value.charCodeAt(i))
  }
  text(0, "RIFF")
  view.setUint32(4, 36 + bytes, true)
  text(8, "WAVEfmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE * channels * 2, true)
  view.setUint16(32, channels * 2, true)
  view.setUint16(34, 16, true)
  text(36, "data")
  view.setUint32(40, bytes, true)
  let offset = 44
  for (const block of mixBlocks(clips, smooth, join)) {
    for (let i = 0; i < block[0]!.length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = block[channel]![i]!
        view.setInt16(
          offset,
          Math.round(sample * (sample < 0 ? 32768 : 32767)),
          true
        )
        offset += 2
      }
    }
    onProgress?.(Math.round(((offset - 44) / bytes) * 100))
  }
  return buffer
}
