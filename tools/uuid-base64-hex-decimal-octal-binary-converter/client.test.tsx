import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidBaseConverterClient from "./client"

const messages = {
  meta: {
    name: "UUID Base64 Hex Decimal Octal Binary Converter",
    description:
      "Convert UUIDs to and from Base64, hexadecimal, decimal, octal, and 128-bit binary values in your browser.",
  },
  actionsLabel: "Converter actions",
  generateUuidLabel: "Generate UUID",
  loadSampleLabel: "Load sample",
  clearAllLabel: "Clear all",
  copiedLabel: "Copied",
  invalidValueTitle: "Invalid value",
  invalidValueDescription:
    "Fix the highlighted field before copying converted values.",
  cryptoUnavailableTitle: "Secure random UUID unavailable",
  cryptoUnavailableDescription:
    "This browser does not expose Web Crypto random values. Load the sample or paste a UUID instead.",
  formats: {
    uuid: {
      label: "UUID",
      description: "Canonical UUID text.",
      placeholder: "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f",
      copyLabel: "Copy UUID",
      invalidMessage: "Enter a UUID.",
    },
    base64: {
      label: "Base64",
      description: "Standard padded Base64.",
      placeholder: "we1n8DS9EfCz/gLXHoQfTw==",
      copyLabel: "Copy Base64",
      invalidMessage: "Enter Base64.",
    },
    hex: {
      label: "Hexadecimal",
      description: "The UUID as 32 lowercase hexadecimal digits.",
      placeholder: "c1ed67f034bd11f0b3fe02d71e841f4f",
      copyLabel: "Copy hex",
      invalidMessage: "Enter exactly 32 hexadecimal digits.",
    },
    decimal: {
      label: "Decimal",
      description: "Unsigned 128-bit integer in base 10.",
      placeholder: "257773685661231489374926881343358115663",
      copyLabel: "Copy decimal",
      invalidMessage: "Enter a 128-bit decimal integer.",
    },
    octal: {
      label: "Octal",
      description: "Unsigned 128-bit integer in base 8.",
      placeholder: "3017326376015136421741317760055343641017517",
      copyLabel: "Copy octal",
      invalidMessage: "Enter octal digits.",
    },
    binary: {
      label: "Binary",
      description: "Fixed-width 128-bit binary.",
      placeholder:
        "11000001111011010110011111110000001101001011110100010001111100001011001111111110000000101101011100011110100001000001111101001111",
      copyLabel: "Copy binary",
      invalidMessage: "Enter binary digits.",
    },
  },
} as const

const STORAGE_KEY = "tools:uuid-base64-hex-decimal-octal-binary-converter:uuid"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function renderClient() {
  render(<UuidBaseConverterClient messages={messages} />)
}

function getTextbox(name: string) {
  return screen.getByRole("textbox", { name }) as HTMLInputElement
}

describe("UuidBaseConverterClient", () => {
  test("renders the sample UUID and all derived formats", () => {
    renderClient()

    expect(getTextbox("UUID").value).toBe(
      "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
    )
    expect(getTextbox("Base64").value).toBe("we1n8DS9EfCz/gLXHoQfTw==")
    expect(getTextbox("Hexadecimal").value).toBe(
      "c1ed67f034bd11f0b3fe02d71e841f4f"
    )
    expect(screen.getByRole("button", { name: "Copy UUID" })).toHaveProperty(
      "disabled",
      false
    )
  })

  test("updates every field from edited hexadecimal input", () => {
    renderClient()

    fireEvent.change(getTextbox("Hexadecimal"), {
      target: { value: "550E8400E29B41D4A716446655440000" },
    })

    expect(getTextbox("UUID").value).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
    expect(getTextbox("Base64").value).toBe("VQ6EAOKbQdSnFkRmVUQAAA==")
    expect(getTextbox("Decimal").value).toBe(
      "113059749145936325402354257176981405696"
    )
  })

  test("shows an invalid state and disables copy actions", () => {
    renderClient()

    fireEvent.change(getTextbox("Decimal"), {
      target: { value: "340282366920938463463374607431768211456" },
    })

    expect(screen.getByText(messages.invalidValueTitle)).toBeTruthy()
    expect(
      screen.getByText(messages.formats.decimal.invalidMessage)
    ).toBeTruthy()
    expect(getTextbox("Decimal").getAttribute("aria-invalid")).toBe("true")
    expect(getTextbox("UUID").value).toBe("")
    expect(
      screen.getByRole("button", { name: messages.formats.decimal.copyLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears all values and restores the sample", () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    expect(getTextbox("UUID").value).toBe("")
    expect(getTextbox("Base64").value).toBe("")

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    expect(getTextbox("UUID").value).toBe(
      "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
    )
  })

  test("generates a UUID using Web Crypto", () => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn(() => "550e8400-e29b-41d4-a716-446655440000"),
      getRandomValues: vi.fn(),
    })

    renderClient()
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateUuidLabel })
    )

    expect(getTextbox("UUID").value).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
  })

  test("reports random generation failures without clearing current values", () => {
    vi.stubGlobal("crypto", {})

    renderClient()
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateUuidLabel })
    )

    expect(screen.getByText(messages.cryptoUnavailableTitle)).toBeTruthy()
    expect(getTextbox("UUID").value).toBe(
      "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
    )
  })

  test("restores the last valid UUID from localStorage", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      "550e8400-e29b-41d4-a716-446655440000"
    )

    renderClient()

    expect(getTextbox("UUID").value).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    )
  })
})
