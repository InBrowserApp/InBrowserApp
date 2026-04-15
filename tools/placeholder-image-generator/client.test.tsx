import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PlaceholderImageGeneratorClient from "./client"

vi.mock("./core/placeholder-image", async () => {
  const actual = await vi.importActual<
    typeof import("./core/placeholder-image")
  >("./core/placeholder-image")

  return {
    ...actual,
    createPlaceholderRasterBlob: vi.fn(
      async (_options, format: string) =>
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

import { createPlaceholderRasterBlob } from "./core/placeholder-image"

const mockedCreatePlaceholderRasterBlob = vi.mocked(createPlaceholderRasterBlob)

const messages = {
  autoFontSizeHint: "Auto",
  backgroundColorLabel: "Background color",
  backgroundDescription: "Switch between solid fills and gradients.",
  backgroundTitle: "Background",
  currentSizeLabel: "Current size",
  customTextLabel: "Custom text",
  dimensionsDescription: "Pick a preset or enter exact dimensions in pixels.",
  dimensionsTitle: "Dimensions",
  downloadDescription: "Export as PNG, SVG, JPEG, or WebP.",
  downloadLabel: "Download",
  exportError: "Unable to prepare downloads.",
  fontSizeLabel: "Font size",
  gradientAngleLabel: "Gradient angle",
  gradientColor1Label: "Gradient color 1",
  gradientColor2Label: "Gradient color 2",
  heightLabel: "Height",
  linearGradientLabel: "Linear gradient",
  meta: {
    description: "Generate custom placeholder images.",
    name: "Placeholder Image Generator",
  },
  optionsDescription:
    "Adjust dimensions, background, text, and export settings.",
  optionsTitle: "Options",
  presetLabel: "Preset",
  previewDescription: "Preview the placeholder before downloading any format.",
  previewTitle: "Preview",
  qualityDescription: "Quality affects JPEG and WebP exports.",
  qualityLabel: "Quality",
  radialGradientLabel: "Radial gradient",
  scaleLabel: "Scale",
  solidBackgroundLabel: "Solid",
  textColorLabel: "Text color",
  textDescription:
    "Override the default size label with your own copy and styling.",
  textTitle: "Text",
  widthLabel: "Width",
} as const

beforeEach(() => {
  mockedCreatePlaceholderRasterBlob.mockClear()

  let urlCounter = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:placeholder-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(cleanup)

describe("PlaceholderImageGeneratorClient", () => {
  test("renders the default preview and download links", async () => {
    render(<PlaceholderImageGeneratorClient messages={messages} />)

    expect(screen.getByText(messages.previewTitle)).toBeTruthy()

    await waitFor(() => {
      expect(mockedCreatePlaceholderRasterBlob).toHaveBeenCalledTimes(3)
    })

    expect(
      screen.getByRole("link", { name: "PNG" }).getAttribute("download")
    ).toBe("placeholder-800x600.png")
    expect(
      screen.getByRole("img", { name: messages.meta.name }).getAttribute("src")
    ).toContain("data:image/svg+xml")
  })

  test("updates dimensions from presets and scales download names", async () => {
    render(<PlaceholderImageGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Cover 1200 × 630" }))
    fireEvent.click(screen.getByRole("button", { name: "2x" }))

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "PNG" }).getAttribute("download")
      ).toBe("placeholder-1200x630@2x.png")
    })
  })

  test("updates the preview when custom text and gradients change", async () => {
    render(<PlaceholderImageGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.linearGradientLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.customTextLabel), {
      target: { value: "Hero" },
    })

    await waitFor(() => {
      expect(
        screen
          .getByRole("img", { name: messages.meta.name })
          .getAttribute("src")
      ).toContain("Hero")
    })
  })

  test("shows an export error when raster generation fails", async () => {
    mockedCreatePlaceholderRasterBlob.mockRejectedValueOnce(
      new Error("CANVAS_EXPORT_FAILED")
    )

    render(<PlaceholderImageGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.exportError)).toBeTruthy()
    })
  })
})
