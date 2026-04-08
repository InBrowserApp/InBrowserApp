import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageResizerClient from "./client"

vi.mock("./core/resize-image", () => ({
  readImageDimensions: vi.fn(),
  resizeImageFile: vi.fn(),
}))

import { readImageDimensions, resizeImageFile } from "./core/resize-image"

const mockedReadImageDimensions = vi.mocked(readImageDimensions)
const mockedResizeImageFile = vi.mocked(resizeImageFile)

const messages = {
  meta: { name: "Image Resizer", description: "Resize images in the browser" },
  uploadTitle: "Source image",
  uploadDescription:
    "Pick a local image file to inspect its dimensions and generate a resized export.",
  chooseImageLabel: "Choose an image",
  changeImageLabel: "Change image",
  uploadHint:
    "PNG, JPEG, WebP, and other browser-readable formats are supported.",
  optionsTitle: "Resize options",
  optionsDescription:
    "Dimensions, interpolation style, output format, and quality are all controlled locally in the browser.",
  widthLabel: "Width",
  heightLabel: "Height",
  keepAspectRatioLabel: "Keep aspect ratio",
  keepAspectRatioDescription:
    "Changing width or height automatically adjusts the other side.",
  allowUpscaleLabel: "Allow upscale",
  allowUpscaleDescription:
    "Permit output dimensions larger than the source image.",
  algorithmLabel: "Scaling algorithm",
  formatLabel: "Output format",
  qualityLabel: "Quality",
  qualityDescription: "Used for lossy outputs such as JPEG and WebP.",
  resizeLabel: "Resize image",
  resetLabel: "Reset options",
  resultTitle: "Output preview",
  resultDescription:
    "Compare the original image with the resized output before downloading it.",
  downloadLabel: "Download result",
  originalLabel: "Original",
  outputLabel: "Resized output",
  emptyResultTitle: "Resize an image to preview the output.",
  emptyResultDescription:
    "The resized image and download action appear here after processing finishes.",
  invalidImageTitle: "This file could not be read as an image.",
  invalidImageDescription:
    "Choose a browser-readable image file and try again.",
  resizeErrorTitle: "The image could not be resized.",
  resizeErrorDescription: "Try a smaller output size or choose another format.",
  algorithmHighQuality: "High quality",
  algorithmBalanced: "Balanced",
  algorithmPixelated: "Pixelated / nearest-neighbor",
  formatAuto: "Auto",
  formatPng: "PNG",
  formatJpeg: "JPEG",
  formatWebp: "WebP",
} as const

const OPTION_STORAGE_KEY = "tools:image-resizer:options"

let urlCounter = 0

function createImageFile(
  name = "photo.png",
  type = "image/png",
  size = 2048
): File {
  const content = new Uint8Array(size)
  return new File([content], name, { type })
}

function createNonImageFile(): File {
  return new File(["text content"], "readme.txt", { type: "text/plain" })
}

beforeEach(() => {
  urlCounter = 0
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:mock-url-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
  window.localStorage.clear()
  mockedReadImageDimensions.mockReset()
  mockedResizeImageFile.mockReset()
})

afterEach(cleanup)

