import { describe, expect, test } from "vitest"

import {
  buildDefaultRecordingName,
  buildRecordingDownloadName,
  formatRecordingDuration,
  formatRecordingFileSize,
  getAudioExtensionForMimeType,
  getSupportedAudioMimeType,
  isPermissionDeniedError,
  sanitizeRecordingBaseName,
} from "./recorder"

describe("audio recorder core helpers", () => {
  test("selects the first supported browser audio MIME type", () => {
    expect(
      getSupportedAudioMimeType((mimeType) => mimeType === "audio/webm")
    ).toBe("audio/webm")
    expect(getSupportedAudioMimeType(() => false)).toBe("")
    expect(getSupportedAudioMimeType()).toBe("")
  })

  test("maps browser MIME types to download extensions", () => {
    expect(getAudioExtensionForMimeType("audio/webm;codecs=opus")).toBe("webm")
    expect(getAudioExtensionForMimeType("audio/ogg;codecs=opus")).toBe("ogg")
    expect(getAudioExtensionForMimeType("audio/mp4;codecs=mp4a.40.2")).toBe(
      "m4a"
    )
    expect(getAudioExtensionForMimeType("audio/wav")).toBe("wav")
    expect(getAudioExtensionForMimeType("")).toBe("webm")
  })

  test("formats elapsed recording duration", () => {
    expect(formatRecordingDuration(-1)).toBe("00:00")
    expect(formatRecordingDuration(999)).toBe("00:00")
    expect(formatRecordingDuration(61_000)).toBe("01:01")
    expect(formatRecordingDuration(3_661_000)).toBe("01:01:01")
  })

  test("formats recording file sizes", () => {
    expect(formatRecordingFileSize(Number.NaN)).toBe("0 B")
    expect(formatRecordingFileSize(0)).toBe("0 B")
    expect(formatRecordingFileSize(512)).toBe("512 B")
    expect(formatRecordingFileSize(1536)).toBe("1.5 KB")
    expect(formatRecordingFileSize(1_572_864)).toBe("1.5 MB")
    expect(formatRecordingFileSize(1_610_612_736)).toBe("1.5 GB")
  })

  test("builds stable default recording names from local time", () => {
    expect(buildDefaultRecordingName(new Date(2026, 0, 2, 3, 4, 5))).toBe(
      "recording-20260102-030405"
    )
  })

  test("sanitizes recording base names for downloads", () => {
    expect(sanitizeRecordingBaseName("  demo take.webm  ")).toBe("demo take")
    expect(sanitizeRecordingBaseName("../bad:name?.ogg")).toBe("bad-name")
    expect(sanitizeRecordingBaseName("...")).toBe("recording")
    expect(sanitizeRecordingBaseName("", "fallback")).toBe("fallback")
  })

  test("builds a download filename with the browser format extension", () => {
    expect(buildRecordingDownloadName("meeting.mp4", "audio/ogg")).toBe(
      "meeting.ogg"
    )
    expect(buildRecordingDownloadName("", "audio/mp4", "audio-note")).toBe(
      "audio-note.m4a"
    )
  })

  test("detects microphone permission denial errors", () => {
    expect(
      isPermissionDeniedError(new DOMException("denied", "NotAllowedError"))
    ).toBe(true)
    expect(
      isPermissionDeniedError(
        new DOMException("denied", "PermissionDeniedError")
      )
    ).toBe(true)
    expect(
      isPermissionDeniedError(
        Object.assign(new Error("denied"), { name: "NotAllowedError" })
      )
    ).toBe(true)
    expect(isPermissionDeniedError(new Error("nope"))).toBe(false)
    expect(isPermissionDeniedError(null)).toBe(false)
  })
})
