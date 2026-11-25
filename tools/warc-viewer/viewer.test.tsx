// @vitest-environment jsdom
import { gzipSync } from "node:zlib"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { openWarc, sampleArchive } from "./archive"
import Client from "./client"
import m from "./messages/en.json"
import { indexResources, previewCapture } from "./preview"
import { CaptureBrowser } from "./capture-browser"
import type { Capture } from "./archive"

afterEach(cleanup)
const signal = new AbortController().signal
const encoder = new TextEncoder()
function fileWithBytes(data: Uint8Array<ArrayBuffer>, name: string) {
  const file = new File([data], name)
  Object.defineProperty(file, "stream", {
    value: () =>
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(data)
          controller.close()
        },
      }),
  })
  return file
}

function readSample() {
  const file = sampleArchive()
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

test("indexes WARC records and concatenated gzip members", async () => {
  const bytes = new Uint8Array(await readSample())
  const offset = new TextDecoder().decode(bytes).lastIndexOf("WARC/1.1")
  const compressed = Uint8Array.from(
    Buffer.concat([
      gzipSync(bytes.slice(0, offset)),
      gzipSync(bytes.slice(offset)),
    ])
  )
  for (const file of [
    fileWithBytes(bytes, "example.warc"),
    fileWithBytes(compressed, "example.warc.gz"),
  ]) {
    const records = await openWarc(file, signal)
    expect(records).toHaveLength(2)
    expect(records[0]).toMatchObject({
      url: "https://example.org/field-notes",
      date: "2024-06-01T10:30:00Z",
      type: "response",
      status: 200,
      contentType: "text/html; charset=utf-8",
    })
    expect(records[0]?.headers).toContainEqual(["warc-type", "response"])
    expect(new TextDecoder().decode(records[1]?.body)).toContain("system-ui")
  }
})

test("rejects unreadable archive bytes and supports cancellation before reading", async () => {
  await expect(
    openWarc(fileWithBytes(encoder.encode("invalid"), "broken.warc"), signal)
  ).rejects.toThrow("Invalid WARC header")
  await expect(
    openWarc(new File([], "unused.warc"), AbortSignal.abort())
  ).rejects.toThrow("This operation was aborted")
})

const capture = (
  url: string,
  contentType: string,
  body: string,
  overrides: Partial<Capture> = {}
): Capture => ({
  url,
  date: "2024-06-01T10:30:00Z",
  type: "response",
  status: 200,
  headers: [["WARC-Type", "response"]],
  httpHeaders: [["Content-Type", contentType]],
  contentType,
  body: encoder.encode(body),
  ...overrides,
})

test("previews saved resources from the nearest capture and strips live paths", () => {
  const page = capture(
    "https://example.org/page",
    "text/html; charset=windows-1252",
    '<base href="/assets/"><title>Archived page</title><link rel="stylesheet" href="page.css" media="screen"><p>Archived text</p><img src="ok.png" srcset="live.png"><img src="missing.png"><script>alert(1)</script>'
  )
  const resources = indexResources([
    capture("not a URL", "text/css", ""),
    capture(
      "https://example.org/assets/page.css",
      "text/css",
      "p{color:blue}",
      { date: "2024-05-01T10:30:00Z" }
    ),
    capture(
      "https://example.org/assets/page.css",
      "text/css; charset=unknown",
      "p{color:red}"
    ),
    capture("https://example.org/assets/ok.png", "image/png", "example"),
    page,
  ])
  const preview = previewCapture(
    { ...page, body: page.body! },
    resources,
    m.noPreview
  )
  expect(preview.title).toBe("Archived page")
  expect(preview.html).toContain("color: red")
  expect(preview.html).toContain("data:image/png;base64,ZXhhbXBsZQ==")
  expect(preview.html).not.toMatch(/<script|srcset|missing\.png/)
  expect(preview.notes.local).toBe(true)
})

test("opens a selected file, filters and switches records, then recovers from an invalid file", async () => {
  const file = fileWithBytes(new Uint8Array(await readSample()), "example.warc")
  render(<Client messages={m} lang="en" />)
  const picker = screen.getByLabelText(m.open)
  fireEvent.change(picker, { target: { files: [file] } })
  await screen.findByTitle("Field notes")
  fireEvent.change(screen.getByLabelText(m.search), {
    target: { value: "notes.css" },
  })
  fireEvent.click(screen.getByRole("button", { name: /notes.css/ }))
  expect(screen.getByText(m.noPreview)).toBeTruthy()
  expect(screen.getByText(m.httpHeaders)).toBeTruthy()
  fireEvent.change(screen.getByLabelText(m.search), {
    target: { value: "no record" },
  })
  expect(screen.getByText(m.noMatches)).toBeTruthy()
  fireEvent.change(picker, {
    target: {
      files: [fileWithBytes(encoder.encode("not warc"), "broken.warc")],
    },
  })
  await screen.findByText(m.invalid)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("lists records across pages and starts with details when there is no page", () => {
  const records = Array.from({ length: 61 }, (_, index) =>
    capture(`https://example.org/${index + 1}`, "", "", {
      type: "request",
      httpHeaders: [],
    })
  )
  render(<CaptureBrowser captures={records} messages={m} lang="en" />)
  const page = screen.getByRole("combobox", { name: m.records })
  fireEvent.change(page, { target: { value: "1" } })
  fireEvent.click(screen.getByRole("button", { name: /example.org\/61/ }))
  expect(screen.getAllByText("https://example.org/61")).toHaveLength(2)
  expect(screen.queryByText(m.httpHeaders)).toBeNull()
})

test("loads the built-in sample and connects the open button to the file picker", async () => {
  const bytes = new Uint8Array(await readSample())
  const original = Object.getOwnPropertyDescriptor(File.prototype, "stream")
  Object.defineProperty(File.prototype, "stream", {
    configurable: true,
    value: () => fileWithBytes(bytes, "sample.warc").stream(),
  })
  try {
    render(<Client messages={m} lang="en" />)
    const picker = screen.getByLabelText(m.open)
    const click = vi.spyOn(picker, "click")
    fireEvent.click(screen.getByRole("button", { name: m.open }))
    expect(click).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole("button", { name: m.example }))
    await waitFor(() => expect(screen.getByTitle("Field notes")).toBeTruthy())
  } finally {
    if (original) Object.defineProperty(File.prototype, "stream", original)
    else Reflect.deleteProperty(File.prototype, "stream")
  }
})

test("indexes WARC 1.0 non-HTTP resources and metadata without inventing HTTP details", async () => {
  const createRecord = (
    type: string,
    uri: string,
    body: string,
    contentType?: string
  ) =>
    [
      "WARC/1.0",
      `warc-type: ${type}`,
      "warc-record-id: <urn:uuid:00000000-0000-4000-8000-000000000002>",
      uri ? `warc-target-uri: ${uri}` : null,
      contentType ? `content-type: ${contentType}` : null,
      `content-length: ${encoder.encode(body).length}`,
      "",
      body,
      "",
      "",
    ]
      .filter((value) => value !== null)
      .join("\r\n")
  const bytes = encoder.encode(
    createRecord("warcinfo", "", "") +
      createRecord(
        "resource",
        "https://example.org/report",
        "<p>Saved report</p>",
        "text/html"
      ) +
      createRecord(
        "resource",
        "https://example.org/video.mp4",
        "file content",
        "video/mp4"
      )
  )
  const records = await openWarc(fileWithBytes(bytes, "mixed.warc"), signal)
  expect(records[0]).toMatchObject({
    type: "warcinfo",
    url: "",
    date: "",
    httpHeaders: [],
  })
  expect(new TextDecoder().decode(records[1]?.body)).toBe("<p>Saved report</p>")
  expect(records[2]?.body).toBeUndefined()
  await expect(
    openWarc(fileWithBytes(new Uint8Array(), "empty.warc"), signal)
  ).rejects.toThrow("Empty WARC")
})
