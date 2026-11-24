export type PcmFormat = "pcm-u8" | "pcm-s16" | "pcm-s24" | "pcm-s32" | "pcm-f32"
export type DownloadFormat = "wav" | "flac" | "mp3"
export type ChannelFiles = { left: Blob; right: Blob }

// Rates supported by the bundled FLAC encoder.
const FLAC_RATES = new Set([
  8_000, 16_000, 22_050, 24_000, 32_000, 44_100, 48_000, 88_200, 96_000,
  176_400, 192_000,
])
const MP3_RATES = [
  8_000, 11_025, 12_000, 16_000, 22_050, 24_000, 32_000, 44_100, 48_000,
]

export function supportsFlac(sampleRate: number, pcm: PcmFormat) {
  return pcm !== "pcm-f32" && pcm !== "pcm-s32" && FLAC_RATES.has(sampleRate)
}

export function mp3SampleRate(sampleRate: number) {
  return MP3_RATES.reduce((closest, rate) =>
    Math.abs(rate - sampleRate) < Math.abs(closest - sampleRate)
      ? rate
      : closest
  )
}

export function pcmFormat(codec: string | null): PcmFormat | undefined {
  const littleEndian = codec?.replace(/be$/, "")
  switch (littleEndian) {
    case "pcm-u8":
    case "pcm-s16":
    case "pcm-s24":
    case "pcm-s32":
    case "pcm-f32":
      return littleEndian
    case "pcm-f64":
      return "pcm-f32"
  }
}

export function flacPcmFormat(streamInfo: Uint8Array): PcmFormat {
  // WebCodecs FLAC description includes `fLaC` and the metadata header.
  if (streamInfo.length < 42) return "pcm-s24"
  const bits = (((streamInfo[20]! & 1) << 4) | (streamInfo[21]! >> 4)) + 1
  if (bits <= 8) return "pcm-u8"
  if (bits <= 16) return "pcm-s16"
  if (bits <= 24) return "pcm-s24"
  return "pcm-s32"
}
