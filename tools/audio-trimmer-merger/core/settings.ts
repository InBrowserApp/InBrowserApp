import type { CompressionQuality, ExportSettings, OutputFormat } from "../types"

export const SAMPLE_RATE = 48000
export const DEFAULT_SETTINGS: ExportSettings = {
  format: "mp3",
  quality: "standard",
  smooth: false,
  join: { mode: "none", seconds: 0.5 },
}
export const FORMATS = {
  m4a: { label: "M4A (AAC)", mime: "audio/mp4" },
  webm: { label: "WebM (Opus)", mime: "audio/webm" },
  mp3: { label: "MP3", mime: "audio/mpeg" },
  wav: { label: "WAV", mime: "audio/wav" },
  ogg: { label: "OGG", mime: "audio/ogg" },
} as const
export const MP3_BITRATES = { small: 128, standard: 192, high: 320 } as const
const AAC_BITRATES = { small: 96, standard: 128, high: 192 } as const
const OPUS_BITRATES = { small: 64, standard: 128, high: 192 } as const
export const OGG_QUALITIES = { small: 3, standard: 5, high: 8 } as const

export function downloadName(name: string, format: OutputFormat) {
  return `${name.trim().replace(/\.(mp3|wav|ogg|m4a|webm)$/i, "") || "audio"}.${format}`
}

export function bitrate(
  format: Exclude<OutputFormat, "wav">,
  quality: CompressionQuality,
  channels = 2
) {
  const rates = {
    mp3: MP3_BITRATES,
    m4a: AAC_BITRATES,
    webm: OPUS_BITRATES,
    ogg: { small: 128, standard: 160, high: 256 },
  }
  return rates[format][quality] * (format === "ogg" ? channels / 2 : 1)
}

export function estimateBytes(
  frames: number,
  channels: number,
  format: OutputFormat,
  quality: CompressionQuality
) {
  if (format === "wav") return 44 + frames * channels * 2
  return Math.ceil(
    ((frames / SAMPLE_RATE) * bitrate(format, quality, channels) * 1000) / 8
  )
}

export function formatBytes(bytes: number, language = "en") {
  const unit = bytes >= 1048576 ? "MiB" : "KiB"
  const value = bytes / (unit === "MiB" ? 1048576 : 1024)
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value)} ${unit}`
}
