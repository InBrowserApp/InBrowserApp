import { describe, expect, test, vi } from "vitest"

import {
  buildDefaultRecordingName,
  buildDownloadFileName,
  buildRecordingTimestamp,
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedScreenRecorderMimeType,
  preferredScreenRecorderMimeTypes,
  sanitizeFileNameBase,
} from "./recorder"

describe("getSupportedScreenRecorderMimeType", () => {
  test("returns the first supported preferred MIME type", () => {
    const isTypeSupported = vi.fn((type: string) => type.includes("webm"))

    expect(getSupportedScreenRecorderMimeType(isTypeSupported)).toBe(
      "video/webm;codecs=vp9,opus"
    )
    expect(isTypeSupported).toHaveBeenCalledWith(
      preferredScreenRecorderMimeTypes[0]
    )
  })

  test("returns an empty string without a support checker", () => {
    expect(getSupportedScreenRecorderMimeType()).toBe("")
  })

  test("returns an empty string when no preferred type is supported", () => {
    expect(getSupportedScreenRecorderMimeType(() => false)).toBe("")
  })
})

describe("getExtensionForMimeType", () => {
  test.each([
    ["video/webm;codecs=vp9", "webm"],
    ["video/mp4;codecs=avc1", "mp4"],
    ["video/x-matroska", "mkv"],
    ["video/quicktime", "webm"],
    ["application/octet-stream", "webm"],
    ["", "webm"],
  ])("maps %s to %s", (mimeType, extension) => {
    expect(getExtensionForMimeType(mimeType)).toBe(extension)
  })
})

describe("formatDuration", () => {
  test.each([
    [-1, "00:00"],
    [0, "00:00"],
    [999, "00:00"],
    [61_000, "01:01"],
    [3_661_000, "01:01:01"],
  ])("formats %s ms as %s", (ms, label) => {
    expect(formatDuration(ms)).toBe(label)
  })
})

describe("formatFileSize", () => {
  test.each([
    [NaN, "0 B"],
    [-20, "0 B"],
    [0, "0 B"],
    [512, "512 B"],
    [1536, "1.5 KB"],
    [1_572_864, "1.5 MB"],
    [1_610_612_736, "1.5 GB"],
  ])("formats %s bytes as %s", (bytes, label) => {
    expect(formatFileSize(bytes)).toBe(label)
  })
})

describe("file names", () => {
  const date = new Date(2026, 4, 14, 9, 8, 7)

  test("builds stable timestamps and default names", () => {
    expect(buildRecordingTimestamp(date)).toBe("20260514-090807")
    expect(buildDefaultRecordingName(date)).toBe(
      "screen-recording-20260514-090807"
    )
  })

  test("sanitizes unsafe file name characters", () => {
    expect(sanitizeFileNameBase(" demo/<bad>|name... ", "fallback")).toBe(
      "demo-bad-name"
    )
    expect(sanitizeFileNameBase("demo\u0001name", "fallback")).toBe("demo-name")
    expect(sanitizeFileNameBase("...", "fallback")).toBe("fallback")
  })

  test("builds download names with the resolved extension", () => {
    expect(buildDownloadFileName("demo", "video/mp4", "fallback")).toBe(
      "demo.mp4"
    )
    expect(buildDownloadFileName("", "video/webm", "fallback")).toBe(
      "fallback.webm"
    )
  })
})
