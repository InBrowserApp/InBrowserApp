import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ImagePaletteExtractorClient from "./client"
import { loadImageData } from "./client/image-data"

import type { ImagePaletteExtractorMessages } from "./client/types"

vi.mock("./client/image-data", async () => {
  const actual = await vi.importActual<typeof import("./client/image-data")>(
    "./client/image-data"
  )

  return {
    ...actual,
    loadImageData: vi.fn(),
  }
})

const messages: ImagePaletteExtractorMessages = {
  meta: {
    description:
      "Extract dominant colors from images and export palettes as HEX, CSS variables, or JSON.",
    name: "Image Palette Extractor",
  },
  changeImageLabel: "Change image",
  chooseImageLabel: "Drag and drop an image here, or click to upload",
  colorCountDescription: "Choose between 3 and 12 palette colors.",
  colorCountLabel: "Colors",
  copiedColorLabel: "Copied",
  copiedPaletteLabel: "Copied",
  copyColorLabel: "Copy color",
  copyPaletteLabel: "Copy palette",
  dominantColorLabel: "Dominant color",
  downloadPaletteLabel: "Download palette",
  emptyResultDescription:
    "Upload an image to see dominant colors and export options.",
  emptyResultTitle: "No palette yet",
  errorTitle: "Extraction issue",
  exportDescription: "Copy or download the palette for design handoff or code.",
  exportFormatCss: "CSS variables",
  exportFormatHex: "HEX list",
  exportFormatJson: "JSON",
  exportFormatLabel: "Format",
  exportTitle: "Export palette",
  extractedColorsLabel: "Extracted colors",
  ignoreTransparentDescription:
    "Skip fully transparent pixels when finding dominant colors.",
  ignoreTransparentLabel: "Ignore transparent pixels",
  invalidFileTypeError: "Please select a valid image file.",
  loadFailedError: "Failed to load the image. Please try another file.",
  loadingDescription: "Sampling pixels and grouping similar colors.",
  loadingTitle: "Extracting palette",
  noPixelsError:
    "No visible pixels found. Try disabling transparent pixel filtering.",
  optionsDescription:
    "Control how many colors to extract and how to sort them.",
  optionsTitle: "Palette settings",
  qualityBalanced: "Balanced",
  qualityDescription:
    "Higher quality samples more pixels and may take longer on large images.",
  qualityFast: "Fast",
  qualityLabel: "Quality",
  qualityPrecise: "Precise",
  removeImageLabel: "Remove image",
  resultsDescription: "Review, copy, and export the extracted palette.",
  resultsTitle: "Palette results",
  sampledPixelsLabel: "Sampled pixels",
  sortDescription:
    "Change display order without changing the extracted colors.",
  sortDominance: "Dominance",
  sortHue: "Hue",
  sortLabel: "Sort by",
  sortLightness: "Lightness",
  supportedFormatsLabel: "Supports PNG, JPEG, WebP, GIF, SVG, AVIF, and more.",
  uploadDescription: "Choose an image to sample locally in your browser.",
  uploadHint: "The image is decoded locally; it is not uploaded.",
  uploadTitle: "Upload image",
}

function createImageData() {
  const data = Uint8ClampedArray.from([
    255, 0, 0, 255, 255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
  ])

  if (typeof ImageData !== "undefined") {
    return new ImageData(data as ImageDataArray, 4, 1)
  }

  return { data, height: 1, width: 4 } as ImageData
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("image-input") as HTMLInputElement
}

beforeEach(() => {
  window.localStorage.clear()
  vi.mocked(loadImageData).mockReset()
  vi.mocked(loadImageData).mockResolvedValue({
    height: 1,
    imageData: createImageData(),
    sampleHeight: 1,
    sampleWidth: 4,
    width: 4,
  })
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:palette-preview")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ImagePaletteExtractorClient", () => {
  it("renders upload, settings, and empty result states", () => {
    render(<ImagePaletteExtractorClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  it("extracts a palette after selecting an image", async () => {
    render(<ImagePaletteExtractorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["png"], "brand.png", { type: "image/png" })],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.exportTitle)).toBeTruthy()
    })

    expect(loadImageData).toHaveBeenCalledTimes(1)
    expect(screen.getByText("brand.png")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText(messages.downloadPaletteLabel)).toBeTruthy()
    expect(screen.getAllByLabelText(/Copy color/).length).toBeGreaterThan(0)
  })

  it("copies a swatch color to the clipboard", async () => {
    render(<ImagePaletteExtractorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["png"], "brand.png", { type: "image/png" })],
      },
    })

    await screen.findByText(messages.exportTitle)

    const swatch = screen.getAllByLabelText(/Copy color/)
    fireEvent.click(swatch[0]!)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringMatching(/^#/)
      )
    })
  }, 10000)

  it("shows errors for invalid files and failed image loading", async () => {
    render(<ImagePaletteExtractorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["txt"], "notes.txt", { type: "text/plain" })],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()

    vi.mocked(loadImageData).mockRejectedValueOnce(new Error("bad image"))
    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["png"], "bad.png", { type: "image/png" })],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.loadFailedError)).toBeTruthy()
    })
  })
})
