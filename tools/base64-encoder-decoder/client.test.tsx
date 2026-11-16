import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import Base64EncoderDecoderClient from "./client"

const messages = {
  encodeLabel: "Encode",
  decodeLabel: "Decode",
  meta: { name: "Base64", description: "Encode and decode" },
  plainTextLabel: "Plain text",
  plainTextPlaceholder: "Enter text…",
  plainTextDescription: "UTF-8 text input.",
  encodedTextLabel: "Base64",
  encodedTextPlaceholder: "Paste Base64…",
  encodedTextDescription: "Base64 encoded output.",
  invalidBase64Title: "Invalid Base64",
  invalidBase64Description: "Check for errors.",
  copyPlainTextLabel: "Copy plain",
  copyEncodedTextLabel: "Copy Base64",
  copiedLabel: "Copied",
  resetLabel: "Reset",
} as const

afterEach(cleanup)

describe("Base64EncoderDecoderClient", () => {
  test("renders with default text", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("Hello, browser-native world!")

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    expect(encodedInput.value).toBeTruthy()
  })

  test("encodes plain text to base64 on input change", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "test" } })

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    expect(encodedInput.value).toBe("dGVzdA==")
  })

  test("decodes base64 to plain text on encoded input change", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "dGVzdA==" } })

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("test")
  })

  test("puts the decoding input first and preserves values when switching", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    expect(screen.getAllByRole("textbox")[0]).toBe(plainInput)

    fireEvent.click(screen.getByRole("radio", { name: "Decode" }))
    expect(screen.getAllByRole("textbox")[0]).toBe(encodedInput)

    fireEvent.change(encodedInput, { target: { value: "5L2g5aW98J+Riw==" } })
    expect(plainInput.value).toBe("你好👋")

    fireEvent.click(screen.getByRole("radio", { name: "Decode" }))
    expect(screen.getAllByRole("textbox")[0]).toBe(encodedInput)

    fireEvent.click(screen.getByRole("radio", { name: "Encode" }))
    expect(screen.getAllByRole("textbox")[0]).toBe(plainInput)
    expect(plainInput.value).toBe("你好👋")
    expect(encodedInput.value).toBe("5L2g5aW98J+Riw==")
  })

  test("shows error alert for invalid base64 input", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "!!!invalid!!!" } })

    expect(screen.getByText("Invalid Base64")).toBeTruthy()
  })

  test("resets to default text on reset button click", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "changed" } })
    expect(plainInput.value).toBe("changed")

    const resetButton = screen.getByText("Reset")
    fireEvent.click(resetButton)

    expect(plainInput.value).toBe("Hello, browser-native world!")
  })

  test("clears error when valid base64 is entered", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "!!!invalid!!!" } })
    expect(screen.getByText("Invalid Base64")).toBeTruthy()

    fireEvent.change(encodedInput, { target: { value: "dGVzdA==" } })
    expect(screen.queryByText("Invalid Base64")).toBeNull()
  })

  test("restores from localStorage on mount", () => {
    window.localStorage.setItem(
      "tools:base64-encoder-decoder:plain-text",
      "stored value"
    )

    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("stored value")

    window.localStorage.removeItem("tools:base64-encoder-decoder:plain-text")
  })

  test("persists plain text to localStorage on change", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "persist me" } })

    expect(
      window.localStorage.getItem("tools:base64-encoder-decoder:plain-text")
    ).toBe("persist me")
  })

  test("clears error when plain text is changed", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByRole("textbox", {
      name: "Base64",
    }) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "!!!invalid!!!" } })
    expect(screen.getByText("Invalid Base64")).toBeTruthy()

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "new text" } })
    expect(screen.queryByText("Invalid Base64")).toBeNull()
  })
})
