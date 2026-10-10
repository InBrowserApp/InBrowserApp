import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { DocumentDownload } from "./document-download"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
test("replaces and releases download URLs with their source blobs", () => {
  const create = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValueOnce("blob:first")
    .mockReturnValueOnce("blob:second")
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  const first = new Blob(["first"])
  const second = new Blob(["second"])
  const { rerender, unmount } = render(
    <DocumentDownload file={first} filename="one.pdf" label="Download PDF" />
  )
  expect(screen.getByRole("link").getAttribute("href")).toBe("blob:first")
  rerender(
    <DocumentDownload file={second} filename="two.pdf" label="Download PDF" />
  )
  expect(screen.getByRole("link").getAttribute("href")).toBe("blob:second")
  expect(screen.getByRole("link").getAttribute("download")).toBe("two.pdf")
  expect(create.mock.calls).toEqual([[first], [second]])
  expect(revoke).toHaveBeenCalledWith("blob:first")
  unmount()
  expect(revoke).toHaveBeenCalledWith("blob:second")
})
