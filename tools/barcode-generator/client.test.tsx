import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import BarcodeGeneratorClient from "./client"

vi.mock("./client/render", () => ({
  renderBarcodeRasterBlob: vi.fn(
    async (_options, format: string) =>
      new Blob([format], { type: `image/${format}` })
  ),
  renderBarcodeSvgMarkup: vi.fn(
    () => '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  ),
}))

import {
  renderBarcodeRasterBlob,
  renderBarcodeSvgMarkup,
} from "./client/render"

const mockedRenderBarcodeRasterBlob = vi.mocked(renderBarcodeRasterBlob)
const mockedRenderBarcodeSvgMarkup = vi.mocked(renderBarcodeSvgMarkup)

const messages = {
  meta: {
    name: "Barcode Generator",
    description:
      "Generate barcodes (CODE128, EAN, UPC, etc.) and download as PNG or SVG.",
  },
  options: "Options",
  optionsDescription:
    "Choose a barcode format and adjust size, labels, and colors.",
  preview: "Preview",
  previewDescription:
    "Review the generated barcode and export it as PNG, SVG, JPEG, or WebP.",
  download: "Download",
  text: "Text",
  textPlaceholder: "Type content to encode...",
  format: "Format",
  barWidth: "Bar width",
  barHeight: "Bar height",
  margin: "Margin",
  displayValue: "Display value",
  textAlign: "Text align",
  textPosition: "Text position",
  fontSize: "Font size",
  lineColor: "Line color",
  background: "Background",
  left: "Left",
  center: "Center",
  right: "Right",
  top: "Top",
  bottom: "Bottom",
} as const

beforeEach(() => {
  window.localStorage.clear()
  mockedRenderBarcodeRasterBlob.mockClear()
  mockedRenderBarcodeSvgMarkup.mockClear()

  let urlCounter = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:mock-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(cleanup)

describe("BarcodeGeneratorClient", () => {
  test("renders the generator UI and download links", async () => {
    render(<BarcodeGeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.text)).toBeTruthy()
    expect(screen.getByText(messages.options)).toBeTruthy()
    expect(screen.getByText(messages.preview)).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "PNG" })).toBeTruthy()
      expect(screen.getByRole("link", { name: "SVG" })).toBeTruthy()
      expect(screen.getByRole("link", { name: "JPEG" })).toBeTruthy()
      expect(screen.getByRole("link", { name: "WebP" })).toBeTruthy()
    })

    expect(mockedRenderBarcodeSvgMarkup).toHaveBeenCalled()
    expect(mockedRenderBarcodeRasterBlob).toHaveBeenCalledTimes(3)
  })

  test("restores persisted options from localStorage", async () => {
    window.localStorage.setItem(
      "tools:barcode-generator:options",
      JSON.stringify({
        text: "RESTORED",
        width: 4,
        displayValue: false,
      })
    )

    render(<BarcodeGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("RESTORED")).toBeTruthy()
    })

    expect(
      screen
        .getByRole("switch", { name: messages.displayValue })
        .getAttribute("data-state")
    ).toBe("unchecked")
  })

  test("persists text edits to localStorage", async () => {
    render(<BarcodeGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.text), {
      target: { value: "persist me" },
    })

    await waitFor(() => {
      const stored = window.localStorage.getItem(
        "tools:barcode-generator:options"
      )
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!).text).toBe("persist me")
    })
  })

  test("shows a preview error when rendering fails", async () => {
    mockedRenderBarcodeSvgMarkup.mockImplementation(() => {
      throw new Error("Invalid barcode contents")
    })

    render(<BarcodeGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Invalid barcode contents")).toBeTruthy()
    })

    expect(screen.queryByRole("link", { name: "PNG" })).toBeNull()
    expect(screen.queryByRole("link", { name: "SVG" })).toBeNull()
    expect(screen.queryByRole("link", { name: "JPEG" })).toBeNull()
    expect(screen.queryByRole("link", { name: "WebP" })).toBeNull()
  })
})
