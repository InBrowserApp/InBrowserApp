import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import MusicXmlToImage from "./client"
import messages from "./messages/en.json"

const { renderScore, exportScore, download } = vi.hoisted(() => ({
  renderScore: vi.fn(),
  exportScore: vi.fn(),
  download: vi.fn(),
}))
vi.mock("@workspace/score-export/musicxml", () => ({
  renderMusicXmlScore: renderScore,
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
function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}
function change(name: string, value: string) {
  fireEvent.change(screen.getByLabelText(name), { target: { value } })
}

let fullPages: SVGSVGElement[]
beforeEach(() => {
  vi.resetAllMocks()
  fullPages = [page(), page()]
  renderScore.mockResolvedValue({ measureCount: 12, pages: fullPages })
  exportScore.mockResolvedValue({ blob: new Blob(), filename: "score.png" })
})
afterEach(cleanup)

async function loadExample() {
  render(<MusicXmlToImage messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Page 1 of 2")
}

test("downloads all pages as ZIP and exports the current page as a single image", async () => {
  await loadExample()
  press(messages.downloadZip)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(exportScore).toHaveBeenCalledWith(
    fullPages,
    "png",
    "Morning Steps",
    "en"
  )
  press(messages.next)
  expect(screen.getByText("Page 2 of 2")).toBeTruthy()
  change(messages.area, "single")
  change(messages.format, "svg")
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledTimes(2))
  expect(exportScore).toHaveBeenLastCalledWith(
    [fullPages[1]],
    "svg",
    "Morning Steps-page-2",
    "en"
  )
})

test("validates measure bounds, previews the exact range, and discards it after edits", async () => {
  await loadExample()
  change(messages.area, "excerpt")
  expect(screen.getByText(messages.chooseRange)).toBeTruthy()
  change(messages.firstMeasure, "3")
  change(messages.lastMeasure, "2")
  press(messages.previewRange)
  expect(screen.getByRole("alert").textContent).toBe(
    messages.invalidRange.replace("{total}", "12")
  )
  expect(renderScore).toHaveBeenCalledOnce()
  change(messages.lastMeasure, "7")
  const cropped = [page()]
  renderScore.mockResolvedValueOnce({ measureCount: 12, pages: cropped })
  press(messages.previewRange)
  await screen.findByText("Page 1 of 1")
  expect(renderScore.mock.calls[1]?.[1]).toEqual({ measures: [3, 7] })
  press(messages.download)
  await waitFor(() =>
    expect(exportScore).toHaveBeenCalledWith(
      cropped,
      "png",
      "Morning Steps-measures-3-7",
      "en"
    )
  )
  change(messages.lastMeasure, "8")
  expect(screen.queryByText("Page 1 of 1")).toBeNull()
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.download })
      .disabled
  ).toBe(true)
})

test("ignores superseded renders and keeps the full score after an excerpt error", async () => {
  await loadExample()
  change(messages.area, "excerpt")
  let finish!: (layout: {
    measureCount: number
    pages: SVGSVGElement[]
  }) => void
  renderScore.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
  press(messages.previewRange)
  await waitFor(() => expect(renderScore).toHaveBeenCalledTimes(2))
  expect(screen.getByRole("status").textContent).toBe(messages.loading)
  change(messages.lastMeasure, "3")
  renderScore.mockRejectedValueOnce(new Error("range invalid"))
  press(messages.previewRange)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.rangeFailed
  )
  await act(async () => finish({ measureCount: 12, pages: [page()] }))
  change(messages.area, "whole")
  expect(screen.getByText("Page 1 of 2")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()
})

test("can replace an invalid score and retry a failed image download", async () => {
  renderScore.mockRejectedValueOnce(new Error("score invalid"))
  exportScore.mockRejectedValueOnce(new Error("export unavailable"))
  render(<MusicXmlToImage messages={messages} language="en" />)
  function open(name: string) {
    fireEvent.change(document.querySelector("input[type=file]")!, {
      target: { files: [new File([], name)] },
    })
  }
  open("bad.xml")
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.invalidScore
  )
  open("good.mxl")
  await screen.findByText("Page 1 of 2")
  press(messages.downloadZip)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.downloadError
  )
  press(messages.downloadZip)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
})

test("accepts Arabic-Indic and full-width digits in the measure controls", async () => {
  render(<MusicXmlToImage messages={messages} language="ar" />)
  press(messages.example)
  await waitFor(() => expect(screen.getByText(messages.preview)).toBeTruthy())
  change(messages.area, "excerpt")
  change(messages.firstMeasure, "٢")
  change(messages.lastMeasure, "３")
  press(messages.previewRange)
  await waitFor(() =>
    expect(renderScore.mock.calls[1]?.[1]).toEqual({ measures: [2, 3] })
  )
})
