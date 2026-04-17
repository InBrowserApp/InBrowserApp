import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import VatValidatorClient from "./client"

const messages = {
  meta: {
    name: "EU VAT Number Validator",
    description: "Validate EU VAT numbers in the browser.",
  },
  locale: "en",
  vat: "VAT Number",
  placeholder: "e.g. BE0123456749",
  valid: "Valid VAT number",
  invalid: "Invalid VAT number",
  invalidCountryCode: "The first two characters must be an ISO country code.",
  unsupportedCountry: "That country code is not in the EU VAT scheme.",
  invalidFormat: "Number does not match the expected format for this country.",
  invalidChecksum: "Country checksum failed.",
  result: "Validation Result",
  status: "Status",
  country: "Country",
  countryStatus: "Country Status",
  format: "Expected Format",
  formatStatus: "Format Check",
  checksum: "Checksum",
  normalized: "Normalized VAT",
  number: "Number",
  pass: "Pass",
  fail: "Fail",
  notChecked: "Not checked",
  notAvailable: "Not available",
  supported: "Supported",
  unsupported: "Unsupported",
  unknown: "Unknown",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.vat,
  }) as HTMLInputElement
}

describe("VatValidatorClient", () => {
  test("renders the default example and marks it valid", () => {
    render(<VatValidatorClient messages={messages} />)

    expect(getInput().value).toBe("BE 0123.4567.49")
    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
    expect(screen.getAllByText("BE0123456749")[0]).toBeTruthy()
    expect(screen.getAllByText(messages.supported)[0]).toBeTruthy()
  })

  test("flags an invalid country code", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "1B 123" } })

    expect(screen.getByText(messages.invalidCountryCode)).toBeTruthy()
    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
  })

  test("flags an unsupported country", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "US123456789" } })

    expect(screen.getByText(messages.unsupportedCountry)).toBeTruthy()
    expect(screen.getAllByText(messages.unsupported)[0]).toBeTruthy()
  })

  test("flags an invalid format", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "BE123" } })

    expect(screen.getByText(messages.invalidFormat)).toBeTruthy()
  })

  test("flags a failing checksum", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "BE0123456748" } })

    expect(screen.getByText(messages.invalidChecksum)).toBeTruthy()
  })

  test("accepts a country with no checksum rule", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "BG123456789" } })

    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
    expect(screen.getAllByText(messages.notChecked)[0]).toBeTruthy()
  })

  test("hides the result card when the input is cleared", () => {
    render(<VatValidatorClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "" } })

    expect(screen.queryByText(messages.result)).toBeNull()
  })

  test("persists the input between renders via localStorage", () => {
    const { unmount } = render(<VatValidatorClient messages={messages} />)
    fireEvent.change(getInput(), { target: { value: "DE100000008" } })
    unmount()

    render(<VatValidatorClient messages={messages} />)
    expect(getInput().value).toBe("DE100000008")
  })
})
