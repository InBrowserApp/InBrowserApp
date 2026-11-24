import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import PdfOcr from "./client"
import { convertPdf } from "./convert"
import messages from "./messages/en.json"
import type { Result } from "./convert"

vi.mock("./convert", () => ({ convertPdf: vi.fn() }))

const convert = vi.mocked(convertPdf)
const scan = new File(["scan"], "invoice.PDF", { type: "application/pdf" })

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

function openTool(lang = "en") {
  render(<PdfOcr lang={lang} messages={messages} />)
  const input = screen.getByLabelText(messages.choosePdf)
  const start = screen.getByRole("button", { name: messages.start })
  return {
    input,
    start,
    choose(file = scan) {
      fireEvent.change(input, { target: { files: [file] } })
    },
  }
}

it("recognizes a dropped PDF in the selected language and offers the named result", async () => {
  convert.mockImplementation(async (_, options) => {
    options.onProgress({
      stage: "pageProgress",
      page: 1,
      total: 2,
      fraction: 0.5,
    })
    return { status: "ready", blob: new Blob(["result"]), skippedPages: true }
  })
  const { start } = openTool("zh-CN")
  fireEvent.click(screen.getByLabelText(messages.includeEnglish))
  fireEvent.dragOver(screen.getByRole("button", { name: /Choose a PDF/ }))
  fireEvent.drop(screen.getByRole("button", { name: /Choose a PDF/ }), {
    dataTransfer: { files: [scan] },
  })
  fireEvent.click(start)

  const download = await screen.findByRole("link", { name: messages.download })
  expect(download.getAttribute("download")).toBe("invoice-searchable.pdf")
  expect(screen.getByRole("status").textContent).toBe(messages.ready)
  expect(convert).toHaveBeenCalledWith(
    scan,
    expect.objectContaining({ language: "chi_sim", includeEnglish: true })
  )
})

it("lets a cancelled run be retried and discards its late result", async () => {
  let finishPrevious!: (result: Result) => void
  const previous = new Promise<Result>((resolve) => {
    finishPrevious = resolve
  })
  convert
    .mockReturnValueOnce(previous)
    .mockResolvedValueOnce({ status: "noText" })
  const { choose, start } = openTool()
  choose()
  fireEvent.click(start)
  await waitFor(() => expect(convert).toHaveBeenCalledTimes(1))

  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(convert.mock.calls[0]?.[1].signal.aborted).toBe(true)
  fireEvent.click(start)
  const download = await screen.findByRole("link", {
    name: messages.downloadOriginal,
  })
  expect(download.getAttribute("download")).toBe(scan.name)
  await act(async () => finishPrevious({ status: "alreadySearchable" }))
  expect(screen.getByRole("status").textContent).toBe(messages.noText)
})

it("keeps the selected file for retry after an error", async () => {
  convert
    .mockResolvedValueOnce({ status: "encryptedPdf" })
    .mockRejectedValueOnce(new Error("OCR"))
  const { choose, start } = openTool()
  choose(new File(["wrong"], "invoice.png"))
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidPdf)
  choose()
  fireEvent.click(start)
  await screen.findByText(messages.encryptedPdf)
  fireEvent.click(start)
  await screen.findByText(messages.failed)
  expect(convert).toHaveBeenCalledTimes(2)
  expect(screen.getByText(scan.name)).toBeDefined()
})
