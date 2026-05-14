import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import JwtDecoderVerifierClient from "./client"
import { SAMPLE_SECRET, SAMPLE_TOKEN } from "./client/constants"
import meta from "./meta/en.json"
import messagesCatalog from "./messages/en.json"

const messages = { meta, ...messagesCatalog } as const

afterEach(() => {
  cleanup()
})

describe("JwtDecoderVerifierClient", () => {
  test("renders the sample token and verifies it", async () => {
    render(<JwtDecoderVerifierClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.token.label) as HTMLTextAreaElement).value
    ).toBe(SAMPLE_TOKEN)
    expect(
      (
        screen.getByLabelText(
          messages.verification.keyLabel
        ) as HTMLTextAreaElement
      ).value
    ).toBe(SAMPLE_SECRET)
    expect(screen.getByText(messages.decoded.headerTitle)).toBeTruthy()
    expect(screen.getByText(messages.decoded.payloadTitle)).toBeTruthy()
    expect(screen.getByDisplayValue(/"sub": "user_123"/u)).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByText(messages.verification.verifiedTitle)).toBeTruthy()
    })
  })

  test("shows decode errors and clears the token", () => {
    render(<JwtDecoderVerifierClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.token.label), {
      target: { value: "not-a-jwt" },
    })

    expect(screen.getByRole("alert").textContent).toContain(
      messages.decodeErrors["invalid-segment-count"]
    )

    fireEvent.click(screen.getByRole("button", { name: messages.token.clear }))

    expect(screen.getByText(messages.decoded.emptyTitle)).toBeTruthy()
  })

  test("reports signature failures and restores the sample", async () => {
    render(<JwtDecoderVerifierClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.verification.keyLabel), {
      target: { value: "wrong-secret" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.verification.failedTitle)).toBeTruthy()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.token.useSample })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.verification.verifiedTitle)).toBeTruthy()
    })
    expect(
      (
        screen.getByLabelText(
          messages.verification.keyLabel
        ) as HTMLTextAreaElement
      ).value
    ).toBe(SAMPLE_SECRET)
  })
})
