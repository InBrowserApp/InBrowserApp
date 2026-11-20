import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { loadImageSource } from "@workspace/raster-image/browser-canvas"

import ImageSizeCompressor from "./client"
import { compressImage, readyImagesZip } from "./compress"
import messages from "./messages/en.json"

vi.mock("./compress", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./compress")>()),
  compressImage: vi.fn(),
  readyImagesZip: vi.fn(),
}))

vi.mock("@workspace/raster-image/browser-canvas", () => ({
  loadImageSource: vi.fn(),
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

beforeEach(() => {
  vi.mocked(loadImageSource).mockRejectedValue(new Error("INVALID_IMAGE"))
})

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
  expect(compressImage).toHaveBeenCalledWith(photos[0], "jpg", 200_000, {
    mode: "original",
  })
  expect(screen.getByText(messages.overLimit)).toBeTruthy()
  expect(screen.getByText(messages.alreadyFits)).toBeTruthy()
  expect(screen.getByText(messages.readError)).toBeTruthy()
  expect(
    screen.getByRole("button", { name: messages.shrinkAndRetry })
  ).toBeTruthy()
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
  fireEvent.click(screen.getByRole("radio", { name: messages.allowResize }))
  fireEvent.change(screen.getByRole("textbox", { name: messages.sizeLimit }), {
    target: { value: "10,001" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.compress }))
  await screen.findByText(messages.unsupportedFormat)
  expect(compressImage).toHaveBeenCalledWith(photos[1], "webp", 10_001, {
    mode: "shrink",
  })
  fireEvent.change(input, { target: { files: [photos[0]] } })
  fireEvent.click(screen.getByRole("button", { name: messages.clearAll }))
  expect(screen.queryByText("second.jpg")).toBeNull()
})

it("requires both exact dimensions and can retry without a file size limit", async () => {
  const output = { ...mockResult(200_001), width: 600, height: 600 }
  vi.mocked(compressImage).mockResolvedValue(output)
  render(<ImageSizeCompressor lang="en" messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.addImages), {
    target: { files: [photos[0]] },
  })
  const submit = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.compress,
  })
  const sizeLimit = screen.getByRole("textbox", { name: messages.sizeLimit })
  fireEvent.change(sizeLimit, { target: { value: "200.0005" } })
  expect(submit.disabled).toBe(true)
  fireEvent.change(sizeLimit, { target: { value: "200" } })
  fireEvent.click(screen.getByRole("radio", { name: messages.exactDimensions }))
  expect(submit.disabled).toBe(true)
  const width = screen.getByRole("textbox", { name: messages.width })
  const height = screen.getByRole("textbox", { name: messages.height })
  fireEvent.change(width, { target: { value: "６００" } })
  expect(submit.disabled).toBe(true)
  fireEvent.change(height, { target: { value: "600.1" } })
  expect(height.getAttribute("aria-invalid")).toBe("true")
  fireEvent.change(height, { target: { value: "٦٠٠" } })
  const fit = screen.getByRole<HTMLSelectElement>("combobox", {
    name: messages.fit,
  })
  expect(fit.value).toBe("contain")
  fireEvent.click(submit)

  await screen.findByText(messages.tryExactLimit)
  expect(screen.getByText(/600 × 600 px/)).toBeTruthy()
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  expect(compressImage).toHaveBeenLastCalledWith(photos[0], "jpg", 200_000, {
    mode: "exact",
    width: 600,
    height: 600,
    fit: "contain",
  })

  fireEvent.change(fit, { target: { value: "cover" } })
  fireEvent.change(sizeLimit, { target: { value: "" } })
  fireEvent.click(submit)
  await screen.findByText("1 of 1 ready")
  expect(screen.queryByText(messages.withinLimit)).toBeNull()
  expect(
    await screen.findByRole("link", { name: messages.download })
  ).toBeTruthy()
  expect(compressImage).toHaveBeenLastCalledWith(photos[0], "jpg", Infinity, {
    mode: "exact",
    width: 600,
    height: 600,
    fit: "cover",
  })
})

it("links either dimension to a manually entered ratio and edits independently when unlocked", () => {
  render(<ImageSizeCompressor lang="en" messages={messages} />)
  fireEvent.click(screen.getByRole("radio", { name: messages.exactDimensions }))
  const width = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.width,
  })
  const height = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.height,
  })
  const lock = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.lockAspectRatio,
  })
  expect(lock.disabled).toBe(true)

  fireEvent.change(width, { target: { value: "400" } })
  fireEvent.change(height, { target: { value: "300" } })
  fireEvent.click(lock)
  expect(lock.getAttribute("aria-pressed")).toBe("true")
  fireEvent.change(width, { target: { value: "500" } })
  expect(height.value).toBe("375")
  fireEvent.change(height, { target: { value: "200" } })
  expect(width.value).toBe("267")
  fireEvent.change(width, { target: { value: "" } })
  expect(height.value).toBe("200")
  fireEvent.change(width, { target: { value: "400" } })
  expect(height.value).toBe("300")

  fireEvent.click(screen.getByRole("radio", { name: messages.keepDimensions }))
  fireEvent.click(screen.getByRole("radio", { name: messages.exactDimensions }))
  const returnedLock = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.lockAspectRatio,
  })
  expect(returnedLock.getAttribute("aria-pressed")).toBe("true")
  const returnedWidth = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.width,
  })
  const returnedHeight = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.height,
  })

  fireEvent.click(returnedLock)
  expect(returnedLock.getAttribute("aria-pressed")).toBe("false")
  fireEvent.change(returnedWidth, { target: { value: "600" } })
  expect(returnedHeight.value).toBe("300")
})

