import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mocked = vi.hoisted(() => ({
  loadPresentation: vi.fn(),
  renderSlideImage: vi.fn(),
  failure: vi.fn(),
  downloadBlob: vi.fn(),
}))
vi.mock("@tool/pptx-to-pdf-converter/presentation", () => mocked)
vi.mock("@workspace/ui/lib/download-blob", () => ({
  downloadBlob: mocked.downloadBlob,
}))

const source = {
  slideCount: 3,
  slideWidth: 9144000,
  slideHeight: 5143500,
  waitUntilLayoutComplete: vi.fn(),
  destroy: vi.fn(),
}

function upload(name = "Sales.PPTX") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File(["data"], name)] },
  })
}

beforeEach(() => {
  vi.resetAllMocks()
  mocked.loadPresentation.mockResolvedValue(source)
  mocked.renderSlideImage.mockImplementation(
    async (_source, index, _width, _height, _signal, mime) =>
      new Blob([String(index)], { type: mime })
  )
  mocked.failure.mockReturnValue({ code: "protected" })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:slide")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it("navigates to a slide and downloads it as a double-sized WebP", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect((screen.getByLabelText(m.page) as HTMLSelectElement).value).toBe("2")
  fireEvent.change(screen.getByLabelText(m.format), {
    target: { value: "webp" },
  })
  fireEvent.change(screen.getByLabelText(m.scale), { target: { value: "2" } })
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  await waitFor(() =>
    expect(mocked.downloadBlob).toHaveBeenCalledWith(
      expect.objectContaining({ type: "image/webp" }),
      "Sales-slide-2.webp"
    )
  )
  expect(mocked.renderSlideImage).toHaveBeenLastCalledWith(
    source,
    1,
    1920,
    1080,
    expect.any(AbortSignal),
    "image/webp"
  )
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(source.destroy).toHaveBeenCalledTimes(1)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:slide")
})

it("validates a range, downloads multiple slides, and recovers after a render failure", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("img", { name: m.preview })
  fireEvent.change(screen.getByLabelText(m.scope), {
    target: { value: "range" },
  })
  fireEvent.change(screen.getByLabelText(m.first), { target: { value: "4" } })
  await screen.findByText(m.rangeError.replace("{total}", "3"))
  fireEvent.change(screen.getByLabelText(m.first), { target: { value: "2" } })
  fireEvent.change(screen.getByLabelText(m.last), { target: { value: "3" } })
  mocked.renderSlideImage.mockRejectedValueOnce(new Error("render"))
  fireEvent.click(screen.getByRole("button", { name: m.downloadZip }))
  await screen.findByText(m.downloadError)
  fireEvent.click(screen.getByRole("button", { name: m.downloadZip }))
  await waitFor(() =>
    expect(mocked.downloadBlob).toHaveBeenCalledWith(
      expect.objectContaining({ type: "application/zip" }),
      "Sales-slides-2-3-png.zip"
    )
  )
})

it("recovers from an unsupported file and an engine error", async () => {
  render(<Client messages={m} />)
  upload("Wrong.ppt")
  await screen.findByText(m.invalid)
  mocked.loadPresentation.mockRejectedValueOnce(new Error("protected"))
  upload()
  await screen.findByText(m.protected)
  upload()
  await screen.findByRole("img", { name: m.preview })
})