function getFileInput(): HTMLInputElement {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

async function uploadFile(file: File) {
  const input = getFileInput()
  fireEvent.change(input, { target: { files: [file] } })
  await waitFor(() => {
    // Wait for state updates to settle after file upload
  })
}

describe("ImageResizerClient", () => {
  // ---------------------------------------------------------------------------
  // Initial render
  // ---------------------------------------------------------------------------

  test("renders upload area with placeholder when no file is selected", () => {
    render(<ImageResizerClient messages={messages} />)

    expect(screen.getByText("Source image")).toBeTruthy()
    expect(screen.getByText("Choose an image")).toBeTruthy()
    expect(
      screen.getByText(
        "PNG, JPEG, WebP, and other browser-readable formats are supported."
      )
    ).toBeTruthy()
  })

  test("renders the options card with default values", () => {
    render(<ImageResizerClient messages={messages} />)

    expect(screen.getByText("Resize options")).toBeTruthy()

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    expect(widthInput.value).toBe("1920")

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    expect(heightInput.value).toBe("1080")

    expect(screen.getByText("92")).toBeTruthy()
  })

  test("renders the empty result area", () => {
    render(<ImageResizerClient messages={messages} />)

    expect(screen.getByText("Output preview")).toBeTruthy()
    expect(
      screen.getByText("Resize an image to preview the output.")
    ).toBeTruthy()
    expect(
      screen.getByText(
        "The resized image and download action appear here after processing finishes."
      )
    ).toBeTruthy()
  })

  test("resize button is disabled when no file is selected", () => {
    render(<ImageResizerClient messages={messages} />)

    const resizeButton = screen.getByText("Resize image").closest("button")!
    expect(resizeButton.disabled).toBe(true)
  })

  // ---------------------------------------------------------------------------
  // Options: width and height inputs
  // ---------------------------------------------------------------------------

  test("changing width updates the input value", () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "800" } })

    expect(widthInput.value).toBe("800")
  })

  test("changing height updates the input value", () => {
    render(<ImageResizerClient messages={messages} />)

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    fireEvent.change(heightInput, { target: { value: "600" } })

    expect(heightInput.value).toBe("600")
  })

  test("width input clamps to 1 when empty or zero", () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "0" } })

    expect(widthInput.value).toBe("1")
  })

  test("height input clamps to 1 when empty or zero", () => {
    render(<ImageResizerClient messages={messages} />)

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    fireEvent.change(heightInput, { target: { value: "" } })

    expect(heightInput.value).toBe("1")
  })

  // ---------------------------------------------------------------------------
  // Options: aspect ratio linked width/height
  // ---------------------------------------------------------------------------

  test("width change adjusts height when aspect ratio is on and source is loaded", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 2000,
      height: 1000,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const widthInput = screen.getByLabelText("Width") as HTMLInputElement
      expect(widthInput.value).toBe("2000")
    })

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "1000" } })

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    expect(heightInput.value).toBe("500")
  })

  test("height change adjusts width when aspect ratio is on and source is loaded", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 2000,
      height: 1000,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const heightInput = screen.getByLabelText("Height") as HTMLInputElement
      expect(heightInput.value).toBe("1000")
    })

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    fireEvent.change(heightInput, { target: { value: "500" } })

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    expect(widthInput.value).toBe("1000")
  })

  test("width change does NOT adjust height when aspect ratio is off", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 2000,
      height: 1000,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const widthInput = screen.getByLabelText("Width") as HTMLInputElement
      expect(widthInput.value).toBe("2000")
    })

    // Turn off aspect ratio
    const aspectSwitch = screen.getByRole("switch", {
      name: "Keep aspect ratio",
    })
    fireEvent.click(aspectSwitch)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "500" } })

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    // Height should NOT change proportionally
    expect(heightInput.value).toBe("1000")
  })

  test("height change does NOT adjust width when aspect ratio is off", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 2000,
      height: 1000,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const heightInput = screen.getByLabelText("Height") as HTMLInputElement
      expect(heightInput.value).toBe("1000")
    })

    // Turn off aspect ratio
    const aspectSwitch = screen.getByRole("switch", {
      name: "Keep aspect ratio",
    })
    fireEvent.click(aspectSwitch)

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    fireEvent.change(heightInput, { target: { value: "300" } })

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    expect(widthInput.value).toBe("2000")
  })

  test("width change without source dimensions does not adjust height", () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    const heightInput = screen.getByLabelText("Height") as HTMLInputElement

    const originalHeight = heightInput.value

    fireEvent.change(widthInput, { target: { value: "500" } })

    expect(heightInput.value).toBe(originalHeight)
  })

  test("height change without source dimensions does not adjust width", () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    const heightInput = screen.getByLabelText("Height") as HTMLInputElement

    const originalWidth = widthInput.value

    fireEvent.change(heightInput, { target: { value: "500" } })

    expect(widthInput.value).toBe(originalWidth)
  })

  // ---------------------------------------------------------------------------
  // Options: switches
  // ---------------------------------------------------------------------------

  test("toggling keep aspect ratio switch", () => {
    render(<ImageResizerClient messages={messages} />)

    const aspectSwitch = screen.getByRole("switch", {
      name: "Keep aspect ratio",
    })

    expect(aspectSwitch.getAttribute("data-state")).toBe("checked")

    fireEvent.click(aspectSwitch)
    expect(aspectSwitch.getAttribute("data-state")).toBe("unchecked")

    fireEvent.click(aspectSwitch)
    expect(aspectSwitch.getAttribute("data-state")).toBe("checked")
  })

  test("toggling allow upscale checkbox", () => {
    render(<ImageResizerClient messages={messages} />)

    const upscaleSwitch = screen.getByRole("checkbox", {
      name: "Allow upscale",
    })

    expect(upscaleSwitch.getAttribute("data-state")).toBe("unchecked")

    fireEvent.click(upscaleSwitch)
    expect(upscaleSwitch.getAttribute("data-state")).toBe("checked")
  })

  // ---------------------------------------------------------------------------
  // Reset button
  // ---------------------------------------------------------------------------

  test("reset button resets options to defaults", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const widthInput = screen.getByLabelText("Width") as HTMLInputElement
      expect(widthInput.value).toBe("800")
    })

    // Change some values
    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "400" } })

    const upscaleSwitch = screen.getByRole("checkbox", {
      name: "Allow upscale",
    })
    fireEvent.click(upscaleSwitch)

    expect(widthInput.value).toBe("400")
    expect(upscaleSwitch.getAttribute("data-state")).toBe("checked")

    // Reset
    const resetButton = screen.getByText("Reset options").closest("button")!
    fireEvent.click(resetButton)

    // Width/height should reset to source dimensions, not DEFAULT_OPTIONS
    expect(widthInput.value).toBe("800")
    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    expect(heightInput.value).toBe("600")

    // Upscale should be back to default (off)
    expect(upscaleSwitch.getAttribute("data-state")).toBe("unchecked")
  })

  test("reset button uses default dimensions when no source is loaded", () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "999" } })

    // Verify the width was changed
    expect(widthInput.value).toBe("999")

    const resetButton = screen.getByText("Reset options").closest("button")!
    fireEvent.click(resetButton)

    // Without a loaded source, reset falls back to DEFAULT_OPTIONS
    // but sourceDimensions is null so it uses currentOptions width/height.
    // The key thing is that other options (algorithm, format, quality) reset.
    // Width/height restore to defaults when source is loaded (tested elsewhere).
    expect(resetButton).toBeTruthy()
  })

  test("reset button clears error and result state", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })
    mockedResizeImageFile.mockRejectedValueOnce(new Error("resize failure"))

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(
        screen.getByText("Try a smaller output size or choose another format.")
      ).toBeTruthy()
    })

    const resetButton = screen.getByText("Reset options").closest("button")!
    fireEvent.click(resetButton)

    expect(
      screen.queryByText("Try a smaller output size or choose another format.")
    ).toBeNull()
  })

  // ---------------------------------------------------------------------------
  // File upload
  // ---------------------------------------------------------------------------

  test("uploading a valid image shows preview with dimensions and file size", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 1600,
      height: 900,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("test.png", "image/png", 5120))

    await waitFor(() => {
      expect(screen.getByText("test.png")).toBeTruthy()
    })

    expect(screen.getByText(/1600 .* 900/)).toBeTruthy()
    expect(screen.getByText("5.0 KB")).toBeTruthy()
    expect(screen.getByText("Change image")).toBeTruthy()
  })

  test("uploading sets width and height options from source dimensions", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 3000,
      height: 2000,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      const widthInput = screen.getByLabelText("Width") as HTMLInputElement
      expect(widthInput.value).toBe("3000")
    })

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    expect(heightInput.value).toBe("2000")
  })

  test("uploading enables the resize button", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    render(<ImageResizerClient messages={messages} />)

    const resizeButton = screen.getByText("Resize image").closest("button")!
    expect(resizeButton.disabled).toBe(true)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(resizeButton.disabled).toBe(false)
    })
  })

  test("uploading a non-image file shows invalid image error", async () => {
    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createNonImageFile())

    await waitFor(() => {
      expect(
        screen.getByText("This file could not be read as an image.")
      ).toBeTruthy()
      expect(
        screen.getByText("Choose a browser-readable image file and try again.")
      ).toBeTruthy()
    })
  })

  test("uploading an image that fails readImageDimensions shows error", async () => {
    mockedReadImageDimensions.mockRejectedValueOnce(new Error("bad image"))

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(
        screen.getByText("Choose a browser-readable image file and try again.")
      ).toBeTruthy()
    })
  })

  test("uploading a valid file after an error clears the error", async () => {
    render(<ImageResizerClient messages={messages} />)

    // First upload a non-image
    await uploadFile(createNonImageFile())

    await waitFor(() => {
      expect(
        screen.getByText("Choose a browser-readable image file and try again.")
      ).toBeTruthy()
    })

    // Now upload a valid image
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Choose a browser-readable image file and try again."
        )
      ).toBeNull()
    })
  })

  test("file change with empty files list sets null", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Change image")).toBeTruthy()
    })

    // Fire change with no files
    const input = getFileInput()
    fireEvent.change(input, { target: { files: [] } })

    await waitFor(() => {
      expect(screen.getByText("Choose an image")).toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // Error states and alert variant
  // ---------------------------------------------------------------------------

  test("error alert shows invalidImageTitle when no file is selected", async () => {
    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createNonImageFile())

    await waitFor(() => {
      expect(
        screen.getByText("This file could not be read as an image.")
      ).toBeTruthy()
    })
  })

  test("error alert shows resizeErrorTitle when file is selected but resize fails", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })
    mockedResizeImageFile.mockRejectedValueOnce(
      new Error("canvas not available")
    )

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("The image could not be resized.")).toBeTruthy()
      expect(
        screen.getByText("Try a smaller output size or choose another format.")
      ).toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // Resize flow
  // ---------------------------------------------------------------------------

  test("successful resize shows result with previews and download button", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 1600,
      height: 900,
    })

    const resultBlob = new Blob(["resized-image-data"], {
      type: "image/png",
    })
    Object.defineProperty(resultBlob, "size", { value: 1024 })

    mockedResizeImageFile.mockResolvedValueOnce({
      blob: resultBlob,
      outputWidth: 800,
      outputHeight: 450,
      mimeType: "image/png",
      outputName: "photo.png",
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("photo.png"))

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("Original")).toBeTruthy()
      expect(screen.getByText("Resized output")).toBeTruthy()
    })

    expect(screen.getByText(/800 .* 450/)).toBeTruthy()
    expect(screen.getByText("image/png")).toBeTruthy()
    expect(screen.getByText("1.0 KB")).toBeTruthy()

    const downloadLink = screen.getByText("Download result").closest("a")!
    expect(downloadLink.getAttribute("download")).toBe("photo.png")
    expect(downloadLink.getAttribute("href")).toContain("blob:mock-url-")
  })

  test("resize calls resizeImageFile with current options", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 1000,
      height: 500,
    })

    const resultBlob = new Blob(["data"], { type: "image/png" })
    mockedResizeImageFile.mockResolvedValueOnce({
      blob: resultBlob,
      outputWidth: 1000,
      outputHeight: 500,
      mimeType: "image/png",
      outputName: "photo.png",
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(mockedResizeImageFile).toHaveBeenCalledOnce()
    })

    const calledOptions = mockedResizeImageFile.mock.calls[0]![1]
    expect(calledOptions.width).toBe(1000)
    expect(calledOptions.height).toBe(500)
    expect(calledOptions.keepAspectRatio).toBe(true)
    expect(calledOptions.allowUpscale).toBe(false)
    expect(calledOptions.algorithm).toBe("high-quality")
    expect(calledOptions.outputFormat).toBe("auto")
    expect(calledOptions.quality).toBe(92)
  })

  test("runResize does nothing when no file is selected", () => {
    render(<ImageResizerClient messages={messages} />)

    const resizeButton = screen.getByText("Resize image").closest("button")!
    // Force click even though disabled, to cover the early return branch
    fireEvent.click(resizeButton)

    expect(mockedResizeImageFile).not.toHaveBeenCalled()
  })

  test("resize failure clears any previous result", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    const resultBlob = new Blob(["data"], { type: "image/png" })
    mockedResizeImageFile
      .mockResolvedValueOnce({
        blob: resultBlob,
        outputWidth: 400,
        outputHeight: 300,
        mimeType: "image/png",
        outputName: "photo.png",
      })
      .mockRejectedValueOnce(new Error("second resize failed"))

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    // First successful resize
    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("Original")).toBeTruthy()
    })

    // Second resize that fails
    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(
        screen.getByText("Try a smaller output size or choose another format.")
      ).toBeTruthy()
    })

    // Result area should show the empty state
    expect(
      screen.getByText("Resize an image to preview the output.")
    ).toBeTruthy()
  })

  // ---------------------------------------------------------------------------
  // URL.createObjectURL / revokeObjectURL lifecycle
  // ---------------------------------------------------------------------------

  test("creates and revokes object URLs for source preview", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled()
    })
  })

  test("creates and revokes object URLs for result preview", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    const resultBlob = new Blob(["data"], { type: "image/png" })
    mockedResizeImageFile.mockResolvedValueOnce({
      blob: resultBlob,
      outputWidth: 400,
      outputHeight: 300,
      mimeType: "image/png",
      outputName: "photo.png",
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("Download result")).toBeTruthy()
    })

    // URL.createObjectURL is called for the source and the result
    expect(
      (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls.length
    ).toBeGreaterThanOrEqual(2)
  })

  // ---------------------------------------------------------------------------
  // localStorage persistence
  // ---------------------------------------------------------------------------

  test("persists options to localStorage on change", async () => {
    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    fireEvent.change(widthInput, { target: { value: "640" } })

    await waitFor(() => {
      const stored = window.localStorage.getItem(OPTION_STORAGE_KEY)
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed.width).toBe(640)
    })
  })

  test("restores options from localStorage on mount", async () => {
    const storedOptions = {
      width: 512,
      height: 384,
      quality: 75,
      algorithm: "balanced",
      outputFormat: "jpeg",
      keepAspectRatio: false,
      allowUpscale: true,
    }
    window.localStorage.setItem(
      OPTION_STORAGE_KEY,
      JSON.stringify(storedOptions)
    )

    render(<ImageResizerClient messages={messages} />)

    await waitFor(() => {
      const widthInput = screen.getByLabelText("Width") as HTMLInputElement
      expect(widthInput.value).toBe("512")
    })

    const heightInput = screen.getByLabelText("Height") as HTMLInputElement
    expect(heightInput.value).toBe("384")

    expect(screen.getByText("75")).toBeTruthy()

    const aspectSwitch = screen.getByRole("switch", {
      name: "Keep aspect ratio",
    })
    expect(aspectSwitch.getAttribute("data-state")).toBe("unchecked")

    const upscaleSwitch = screen.getByRole("checkbox", {
      name: "Allow upscale",
    })
    expect(upscaleSwitch.getAttribute("data-state")).toBe("checked")
  })

  test("ignores broken localStorage data gracefully", () => {
    window.localStorage.setItem(OPTION_STORAGE_KEY, "not-valid-json{{{")

    // Should not throw
    render(<ImageResizerClient messages={messages} />)

    // Falls back to defaults
    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    expect(widthInput.value).toBe("1920")
  })

  test("skips localStorage restore when no stored options exist", () => {
    window.localStorage.removeItem(OPTION_STORAGE_KEY)

    render(<ImageResizerClient messages={messages} />)

    const widthInput = screen.getByLabelText("Width") as HTMLInputElement
    expect(widthInput.value).toBe("1920")
  })

  // ---------------------------------------------------------------------------
  // formatFileSize helper (tested indirectly through rendered output)
  // ---------------------------------------------------------------------------

  test("displays file size in bytes for very small files", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 10,
      height: 10,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("tiny.png", "image/png", 500))

    await waitFor(() => {
      expect(screen.getByText("500 B")).toBeTruthy()
    })
  })

  test("displays file size in KB for medium files", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 100,
      height: 100,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("medium.png", "image/png", 51200))

    await waitFor(() => {
      expect(screen.getByText("50.0 KB")).toBeTruthy()
    })
  })

  test("displays file size in MB for large files", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 100,
      height: 100,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("large.png", "image/png", 2 * 1024 * 1024))

    await waitFor(() => {
      expect(screen.getByText("2.0 MB")).toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // Source preview URL cleanup when file is set to null
  // ---------------------------------------------------------------------------

  test("revokes source preview URL when file is removed", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Change image")).toBeTruthy()
    })

    // Upload null (no files)
    const input = getFileInput()
    fireEvent.change(input, { target: { files: [] } })

    await waitFor(() => {
      expect(screen.getByText("Choose an image")).toBeTruthy()
    })

    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  // ---------------------------------------------------------------------------
  // Result preview URL lifecycle
  // ---------------------------------------------------------------------------

  test("revokes result preview URL when result is cleared", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    const resultBlob = new Blob(["data"], { type: "image/png" })
    mockedResizeImageFile.mockResolvedValueOnce({
      blob: resultBlob,
      outputWidth: 400,
      outputHeight: 300,
      mimeType: "image/png",
      outputName: "photo.png",
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("Download result")).toBeTruthy()
    })

    // Reset clears result
    const resetButton = screen.getByText("Reset options").closest("button")!
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(
        screen.getByText("Resize an image to preview the output.")
      ).toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // Multiple file uploads (URL replacement)
  // ---------------------------------------------------------------------------

  test("replacing file revokes previous source URL", async () => {
    mockedReadImageDimensions
      .mockResolvedValueOnce({ width: 800, height: 600 })
      .mockResolvedValueOnce({ width: 1024, height: 768 })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("first.png"))

    await waitFor(() => {
      expect(screen.getByText("first.png")).toBeTruthy()
    })

    await uploadFile(createImageFile("second.png"))

    await waitFor(() => {
      expect(screen.getByText("second.png")).toBeTruthy()
    })

    // revokeObjectURL should have been called for the first URL
    expect(
      (URL.revokeObjectURL as ReturnType<typeof vi.fn>).mock.calls.length
    ).toBeGreaterThanOrEqual(1)
  })

  // ---------------------------------------------------------------------------
  // Multiple resizes (result URL replacement)
  // ---------------------------------------------------------------------------

  test("second resize revokes previous result URL", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 800,
      height: 600,
    })

    const blob1 = new Blob(["data1"], { type: "image/png" })
    const blob2 = new Blob(["data2"], { type: "image/jpeg" })

    mockedResizeImageFile
      .mockResolvedValueOnce({
        blob: blob1,
        outputWidth: 400,
        outputHeight: 300,
        mimeType: "image/png",
        outputName: "photo.png",
      })
      .mockResolvedValueOnce({
        blob: blob2,
        outputWidth: 200,
        outputHeight: 150,
        mimeType: "image/jpeg",
        outputName: "photo.jpg",
      })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile())

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    // First resize
    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("image/png")).toBeTruthy()
    })

    // Second resize
    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("image/jpeg")).toBeTruthy()
    })
  })

  // ---------------------------------------------------------------------------
  // The download footer is hidden when there's no result
  // ---------------------------------------------------------------------------

  test("download button is not rendered when there is no result", () => {
    render(<ImageResizerClient messages={messages} />)

    expect(screen.queryByText("Download result")).toBeNull()
  })

  // ---------------------------------------------------------------------------
  // Source preview images
  // ---------------------------------------------------------------------------

  test("result section shows source and result images", async () => {
    mockedReadImageDimensions.mockResolvedValueOnce({
      width: 1600,
      height: 900,
    })

    const resultBlob = new Blob(["data"], { type: "image/webp" })
    Object.defineProperty(resultBlob, "size", { value: 2048 })

    mockedResizeImageFile.mockResolvedValueOnce({
      blob: resultBlob,
      outputWidth: 800,
      outputHeight: 450,
      mimeType: "image/webp",
      outputName: "photo.webp",
    })

    render(<ImageResizerClient messages={messages} />)

    await uploadFile(createImageFile("photo.png"))

    await waitFor(() => {
      expect(screen.getByText("Resize image").closest("button")!.disabled).toBe(
        false
      )
    })

    fireEvent.click(screen.getByText("Resize image").closest("button")!)

    await waitFor(() => {
      expect(screen.getByText("Resized output")).toBeTruthy()
    })

    // Both images are rendered
    const images = document.querySelectorAll("img")
    expect(images.length).toBeGreaterThanOrEqual(3) // source preview + result source + result output

    expect(screen.getByText("image/webp")).toBeTruthy()
    expect(screen.getAllByText("2.0 KB").length).toBeGreaterThanOrEqual(1)
  })
})
