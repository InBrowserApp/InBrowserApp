import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import BcryptHashPasswordVerifierClient from "./client"
import type { BcryptHashPasswordVerifierMessages } from "./client/types"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

const messages = {
  meta: enMeta,
  ...enMessages,
} satisfies BcryptHashPasswordVerifierMessages

const PASSWORD = "correct horse battery staple"
const HASH = "$2b$10$9goojv/JvRhQvBIMI6yJNu9mziiWggh4.5/rpJAIhx66y28hq4Ybe"

describe("BcryptHashPasswordVerifierClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(cleanup)

  it("renders the empty state and keeps verify disabled until a hash exists", () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(
      screen
        .getByRole("button", { name: messages.verifyLabel })
        .hasAttribute("disabled")
    ).toBe(true)
    expect(window.localStorage.length).toBe(0)
  })

  it("toggles visibility for both secret fields", () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    const passwordInput = screen.getByLabelText(messages.passwordLabel)
    const hashInput = screen.getByLabelText(messages.hashLabel)

    expect((passwordInput as HTMLInputElement).type).toBe("password")
    expect((hashInput as HTMLInputElement).type).toBe("password")

    fireEvent.click(screen.getAllByRole("button", { name: messages.show })[0]!)
    fireEvent.click(screen.getAllByRole("button", { name: messages.show })[0]!)

    expect((passwordInput as HTMLInputElement).type).toBe("text")
    expect((hashInput as HTMLInputElement).type).toBe("text")
  })

  it("loads the sample values without verifying automatically", () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.sampleLabel }))

    expect(
      (screen.getByLabelText(messages.passwordLabel) as HTMLInputElement).value
    ).toBe(PASSWORD)
    expect(
      (screen.getByLabelText(messages.hashLabel) as HTMLInputElement).value
    ).toBe(HASH)
    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
  })

  it("shows an invalid hash error", async () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.hashLabel), {
      target: { value: "not a bcrypt hash" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.verifyLabel }))

    expect((await screen.findByRole("alert")).textContent).toContain(
      messages.invalidHashTitle
    )
    expect(
      screen.getByLabelText(messages.hashLabel).getAttribute("aria-invalid")
    ).toBe("true")
  })

  it("verifies a matching bcrypt hash", async () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: PASSWORD },
    })
    fireEvent.change(screen.getByLabelText(messages.hashLabel), {
      target: { value: HASH },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.verifyLabel }))

    await waitFor(() => {
      expect(screen.getAllByText(messages.matchTitle).length).toBeGreaterThan(0)
    })
    expect(screen.getByText("$2b$")).toBeTruthy()
    expect(screen.getByText("10")).toBeTruthy()
  })

  it("shows mismatch and clears stale output on edit", async () => {
    render(<BcryptHashPasswordVerifierClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "wrong" },
    })
    fireEvent.change(screen.getByLabelText(messages.hashLabel), {
      target: { value: HASH },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.verifyLabel }))

    await waitFor(() => {
      expect(
        screen.getAllByText(messages.mismatchTitle).length
      ).toBeGreaterThan(0)
    })

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: PASSWORD },
    })

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
  })
})
