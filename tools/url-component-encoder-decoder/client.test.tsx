import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UrlComponentEncoderDecoderClient from "./client"

const messages = {
  meta: {
    name: "URL Component Encoder and Decoder",
    description: "Encode and decode URL components.",
  },
  plainTextLabel: "Plain Text",
  plainTextPlaceholder: "Enter text to encode...",
  encodedTextLabel: "URL Encoded Text",
  encodedTextPlaceholder: "Enter URL encoded text to decode...",
  invalidEncodedTextLabel: "Invalid URL encoded text",
  copyPlainTextLabel: "Copy plain text",
  copyEncodedTextLabel: "Copy encoded text",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

afterEach(cleanup)

describe("UrlComponentEncoderDecoderClient", () => {
  test("renders with default text", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("Hello World! 50% off & more")

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    expect(encodedInput.value).toBe("Hello%20World!%2050%25%20off%20%26%20more")
  })

  test("encodes plain text on input change", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "hello world?" } })

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    expect(encodedInput.value).toBe("hello%20world%3F")
  })

  test("decodes encoded text on input change", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, {
      target: { value: "hello%20world%20%E4%BD%A0%E5%A5%BD" },
    })

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("hello world 你好")
  })

  test("shows an error for invalid encoded input", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "%" } })

    expect(screen.getByText("Invalid URL encoded text")).toBeTruthy()
  })

  test("clears the error when valid encoded text is entered", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "%" } })
    expect(screen.getByText("Invalid URL encoded text")).toBeTruthy()

    fireEvent.change(encodedInput, { target: { value: "hello%20world" } })
    expect(screen.queryByText("Invalid URL encoded text")).toBeNull()
  })

  test("resets to the default example", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "changed" } })

    fireEvent.click(screen.getByText("Reset example"))

    expect(plainInput.value).toBe("Hello World! 50% off & more")
  })

  test("restores plain text from localStorage on mount", () => {
    window.localStorage.setItem(
      "tools:url-component-encoder-decoder:plain-text",
      "stored value"
    )

    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("stored value")

    const encodedInput = screen.getByLabelText(
      "URL Encoded Text"
    ) as HTMLTextAreaElement
    expect(encodedInput.value).toBe("stored%20value")

    window.localStorage.removeItem(
      "tools:url-component-encoder-decoder:plain-text"
    )
  })

  test("persists plain text to localStorage", () => {
    render(<UrlComponentEncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain Text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "persist me" } })

    expect(
      window.localStorage.getItem(
        "tools:url-component-encoder-decoder:plain-text"
      )
    ).toBe("persist me")
  })
})
