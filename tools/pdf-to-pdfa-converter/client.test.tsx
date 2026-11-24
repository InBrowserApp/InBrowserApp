import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import PdfToPdfa from "./client"
import { convertPdf } from "./convert"
import messages from "./messages/en.json"

vi.mock("./convert", () => ({ convertPdf: vi.fn() }))
const convert = vi.mocked(convertPdf)
const source = new File(["pdf"], "Records.PDF", { type: "application/pdf" })

function load() {
  const { container } = render(<PdfToPdfa messages={messages} />)
  return container.querySelector("input[type=file]")!
}

function startButton() {
  return screen.getByRole<HTMLButtonElement>("button", {
    name: messages.convert,
  })
}

afterEach(() => {
  cleanup()
  convert.mockReset()
  vi.restoreAllMocks()
})

describe("PDF/A converter controls", () => {
  it("downloads the checked file and clears it on a profile change", async () => {
    const blob = new Blob(["archive"], { type: "application/pdf" })
    convert.mockResolvedValue({ status: "ready", blob })
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:archive")
    const revoke = vi.spyOn(URL, "revokeObjectURL")
    const fileInput = load()
    expect(startButton().disabled).toBe(true)
    expect(
      screen.getByRole<HTMLInputElement>("radio", { name: "PDF/A-2b" }).checked
    ).toBe(true)
    fireEvent.change(fileInput, { target: { files: [source] } })
    expect(screen.getByText("Records.PDF")).toBeTruthy()

    fireEvent.click(startButton())
    const link = await screen.findByRole("link", { name: messages.download })
    expect(link.getAttribute("download")).toBe("Records-pdfa-2b.pdf")
    expect(link.getAttribute("href")).toBe("blob:archive")
    expect(convert).toHaveBeenCalledWith(
      source,
      expect.objectContaining({ profile: 2 })
    )

    fireEvent.click(screen.getByRole("radio", { name: "PDF/A-1b" }))
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(revoke).toHaveBeenCalledWith("blob:archive")
    expect(screen.getByText(messages.part1)).toBeTruthy()
  })

  it("retains the selected file if archive checks fail", async () => {
    convert.mockResolvedValue({ status: "checkFailed" })
    const fileInput = load()
    fireEvent.change(fileInput, { target: { files: [source] } })
    fireEvent.click(startButton())
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.checkFailed
    )
    expect(screen.getByText("Records.PDF")).toBeTruthy()
    expect(startButton().disabled).toBe(false)
  })

  it("accepts one file by drag and drop and can cancel a conversion", async () => {
    convert.mockImplementation(async (_file, { signal, onProgress }) => {
      onProgress("converting")
      return new Promise((_, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), {
          once: true,
        })
      })
    })
    load()
    const drop = screen.getByRole("button", { name: /Choose a PDF/ })
    fireEvent.drop(drop, { dataTransfer: { files: [source, source] } })
    expect(screen.getByRole("alert").textContent).toBe(messages.oneFile)
    fireEvent.drop(drop, { dataTransfer: { files: [source] } })
    fireEvent.click(startButton())
    await screen.findByText(messages.converting)
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
    await waitFor(() =>
      expect(convert.mock.lastCall?.[1].signal.aborted).toBe(true)
    )
    expect(screen.queryByRole("alert")).toBeNull()
    expect(document.activeElement).toBe(startButton())
  })
})
