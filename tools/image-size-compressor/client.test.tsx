import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import ImageSizeCompressor from "./client"
import { compressImage, readyImagesZip } from "./compress"
import messages from "./messages/en.json"

vi.mock("./compress", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./compress")>()),
  compressImage: vi.fn(),
  readyImagesZip: vi.fn(),
}))

const photos = ["first.png", "second.jpg", "too-large.png", "broken.png"].map(
  (name) => new File(["test"], name)
)

function mockResult(bytes: number, originalKept = false) {
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "image/jpeg" }),
    width: 120,
    height: 80,
    original: { width: 120, height: 80 },
    originalKept,
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

it("enforces an exact per-file limit and exports only the ready files", async () => {
  vi.mocked(compressImage)
    .mockResolvedValueOnce(mockResult(200_000))
    .mockResolvedValueOnce(mockResult(4, true))
    .mockResolvedValueOnce(mockResult(200_001))
    .mockRejectedValueOnce(new Error("INVALID_IMAGE"))
  vi.mocked(readyImagesZip).mockResolvedValue(new Blob())
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
  render(<ImageSizeCompressor lang="en" messages={messages} />)

  const submit = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.compress,
  })
  expect(submit.disabled).toBe(true)
  const add = screen.getByRole("button", {
    name: new RegExp(messages.addImages),
  })
  fireEvent.dragOver(add)
  fireEvent.dragLeave(add)
  fireEvent.drop(add, { dataTransfer: { files: photos } })
  fireEvent.click(submit)

  await screen.findByText("2 of 4 within 200 KB")
  expect(compressImage).toHaveBeenCalledWith(photos[0], "jpg", 200_000, false)
  expect(screen.getByText(messages.overLimit)).toBeTruthy()
  expect(screen.getByText(messages.alreadyFits)).toBeTruthy()
  expect(screen.getByText(messages.readError)).toBeTruthy()
  expect(screen.getByText(messages.tryResize)).toBeTruthy()
  expect(
    await screen.findAllByRole("link", { name: messages.download })
  ).toHaveLength(2)
  fireEvent.click(screen.getByRole("button", { name: messages.downloadZip }))
  expect(
    vi.mocked(readyImagesZip).mock.calls[0]?.[0].map(({ name }) => name)
  ).toEqual(["first.jpg", "second.jpg"])

  fireEvent.click(screen.getByRole("radio", { name: "WebP" }))
  expect(screen.queryByText(messages.results)).toBeNull()
})

it("retries with new settings, reports unsupported WebP, and updates its queue", async () => {
  vi.mocked(compressImage).mockRejectedValue(new Error("UNSUPPORTED_FORMAT"))
  render(<ImageSizeCompressor lang="en" messages={messages} />)
  const input = screen.getByLabelText(messages.addImages)
  fireEvent.change(input, { target: { files: [photos[0], photos[1]] } })
  fireEvent.click(screen.getByRole("button", { name: "Remove first.png" }))
  expect(screen.queryByText("first.png")).toBeNull()
  fireEvent.click(screen.getByRole("radio", { name: "WebP" }))
  fireEvent.click(
    screen.getByRole("checkbox", { name: new RegExp(messages.allowResize) })
  )
  fireEvent.change(screen.getByRole("textbox", { name: messages.sizeLimit }), {
    target: { value: "10,001" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.compress }))
  await screen.findByText(messages.unsupportedFormat)
  expect(compressImage).toHaveBeenCalledWith(photos[1], "webp", 10_001, true)
  fireEvent.change(input, { target: { files: [photos[0]] } })
  fireEvent.click(screen.getByRole("button", { name: messages.clearAll }))
  expect(screen.queryByText("second.jpg")).toBeNull()
})
