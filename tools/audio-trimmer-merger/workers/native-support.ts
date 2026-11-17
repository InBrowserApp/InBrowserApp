import { bitrate, SAMPLE_RATE } from "../core/settings"
import type { CapabilityRequest, NativeFormat, NativeSupport } from "../types"

export const CODECS = {
  m4a: "aac",
  webm: "opus",
  mp3: "mp3",
  ogg: "vorbis",
} as const

export function nativeConfig(
  format: NativeFormat,
  { channels, quality }: CapabilityRequest
) {
  return {
    codec: format === "m4a" ? "mp4a.40.2" : CODECS[format],
    sampleRate: SAMPLE_RATE,
    numberOfChannels: channels,
    bitrate: bitrate(format, quality, channels) * 1000,
    bitrateMode: format === "mp3" ? "constant" : "variable",
    ...(format === "m4a" ? { aac: { format: "aac" } } : {}),
    ...(format === "webm" ? { opus: { format: "opus" } } : {}),
  } satisfies AudioEncoderConfig
}

export async function supportsNative(
  format: NativeFormat,
  request: CapabilityRequest
) {
  if (typeof AudioEncoder === "undefined" || typeof AudioData === "undefined")
    return false
  try {
    return (
      (await AudioEncoder.isConfigSupported(nativeConfig(format, request)))
        .supported === true
    )
  } catch {
    return false
  }
}

export async function nativeSupport(
  request: CapabilityRequest
): Promise<NativeSupport> {
  const formats = Object.keys(CODECS) as NativeFormat[]
  const values = await Promise.all(
    formats.map((format) => supportsNative(format, request))
  )
  return Object.fromEntries(
    formats.map((format, i) => [format, values[i]])
  ) as NativeSupport
}
