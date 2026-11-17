// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { FORMATS, SubtitleError, type Options } from "./formats"
import { convertSubtitle, decodeFile, outputFilename } from "./convert"
import { parseSubtitle, detectFormat } from "./parse"
import { parseTime, clock, frameClock } from "./time"
import {
  cleanMarkup,
  decodeEntities,
  escapeXml,
  plainText,
  assText,
} from "./text"

const options: Options = { source: "auto", target: "vtt", fps: 25, offset: 0 }
const sample =
  "1\n00:00:01,200 --> 00:00:03,400\nHello, <i>world</i>!\n你好 &amp; goodbye\n\n2\n00:00:04,000 --> 00:00:06,000\nSecond line\n"

describe("subtitle formats", () => {
  it.each(FORMATS.filter((format) => format.id !== "txt"))(
    "writes and reads $label",
    ({ id }) => {
      const written = convertSubtitle(sample, { ...options, target: id })
      const read = parseSubtitle(written.output, id, 25)
      expect(read.cues).toHaveLength(2)
      expect(read.cues[0]!.start).toBeCloseTo(1200)
      expect(plainText(read.cues[0]!.text)).toContain("Hello, world!")
      expect(plainText(read.cues[0]!.text)).toContain("你好 & goodbye")
      if (id !== "lrc") expect(read.cues[0]!.end).toBeCloseTo(3400)
      expect(detectFormat(written.output.trim())).toBeDefined()
    }
  )

  it("exports a transcript and explains loss of timing", () => {
    const result = convertSubtitle(sample, { ...options, target: "txt" })
    expect(result.output).toBe("Hello, world!\n你好 & goodbye\n\nSecond line\n")
    expect(result.notes).toContain("transcriptNote")
  })

  it("reads BOM/CRLF, VTT identifiers, cue settings and metadata", () => {
    const text =
      "\ufeffWEBVTT\r\n\r\nNOTE hello\r\nnotes\r\n\r\nSTYLE\r\n::cue { color: red; }\r\n\r\nREGION\r\nid:1\r\n\r\ncue-id\r\n00:01.000 --> 00:03.000 align:start\r\n<v Alice><b>Hi</b></v>\r\n"
    const parsed = parseSubtitle(text, "auto", 25)
    expect(parsed.format).toBe("vtt")
    expect(parsed.cues).toEqual([{ start: 1000, end: 3000, text: "<b>Hi</b>" }])
    expect(
      parseSubtitle("00:01.000 --> 00:03.000\nHi", "auto", 25).format
    ).toBe("vtt")
  })

  it("uses ASS event field order, ignores comments and retains commas/line breaks", () => {
    const text =
      "[Script Info]\nScriptType: v4.00+\n[V4+ Styles]\nFormat: Name, Fontname\n[Events]\nFormat: Start, End, Layer, Text\nComment: 0,ignored\nDialogue: 0:00:01.00,0:00:02.00,0,{\\b1}Hi,{\\b0} yes\\NNext\\hline"
    expect(parseSubtitle(text, "auto", 25).cues[0]!).toEqual({
      start: 1000,
      end: 2000,
      text: "<b>Hi,</b> yes\nNext line",
    })
    expect(assText("{\\p1}m 0 0 l 1 1{\\p0}Caption")).toBe("Caption")
  })

  it("honors embedded MicroDVD fps, MPL2 italics and Spruce directives", () => {
    expect(
      parseSubtitle("{1}{1}50\n{50}{100}One|Two", "auto", 25).cues[0]!
    ).toEqual({ start: 1000, end: 2000, text: "One\nTwo" })
    expect(
      parseSubtitle("[10][20]/Italic|Normal", "auto", 25).cues[0]!.text
    ).toBe("<i>Italic</i>\nNormal")
    expect(
      parseSubtitle(
        "$FontName = Arial\n00:00:01:00,00:00:02:00,Hi|there",
        "auto",
        25
      ).cues[0]!.text
    ).toBe("Hi\nthere")
    expect(
      parseSubtitle(
        "//$SMPTEFormat = 50\n00:00:01:25,00:00:02:25,Hi",
        "spruce",
        25
      ).cues[0]!.start
    ).toBe(1500)
    expect(() =>
      parseSubtitle(
        "//$SMPTEFormat = 0\n00:00:01:00,00:00:02:00,Hi",
        "spruce",
        25
      )
    ).toThrow("invalidOptions")
  })

  it("reads repeated LRC tags, offsets, enhanced timing, empty end markers and metadata", () => {
    const result = parseSubtitle(
      "[ar:Someone]\n[offset:-100]\n[00:01.00][00:03.00]<00:01.50>Hello\n[00:05.00]\n",
      "auto",
      25
    )
    expect(result.cues).toEqual([
      { start: 900, end: 2900, text: "Hello" },
      { start: 2900, end: 4900, text: "Hello" },
    ])
    expect(parseSubtitle("[00:01.00]Hello", "auto", 25).cues[0]!.end).toBe(3000)
  })

  it("reads TTML offsets, parent timing, duration, entities and line breaks", () => {
    const text =
      '<tt xmlns="http://www.w3.org/ns/ttml"><body begin="1s"><div begin="2s" end="8s"><p begin="500ms" dur="2s">Hello <span fontStyle="italic">world</span><br/>你好 &amp; all</p></div></body></tt>'
    expect(parseSubtitle(text, "auto", 25).cues).toEqual([
      { start: 3500, end: 5500, text: "Hello <i>world</i>\n你好 &amp; all" },
    ])
  })

  it("reads TTML inherited ends, frameRateMultiplier, ticks and sequence timing", () => {
    const text =
      '<tt xmlns:ttp="http://www.w3.org/ns/ttml#parameter" ttp:frameRate="30" ttp:frameRateMultiplier="1 2" ttp:tickRate="100"><body><div timeContainer="seq"><p begin="15f" dur="1s">one</p><p begin="50t" dur="1s">two</p></div><div end="10s"><p begin="5s">three</p></div></body></tt>'
    expect(
      parseSubtitle(text, "auto", 25).cues.map(({ start, end }) => [start, end])
    ).toEqual([
      [1000, 2000],
      [2500, 3500],
      [5000, 10000],
    ])
    expect(
      parseSubtitle(
        '<tt xmlns:ttp="x" ttp:frameRate="25"><body><p begin="25t" dur="25t">Hi</p></body></tt>',
        "ttml",
        25
      ).cues[0]!.end
    ).toBe(2000)
  })

  it("reads Whisper JSON seconds and CSV quoted multiline values", () => {
    expect(
      parseSubtitle(
        '{"segments":[{"start":1.5,"end":2.5,"text":"hello"}]}',
        "auto",
        25
      ).cues[0]!
    ).toEqual({ start: 1500, end: 2500, text: "hello" })
    const result = parseSubtitle(
      'start,end,text\n00:00:01.000,00:00:02.000,"Hello,\n""world"""',
      "csv",
      25
    )
    expect(plainText(result.cues[0]!.text)).toBe('Hello,\n"world"')
    expect(
      parseSubtitle('[{"start":"1000","end":2000,"text":"Hi"}]', "json", 25)
        .cues[0]!.start
    ).toBe(1000)
  })

  it("shifts cues, keeps overlaps and removes cues before zero", () => {
    const result = convertSubtitle(sample, { ...options, offset: -2000 })
    expect(result.cues[0]!).toMatchObject({ start: 0, end: 1400 })
    expect(result.notes).toContain("shiftedNote")
    expect(
      convertSubtitle(sample, { ...options, offset: -3500 }).cues
    ).toHaveLength(1)
    expect(
      convertSubtitle(sample, { ...options, offset: 100 }).cues[0]!.start
    ).toBe(1300)
    const overlapping =
      '[{"start":1000,"end":3000,"text":"A"},{"start":2000,"end":4000,"text":"B"}]'
    const sami = convertSubtitle(overlapping, {
      ...options,
      target: "sami",
    }).output
    expect(
      parseSubtitle(sami, "sami", 25).cues.map((cue) => plainText(cue.text))
    ).toEqual(["A", "A\nB", "B"])
    const adjacent =
      '[{"start":1000,"end":2000,"text":"A"},{"start":2000,"end":3000,"text":"B"}]'
    expect(
      parseSubtitle(
        convertSubtitle(adjacent, { ...options, target: "qt" }).output,
        "qt",
        25
      ).cues.map((cue) => plainText(cue.text))
    ).toEqual(["A", "B"])
  })

  it.each([
    "ass",
    "ssa",
    "subviewer",
    "mpl2",
    "microdvd",
    "spruce",
    "srt",
  ] as const)(
    "keeps very short cues valid after %s precision rounding",
    (target) => {
      const output = convertSubtitle(
        '[{"start":1000,"end":1001,"text":"Short"}]',
        { ...options, target }
      ).output
      const cue = parseSubtitle(output, target, 25).cues[0]!
      expect(cue.end).toBeGreaterThan(cue.start)
    }
  )

  it.each([
    ["", "empty"],
    ["not subtitles", "unsupported"],
    ["WEBVTT", "noCues"],
    ["1\n00:00:02,000 --> 00:00:01,000\nHi", "timing"],
    ["1\n00:00:01,000 --> 00:00:02,000\n", "invalid"],
    ["1\n00:00:01,000 --> 00:00:02,000\nHi\n\nBroken", "invalid"],
  ])("reports %j", (text, code) =>
    expect(() => convertSubtitle(text, options)).toThrow(code)
  )

  it.each([0, 121, NaN, Infinity])("rejects invalid frame rate %s", (fps) =>
    expect(() => convertSubtitle(sample, { ...options, fps })).toThrow(
      "invalidOptions"
    )
  )
  it("rejects invalid offsets and a shift removing all cues", () => {
    expect(() => convertSubtitle(sample, { ...options, offset: NaN })).toThrow(
      "invalidOptions"
    )
    expect(() =>
      convertSubtitle(sample, { ...options, offset: -7000 })
    ).toThrow("noCues")
    expect(new SubtitleError("invalid").code).toBe("invalid")
  })
})

