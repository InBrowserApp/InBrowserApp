import { describe, expect, it } from "vitest"
import {
  formatTranscript,
  hasTranscriptText,
  timestamp,
  toSegments,
} from "./transcript"

describe("timestamped audio exports", () => {
  const segments = [
    { start: 630, end: 4200, text: " R&D <update> " },
    { start: 4300, end: 5200, text: " " },
    { start: 5200, end: 7600, text: "Next\n\nitem" },
  ]

  it("exports editable text and format-specific timing", () => {
    expect(formatTranscript(segments, "txt")).toBe(
      "[00:00:00.630] R&D <update>\n[00:00:05.200] Next item\n"
    )
    expect(formatTranscript(segments, "srt")).toBe(
      "1\n00:00:00,630 --> 00:00:04,200\nR&D <update>\n\n2\n00:00:05,200 --> 00:00:07,600\nNext item\n"
    )
    expect(formatTranscript(segments, "vtt")).toBe(
      "WEBVTT\n\n00:00:00.630 --> 00:00:04.200\nR&amp;D &lt;update&gt;\n\n00:00:05.200 --> 00:00:07.600\nNext item\n"
    )
    expect(timestamp(3_661_023)).toBe("01:01:01.023")
  })

  it("omits timestamps from plain TXT without removing paragraph breaks", () => {
    expect(formatTranscript(segments, "plain")).toBe(
      "R&D <update>\n\nNext\n\nitem\n"
    )
  })

  it("distinguishes an empty transcript from editable text in either mode", () => {
    expect(hasTranscriptText({ kind: "plain", text: " \n" })).toBe(false)
    expect(hasTranscriptText({ kind: "plain", text: "会议记录" })).toBe(true)
    expect(hasTranscriptText({ kind: "timed", segments: [] })).toBe(false)
    expect(hasTranscriptText({ kind: "timed", segments: [segments[1]!] })).toBe(
      false
    )
    expect(hasTranscriptText({ kind: "timed", segments })).toBe(true)
  })

  it("reconstructs missing boundaries and clips cues to the recording", () => {
    expect(
      toSegments(
        [
          { timestamp: [-0.02, null], text: " First " },
          { timestamp: [1.23, 2], text: " Second " },
          { timestamp: [null, 2.75], text: " Third " },
          { timestamp: [2.75, 2.8], text: "    " },
          { timestamp: [2.76, 2.8], text: "[BLANK_AUDIO]" },
          { timestamp: [4.2, 4.9], text: "Beyond the recording" },
          { timestamp: [2.8, null], text: "Last" },
        ],
        4
      )
    ).toEqual([
      { start: 0, end: 1230, text: "First" },
      { start: 1230, end: 2000, text: "Second" },
      { start: 2000, end: 2750, text: "Third" },
      { start: 2800, end: 4000, text: "Last" },
    ])
  })

  it("orders cues by start time for subtitle players", () => {
    expect(
      toSegments(
        [
          { timestamp: [2, 3], text: "Later" },
          { timestamp: [0, 2], text: "Earlier" },
        ],
        3
      ).map(({ text }) => text)
    ).toEqual(["Earlier", "Later"])
  })
})
