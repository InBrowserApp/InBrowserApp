import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import ImeiValidatorClient from "./client"
import type { IMEIValidatorMessages } from "./client/types"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

const messages = {
  meta: enMeta,
  ...enMessages,
} satisfies IMEIValidatorMessages

describe("ImeiValidatorClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(cleanup)

  it("shows the empty state by default", () => {
    render(<ImeiValidatorClient messages={messages} />)

    expect(screen.getAllByText(messages.result)).toHaveLength(2)
    expect(screen.getAllByText(messages.meta.description)).toHaveLength(3)
    expect(screen.queryAllByRole("alert")).toHaveLength(0)
  })

  it("renders valid results for a known IMEI", () => {
    render(<ImeiValidatorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.imei), {
      target: { value: "490154203237518" },
    })

    expect(screen.getAllByText(messages.valid)[0]).toBeTruthy()
    expect(screen.getByText(messages.normalized)).toBeTruthy()
    expect(screen.getByText(messages.expectedCheckDigit)).toBeTruthy()
    expect(screen.getByText(messages.actualCheckDigit)).toBeTruthy()
  })

  it("shows length feedback for incomplete IMEIs", () => {
    render(<ImeiValidatorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.imei), {
      target: { value: "49015420323751" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getAllByText(messages.invalidLength)).toHaveLength(3)
  })

  it("shows format feedback for non-digit input", () => {
    render(<ImeiValidatorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.imei), {
      target: { value: "4901542032375A8" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getAllByText(messages.invalidFormat)).toHaveLength(3)
  })

  it("shows checksum feedback for mismatched check digits", () => {
    render(<ImeiValidatorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.imei), {
      target: { value: "490154203237519" },
    })

    expect(screen.getAllByText(messages.invalid)[0]).toBeTruthy()
    expect(screen.getAllByText(messages.invalidChecksum)).toHaveLength(3)
  })

  it("does not persist IMEIs to local storage", () => {
    render(<ImeiValidatorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.imei), {
      target: { value: "490154203237518" },
    })

    expect(window.localStorage.length).toBe(0)
  })
})