describe("time, text and encoding", () => {
  it.each([
    ["1h", 3600000],
    ["2m", 120000],
    ["1.5s", 1500],
    ["125ms", 125],
    ["25f", 1000],
    ["2t", 2000],
    ["1:02:03.4", 3723400],
    ["02:03", 123000],
    ["00:00:01:12", 1480],
  ])("parses %s", (text, ms) => expect(parseTime(text as string)).toBe(ms))
  it.each(["no", "00:60:00", "00:00:60", "00:00:00:25", "-1s"])(
    "rejects invalid time %s",
    (text) => expect(() => parseTime(text)).toThrow("timing")
  )
  it("formats rounding carries and frame counts", () => {
    expect(clock(59999.9)).toBe("00:01:00.000")
    expect(clock(3599999, ".", 2)).toBe("01:00:00.00")
    expect(frameClock(1480, 25)).toBe("00:00:01:12")
    expect(frameClock(0, 25)).toBe("00:00:00:00")
    expect(frameClock(999, 25)).toBe("00:00:01:00")
    expect(parseTime("100:02.00")).toBe(6002000)
  })
  it("normalizes basic markup without rendering input", () => {
    expect(
      cleanMarkup(
        '<b class="x">bold</b><br/><script>alert(1)</script> &lt;i&gt;literal&lt;/i&gt;'
      )
    ).toBe("<b>bold</b>\nalert(1) &lt;i&gt;literal&lt;/i&gt;")
    expect(
      decodeEntities("&#65;&#x1F600;&apos;&quot;&nbsp;&#0;&#x110000;")
    ).toBe("A😀'\" &#0;&#x110000;")
    expect(escapeXml('<&>"')).toBe("&lt;&amp;&gt;&quot;")
    expect(cleanMarkup("<i>Hi")).toBe("<i>Hi</i>")
    expect(cleanMarkup("<b><i>Hi</b></i>")).toBe("<b><i>Hi</i></b>")
    expect(cleanMarkup("Hi</b>")).toBe("Hi")
    const ass =
      "[Events]\nFormat: Start, End, Text\nDialogue: 0:00:01.00,0:00:02.00,{\\i1}Italic"
    const ttml = convertSubtitle(ass, {
      ...options,
      source: "ass",
      target: "ttml",
    }).output
    expect(parseSubtitle(ttml, "ttml", 25).cues[0]!.text).toBe("<i>Italic</i>")
  })
  it("decodes UTF-8/16 BOMs and legacy encoding or reports decoding errors", () => {
    expect(decodeFile(new TextEncoder().encode("你好").buffer, "auto")).toBe(
      "你好"
    )
    expect(decodeFile(new Uint8Array([255, 254, 65, 0]).buffer, "auto")).toBe(
      "A"
    )
    expect(decodeFile(new Uint8Array([254, 255, 0, 65]).buffer, "auto")).toBe(
      "A"
    )
    expect(decodeFile(new Uint8Array([233]).buffer, "windows-1252")).toBe("é")
    expect(() => decodeFile(new Uint8Array([255]).buffer, "utf-8")).toThrow(
      "encodingError"
    )
  })
  it("uses safe matching filenames", () => {
    expect(outputFilename("movie.en.srt", "vtt")).toBe("movie.en.vtt")
    expect(outputFilename("movie.qt.txt", "ass")).toBe("movie.ass")
    expect(outputFilename("", "srt")).toBe("subtitles.srt")
    expect(outputFilename("../a/b.srt", "srt")).toBe(".._a_b.srt")
    expect(outputFilename("a\n.srt", "vtt")).toBe("a_.vtt")
  })
})

