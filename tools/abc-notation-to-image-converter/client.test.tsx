import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import AbcNotationToImage from "./client"
import messages from "./messages/en.json"
import type { AbcTune } from "@workspace/score-export/abc"

const { renderImages, exportImages, download } = vi.hoisted(() => ({
  renderImages: vi.fn(),
  exportImages: vi.fn(),
  download: vi.fn(),
}))
vi.mock("@workspace/score-export/abc", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@workspace/score-export/abc")>()),
  renderAbcImages: renderImages,
}))
vi.mock("@workspace/score-export", () => ({ exportScoreImages: exportImages }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: download }))

function image(tune: AbcTune) {
  const page = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  page.setAttribute("width", "704")
  page.setAttribute("height", "112")
  return { page, name: tune.title }
}
function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

beforeEach(() => {
  vi.resetAllMocks()
  renderImages.mockImplementation(async (tunes: AbcTune[]) => tunes.map(image))
  exportImages.mockResolvedValue({ blob: new Blob(), filename: "tunes.zip" })
})
afterEach(cleanup)

test("previews the tune book and downloads the selected format in source order", async () => {
  render(<AbcNotationToImage messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Image 1 of 2")
  press(messages.next)
  expect(screen.getByText("Image 2 of 2")).toBeTruthy()
  fireEvent.change(screen.getByLabelText(messages.format), {
    target: { value: "svg" },
  })
  expect(screen.getByText("Image 2 of 2")).toBeTruthy()
  expect(renderImages).toHaveBeenCalledOnce()
  press(messages.downloadZip)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(exportImages).toHaveBeenCalledWith(
    [
      { name: "Morning Path", page: expect.any(SVGElement) },
      { name: "Evening Waltz", page: expect.any(SVGElement) },
    ],
    "svg",
    "abc-score"
  )
})

test("downloads a single selected tune as PNG and reports export failures inline", async () => {
  render(<AbcNotationToImage messages={messages} language="en" />)
  press(messages.example)
  await screen.findByText("Image 1 of 2")
  press(messages.clearSelection)
  expect(screen.getByRole("status").textContent).toBe(messages.noSelection)
  fireEvent.click(screen.getByRole("checkbox", { name: "Evening Waltz" }))
  await screen.findByText("Image 1 of 1")
  exportImages.mockRejectedValueOnce(new Error("PNG could not be encoded"))
  press(messages.download)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.downloadError
  )
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(exportImages).toHaveBeenLastCalledWith(
    [{ name: "Evening Waltz", page: expect.any(SVGElement) }],
    "png",
    "abc-score"
  )
})

test("normalizes old text file line endings and uses the source filename as the archive name", async () => {
  render(<AbcNotationToImage messages={messages} language="en" />)
  const source = "X:1\rT:First\rK:D\rD4|\r\rX:2\rT:Second\rK:C\rC4|"
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [new File([source], "Rehearsal.txt")] },
  })
  await screen.findByText("Image 1 of 2")
  expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe(
    source.replaceAll("\r", "\n")
  )
  press(messages.downloadZip)
  await waitFor(() =>
    expect(exportImages).toHaveBeenCalledWith(
      expect.any(Array),
      "png",
      "Rehearsal"
    )
  )
})
