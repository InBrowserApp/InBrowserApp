import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import IsbnValidatorClient from "./client"

const messages = {
  meta: {
    name: "ISBN Validator",
    description: "Validate ISBN numbers in the browser.",
  },
  isbn: "ISBN",
  placeholder: "Enter ISBN-10 or ISBN-13",
  valid: "Valid ISBN",
  invalid: "Invalid ISBN",
  invalidChecksum: "Invalid checksum",
  invalidLength: "ISBN must be 10 or 13 digits",
  invalidFormat: "Invalid ISBN format",
  result: "Validation Result",
  type: "ISBN Type",
  normalized: "Normalized ISBN",
  checksum: "Checksum",
  checkDigit: "Check Digit",
  expected: "Expected",
  actual: "Actual",
  pass: "Pass",
  fail: "Fail",
  unknown: "Unknown",
  isbn10: "ISBN-10",
  isbn13: "ISBN-13",
  prefix: "Prefix",
  digits: "Total Digits",
  notAvailable: "Not available",
  notConvertible: "Not convertible",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.isbn,
  }) as HTMLInputElement
}

describe("IsbnValidatorClient", () => {
  test("renders the default example and validation result", () => {
    render(<IsbnValidatorClient messages={messages} />)

    expect(getInput().value).toBe("978-0-306-40615-7")
    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
    expect(screen.getAllByText("ISBN-13")[0]).toBeTruthy()
    expect(screen.getAllByText("9780306406157")[0]).toBeTruthy()
  })

  test("shows length feedback for incomplete values", () => {
    render(<IsbnValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "1234567" },
    })

    expect(screen.getByText(messages.invalid)).toBeTruthy()
    expect(screen.getByText(messages.invalidLength)).toBeTruthy()
    expect(screen.getByText(messages.unknown)).toBeTruthy()
  })

  test("shows format feedback for malformed ISBN-10 values", () => {
    render(<IsbnValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "12345678X9" },
    })

    expect(screen.getByText(messages.invalidFormat)).toBeTruthy()
    expect(screen.getAllByText(messages.notAvailable)[0]).toBeTruthy()
  })

  test("shows checksum feedback and conversion details", () => {
    render(<IsbnValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "9780306406158" },
    })

    expect(screen.getByText(messages.invalidChecksum)).toBeTruthy()
    expect(screen.getByText(messages.fail)).toBeTruthy()
    expect(screen.getByText("Expected: 7")).toBeTruthy()
    expect(screen.getByText("Actual: 8")).toBeTruthy()
  })

  test("shows 979-prefixed values as not convertible to ISBN-10", () => {
    render(<IsbnValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "9790306406156" },
    })

    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
    expect(screen.getByText(messages.notConvertible)).toBeTruthy()
    expect(screen.getByText("979")).toBeTruthy()
  })

  test("restores and persists the last ISBN from localStorage", () => {
    window.localStorage.setItem("tools:isbn-validator:isbn", "0306406152")

    render(<IsbnValidatorClient messages={messages} />)

    expect(getInput().value).toBe("0306406152")
    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()

    fireEvent.change(getInput(), {
      target: { value: "9780306406157" },
    })

    expect(window.localStorage.getItem("tools:isbn-validator:isbn")).toBe(
      "9780306406157"
    )
  })
})
