import { expect, test, vi } from "vitest"
import { readAsciiDoc } from "@workspace/asciidoc"
import { prepare } from "./core/prepare"
import { openDocument } from "./open-document"

vi.mock("@workspace/asciidoc", () => ({
  readAsciiDoc: vi.fn(),
}))
vi.mock("./core/prepare", () => ({
  prepare: vi.fn(() => ({ html: "<p>Text</p>", css: "" })),
}))

test("uses the AsciiDoc worker and rejects stale content before print preparation", async () => {
  const archive = {
    html: "<p>Text</p>",
    warnings: false,
  }
  vi.mocked(readAsciiDoc).mockResolvedValue(archive)
  const file = new File(["archive"], "report.adoc")
  const signal = new AbortController().signal
  expect(await openDocument(file, signal)).toEqual({
    html: "<p>Text</p>",
    css: "",
  })
  expect(readAsciiDoc).toHaveBeenCalledWith(file, signal)
  expect(prepare).toHaveBeenCalledWith(archive)
  const controller = new AbortController()
  const pending = openDocument(file, controller.signal)
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(prepare).toHaveBeenCalledOnce()
})
