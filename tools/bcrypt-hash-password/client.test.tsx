import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import BcryptHashPasswordClient from "./client"

const { hashMock } = vi.hoisted(() => ({
  hashMock: vi.fn(async (_password: string, cost: number) => {
    return `$2b$${String(cost).padStart(2, "0")}$abcdefghijklmnopqrstuuM6tV6dQe4hKpiu3wPjz9c2vY1a6b8cC`
  }),
}))

vi.mock("bcrypt-ts", () => ({
  hash: hashMock,
}))

const messages = {
  meta: {
    name: "Bcrypt Hash Password Generator",
    description:
      "Generate bcrypt password hashes locally with configurable cost.",
  },
  inputTitle: "Password and cost",
  inputDescription:
    "Generate a bcrypt hash locally with a fresh random salt each time.",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter the password to hash",
  showPasswordLabel: "Show password",
  hidePasswordLabel: "Hide password",
  costLabel: "Cost factor",
  costDescription: "Higher cost values are slower and harder to brute-force.",
  costInvalidMessage: "Enter a whole number from 4 to 15.",
  generateLabel: "Generate hash",
  generatingLabel: "Generating...",
  resetLabel: "Reset",
  outputTitle: "Bcrypt hash",
  outputDescription:
    "The output includes the bcrypt version, cost, salt, and checksum.",
  emptyTitle: "No hash generated yet",
  emptyDescription:
    "Enter a password and choose a cost factor, then generate a hash.",
  errorTitle: "Could not generate hash",
  copyHashLabel: "Copy hash",
  copiedLabel: "Copied",
  hashValueLabel: "Generated bcrypt hash",
  hashDetailsLabel: "Bcrypt hash details",
  versionLabel: "Version",
  costValueLabel: "Cost",
  saltLabel: "Salt",
  checksumLabel: "Checksum",
  generatedSummary: "Cost {cost}",
  privacyNote: "The password is never saved.",
} as const

beforeEach(() => {
  window.localStorage.clear()
  hashMock.mockClear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("BcryptHashPasswordClient", () => {
  test("renders an empty state until a password is provided", () => {
    render(<BcryptHashPasswordClient messages={messages} />)

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)
  })

  test("generates a bcrypt hash with the selected cost", async () => {
    render(<BcryptHashPasswordClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "correct horse battery staple" },
    })
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.costLabel }),
      {
        target: { value: "10" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(hashMock).toHaveBeenCalledWith("correct horse battery staple", 10)
    })

    expect(
      screen.getByLabelText(messages.hashValueLabel).textContent
    ).toContain("$2b$10$")
    expect(screen.getByText("abcdefghijklmnopqrstuu")).toBeTruthy()
    expect(screen.getByText("M6tV6dQe4hKpiu3wPjz9c2vY1a6b8cC")).toBeTruthy()
    expect(window.localStorage.getItem("tools:bcrypt-hash-password:cost")).toBe(
      "10"
    )
  })

  test("clears a generated hash when input changes", async () => {
    render(<BcryptHashPasswordClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "secret" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByLabelText(messages.hashValueLabel)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "changed" },
    })

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.queryByLabelText(messages.hashValueLabel)).toBeNull()
  })

  test("shows a validation error for invalid cost input", () => {
    render(<BcryptHashPasswordClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "secret" },
    })
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.costLabel }),
      {
        target: { value: "16" },
      }
    )

    expect(screen.getByText(messages.costInvalidMessage)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)
    expect(hashMock).not.toHaveBeenCalled()
  })

  test("restores a valid stored cost but does not store the password", () => {
    window.localStorage.setItem("tools:bcrypt-hash-password:cost", "14")

    render(<BcryptHashPasswordClient messages={messages} />)

    expect(
      screen.getByRole("spinbutton", { name: messages.costLabel })
    ).toHaveProperty("value", "14")
    expect(
      window.localStorage.getItem("tools:bcrypt-hash-password:password")
    ).toBeNull()
  })
})