it.each([
  ["", "", "1200", "800"],
  ["600", "", "600", "400"],
  ["", "500", "750", "500"],
])(
  "can lock the first image ratio with width %s and height %s",
  async (widthInput, heightInput, expectedWidth, expectedHeight) => {
    const release = vi.fn()
    vi.mocked(loadImageSource).mockResolvedValue({
      height: 800,
      width: 1200,
      image: document.createElement("img"),
      cleanup: release,
    })
    vi.mocked(compressImage).mockResolvedValue(mockResult(1000))
    render(<ImageSizeCompressor lang="en" messages={messages} />)
    fireEvent.change(screen.getByLabelText(messages.addImages), {
      target: { files: [photos[0], photos[1]] },
    })
    fireEvent.click(
      screen.getByRole("radio", { name: messages.exactDimensions })
    )
    const width = screen.getByRole<HTMLInputElement>("textbox", {
      name: messages.width,
    })
    const height = screen.getByRole<HTMLInputElement>("textbox", {
      name: messages.height,
    })
    fireEvent.change(width, { target: { value: widthInput } })
    fireEvent.change(height, { target: { value: heightInput } })
    const lock = screen.getByRole<HTMLButtonElement>("button", {
      name: messages.lockAspectRatio,
    })
    await waitFor(() => expect(lock.disabled).toBe(false))
    expect(loadImageSource).toHaveBeenCalledExactlyOnceWith(photos[0])
    expect(release).toHaveBeenCalledOnce()
    fireEvent.change(width, { target: { value: "600 pixels" } })
    expect(lock.disabled).toBe(true)
    fireEvent.change(width, { target: { value: widthInput } })
    fireEvent.click(lock)
    expect([width.value, height.value]).toEqual([expectedWidth, expectedHeight])
    fireEvent.click(screen.getByRole("button", { name: messages.compress }))
    await screen.findByText("2 of 2 within 200 KB")
    for (const file of photos.slice(0, 2)) {
      expect(compressImage).toHaveBeenCalledWith(file, "jpg", 200_000, {
        mode: "exact",
        width: Number(expectedWidth),
        height: Number(expectedHeight),
        fit: "contain",
      })
    }
  }
)

it("accepts pasted upload constraints and previews the output", async () => {
  vi.mocked(compressImage).mockResolvedValue({
    ...mockResult(199_999),
    width: 600,
    height: 400,
  })
  render(<ImageSizeCompressor lang="en" messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.addImages), {
    target: { files: [photos[0]] },
  })
  fireEvent.change(screen.getByRole("textbox", { name: messages.sizeLimit }), {
    target: { value: "≤ 200 KB" },
  })
  fireEvent.click(screen.getByRole("radio", { name: messages.exactDimensions }))
  const width = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.width,
  })
  const height = screen.getByRole<HTMLInputElement>("textbox", {
    name: messages.height,
  })
  fireEvent.change(width, { target: { value: "six hundred" } })
  expect(screen.getByText(messages.invalidDimensions)).toBeTruthy()
  fireEvent.paste(width, { clipboardData: { getData: () => "600 × 400 px" } })
  expect([width.value, height.value]).toEqual(["600", "400"])

  fireEvent.click(screen.getByRole("button", { name: messages.compress }))
  expect(
    await screen.findByRole("link", { name: messages.viewResults })
  ).toBeTruthy()
  expect(screen.getByRole("status").textContent).toBe("1 of 1 ready")
  expect(compressImage).toHaveBeenCalledWith(photos[0], "jpg", 200_000, {
    mode: "exact",
    width: 600,
    height: 400,
    fit: "contain",
  })
  fireEvent.click(
    await screen.findByRole("button", { name: "Preview first.jpg" })
  )
  expect(await screen.findByRole("dialog", { name: "first.jpg" })).toBeTruthy()
  expect(
    screen.getByRole("img", { name: "Preview first.jpg" }).getAttribute("src")
  ).toMatch(/^blob:/)
  fireEvent.click(screen.getByRole("button", { name: messages.closePreview }))
  expect(screen.queryByRole("dialog")).toBeNull()
})

it("retries with smaller dimensions while retaining ready images", async () => {
  vi.mocked(compressImage)
    .mockResolvedValueOnce(mockResult(150_000))
    .mockResolvedValueOnce(mockResult(238_000))
    .mockResolvedValueOnce({ ...mockResult(199_000), width: 90, height: 60 })
  render(<ImageSizeCompressor lang="en" messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.addImages), {
    target: { files: photos.slice(0, 2) },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.compress }))
  await screen.findByText("Limit 200 KB · Output 238 KB")
  const accepted = await screen.findByRole("link", { name: messages.download })
  const acceptedHref = accepted.getAttribute("href")
  fireEvent.click(screen.getByRole("button", { name: messages.shrinkAndRetry }))
  await screen.findByText("2 of 2 within 200 KB")
  expect(compressImage).toHaveBeenCalledTimes(3)
  expect(compressImage).toHaveBeenLastCalledWith(photos[1], "jpg", 200_000, {
    mode: "shrink",
  })
  expect(
    (
      await screen.findAllByRole("link", { name: messages.download })
    )[0]?.getAttribute("href")
  ).toBe(acceptedHref)
  expect(
    screen.getByRole<HTMLInputElement>("radio", { name: messages.allowResize })
      .checked
  ).toBe(true)
})
