import { describe, expect, it } from "vitest"
import {
  mergeOverlaps,
  parseSrt,
  readSubtitles,
  subtitleFile,
} from "./subtitles"

describe("subtitle editing and export", () => {
  it("round-trips multiline Unicode and millisecond timing", () => {
    const cues = parseSrt(
      "\uFEFF1\r\n00:00:00,125 --> 00:00:01,990\r\n你好！\r\nمرحبا\r\n\r\n" +
        "2\r\n01:02:03,001 --> 01:02:04,123\r\nA later cue\r\n"
    )
    expect(cues).toEqual([
      { start: 125, end: 1990, text: "你好！\nمرحبا" },
      { start: 3723001, end: 3724123, text: "A later cue" },
    ])
    expect(parseSrt(subtitleFile(cues, "srt"))).toEqual(cues)
    expect(parseSrt("")).toEqual([])
  })

  it("rejects an unreadable SRT instead of silently omitting the bad cue", () => {
    expect(() => parseSrt("1\n00:00:01,000 --> 00:00:00,125\nhello")).toThrow(
      "Invalid SRT timing"
    )
    expect(() => parseSrt("1\n00:00:01,000 --> 00:00:02,125")).toThrow(
      "Invalid SRT cue"
    )
  })

  it("lets captions overlap and flags incomplete or backwards times", () => {
    const first = { id: 1, start: "1", end: "3.250", text: "first" }
    const second = { id: 2, start: "2", end: "5", text: "second" }
    const blank = { id: 3, start: "", end: "", text: " " }
    expect(readSubtitles([second, blank, first])).toEqual({
      invalid: false,
      segments: [
        { start: 1000, end: 3250, text: "first" },
        { start: 2000, end: 5000, text: "second" },
      ],
    })
    expect(readSubtitles([{ ...first, end: "" }]).invalid).toBe(true)
    expect(readSubtitles([{ ...first, end: "0" }]).invalid).toBe(true)
  })

  it("shows both passages in MP4 during overlapping cue intervals", () => {
    const cues = [
      { start: 0, end: 2000, text: "A" },
      { start: 1000, end: 3000, text: "B" },
      { start: 3000, end: 4000, text: "C" },
      { start: 5000, end: 6000, text: "D" },
    ]
    expect(mergeOverlaps(cues)).toEqual([
      { start: 0, end: 1000, text: "A" },
      { start: 1000, end: 2000, text: "A\nB" },
      { start: 2000, end: 3000, text: "B" },
      { start: 3000, end: 4000, text: "C" },
      { start: 5000, end: 6000, text: "D" },
    ])
  })

  it("treats typed markup as text in the browser preview", () => {
    expect(
      subtitleFile([{ start: 0, end: 1000, text: "<a> &\n\nA --> B" }], "vtt")
    ).toBe(
      "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n&lt;a&gt; &amp;\nA --&gt; B\n"
    )
  })
})
