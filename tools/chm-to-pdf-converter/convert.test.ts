// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { openChm } from "@workspace/chm"
import { renderPdf } from "@workspace/html-pdf"
import { convert } from "./convert"

vi.mock("@workspace/chm", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@workspace/chm")>()),
  openChm: vi.fn(),
}))
vi.mock("@workspace/html-pdf", () => ({ renderPdf: vi.fn() }))

const file = new File([], "manual.chm")
const topic = (path: string) => ({
  title: path,
  destination: { path },
  children: [],
})

afterEach(() => vi.resetAllMocks())

test("includes topics once in contents order and restores only local images", async () => {
  const entries = new Map([
    [
      "/start.htm",
      '<h1>Start</h1><img src="fig.png"><img src="fig.png"><img src="https://example.test/pixel.gif" alt="Unavailable"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><script>alert(1)</script><video src="data:video/mp4;base64,AAAA"></video>',
    ],
    ["/another.htm", "<h1>Another topic</h1>"],
    ["/fig.png", "image bytes"],
  ])
  const close = vi.fn()
  const read = vi.fn(async (path: string) =>
    new TextEncoder().encode(entries.get(path))
  )
  vi.mocked(openChm).mockResolvedValue({
    encoding: "utf-8",
    topics: [topic("/another.htm"), topic("/start.htm")],
    contents: [topic("/start.htm"), topic("/start.htm")],
    home: { path: "/start.htm" },
    lookup: (path) => (entries.has(path) ? path : undefined),
    lookupTopic: (path) => path,
    read,
    close,
  })
  const result = { pages: 1, pdf: new Blob() }
  vi.mocked(renderPdf).mockResolvedValue(result)

  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).resolves.toBe(result)
  const [{ html }] = vi.mocked(renderPdf).mock.calls[0]!
  const doc = new DOMParser().parseFromString(html, "text/html")
  expect(
    [...doc.querySelectorAll("h1")].map((node) => node.textContent)
  ).toEqual(["Start", "Another topic"])
  expect([...doc.images].map((image) => image.src)).toEqual([
    "data:image/png;base64,aW1hZ2UgYnl0ZXM=",
    "data:image/png;base64,aW1hZ2UgYnl0ZXM=",
    expect.stringMatching(/^data:image\/gif;base64,/),
  ])
  expect(doc.body.textContent).toContain("Unavailable")
  expect(doc.querySelector("script, video")).toBeNull()
  expect(read.mock.calls.map(([path]) => path)).toEqual([
    "/start.htm",
    "/fig.png",
    "/another.htm",
  ])
  expect(close).toHaveBeenCalledOnce()
})

test("closes the worker if a topic cannot be read", async () => {
  const close = vi.fn()
  vi.mocked(openChm).mockResolvedValue({
    encoding: "utf-8",
    topics: [topic("/start.htm")],
    contents: [],
    home: { path: "/start.htm" },
    lookup: () => undefined,
    lookupTopic: () => undefined,
    read: vi.fn().mockRejectedValue(new Error("Unreadable topic")),
    close,
  })
  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("Unreadable topic")
  expect(close).toHaveBeenCalledOnce()
  expect(renderPdf).not.toHaveBeenCalled()
})

test("rejects archives without any topics", async () => {
  vi.mocked(openChm).mockResolvedValue(null)
  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("No CHM topics")
  expect(renderPdf).not.toHaveBeenCalled()
})
