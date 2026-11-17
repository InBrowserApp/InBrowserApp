import { expect, test } from "vitest"
import { downloadName, estimateBytes, formatBytes } from "./settings"

test("estimates PCM exactly and compressed output approximately", () => {
  expect(estimateBytes(48000, 2, "wav", "standard")).toBe(192044)
  expect(estimateBytes(48000, 1, "mp3", "small")).toBe(16000)
  expect(estimateBytes(48000, 2, "mp3", "standard")).toBe(24000)
  expect(estimateBytes(48000, 2, "mp3", "high")).toBe(40000)
  expect(estimateBytes(48000, 2, "ogg", "small")).toBe(16000)
  expect(estimateBytes(48000, 1, "ogg", "standard")).toBe(10000)
  expect(estimateBytes(48000, 2, "ogg", "high")).toBe(32000)
  expect(estimateBytes(48000, 2, "m4a", "standard")).toBe(16000)
  expect(estimateBytes(48000, 1, "webm", "small")).toBe(8000)
})
test("uses the selected extension and locale-aware size numbers", () => {
  expect(downloadName(" voice.WAV ", "mp3")).toBe("voice.mp3")
  expect(downloadName("", "ogg")).toBe("audio.ogg")
  expect(downloadName("clip.mp3", "wav")).toBe("clip.wav")
  expect(downloadName("clip.m4a", "webm")).toBe("clip.webm")
  expect(downloadName("clip.webm", "m4a")).toBe("clip.m4a")
  expect(formatBytes(1024)).toBe("1 KiB")
  expect(formatBytes(1572864, "de")).toBe("1,5 MiB")
})
