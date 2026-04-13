import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UnicodeEscapeUnescapeClient from "./client"

const messages = {
  meta: {
    name: "Unicode Escape / Unescape",
    description: "Escape and unescape Unicode characters.",
  },
  plainTextLabel: "Plain Text",
  plainTextPlaceholder: "Enter text to escape...",
  escapeFormatLabel: "Escape Format",
  escapedTextLabel: "Escaped Text",
  escapedTextPlaceholder: "Enter escaped text to unescape...",
  copyPlainTextLabel: "Copy plain text",
  copyEscapedTextLabel: "Copy escaped text",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.removeItem("tools:unicode-escape-unescape:plain-text")
  window.localStorage.removeItem("tools:unicode-escape-unescape:format")
})

describe("UnicodeEscapeUnescapeClient", () => {
  test("renders with default text", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("Hello 你好 🎉")

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    expect(escapedInput.value).toBe("Hello \\u4F60\\u597D \\uD83C\\uDF89")
  })

  test("encodes plain text on input change", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "café" } })

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    expect(escapedInput.value).toBe("caf\\u00E9")
  })

  test("decodes escaped text on input change", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    fireEvent.change(escapedInput, {
      target: { value: "\\u4F60\\u597D" },
    })

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("你好")
  })

  test("resets to default example", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "changed" } })
    expect(plainInput.value).toBe("changed")

    fireEvent.click(screen.getByText("Reset example"))
    expect(plainInput.value).toBe("Hello 你好 🎉")
  })

  test("restores plain text from localStorage on mount", () => {
    window.localStorage.setItem(
      "tools:unicode-escape-unescape:plain-text",
      "stored value"
    )

    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("stored value")

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    expect(escapedInput.value).toBe("stored value")
  })

  test("persists plain text to localStorage", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "persist me" } })

    expect(
      window.localStorage.getItem("tools:unicode-escape-unescape:plain-text")
    ).toBe("persist me")
  })

  test("restores format from localStorage on mount", () => {
    window.localStorage.setItem(
      "tools:unicode-escape-unescape:format",
      "html-hex"
    )

    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    // Default text "Hello 你好 🎉" in html-hex format
    expect(escapedInput.value).toBe("Hello &#x4F60;&#x597D; &#x1F389;")
  })

  test("ignores invalid format from localStorage", () => {
    window.localStorage.setItem(
      "tools:unicode-escape-unescape:format",
      "invalid-format"
    )

    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    const escapedInput = screen.getByLabelText(
      "Escaped Text"
    ) as HTMLTextAreaElement
    // Falls back to default "js" format
    expect(escapedInput.value).toBe("Hello \\u4F60\\u597D \\uD83C\\uDF89")
  })

  test("persists format to localStorage", () => {
    render(<UnicodeEscapeUnescapeClient messages={messages} />)

    expect(
      window.localStorage.getItem("tools:unicode-escape-unescape:format")
    ).toBe("js")
  })
})
