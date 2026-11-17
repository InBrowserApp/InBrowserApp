import { describe, expect, it } from "vitest"
import {
  buildReport,
  duration,
  fileSize,
  positive,
  quantity,
  scalar,
} from "./report"
import m from "../messages/en.json"
import type { MediaInfoResult } from "mediainfo.js"

const file = { name: "sample.mkv", size: 1048576 }
const result: MediaInfoResult = {
  media: {
    "@ref": "",
    track: [
      {
        "@type": "General",
        Format: "Matroska",
        Duration: 60.123,
        OverallBitRate: 1500000,
      },
      {
        "@type": "Video",
        Format: "HEVC",
        Width: 1920,
        Height: 1080,
        FrameRate: 29.97,
        FrameRate_Mode: "VFR",
        Rotation: "90.000",
        HDR_Format: "Dolby Vision",
        BitDepth: 10,
        Default: "Yes",
        Forced: "No",
      },
      {
        "@type": "Audio",
        Format: "AAC",
        Channels: 2,
        SamplingRate: 48000,
        BitRate: 192000,
        Language: "en",
        Title: "Original",
      },
      {
        "@type": "Audio",
        Format: "AC-3",
        Channels: 6,
        SamplingRate: 48000,
        Language: "ja",
      },
      {
        "@type": "Text",
        Format: "UTF-8",
        Language: "en",
        Default: "No",
        Forced: "Yes",
      },
      { "@type": "Menu" },
    ],
  },
}

describe("media reports", () => {
  it("keeps container and stream data separate and includes every audio/subtitle track", () => {
    const report = buildReport(result, file, m, "en")
    expect(report.counts).toEqual({ Video: 1, Audio: 2, Text: 1 })
    expect(report.metrics.map((metric) => metric.value)).toEqual([
      "Matroska",
      "00:01:00.123",
      "1.5 Mb/s",
      "1920 × 1080",
    ])
    expect(report.sections.map((section) => section.title)).toEqual([
      "Overview",
      "Video 1",
      "Audio 1",
      "Audio 2",
      "Subtitles 1",
    ])
    expect(report.report).toContain("Bitrate: 192 kb/s")
    expect(report.report).toContain("Frame rate: 29.97 fps")
    expect(report.report).toContain("Rotation: 90.000")
    expect(report.report).toContain("Default track: Yes")
    expect(report.report).toContain("Forced track: No")
    expect(report.report).toContain("Language: ja")
    expect(report.report).toContain("Sample rate: 48 kHz")
    expect(report.report).not.toContain("undefined")
  })
  it("handles audio-only files and decimal sampling rates", () => {
    const report = buildReport(
      {
        media: {
          "@ref": "",
          track: [{ "@type": "Audio", SamplingRate: 44100 }],
        },
      },
      file,
      m,
      "de"
    )
    expect(report.metrics[3]).toEqual({
      label: m.sampleRate,
      value: "44,1 kHz",
    })
    expect(report.counts).toEqual({ Video: 0, Audio: 1, Text: 0 })
  })
  it("does not invent missing measurements or use cover art as a video stream", () => {
    const report = buildReport({}, file, m, "en")
    expect(
      report.metrics.every((metric) => metric.value === m.notAvailable)
    ).toBe(true)
    expect(report.sections).toHaveLength(1)
    const partial = buildReport(
      {
        media: {
          "@ref": "",
          track: [
            { "@type": "Video", Width: 640 },
            { "@type": "Video", Height: 480 },
            { "@type": "Image", Width: 100, Height: 100 },
          ],
        },
      },
      file,
      m,
      "en"
    )
    expect(partial.metrics[3]!.value).toBe(m.notAvailable)
    expect(partial.counts.Video).toBe(2)
    expect(partial.report).not.toContain("Resolution:")
  })
  it.each([undefined, null, "", "NaN", "bad", -1, 0, Infinity])(
    "omits invalid or unknown positive values: %s",
    (value) => {
      expect(positive(value)).toBeNull()
      expect(duration(value)).toBe("")
      expect(quantity(value, "kb/s", 1000, "en")).toBe("")
    }
  )
  it("formats seconds, millisecond rollover, long durations and file sizes", () => {
    expect(duration(0.123)).toBe("00:00:00.123")
    expect(duration(59.9999)).toBe("00:01:00.000")
    expect(duration(90061.001)).toBe("25:01:01.001")
    expect(positive("123.5")).toBe(123.5)
    expect(fileSize(0, "en")).toBe("0 B")
    expect(fileSize(1048576, "en")).toBe("1 MiB")
    expect(fileSize(1024 ** 5, "en")).toBe("1,024 TiB")
    expect(scalar(0)).toBe("0")
    expect(scalar("en")).toBe("en")
    expect(scalar({})).toBe("")
  })
})
