import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { unzipSync } from "fflate"
import { afterEach, expect, it, vi } from "vitest"
import PdfImageExtractor from "./client"
import messages from "./messages/en.json"
import { extractPdfImages } from "./pdf-images"
import { makeZip } from "./zip"
import type { Extraction } from "./pdf-images"

vi.mock("./pdf-images", () => ({ extractPdfImages: vi.fn() }))
vi.mock("./zip", { spy: true })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

const image = {
  blob: new Blob(["photo"], { type: "image/jpeg" }),
  width: 80,
  height: 54,
  page: 1,
  name: "page-1-image-1.jpg",
}
const result = { images: [image], skipped: false }
const choose = (name: string, type = "application/pdf") =>
  new File(["data"], name, { type })

function start() {
  const view = render(<PdfImageExtractor lang="en" messages={messages} />)
  const input = view.container.querySelector("input")!
  return {
    ...view,
    select: (file?: File) =>
      fireEvent.change(input, { target: { files: file ? [file] : [] } }),
    dropZone: screen.getByRole("button", { name: messages.choosePdf })
      .parentElement!,
  }
}

it("opens the picker, extracts a dropped PDF, and downloads the original bytes or a ZIP", async () => {
  vi.mocked(extractPdfImages).mockImplementation(async (_, __, progress) => {
    progress(1, 1)
    return result
  })
  const createUrl = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:photos")
  const revokeUrl = vi
    .spyOn(URL, "revokeObjectURL")
    .mockImplementation(() => {})
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  const { dropZone, container, unmount } = start()
  const inputClick = vi.spyOn(container.querySelector("input")!, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.choosePdf }))
  expect(inputClick).toHaveBeenCalledOnce()
  fireEvent.dragOver(dropZone)
  expect(dropZone.className).toContain("border-primary")
  fireEvent.dragLeave(dropZone, { relatedTarget: null })
  expect(dropZone.className).not.toContain("border-primary")
  fireEvent.drop(dropZone, {
    dataTransfer: { files: [choose("report.PDF", "")] },
  })

  const download = await screen.findByRole("link", {
    name: "Download page-1-image-1.jpg",
  })
  expect(download.getAttribute("download")).toBe(image.name)
  expect(download.getAttribute("href")).toBe("blob:photos")
  expect(screen.getByText("80 × 54 px")).toBeTruthy()
  expect(screen.getByRole("status").textContent).toBe("Extracted images (1)")

  fireEvent.drop(dropZone, {
    dataTransfer: { files: [choose("notes.txt", "text/plain")] },
  })
  expect(await screen.findByText(messages.invalidFile)).toBeTruthy()
  expect(
    screen.getByRole("link", { name: "Download page-1-image-1.jpg" })
  ).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.downloadZip }))
  await waitFor(() => expect(click).toHaveBeenCalledOnce())
  expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe(
    "report-images.zip"
  )
  const payload = createUrl.mock.lastCall?.[0] as Blob
  expect(
    new TextDecoder().decode(
      unzipSync(new Uint8Array(await payload.arrayBuffer()))[image.name]
    )
  ).toBe("photo")
  unmount()
  expect(revokeUrl).toHaveBeenCalledWith("blob:photos")
})

it("abandons outdated scans and distinguishes empty, partial, locked and broken documents", async () => {
  const worker = vi.mocked(extractPdfImages)
  let oldWork!: (value: Extraction) => void
  worker.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        oldWork = resolve
      })
  )
  const { select } = start()
  select()
  expect(worker).not.toHaveBeenCalled()
  select(choose("first.pdf"))
  expect(screen.getByText(messages.opening)).toBeTruthy()
  await waitFor(() => expect(worker).toHaveBeenCalledOnce())
  worker.mockResolvedValueOnce({ images: [], skipped: false })
  select(choose("text-only.pdf"))
  expect(
    await screen.findByRole("heading", { name: messages.emptyTitle })
  ).toBeTruthy()
  expect(worker.mock.calls[0]?.[1].aborted).toBe(true)
  await act(async () => oldWork(result))
  expect(screen.queryByRole("heading", { name: messages.results })).toBeNull()

  worker.mockResolvedValueOnce({ images: [], skipped: true })
  select(choose("partial.pdf"))
  expect(await screen.findByText(messages.skippedImages)).toBeTruthy()
  expect(
    screen.queryByRole("heading", { name: messages.emptyTitle })
  ).toBeNull()

  worker.mockRejectedValueOnce(
    Object.assign(new Error(), { name: "PasswordException" })
  )
  select(choose("locked.pdf"))
  expect(await screen.findByText(messages.lockedPdf)).toBeTruthy()
  worker.mockRejectedValueOnce(new Error())
  select(choose("broken.pdf"))
  expect(await screen.findByText(messages.readError)).toBeTruthy()
  expect(screen.getByRole("button", { name: messages.changePdf })).toBeTruthy()
})

it("allows ZIP retries and suppresses a download if its PDF has been replaced", async () => {
  vi.mocked(extractPdfImages).mockResolvedValue(result)
  const zip = vi.mocked(makeZip)
  zip.mockRejectedValueOnce(new Error("bad archive"))
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  const { select } = start()
  select(choose("first.pdf"))
  fireEvent.click(
    await screen.findByRole("button", { name: messages.downloadZip })
  )
  expect(await screen.findByText(messages.zipError)).toBeTruthy()

  let complete!: (blob: Blob) => void
  zip.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        complete = resolve
      })
  )
  fireEvent.click(screen.getByRole("button", { name: messages.downloadZip }))
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: messages.preparingZip,
    }).disabled
  ).toBe(true)
  await waitFor(() => expect(zip).toHaveBeenCalledTimes(2))
  select(choose("second.pdf"))
  await screen.findByRole("button", { name: messages.downloadZip })
  await act(async () => complete(new Blob()))
  expect(click).not.toHaveBeenCalled()
})
