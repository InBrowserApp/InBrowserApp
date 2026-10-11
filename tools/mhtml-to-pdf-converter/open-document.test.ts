import { expect, test, vi } from "vitest"
import { readWebArchive } from "@workspace/web-document/archive"
import { prepare } from "./core/prepare"
import { openDocument } from "./open-document"

vi.mock("@workspace/web-document/archive", () => ({
  readWebArchive: vi.fn(),
}))
vi.mock("./core/prepare", () => ({
  prepare: vi.fn(() => ({ html: "<p>Text</p>", css: "" })),
}))

test("uses the archive worker and rejects stale content before print preparation", async () => {
  const archive = {
    source: "<p>Text</p>",
    location: "",
    archiveNotes: { truncated: false, encoding: false, nested: false },
  }
  vi.mocked(readWebArchive).mockResolvedValue(archive)
  const file = new File(["archive"], "report.mht")
  const signal = new AbortController().signal
  expect(await openDocument(file, signal)).toEqual({
    html: "<p>Text</p>",
    css: "",
  })
  expect(readWebArchive).toHaveBeenCalledWith(file, signal)
  expect(prepare).toHaveBeenCalledWith(archive)
  const controller = new AbortController()
  const pending = openDocument(file, controller.signal)
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(prepare).toHaveBeenCalledOnce()
})
