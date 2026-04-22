import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import VinValidatorClient from "./client"

const messages = {
  meta: {
    name: "VIN Validator",
    description: "Validate VINs with length, character, and check digit rules",
  },
  vin: "VIN (Vehicle Identification Number)",
  placeholder: "Enter VIN",
  valid: "Valid VIN",
  invalid: "Invalid VIN",
  invalidLength: "VIN must be 17 characters",
  invalidCharacters: "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9",
  invalidChecksum: "Check digit does not match",
  result: "Validation Result",
  status: "Status",
  length: "Length",
  lengthCheck: "Length Check",
  characterCheck: "Character Check",
  checkDigit: "Check Digit",
  expected: "Expected",
  actual: "Actual",
  normalized: "Normalized VIN",
  pass: "Pass",
  fail: "Fail",
  notAvailable: "Not available",
  allowedCharacters: "A-H, J-N, P, R-Z, 0-9",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.vin,
  }) as HTMLInputElement
}

describe("VinValidatorClient", () => {
  test("renders the default example and shows valid result", () => {
    render(<VinValidatorClient messages={messages} />)

    expect(getInput().value).toBe("1M8GDM9AXKP042788")
    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
  })

  test("shows length feedback for incomplete VINs", () => {
    render(<VinValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "123" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getByText(messages.invalidLength)).toBeTruthy()
  })

  test("shows character feedback for invalid characters", () => {
    render(<VinValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "1IOGDM9AXKP042788" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getByText(messages.invalidCharacters)).toBeTruthy()
  })

  test("shows checksum feedback for check digit mismatch", () => {
    render(<VinValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "1M8GDM9A1KP042788" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getByText(messages.invalidChecksum)).toBeTruthy()
    expect(screen.getByText("Expected: X")).toBeTruthy()
    expect(screen.getByText("Actual: 1")).toBeTruthy()
  })

  test("hides result card when input is empty", () => {
    render(<VinValidatorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "" },
    })

    expect(screen.queryByText(messages.result)).toBeNull()
  })

  test("restores and persists the last VIN from localStorage", () => {
    window.localStorage.setItem("tools:vin-validator:vin", "1M8GDM9AXKP042788")

    render(<VinValidatorClient messages={messages} />)

    expect(getInput().value).toBe("1M8GDM9AXKP042788")
    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()

    fireEvent.change(getInput(), {
      target: { value: "1M8GDM9A1KP042788" },
    })

    expect(window.localStorage.getItem("tools:vin-validator:vin")).toBe(
      "1M8GDM9A1KP042788"
    )
  })
})
