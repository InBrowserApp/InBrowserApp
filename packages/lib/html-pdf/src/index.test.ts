import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { renderPdf } from "./index"

vi.mock("./frame.ts?worker&url", () => ({ default: "/frame.js" }))
const source = { html: "<p>Private document</p>", css: "" }
beforeEach(() =>
  vi
    .spyOn(crypto, "randomUUID")
    .mockReturnValue("00000000-0000-4000-8000-000000000000")
)
afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
function reply(data: object, frame = document.querySelector("iframe")!) {
  window.dispatchEvent(
    new MessageEvent("message", {
      source: frame.contentWindow,
      data: { token: "00000000-0000-4000-8000-000000000000", ...data },
    })
  )
}
test("sends source separately from the trusted bootstrap and disposes output resources", async () => {
  const controller = new AbortController(),
    progress = vi.fn()
  const result = renderPdf(source, controller.signal, progress)
  const frame = document.querySelector("iframe")!
  expect(frame.srcdoc).not.toContain(source.html)
  expect(frame.srcdoc).toContain('nonce="00000000-0000-4000-8000-000000000000"')
  const post = vi
    .spyOn(frame.contentWindow!, "postMessage")
    .mockImplementation(() => {})
  reply({ ready: true })
  expect(post).toHaveBeenCalledWith(
    { source, token: "00000000-0000-4000-8000-000000000000" },
    location.origin
  )
  reply({ progress: { page: 1, pages: 2 } })
  expect(progress).toHaveBeenCalledWith({ page: 1, pages: 2 })
  const output = { pdf: new Blob(["%PDF"]), pages: 2 }
  reply({ result: output })
  expect(await result).toBe(output)
  expect(document.querySelector("iframe")).toBeNull()
})
test("ignores unrelated messages, propagates page failures and cancels pending rendering", async () => {
  const controller = new AbortController(),
    progress = vi.fn()
  const result = renderPdf(source, controller.signal, progress)
  window.dispatchEvent(
    new MessageEvent("message", { source: window, data: { ready: true } })
  )
  reply({ token: "wrong", progress: { page: 3, pages: 3 } })
  expect(progress).not.toHaveBeenCalled()
  reply({ error: "unsupported", page: 4 })
  await expect(result).rejects.toMatchObject({
    message: "unsupported",
    page: 4,
  })
  expect(document.querySelector("iframe")).toBeNull()
  const canceled = renderPdf(source, controller.signal, progress)
  controller.abort()
  await expect(canceled).rejects.toMatchObject({ name: "AbortError" })
  await expect(
    renderPdf(source, controller.signal, progress)
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(document.querySelector("iframe")).toBeNull()
})
test("reports frame load errors and removes listeners", async () => {
  const signal = new AbortController().signal,
    remove = vi.spyOn(window, "removeEventListener")
  const result = renderPdf(source, signal, vi.fn())
  document.querySelector("iframe")!.dispatchEvent(new Event("error"))
  await expect(result).rejects.toThrow("engineUnavailable")
  expect(remove).toHaveBeenCalledWith("message", expect.any(Function))
})
