import { describe, expect, test, vi } from "vitest"

import {
  buildCaptureFileName,
  buildCaptureTimestamp,
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedVideoMimeType,
  preferredVideoMimeTypes,
} from "./recorder"

describe("getSupportedVideoMimeType", () => {
  test("returns the first supported preferred MIME type", () => {
    const isTypeSupported = vi.fn((type: string) => type.includes("webm"))

    expect(getSupportedVideoMimeType(isTypeSupported)).toBe(
      "video/webm;codecs=vp9,opus"
    )
    expect(isTypeSupported).toHaveBeenCalledWith(preferredVideoMimeTypes[0])
  })

  test("returns an empty string when no support checker is available", () => {
    expect(getSupportedVideoMimeType()).toBe("")
  })

  test("returns an empty string when no preferred MIME type is supported", () => {
    expect(getSupportedVideoMimeType(() => false)).toBe("")
  })
})

describe("getExtensionForMimeType", () => {
  test.each([
    ["image/jpeg", "photo", "jpg"],
    ["image/png", "photo", "png"],
    ["image/webp", "photo", "webp"],
    ["image/gif", "photo", "gif"],
    ["video/webm;codecs=vp9", "video", "webm"],
    ["video/mp4;codecs=avc1", "video", "mp4"],
    ["video/x-matroska", "video", "mkv"],
    ["image/avif", "photo", "jpg"],
    ["video/quicktime", "video", "mp4"],
    ["", "photo", "jpg"],
    ["application/octet-stream", "video", "mp4"],
  ] as const)(
    "maps %s with %s fallback to %s",
    (mimeType, fallbackKind, extension) => {
      expect(getExtensionForMimeType(mimeType, fallbackKind)).toBe(extension)
    }
  )
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

describe("capture file names", () => {
  const date = new Date(2026, 4, 14, 9, 8, 7)

  test("builds stable timestamps", () => {
    expect(buildCaptureTimestamp(date)).toBe("20260514-090807")
  })

  test("builds photo file names with the resolved extension", () => {
    expect(buildCaptureFileName("photo", "image/jpeg", "photo", date)).toBe(
      "photo-20260514-090807.jpg"
    )
  })

  test("builds video file names with the resolved extension", () => {
    expect(buildCaptureFileName("video", "video/webm", "video", date)).toBe(
      "video-20260514-090807.webm"
    )
  })
})
