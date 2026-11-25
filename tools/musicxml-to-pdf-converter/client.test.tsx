import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import MusicXmlToPdf from "./client"
import messages from "./messages/en.json"

const { renderPages, exportScore, download } = vi.hoisted(() => ({
  renderPages: vi.fn(),
  exportScore: vi.fn(),
  download: vi.fn(),
}))
vi.mock("@workspace/score-export/musicxml", () => ({
  renderMusicXmlPages: renderPages,
  musicXmlBasename: (name: string) => name.replace(/\.[^.]+$/, ""),
}))
vi.mock("@workspace/score-export", () => ({ exportScore }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: download }))

function page() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", "794")
  svg.setAttribute("height", "1123")
  return svg
}

function upload(file: File) {
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
}

function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name, exact: true }))
}

beforeEach(() => {
  vi.resetAllMocks()
  renderPages.mockResolvedValue([page(), page()])
  exportScore.mockResolvedValue({ blob: new Blob(), filename: "score.pdf" })
})
afterEach(cleanup)

test("opens the sample, browses pages, and downloads the current A4 score", async () => {
  render(<MusicXmlToPdf messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Page 1 of 2")
  expect(renderPages.mock.calls[0]?.[0].name).toBe("Morning Steps.musicxml")
  expect(renderPages.mock.calls[0]?.[1]).toBe("a4")
  press(messages.next)
  expect(screen.getByText("Page 2 of 2")).toBeTruthy()
  press(messages.previous)
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(exportScore).toHaveBeenCalledWith(
    expect.arrayContaining([expect.any(SVGElement)]),
    "pdf",
    "Morning Steps",
    "en"
  )
})

test("lays out Letter before enabling download and ignores an obsolete render", async () => {
  let finish!: (pages: SVGSVGElement[]) => void
  renderPages.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
  render(<MusicXmlToPdf messages={messages} language="en" />)
  const file = new File([], "new.mxl")
  upload(file)
  await waitFor(() => expect(renderPages).toHaveBeenCalledOnce())
  expect(screen.getByText(messages.loading)).toBeTruthy()
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.download })
      .disabled
  ).toBe(true)
  const letter = [page()]
  renderPages.mockResolvedValueOnce(letter)
  fireEvent.change(screen.getByLabelText(messages.paper), {
    target: { value: "letter" },
  })
  await screen.findByText("Page 1 of 1")
  await act(async () => finish([page(), page()]))
  expect(screen.queryByText("Page 1 of 2")).toBeNull()
  press(messages.download)
  await waitFor(() =>
    expect(exportScore).toHaveBeenCalledWith(letter, "pdf", "new", "en")
  )
  expect(renderPages).toHaveBeenLastCalledWith(file, "letter")
})

test("preserves the selected file on a failed layout or download and allows a retry", async () => {
  renderPages.mockRejectedValueOnce(new Error("invalid"))
  exportScore.mockRejectedValueOnce(new Error("export unavailable"))
  render(<MusicXmlToPdf messages={messages} language="en" />)
  upload(new File([], "invalid.xml"))
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.invalidScore
  )
  expect(screen.getByText("invalid.xml")).toBeTruthy()
  upload(new File([], "valid.musicxml"))
  await screen.findByText("Page 1 of 2")
  press(messages.download)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.downloadError
  )
  expect(screen.getByText("valid.musicxml")).toBeTruthy()
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(screen.queryByRole("alert")).toBeNull()
})

test("drops a queued download after changing the selected score", async () => {
  let finish!: (file: { blob: Blob; filename: string }) => void
  exportScore.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
  render(<MusicXmlToPdf messages={messages} language="en" />)
  upload(new File([], "first.musicxml"))
  await screen.findByText("Page 1 of 2")
  press(messages.download)
  await waitFor(() => expect(exportScore).toHaveBeenCalledOnce())
  upload(new File([], "replacement.musicxml"))
  await screen.findByText("Page 1 of 2")
  await act(async () => finish({ blob: new Blob(), filename: "first.pdf" }))
  expect(download).not.toHaveBeenCalled()
  expect(screen.getByText("replacement.musicxml")).toBeTruthy()
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
})