describe("parser diagnostics and timing boundaries", () => {
  it.each([
    ["srt", "00:01.000 --> 00:02.000 --> 00:03.000\nHi"],
    ["srt", "one\ntwo\n00:01.000 --> 00:02.000\nHi"],
    [
      "ass",
      "[Events]\nFormat: Text, Start, End\nDialogue: Hi,0:00:01.00,0:00:02.00",
    ],
    ["ass", "[Events]\nFormat: End, Text\nDialogue: 0:00:02.00,Hi"],
    ["ass", "[Events]\nFormat: Start, Text\nDialogue: 0:00:01.00,Hi"],
    ["ass", "[Events]\nFormat: Start, End, Text\nDialogue: 0:00:01.00"],
    ["microdvd", "bad"],
    ["mpl2", "bad"],
    ["spruce", "bad"],
    ["lrc", "bad"],
    ["json", "{"],
    ["json", "null"],
    ["json", "5"],
    ["json", "{}"],
    ["json", "[null]"],
    ["json", "[42]"],
    ["json", "[{}]"],
    ["json", '[{"start":1}]'],
    ["json", '[{"start":1,"end":2}]'],
    ["json", '[{"start":1,"end":2,"text":1}]'],
    ["json", '[{"start":null,"end":2,"text":"Hi"}]'],
    ["json", '[{"start":" ","end":2,"text":"Hi"}]'],
    ["csv", "begin,end,text\n1,2,hi"],
    ["csv", "start,end,text\n1,2,hi,extra"],
    ["youtube", '<transcript><text dur="1">Hi</text></transcript>'],
    ["youtube", '<transcript><text start="1">Hi</text></transcript>'],
    ["srv3", '<timedtext><p d="1">Hi</p></timedtext>'],
    ["srv3", '<timedtext><p t="1">Hi</p></timedtext>'],
    ["ttml", "<tt><body></tt>"],
  ] as const)("reports invalid %s content: %s", (source, text) =>
    expect(() => parseSubtitle(text, source, 25)).toThrow("invalid")
  )

  it.each(["{1}{1}0\n{25}{50}Hi", "{0}{0}121\n{25}{50}Hi"])(
    "rejects invalid embedded frame rates",
    (text) =>
      expect(() => parseSubtitle(text, "microdvd", 25)).toThrow(
        "invalidOptions"
      )
  )

  it.each([
    '<tt xmlns:ttp="x" ttp:frameRate="0"/>',
    '<tt xmlns:ttp="x" ttp:frameRate="bad"/>',
    '<tt xmlns:ttp="x" ttp:tickRate="bad"/>',
    '<tt xmlns:ttp="x" ttp:tickRate="0"/>',
  ])("rejects invalid TTML timing parameters", (text) =>
    expect(() => parseSubtitle(text, "ttml", 25)).toThrow("timing")
  )

  it("rejects unrelated XML, impossible cue values and empty Qt files", () => {
    expect(() => parseSubtitle("<other/>", "ttml", 25)).toThrow("unsupported")
    expect(() =>
      parseSubtitle('[{"start":-1,"end":2,"text":"Hi"}]', "json", 25)
    ).toThrow("timing")
    expect(() =>
      parseSubtitle('[{"start":1,"end":1e400,"text":"Hi"}]', "json", 25)
    ).toThrow("timing")
    expect(() =>
      parseSubtitle('<tt><body><p begin="1s">Hi</p></body></tt>', "ttml", 25)
    ).toThrow("timing")
    expect(() => parseSubtitle("{QTtext}", "qt", 25)).toThrow("noCues")
  })

  it("reads final SAMI/Qt cues and blank lines in line-based formats", () => {
    expect(
      parseSubtitle('<SAMI><SYNC start="1000"><P>Hi</P></SAMI>', "sami", 25)
        .cues[0]!.end
    ).toBe(3000)
    expect(
      parseSubtitle("{QTtext}\n[00:00:01.000]\nHi", "qt", 25).cues[0]!.end
    ).toBe(3000)
    expect(
      parseSubtitle("[00:01.00]Hi\n\n[00:03.00]There", "lrc", 25).cues
    ).toHaveLength(2)
    expect(
      parseSubtitle("{25}{50}Hi\n\n{50}{75}There", "microdvd", 25).cues
    ).toHaveLength(2)
  })

  it("keeps TTML basic styles and xml:space, ignores non-content nodes", () => {
    const text =
      '<tt xmlns:ttp="x" ttp:frameRate="25" ttp:subFrameRate="2"><head><metadata>Info</metadata></head><body><p begin="50t" dur="1s" xml:space="default"><!-- comment --><span fontWeight="bold" textDecoration="underline">One</span></p></body></tt>'
    const cue = parseSubtitle(text, "ttml", 25).cues[0]!
    expect(cue).toEqual({ start: 1000, end: 2000, text: "<u><b>One</b></u>" })
  })
})
