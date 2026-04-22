import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ColorPickerClient from "./client"

import type { ColorPickerMessages } from "./client/types"

const messages: ColorPickerMessages = {
  meta: {
    name: "Color Picker",
    description: "Pick colors from your screen or images.",
  },
  screenTitle: "Screen Color Picker",
  screenDescription: "Use the browser picker to sample any visible pixel.",
  screenButton: "Pick Screen Color",
  screenUnsupported: "Screen picking is not supported in this browser.",
  imageTitle: "Image Color Picker",
  imageDescription: "Upload an image and click to sample a pixel.",
  imageButton: "Select Image",
  imageHint: "Click the image to pick a color.",
  uploadHint: "Click or drag image to upload",
  imageError: "Failed to load the image.",
  clearImage: "Remove Image",
  resultsTitle: "Picked Color",
  sourceLabel: "Source",
  sourceScreen: "Screen",
  sourceImage: "Image",
  sourceUnknown: "Not picked yet",
  showAlpha: "Enable Alpha",
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  hsv: "HSV",
  hsva: "HSVA",
  cmyk: "CMYK",
  alpha: "Alpha",
  copyValue: "Copy",
  copiedValue: "Copied",
}

const canvasContext = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({ data: Uint8ClampedArray.from([1, 2, 3, 128]) })),
}

class MockImage {
  onload: null | (() => void) = null
  onerror: null | (() => void) = null
  naturalWidth = 4
  naturalHeight = 2

  set src(_value: string) {
    queueMicrotask(() => {
      this.onload?.()
    })
  }
}

beforeEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
  vi.stubGlobal("Image", MockImage)
  vi.stubGlobal("EyeDropper", undefined)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:color-picker-test")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})

  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => canvasContext),
  })
})

afterEach(() => {
  cleanup()
})

describe("ColorPickerClient", () => {
  it("renders default copied values", () => {
    render(<ColorPickerClient messages={messages} />)

    expect(screen.getByText("Picked Color")).toBeTruthy()
    expect(screen.getByText("#3498DBFF")).toBeTruthy()
    expect(screen.getByText("Source: Not picked yet")).toBeTruthy()
    expect(screen.getByText("rgba(52, 152, 219, 1)")).toBeTruthy()
  })

  it("reads persisted values and toggles alpha output", () => {
    window.localStorage.setItem(
      "tools:color-picker:rgba",
      JSON.stringify({ r: 255, g: 0, b: 0, a: 0.5 })
    )
    window.localStorage.setItem("tools:color-picker:show-alpha", "false")

    render(<ColorPickerClient messages={messages} />)

    expect(screen.getByText("#FF0000")).toBeTruthy()
    fireEvent.click(screen.getByTestId("alpha-switch"))
    expect(screen.getByText("#FF000080")).toBeTruthy()
    expect(screen.getByText("50%")).toBeTruthy()
  })

  it("shows an unsupported notice when EyeDropper is unavailable", () => {
    render(<ColorPickerClient messages={messages} />)

    expect(screen.getByText(messages.screenUnsupported)).toBeTruthy()
    expect(
      screen.getByTestId("screen-pick-button").hasAttribute("disabled")
    ).toBe(true)
  })

  it("picks a screen color when EyeDropper is supported", async () => {
    class SupportedEyeDropper {
      async open() {
        return { sRGBHex: "#ff0000" }
      }
    }

    vi.stubGlobal("EyeDropper", SupportedEyeDropper)

    render(<ColorPickerClient messages={messages} />)
    fireEvent.click(screen.getByTestId("screen-pick-button"))

    await waitFor(() => {
      expect(screen.getByText("#FF0000FF")).toBeTruthy()
    })
    expect(screen.getByText("Source: Screen")).toBeTruthy()
  })

  it("shows an error for invalid files", () => {
    render(<ColorPickerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("image-input"), {
      target: {
        files: [new File(["hello"], "notes.txt", { type: "text/plain" })],
      },
    })

    expect(screen.getByText(messages.imageError)).toBeTruthy()
  })

  it("loads an image and samples a pixel from the canvas", async () => {
    render(<ColorPickerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("image-input"), {
      target: {
        files: [new File(["png"], "sample.png", { type: "image/png" })],
      },
    })

    await waitFor(() => {
      expect(screen.getByTestId("image-canvas")).toBeTruthy()
    })

    const canvas = screen.getByTestId("image-canvas")
    Object.defineProperty(canvas, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 2,
        height: 1,
        right: 2,
        bottom: 1,
        x: 0,
        y: 0,
        toJSON() {
          return this
        },
      }),
    })

    fireEvent.click(canvas, { clientX: 1, clientY: 0.5 })

    await waitFor(() => {
      expect(screen.getByText("Source: Image")).toBeTruthy()
      expect(screen.getByText("#01020380")).toBeTruthy()
    })
  })
})
