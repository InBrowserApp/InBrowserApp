import type { CompressionQuality, ExportSettings, OutputFormat } from "../types"

export const SAMPLE_RATE = 48000
export const DEFAULT_SETTINGS: ExportSettings = {
  format: "mp3",
  quality: "standard",
  smooth: false,
  join: { mode: "none", seconds: 0.5 },
}
export const FORMATS = {
  mp3: { label: "MP3", mime: "audio/mpeg" },
  wav: { label: "WAV", mime: "audio/wav" },
  ogg: { label: "OGG", mime: "audio/ogg" },
} as const
export const MP3_BITRATES = { small: 128, standard: 192, high: 320 } as const
export const OGG_QUALITIES = { small: 3, standard: 5, high: 8 } as const

export function downloadName(name: string, format: OutputFormat) {
  return `${name.trim().replace(/\.(mp3|wav|ogg)$/i, "") || "audio"}.${format}`
}

export function estimateBytes(
  frames: number,
  channels: number,
  format: OutputFormat,
  quality: CompressionQuality
) {
  if (format === "wav") return 44 + frames * channels * 2
  const bitrate =
    format === "mp3"
      ? MP3_BITRATES[quality]
      : ({ small: 128, standard: 160, high: 256 }[quality] * channels) / 2
  return Math.ceil(((frames / SAMPLE_RATE) * bitrate * 1000) / 8)
}

export function formatBytes(bytes: number, language = "en") {
  const unit = bytes >= 1048576 ? "MiB" : "KiB"
  const value = bytes / (unit === "MiB" ? 1048576 : 1024)
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value)} ${unit}`
}
