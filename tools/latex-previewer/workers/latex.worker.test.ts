import { afterEach, beforeEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({
  init: vi.fn(),
  render: vi.fn(),
  css: vi.fn(),
}))
vi.mock("faster-latex/web", () => ({
  default: mock.init,
  render: mock.render,
  article_css: mock.css,
}))
import { renderFile } from "./latex.worker"
beforeEach(() => {
  vi.clearAllMocks()
  mock.init.mockResolvedValue(undefined)
  mock.render.mockReturnValue({
    html: "<p>Preview</p>",
    warnings: [{ line: 2, message: "unsupported package" }],
  })
  mock.css.mockReturnValue("style")
})
afterEach(() => vi.restoreAllMocks())
test("returns original source, engine warnings, and nonblocking syntax notes", async () => {
  const send = vi.fn()
  await renderFile(new File(["\\begin{document}\ntext"], "file.tex"), send)
  expect(send.mock.calls[0]![0]).toEqual({
    type: "source",
    source: "\\begin{document}\ntext",
  })
  expect(send.mock.calls[1]![0]).toMatchObject({
    type: "result",
    html: "<p>Preview</p>",
    css: "style",
    diagnostics: [
      { line: 2, message: "unsupported package" },
      { line: 1, code: "environmentSyntax" },
    ],
  })
  expect(mock.render).toHaveBeenCalledWith(expect.any(String), {
    fullDocument: false,
    maxNodes: 0xffffffff,
  })
})
test("returns decode and rendering failures without discarding decoded source", async () => {
  const send = vi.fn()
  await renderFile(new File([Uint8Array.from([255])], "bad.tex"), send)
  expect(send).toHaveBeenLastCalledWith({ type: "error", error: "encoding" })
  mock.render.mockImplementation(() => {
    throw new RangeError("memory")
  })
  await renderFile(new File(["original"], "file.tex"), send)
  expect(send.mock.calls.at(-2)![0]).toEqual({
    type: "source",
    source: "original",
  })
  expect(send).toHaveBeenLastCalledWith({
    type: "error",
    error: "resourceLimit",
  })
})
test("connects the worker entrypoint to the same validated conversion path", async () => {
  const send = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  self.onmessage!(
    new MessageEvent("message", { data: new File(["hello"], "hello.tex") })
  )
  await vi.waitFor(() =>
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ type: "result" })
    )
  )
})
