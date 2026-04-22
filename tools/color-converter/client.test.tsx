import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import ColorConverterClient from "./client"

const messages = {
  optionsTitle: "Options",
  resultsTitle: "Results",
  previewTitle: "Preview",
  enableAlphaLabel: "Enable Alpha",
  invalidColorMessage: "Invalid color format",
  copyValueLabel: "Copy value",
  copiedLabel: "Copied",
  keywordLabel: "CSS Keyword",
  hexInfo: "Hex info",
  rgbInfo: "RGB info",
  hslInfo: "HSL info",
  hsvInfo: "HSV info",
  hwbInfo: "HWB info",
  labInfo: "LAB info",
  lchInfo: "LCH info",
  cmykInfo: "CMYK info",
  keywordInfo: "Keyword info",
  meta: {
    name: "Color Converter",
    description: "Convert colors between common web and print formats.",
  },
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("ColorConverterClient", () => {
  test("renders default values", () => {
    render(<ColorConverterClient messages={messages} />)

    expect((screen.getByTestId("hex-input") as HTMLInputElement).value).toBe(
      "#3498DBFF"
    )
    expect((screen.getByTestId("rgb-input") as HTMLInputElement).value).toBe(
      "rgba(52, 152, 219, 1)"
    )
  })

  test("toggles alpha formatting", () => {
    render(<ColorConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("switch", { name: messages.enableAlphaLabel })
    )

    expect((screen.getByTestId("hex-input") as HTMLInputElement).value).toBe(
      "#3498DB"
    )
    expect((screen.getByTestId("rgb-input") as HTMLInputElement).value).toBe(
      "rgb(52, 152, 219)"
    )
  })

  test("updates all formats when rgb input changes", () => {
    render(<ColorConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("rgb-input"), {
      target: { value: "rgba(255, 0, 0, 0.5)" },
    })
    fireEvent.blur(screen.getByTestId("rgb-input"))

    expect((screen.getByTestId("hex-input") as HTMLInputElement).value).toBe(
      "#FF000080"
    )
    expect((screen.getByTestId("hsl-input") as HTMLInputElement).value).toBe(
      "hsla(0, 100%, 50%, 0.5)"
    )
  })

  test("shows validation when a format is invalid", () => {
    render(<ColorConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("lab-input"), {
      target: { value: "lab(999, 1, 1)" },
    })
    fireEvent.blur(screen.getByTestId("lab-input"))

    expect(screen.getByText(messages.invalidColorMessage)).toBeTruthy()
  })

  test("hydrates local storage without overwriting the saved state", () => {
    window.localStorage.setItem(
      "tools:color-converter:rgba",
      JSON.stringify({ r: 255, g: 0, b: 0, a: 0.5 })
    )
    window.localStorage.setItem("tools:color-converter:show-alpha", "false")

    render(<ColorConverterClient messages={messages} />)

    expect((screen.getByTestId("hex-input") as HTMLInputElement).value).toBe(
      "#FF0000"
    )
    expect(
      window.localStorage.getItem("tools:color-converter:show-alpha")
    ).toBe("false")
  })

  test("changes color from the keyword field", () => {
    render(<ColorConverterClient messages={messages} />)

    fireEvent.change(screen.getByTestId("keyword-input"), {
      target: { value: "red" },
    })
    fireEvent.blur(screen.getByTestId("keyword-input"))

    expect((screen.getByTestId("hex-input") as HTMLInputElement).value).toBe(
      "#FF0000FF"
    )
  })
})
