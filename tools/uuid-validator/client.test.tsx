import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import UuidValidatorClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = { meta, ...messagesCatalog }

describe("UuidValidatorClient", () => {
  afterEach(cleanup)

  it("renders the empty validation state", () => {
    render(<UuidValidatorClient messages={messages} />)

    expect(screen.getAllByText("UUID Input")).toHaveLength(1)
    expect(screen.getAllByText("Validation Result")).toHaveLength(1)
    expect(screen.getByText("Enter a UUID")).toBeTruthy()
    expect(screen.queryByText("Valid UUID")).toBeNull()
  })

  it("shows detailed results for a valid uppercase UUID", () => {
    render(<UuidValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "UUID" }), {
      target: { value: "6BA7B810-9DAD-11D1-80B4-00C04FD430C8" },
    })

    expect(screen.getAllByText("Valid UUID").length).toBeGreaterThan(0)
    expect(
      screen.getAllByText("6ba7b810-9dad-11d1-80b4-00c04fd430c8").length
    ).toBeGreaterThan(0)
    expect(screen.getByText("Version 1: time-based")).toBeTruthy()
    expect(screen.getByText("RFC 4122 / RFC 9562")).toBeTruthy()
    expect(screen.getByText("6ba7b8109dad11d180b400c04fd430c8")).toBeTruthy()
  })

  it("shows format feedback for malformed UUID text", () => {
    render(<UuidValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "UUID" }), {
      target: { value: "6ba7b8109dad11d180b400c04fd430c8" },
    })

    expect(screen.getAllByText("Invalid UUID").length).toBeGreaterThan(0)
    expect(
      screen.getAllByText(
        "Use the canonical 8-4-4-4-12 hexadecimal format with hyphens."
      ).length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText("Fail").length).toBeGreaterThan(0)
  })

  it("labels nil UUID as a valid special value", () => {
    render(<UuidValidatorClient messages={messages} />)

    fireEvent.change(screen.getByRole("textbox", { name: "UUID" }), {
      target: { value: "00000000-0000-0000-0000-000000000000" },
    })

    expect(screen.getAllByText("Valid UUID").length).toBeGreaterThan(0)
    expect(screen.getByText("Nil UUID")).toBeTruthy()
    expect(screen.getAllByText("Special UUID value").length).toBeGreaterThan(1)
  })
})
