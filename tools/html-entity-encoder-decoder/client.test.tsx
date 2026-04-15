import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import HtmlEntityEncoderDecoderClient from "./client"

const messages = {
  meta: {
    name: "HTML Entity Encoder & Decoder",
    description:
      "Encode and decode HTML entities. Convert special characters to named, decimal, or hexadecimal HTML entities and vice versa.",
  },
  optionsLabel: "Encoding Options",
  formatLabel: "Format",
  rangeLabel: "Range",
  formatNamedLabel: "Named (&lt;)",
  formatDecimalLabel: "Decimal (&#60;)",
  formatHexLabel: "Hexadecimal (&#x3C;)",
  rangeMinimalLabel: "Minimal (HTML required)",
  rangeNonAsciiLabel: "All Non-ASCII",
  rangeAllSpecialLabel: "All Special Characters",
  plainTextLabel: "Plain Text",
  plainTextPlaceholder: "Enter text to encode...",
  encodedTextLabel: "Encoded Text",
  encodedTextPlaceholder: "Enter HTML entities to decode...",
  copyPlainTextLabel: "Copy plain text",
  copyEncodedTextLabel: "Copy encoded text",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

const STORAGE_KEYS = {
  plainText: "tools:html-entity-encoder-decoder:plain-text",
  format: "tools:html-entity-encoder-decoder:format",
  range: "tools:html-entity-encoder-decoder:range",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByLabelText(messages.plainTextLabel) as HTMLTextAreaElement
}

function getEncodedTextInput() {
  return screen.getByLabelText(messages.encodedTextLabel) as HTMLTextAreaElement
}

function selectOption(label: string, option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: label }))
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("HtmlEntityEncoderDecoderClient", () => {
  test("renders the default example", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      '<div class="hello">Hello & World</div>'
    )
    expect(getEncodedTextInput().value).toBe(
      "&lt;div class=&quot;hello&quot;&gt;Hello &amp; World&lt;/div&gt;"
    )
  })

  test("encodes plain text input", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "<span>AT&T</span>" },
    })

    expect(getEncodedTextInput().value).toBe(
      "&lt;span&gt;AT&amp;T&lt;/span&gt;"
    )
  })

  test("decodes encoded text input", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    fireEvent.change(getEncodedTextInput(), {
      target: { value: "&lt;span&gt;Hi &amp; Bye&lt;/span&gt;" },
    })

    expect(getPlainTextInput().value).toBe("<span>Hi & Bye</span>")
  })

  test("updates output when format and range change", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "Hello ©" },
    })

    selectOption(messages.formatLabel, messages.formatDecimalLabel)
    selectOption(messages.rangeLabel, messages.rangeNonAsciiLabel)

    expect(getEncodedTextInput().value).toBe("Hello &#169;")

    selectOption(messages.formatLabel, messages.formatHexLabel)
    expect(getEncodedTextInput().value).toBe("Hello &#xA9;")
  })

  test("restores plain text and options from localStorage", () => {
    window.localStorage.setItem(STORAGE_KEYS.plainText, "café")
    window.localStorage.setItem(STORAGE_KEYS.format, "decimal")
    window.localStorage.setItem(STORAGE_KEYS.range, "non-ascii")

    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("café")
    expect(getEncodedTextInput().value).toBe("caf&#233;")
    expect(
      screen.getByRole("combobox", { name: messages.formatLabel }).textContent
    ).toContain(messages.formatDecimalLabel)
    expect(
      screen.getByRole("combobox", { name: messages.rangeLabel }).textContent
    ).toContain(messages.rangeNonAsciiLabel)
  })

  test("persists updates to localStorage", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })
    selectOption(messages.formatLabel, messages.formatHexLabel)
    selectOption(messages.rangeLabel, messages.rangeAllSpecialLabel)

    expect(window.localStorage.getItem(STORAGE_KEYS.plainText)).toBe(
      "persist me"
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.format)).toBe("hex")
    expect(window.localStorage.getItem(STORAGE_KEYS.range)).toBe("all-special")
  })

  test("resets back to the example state", () => {
    render(<HtmlEntityEncoderDecoderClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "changed" },
    })
    selectOption(messages.formatLabel, messages.formatHexLabel)
    fireEvent.click(screen.getByText(messages.resetLabel))

    expect(getPlainTextInput().value).toBe(
      '<div class="hello">Hello & World</div>'
    )
    expect(getEncodedTextInput().value).toBe(
      "&lt;div class=&quot;hello&quot;&gt;Hello &amp; World&lt;/div&gt;"
    )
    expect(
      screen.getByRole("combobox", { name: messages.formatLabel }).textContent
    ).toContain(messages.formatNamedLabel)
  })
})
