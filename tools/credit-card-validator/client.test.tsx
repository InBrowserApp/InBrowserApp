import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import CreditCardValidatorClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = { meta, ...messagesCatalog }

describe("CreditCardValidatorClient", () => {
  afterEach(cleanup)

  it("renders the empty state before any input", () => {
    render(<CreditCardValidatorClient messages={messages} />)

    expect(screen.getAllByText("Credit Card Number")).toHaveLength(2)
    expect(screen.getAllByText(meta.description).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Validation Result")).toHaveLength(2)
    expect(screen.queryByText("Valid card number")).toBeNull()
  })

  it("formats and validates a Visa card number", () => {
    render(<CreditCardValidatorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "Credit Card Number" }),
      {
        target: { value: "4111111111111111" },
      }
    )

    expect(screen.getAllByText("Valid card number").length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue("4111 1111 1111 1111")).toBeTruthy()
    expect(screen.getByText("Visa")).toBeTruthy()
    expect(screen.getAllByText("Pass")).toHaveLength(2)
  })

  it("shows checksum feedback for an invalid but brand-matched number", () => {
    render(<CreditCardValidatorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "Credit Card Number" }),
      {
        target: { value: "4111111111111112" },
      }
    )

    expect(
      screen.getAllByText("Invalid checksum (Luhn algorithm failed)").length
    ).toBeGreaterThan(0)
    expect(screen.getByDisplayValue("4111 1111 1111 1112")).toBeTruthy()
    expect(screen.getByText("Visa")).toBeTruthy()
  })

  it("shows an unknown brand for unsupported prefixes", () => {
    render(<CreditCardValidatorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: "Credit Card Number" }),
      {
        target: { value: "9111111111111111" },
      }
    )

    expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Fail")).toHaveLength(2)
  })
})
