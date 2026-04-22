import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import EmailValidatorClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = { meta, ...messagesCatalog }

describe("EmailValidatorClient", () => {
  afterEach(cleanup)

  it("renders the empty results state before input", () => {
    render(<EmailValidatorClient messages={messages} />)

    expect(screen.getAllByText("Email Address")).toHaveLength(2)
    expect(screen.getAllByText(meta.description).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Validation Result")).toHaveLength(2)
    expect(screen.queryByText("Valid email address")).toBeNull()
  })

  it("validates and normalizes a valid email address", () => {
    render(<EmailValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Email Address" }), {
      target: { value: "User.Name+tag@Example.COM" },
    })

    expect(screen.getAllByText("Valid email address").length).toBeGreaterThan(0)
    expect(screen.getByText("User.Name+tag@example.com")).toBeTruthy()
    expect(screen.getByText("User.Name+tag")).toBeTruthy()
    expect(screen.getByText("Example.COM")).toBeTruthy()
    expect(screen.getAllByText("Pass").length).toBe(4)
  })

  it("shows at-sign feedback for malformed addresses", () => {
    render(<EmailValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Email Address" }), {
      target: { value: "invalid.example.com" },
    })

    expect(
      screen.getAllByText("Email must contain a single @").length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText("Invalid email address").length).toBeGreaterThan(
      0
    )
    expect(screen.getAllByText("Not available").length).toBeGreaterThan(0)
  })

  it("shows local-part feedback for repeated dots", () => {
    render(<EmailValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Email Address" }), {
      target: { value: "john..doe@example.com" },
    })

    expect(screen.getAllByText("Local part is invalid").length).toBeGreaterThan(
      0
    )
    expect(screen.getByText("john..doe")).toBeTruthy()
    expect(screen.getByText("example.com")).toBeTruthy()
  })

  it("shows top-level-domain feedback when the domain has no TLD", () => {
    render(<EmailValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "Email Address" }), {
      target: { value: "user@mailserver" },
    })

    expect(
      screen.getAllByText("Domain must include a top-level domain").length
    ).toBeGreaterThan(0)
    expect(screen.getByText("mailserver")).toBeTruthy()
  })
})
