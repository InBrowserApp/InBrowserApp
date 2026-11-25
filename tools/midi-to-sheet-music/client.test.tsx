import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import MidiToSheetMusic from "./client"
import messages from "./messages/en.json"

const { renderPages, exportScore, downloadBlob } = vi.hoisted(() => ({
  renderPages: vi.fn(),
  exportScore: vi.fn(),
  downloadBlob: vi.fn(),
}))
vi.mock("@workspace/score-export/musicxml", () => ({
  renderMusicXmlPages: renderPages,
}))
vi.mock("@workspace/score-export", () => ({ exportScore }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob }))

function svgPage() {
  const page = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  page.setAttribute("width", "794")
  page.setAttribute("height", "1123")
  return page
}
function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

beforeEach(() => {
  vi.resetAllMocks()
  renderPages.mockResolvedValue([svgPage()])
  exportScore.mockResolvedValue({
    blob: new Blob(),
    filename: "Morning Path.pdf",
  })
})
afterEach(cleanup)

test("renders actual transcribed notes and downloads both artifacts", async () => {
  render(<MidiToSheetMusic messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Page 1 of 1")
  const xml = renderPages.mock.calls[0]?.[0] as File
  const document = new DOMParser().parseFromString(await xml.text(), "text/xml")
  expect(document.querySelector("work-title")?.textContent).toBe("Morning Path")
  expect(document.querySelectorAll("note pitch").length).toBeGreaterThan(10)
  press(messages.downloadMusicXml)
  expect(downloadBlob).toHaveBeenCalledWith(xml, "Morning Path.musicxml")
  press(messages.downloadPdf)
  await waitFor(() => expect(downloadBlob).toHaveBeenCalledTimes(2))
  expect(exportScore).toHaveBeenCalledWith(
    [expect.any(SVGElement)],
    "pdf",
    "Morning Path",
    "en"
  )
})

test("ignores an obsolete preview when a new grid is selected", async () => {
  let finish!: (pages: SVGSVGElement[]) => void
  renderPages.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
  render(<MidiToSheetMusic messages={messages} language="en" />)
  press(messages.example)
  await waitFor(() => expect(renderPages).toHaveBeenCalledOnce())
  expect(screen.getByRole("status").textContent).toBe(messages.loading)
  press(messages.downloadMusicXml)
  expect(downloadBlob).toHaveBeenCalledOnce()
  fireEvent.change(screen.getByLabelText(messages.quantization), {
    target: { value: "8" },
  })
  await screen.findByText("Page 1 of 1")
  await act(async () => finish([svgPage(), svgPage()]))
  expect(screen.getByText("Page 1 of 1")).toBeTruthy()
  expect(screen.queryByText("Page 1 of 2")).toBeNull()
  const [first, second] = renderPages.mock.calls.map(([file]) => file as File)
  expect(await first!.text()).not.toBe(await second!.text())
})

test("keeps MusicXML available when the preview cannot be drawn", async () => {
  renderPages.mockRejectedValueOnce(new Error("renderer unavailable"))
  render(<MidiToSheetMusic messages={messages} language="en" />)
  press(messages.example)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.layoutError
  )
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: messages.downloadPdf,
    }).disabled
  ).toBe(true)
  press(messages.downloadMusicXml)
  expect(downloadBlob).toHaveBeenCalledOnce()
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [new File(["bad"], "bad.mid")] },
  })
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toBe(messages.invalidMidi)
  )
  expect(screen.getByText("bad.mid")).toBeTruthy()
})

test("can retry a failed PDF download without reloading the score", async () => {
  exportScore.mockRejectedValueOnce(new Error("export unavailable"))
  render(<MidiToSheetMusic messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Page 1 of 1")
  press(messages.downloadPdf)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.downloadError
  )
  press(messages.downloadPdf)
  await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce())
  expect(renderPages).toHaveBeenCalledOnce()
})
