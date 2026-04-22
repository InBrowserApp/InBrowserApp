import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UnicodePunycodeConverterClient from "./client"

const messages = {
  meta: {
    name: "Unicode ↔ Punycode Converter",
    description: "Convert domains both ways",
  },
  asciiDomainLabel: "ASCII Domain",
  unicodeDomainLabel: "Unicode Domain",
  whatIsPunycodeTitle: "What is Punycode?",
  whatIsPunycodeDescription: "Punycode explanation.",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

afterEach(cleanup)

describe("UnicodePunycodeConverterClient", () => {
  test("renders the default example values", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement
    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement

    expect(asciiInput.value).toBe("xn--v86c4184b.com")
    expect(unicodeInput.value).toBe("🕸️.com")
  })

  test("decodes punycode when the ascii domain changes", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement
    fireEvent.change(asciiInput, { target: { value: "xn--mnchen-3ya.de" } })

    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement
    expect(unicodeInput.value).toBe("münchen.de")
  })

  test("encodes unicode when the unicode domain changes", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement
    fireEvent.change(unicodeInput, { target: { value: "bücher.com" } })

    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement
    expect(asciiInput.value).toBe("xn--bcher-kva.com")
  })

  test("marks invalid ascii domains", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement
    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement

    fireEvent.change(asciiInput, { target: { value: "bad domain" } })

    expect(asciiInput.getAttribute("aria-invalid")).toBe("true")
    expect(unicodeInput.value).toBe("🕸️.com")
  })

  test("marks invalid unicode domains", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement
    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement

    fireEvent.change(unicodeInput, { target: { value: "bad domain" } })

    expect(unicodeInput.getAttribute("aria-invalid")).toBe("true")
    expect(asciiInput.value).toBe("xn--v86c4184b.com")
  })

  test("resets back to the default example", () => {
    render(<UnicodePunycodeConverterClient messages={messages} />)

    const unicodeInput = screen.getByLabelText(
      "Unicode Domain"
    ) as HTMLInputElement
    fireEvent.change(unicodeInput, { target: { value: "bücher.com" } })

    fireEvent.click(screen.getByText("Reset example"))

    const asciiInput = screen.getByLabelText("ASCII Domain") as HTMLInputElement
    expect(asciiInput.value).toBe("xn--v86c4184b.com")
    expect(unicodeInput.value).toBe("🕸️.com")
  })
})
