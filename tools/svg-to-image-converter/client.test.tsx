import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import SvgToImageConverterClient from "./client"

vi.mock("./client/convert-svg-to-raster", () => {
  return {
    convertSvgToRasterBlob: vi.fn(
      async ({ format }: { format: string }) =>
        new Blob([format], {
          type:
            format === "png"
              ? "image/png"
              : format === "jpeg"
                ? "image/jpeg"
                : "image/webp",
        })
    ),
  }
})

import { convertSvgToRasterBlob } from "./client/convert-svg-to-raster"

const mockedConvertSvgToRasterBlob = vi.mocked(convertSvgToRasterBlob)

const messages = {
  backgroundColorLabel: "Background color",
  backgroundFillDescription: "JPEG always uses the selected background color.",
  backgroundFillLabel: "Fill background",
  changeFileLabel: "Change SVG",
  chooseSvgLabel: "Drag and drop an SVG here, or click to upload",
  convertFailedError: "Unable to convert the SVG.",
  convertLabel: "Convert",
  convertingLabel: "Converting",
  downloadLabel: "Download image",
  dimensionsLabel: "Dimensions",
  emptyResultDescription: "Upload an SVG and convert it to preview the result.",
  emptyResultTitle: "No output yet",
  fileSizeLabel: "File size",
  formatJpegLabel: "JPEG",
  formatLabel: "Output format",
  formatPngLabel: "PNG",
  formatWebpLabel: "WebP",
  heightLabel: "Height",
  imageLoadFailedError: "Unable to load the SVG preview.",
  invalidFileTypeError: "Choose a valid SVG file.",
  invalidSvgError: "The SVG markup is invalid.",
  keepAspectDescription: "Keep the original aspect ratio while resizing.",
  keepAspectLabel: "Keep aspect ratio",
  meta: {
    description: "Convert SVG files into raster images.",
    name: "SVG to Image Converter",
  },
  noCanvasError: "Canvas is not available in this browser.",
  onlyOneFileError: "Only one SVG can be processed at a time.",
  optionsDescription:
    "Adjust the output format, size, background, and quality.",
  optionsTitle: "Options",
  originalLabel: "Original",
  outputLabel: "Output",
  qualityDescription: "Quality only affects JPEG and WebP exports.",
  qualityLabel: "Quality",
  readError: "Failed to read the SVG file.",
  removeFileLabel: "Remove SVG",
  resetLabel: "Reset",
  resultDescription: "Review the converted image and download it.",
  resultTitle: "Result",
  supportedFormatsLabel: "SVG files only.",
  uploadDescription: "Upload one SVG file to convert it into a raster image.",
  uploadHint: "The original SVG dimensions are used by default.",
  uploadTitle: "Upload SVG",
  widthLabel: "Width",
} as const

function createSvgFile(name = "icon.svg") {
  return new File(
    ['<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"></svg>'],
    name,
    {
      type: "image/svg+xml",
    }
  )
}

beforeEach(() => {
  mockedConvertSvgToRasterBlob.mockClear()

  let urlCounter = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:svg-output-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(cleanup)

describe("SvgToImageConverterClient", () => {
  test("shows an error for non-svg uploads", async () => {
    render(<SvgToImageConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-to-image-input"), {
      target: {
        files: [new File(["png"], "icon.png", { type: "image/png" })],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()
  })

  test("uploads an svg file and shows the original dimensions", async () => {
    render(<SvgToImageConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-to-image-input"), {
      target: {
        files: [createSvgFile()],
      },
    })

    await waitFor(() => {
      expect(screen.getByText("icon.svg")).toBeTruthy()
    })

    expect(screen.getByText("200 × 100")).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
  })

  test("keeps aspect ratio when the width changes and resets back", async () => {
    render(<SvgToImageConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-to-image-input"), {
      target: {
        files: [createSvgFile()],
      },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue("200")).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText(messages.widthLabel), {
      target: { value: "400" },
    })

    expect(
      (screen.getByLabelText(messages.heightLabel) as HTMLInputElement).value
    ).toBe("200")

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect(
      (screen.getByLabelText(messages.widthLabel) as HTMLInputElement).value
    ).toBe("200")
    expect(
      (screen.getByLabelText(messages.heightLabel) as HTMLInputElement).value
    ).toBe("100")
  })

  test("converts the uploaded svg and exposes a download link", async () => {
    render(<SvgToImageConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-to-image-input"), {
      target: {
        files: [createSvgFile("logo.svg")],
      },
    })

    await waitFor(() => {
      expect(screen.getByText("logo.svg")).toBeTruthy()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.formatWebpLabel })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(mockedConvertSvgToRasterBlob).toHaveBeenCalledTimes(1)
    })

    expect(
      screen
        .getByRole("link", { name: messages.downloadLabel })
        .getAttribute("download")
    ).toBe("logo.webp")
  })

  test("shows an error when conversion fails", async () => {
    mockedConvertSvgToRasterBlob.mockRejectedValueOnce(
      new Error(messages.convertFailedError)
    )

    render(<SvgToImageConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-to-image-input"), {
      target: {
        files: [createSvgFile()],
      },
    })

    await waitFor(() => {
      expect(screen.getByText("icon.svg")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.convertFailedError)).toBeTruthy()
    })
  })
})
