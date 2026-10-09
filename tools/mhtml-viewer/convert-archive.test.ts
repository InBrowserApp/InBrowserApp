import { readFile } from "node:fs/promises"
import { expect, test, vi } from "vitest"
import { convertArchive, failure } from "./convert-archive"
import { inspectEnvelope } from "./envelope"

function archive(
  body = "<h1>Saved page</h1>",
  extra = "",
  headers = "",
  type = "text/html; charset=utf-8"
) {
  return new TextEncoder().encode(
    `MIME-Version: 1.0\r\nContent-Type: multipart/related;\r\n boundary="archive"\r\n${headers}\r\n--archive\r\nContent-Type: ${type}\r\nContent-Location: https://example.org/report.html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n${body}\r\n${extra}--archive--\r\n`
  )
}

test("reads genuine Chromium and independent html-docx-js producer archives", async () => {
  for (const fixture of ["chromium-report.mhtml", "html-docx-report.mht"]) {
    const bytes = await readFile(`tools/mhtml-viewer/fixtures/${fixture}`)
    const result = await convertArchive(bytes)
    expect(result.source).toContain("Reading the river")
    expect(result.source).toContain("data:image/png;base64,")
    expect(result.source).toMatch(/#164b64|rgb\(22,75,100\)/)
    expect(result.source).toContain("#observations")
    expect(result.source).not.toContain('rel="canonical"')
    expect(result.archiveNotes).toEqual({
      truncated: false,
      encoding: false,
      nested: false,
    })
    expect(result.location).toMatch(/^(http|file):/)
  }
})

test("resolves Content-ID, relative locations, CSS images and quoted-printable non-UTF text", async () => {
  const image =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGMQ804BAAFAAMY5SsycAAAAAElFTkSuQmCC"
  const extra = `--archive\r\nContent-Type: image/png\r\nContent-ID: <marker>\r\nContent-Location: https://example.org/marker.png\r\nContent-Transfer-Encoding: base64\r\n\r\n${image}\r\n--archive\r\nContent-Type: text/css\r\nContent-Location: https://example.org/report.css\r\n\r\nh1{background-image:url(marker.png)}\r\n`
  const result = await convertArchive(
    archive(
      '<html><head><link rel="stylesheet" href="report.css"></head><body><h1>caf=E9</h1><img src="cid:marker"><img src="marker.png"></body></html>',
      extra,
      "",
      "text/html; charset=windows-1252"
    )
  )
  expect(result.source).toContain("café")
  expect(result.source.match(/data:image\/png;base64,/g)).toHaveLength(3)
})

test("keeps parsing inert and reports nested pages, unknown encodings and truncation", async () => {
  const native = vi
    .spyOn(DOMParser.prototype, "parseFromString")
    .mockImplementation(() => {
      throw new Error("Native parsing forbidden")
    })
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockRejectedValue(new Error("Network forbidden"))
  const bytes = archive(
    '<h1>Recovered</h1><iframe src="https://example.org/report.html"></iframe><object data="https://example.org/app"></object><template><iframe src="https://example.org/child"></iframe></template><img src="https://missing.invalid/a.png">',
    "",
    "Snapshot-Content-Location: https://saved.example/page\r\n",
    "text/html; charset=unknown-charset"
  )
  const result = await convertArchive(bytes.subarray(0, bytes.length - 13))
  expect(result.archiveNotes).toEqual({
    truncated: true,
    nested: true,
    encoding: true,
  })
  expect(result.location).toBe("https://saved.example/page")
  expect(result.source).not.toMatch(/<(iframe|object)\b/)
  expect(result.source).toContain("https://missing.invalid/a.png")
  expect(native).not.toHaveBeenCalled()
  expect(fetch).not.toHaveBeenCalled()
  vi.restoreAllMocks()
})

test("identifies additional pages and top-level Content-Location", async () => {
  const extra =
    "--archive\nContent-Type: text/html\nContent-Location: https://example.org/child\n\n<h1>Child</h1>\n"
  const result = await convertArchive(
    archive(
      "<p>Main</p>",
      extra,
      "Content-Location: https://original.example/page\r\n"
    )
  )
  expect(result.archiveNotes.nested).toBe(true)
  expect(result.location).toBe("https://original.example/page")
})

test("rejects email, missing boundaries, unsupported MIME structures and transfer encodings", async () => {
  const text = (s: string) => new TextEncoder().encode(s)
  expect(() =>
    inspectEnvelope(archive("x", "", "To: reader@example.org\r\n"))
  ).toThrow("email")
  expect(() =>
    inspectEnvelope(text("Content-Type: text/html\n\n<p>Plain</p>"))
  ).toThrow("structure")
  expect(() =>
    inspectEnvelope(text("Content-Type: multipart/related\n\n"))
  ).toThrow("invalid")
  expect(() =>
    inspectEnvelope(
      text(
        'Content-Type: multipart/related; boundary="x"\n\nNothing\n--unrelated\n'
      )
    )
  ).toThrow("invalid")
  expect(() =>
    inspectEnvelope(
      archive("", "", "", "multipart/alternative; boundary=nested")
    )
  ).toThrow("structure")
  const encoded = text(
    new TextDecoder()
      .decode(archive())
      .replace("quoted-printable", "x-unsupported")
  )
  expect(() => inspectEnvelope(encoded)).toThrow("structure")
  await expect(
    convertArchive(archive("binary", "", "", "image/png"))
  ).rejects.toThrow("invalid")
  expect(
    inspectEnvelope(
      text(
        new TextDecoder().decode(archive()).replaceAll("\r\n", "\n").trimEnd()
      )
    ).truncated
  ).toBe(false)
})

test("classifies genuine browser resource failures without size limits", () => {
  expect(failure(new RangeError("allocation"))).toBe("resourceLimit")
  expect(failure(new Error("out of memory"))).toBe("resourceLimit")
  expect(failure(new Error("structure"))).toBe("structure")
  expect(failure(new Error("email"))).toBe("email")
  expect(failure("bad data")).toBe("invalid")
})

test("honors an explicit multipart root Content-ID instead of the first HTML part", async () => {
  const source = new TextDecoder()
    .decode(
      archive(
        "<p>Additional page</p>",
        "--archive\r\nContent-Type: text/html\r\nContent-ID: <main>\r\n\r\n<h1>Selected root</h1>\r\n"
      )
    )
    .replace('boundary="archive"', 'boundary="archive"; start="<main>"')
  const result = await convertArchive(new TextEncoder().encode(source))
  expect(result.source).toContain("Selected root")
  expect(result.source).not.toContain("Additional page")
  expect(result.location).toBe("")
  expect(result.archiveNotes.nested).toBe(true)
})

test("recognizes an email sender even when recipients are absent", () => {
  expect(() =>
    inspectEnvelope(
      archive("<p>Message</p>", "", "From: Sender <sender@example.org>\r\n")
    )
  ).toThrow("email")
})
