import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import ColorContrastCheckerClient from "./client"

const messages = {
  optionsTitle: "Options",
  foregroundLabel: "Foreground",
  backgroundLabel: "Background",
  swapLabel: "Swap",
  invalidColorMessage: "Invalid color format",
  resultsTitle: "Results",
  contrastRatioLabel: "Contrast ratio",
  aaNormalLabel: "AA (normal)",
  aaLargeLabel: "AA (large)",
  aaaNormalLabel: "AAA (normal)",
  aaaLargeLabel: "AAA (large)",
  passLabel: "Pass",
  failLabel: "Fail",
  invalidInputMessage: "Enter valid colors to see results.",
  alphaNote: "Transparent colors are blended over white for contrast.",
  previewTitle: "Preview",
  normalTextLabel: "Normal text",
  largeTextLabel: "Large text",
  sampleText: "Aa Bb Cc 123",
  meta: {
    name: "Color Contrast Checker",
    description:
      "Check WCAG contrast ratios for foreground and background colors.",
  },
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("ColorContrastCheckerClient", () => {
  test("renders ratio and pass or fail badges for valid defaults", () => {
    render(<ColorContrastCheckerClient messages={messages} />)

    expect(screen.getByTestId("ratio-value").textContent).toContain(":1")
    expect(screen.getAllByTestId(/status-/)).toHaveLength(4)
  })

  test("shows invalid messaging when either color is invalid", () => {
    render(<ColorContrastCheckerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("foreground-input"), {
      target: { value: "not-a-color" },
    })

    expect(screen.getByText(messages.invalidColorMessage)).toBeTruthy()
    expect(screen.getByText(messages.invalidInputMessage)).toBeTruthy()
  })

  test("swaps foreground and background inputs", () => {
    render(<ColorContrastCheckerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("foreground-input"), {
      target: { value: "#000000" },
    })
    fireEvent.change(screen.getByTestId("background-input"), {
      target: { value: "#ffffff" },
    })

    fireEvent.click(screen.getByRole("button", { name: messages.swapLabel }))

    expect(
      (screen.getByTestId("foreground-input") as HTMLInputElement).value
    ).toBe("#ffffff")
    expect(
      (screen.getByTestId("background-input") as HTMLInputElement).value
    ).toBe("#000000")
  })

  test("preserves alpha when the native picker changes the rgb channels", () => {
    render(<ColorContrastCheckerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("foreground-input"), {
      target: { value: "#11223380" },
    })
    fireEvent.change(screen.getByTestId("foreground-picker"), {
      target: { value: "#ff0000" },
    })

    expect(
      (screen.getByTestId("foreground-input") as HTMLInputElement).value
    ).toBe("#FF000080")
  })

  test("hydrates persisted colors without overwriting storage", () => {
    window.localStorage.setItem(
      "tools:color-contrast-checker:foreground",
      "#123456"
    )
    window.localStorage.setItem(
      "tools:color-contrast-checker:background",
      "#abcdef"
    )

    render(<ColorContrastCheckerClient messages={messages} />)

    expect(
      (screen.getByTestId("foreground-input") as HTMLInputElement).value
    ).toBe("#123456")
    expect(
      (screen.getByTestId("background-input") as HTMLInputElement).value
    ).toBe("#abcdef")
    expect(
      window.localStorage.getItem("tools:color-contrast-checker:foreground")
    ).toBe("#123456")
    expect(
      window.localStorage.getItem("tools:color-contrast-checker:background")
    ).toBe("#abcdef")
  })

  test("applies swatch buttons to the associated field", () => {
    render(<ColorContrastCheckerClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.foregroundLabel} #0F172AFF`,
      })
    )

    expect(
      (screen.getByTestId("foreground-input") as HTMLInputElement).value
    ).toBe("#0F172AFF")
  })
})
