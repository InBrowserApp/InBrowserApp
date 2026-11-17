import type { MediaInfoResult, Track } from "mediainfo.js"
import type { Messages } from "../types"

type Row = { label: string; value: string }
type Section = { title: string; rows: Row[] }

export function scalar(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : ""
}

export function positive(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : null
}

export function duration(value: unknown): string {
  const seconds = positive(value)
  if (seconds === null) return ""
  const ms = Math.round(seconds * 1000)
  return (
    [
      Math.floor(ms / 3600000),
      Math.floor(ms / 60000) % 60,
      Math.floor(ms / 1000) % 60,
    ]
      .map((part) => String(part).padStart(2, "0"))
      .join(":") + `.${String(ms % 1000).padStart(3, "0")}`
  )
}

export function quantity(
  value: unknown,
  unit: string,
  scale: number,
  language: string
): string {
  const number = positive(value)
  if (number === null) return ""
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(number / scale)} ${unit}`
}

export function fileSize(bytes: number, language: string): string {
  const index =
    bytes > 0 ? Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4) : 0
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(bytes / 1024 ** index)} ${["B", "KiB", "MiB", "GiB", "TiB"][index]}`
}

function field(track: Track, key: string) {
  return (track as unknown as Record<string, unknown>)[key]
}

function resolution(track: Track) {
  const width = positive(field(track, "Width"))
  const height = positive(field(track, "Height"))
  return width && height ? `${width} × ${height}` : ""
}

function rows(values: [string, string][]): Row[] {
  return values
    .filter(([, value]) => value !== "")
    .map(([label, value]) => ({ label, value }))
}

export function buildReport(
  result: MediaInfoResult,
  file: { name: string; size: number },
  m: Messages,
  language: string
) {
  const tracks = result.media?.track ?? []
  const general = tracks.find((track) => track["@type"] === "General")
  const video = tracks.find((track) => track["@type"] === "Video")
  const audio = tracks.find((track) => track["@type"] === "Audio")
  const get = (key: string) => (general ? field(general, key) : undefined)
  const bitrate = (value: unknown) =>
    (positive(value) ?? 0) >= 1000000
      ? quantity(value, "Mb/s", 1000000, language)
      : quantity(value, "kb/s", 1000, language)
  const metrics = [
    { label: m.container, value: scalar(get("Format")) },
    { label: m.duration, value: duration(get("Duration")) },
    { label: m.overallBitrate, value: bitrate(get("OverallBitRate")) },
    video
      ? { label: m.resolution, value: resolution(video) }
      : {
          label: m.sampleRate,
          value: audio
            ? quantity(field(audio, "SamplingRate"), "kHz", 1000, language)
            : "",
        },
  ].map((metric) => ({ ...metric, value: metric.value || m.notAvailable }))
  const sections: Section[] = [
    {
      title: m.overview,
      rows: rows([
        [m.fileName, file.name],
        [m.fileSize, fileSize(file.size, language)],
        [m.container, scalar(get("Format"))],
        [m.profile, scalar(get("Format_Profile"))],
        [m.duration, duration(get("Duration"))],
        [m.overallBitrate, bitrate(get("OverallBitRate"))],
        [m.bitrateMode, scalar(get("OverallBitRate_Mode"))],
        [m.title, scalar(get("Title"))],
        [m.encoder, scalar(get("Encoded_Application"))],
      ]),
    },
  ]
  const counts = { Video: 0, Audio: 0, Text: 0 }
  for (const track of tracks) {
    const type = track["@type"]
    if (type !== "Video" && type !== "Audio" && type !== "Text") continue
    const title = { Video: m.video, Audio: m.audio, Text: m.text }[type]
    const get = (key: string) => field(track, key)
    const text = (key: string) => scalar(get(key))
    const flag = (key: string) =>
      get(key) === "Yes" ? m.yes : get(key) === "No" ? m.no : text(key)
    sections.push({
      title: `${title} ${++counts[type]}`,
      rows: rows([
        [m.codec, text("Format")],
        [m.profile, text("Format_Profile")],
        [m.codecId, text("CodecID")],
        [m.title, text("Title")],
        [m.language, text("Language")],
        [m.duration, duration(get("Duration"))],
        [m.bitrate, bitrate(get("BitRate"))],
        [m.bitrateMode, text("BitRate_Mode")],
        ...(type === "Video"
          ? ([
              [m.resolution, resolution(track)],
              [m.frameRate, quantity(get("FrameRate"), "fps", 1, language)],
              [m.frameRateMode, text("FrameRate_Mode")],
              [m.aspectRatio, text("DisplayAspectRatio")],
              [m.rotation, text("Rotation")],
              [m.colorSpace, text("ColorSpace")],
              [m.chromaSubsampling, text("ChromaSubsampling")],
              [m.hdr, text("HDR_Format")],
            ] as [string, string][])
          : []),
        ...(type === "Audio"
          ? ([
              [m.channels, text("Channels")],
              [m.channelLayout, text("ChannelLayout")],
              [
                m.sampleRate,
                quantity(get("SamplingRate"), "kHz", 1000, language),
              ],
            ] as [string, string][])
          : []),
        [m.bitDepth, text("BitDepth")],
        [m.defaultTrack, flag("Default")],
        [m.forcedTrack, flag("Forced")],
        [m.encoder, text("Encoded_Library")],
      ]),
    })
  }
  const report = sections
    .map(
      (section) =>
        `${section.title}\n${section.rows.map((row) => `${row.label}: ${row.value}`).join("\n")}`
    )
    .join("\n\n")
  return { metrics, sections, counts, report }
}
