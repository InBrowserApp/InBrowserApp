import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import Base64EncoderDecoderClient from "./client"

const messages = {
  meta: { name: "Base64", description: "Encode and decode" },
  plainTextLabel: "Plain text",
  plainTextPlaceholder: "Enter text…",
  plainTextDescription: "UTF-8 text input.",
  encodedTextLabel: "Base64 output",
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

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
    expect(encodedInput.value).toBeTruthy()
  })

  test("encodes plain text to base64 on input change", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "test" } })

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
    expect(encodedInput.value).toBe("dGVzdA==")
  })

  test("decodes base64 to plain text on encoded input change", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "dGVzdA==" } })

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    expect(plainInput.value).toBe("test")
  })

  test("shows error alert for invalid base64 input", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
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

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "!!!invalid!!!" } })
    expect(screen.getByText("Invalid Base64")).toBeTruthy()

    fireEvent.change(encodedInput, { target: { value: "dGVzdA==" } })
    expect(screen.queryByText("Invalid Base64")).toBeNull()
  })

  test("clears error when plain text is changed", () => {
    render(<Base64EncoderDecoderClient messages={messages} />)

    const encodedInput = screen.getByLabelText(
      "Base64 output"
    ) as HTMLTextAreaElement
    fireEvent.change(encodedInput, { target: { value: "!!!invalid!!!" } })
    expect(screen.getByText("Invalid Base64")).toBeTruthy()

    const plainInput = screen.getByLabelText(
      "Plain text"
    ) as HTMLTextAreaElement
    fireEvent.change(plainInput, { target: { value: "new text" } })
    expect(screen.queryByText("Invalid Base64")).toBeNull()
  })
})
