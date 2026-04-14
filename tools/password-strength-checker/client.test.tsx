import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import PasswordStrengthCheckerClient from "./client"
import type { PasswordStrengthCheckerMessages } from "./client/types"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

const messages = {
  meta: enMeta,
  ...enMessages,
} satisfies PasswordStrengthCheckerMessages

describe("PasswordStrengthCheckerClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(cleanup)

  it("shows the empty state by default", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    expect(screen.getAllByText(messages.empty)).toHaveLength(2)
    expect(screen.queryByRole("progressbar")).toBeNull()
    expect(screen.queryAllByRole("alert")).toHaveLength(0)
  })

  it("toggles password visibility", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    const input = screen.getByLabelText(messages.passwordLabel)
    expect((input as HTMLInputElement).type).toBe("password")

    fireEvent.click(screen.getByRole("button", { name: messages.show }))
    expect((input as HTMLInputElement).type).toBe("text")
    expect(screen.getByRole("button", { name: messages.hide })).toBeTruthy()
  })

  it("does not persist passwords to local storage", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "StoredPass1!" },
    })

    expect(window.localStorage.length).toBe(0)
  })

  it("renders warnings and fast crack times for weak passwords", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "123456" },
    })

    expect(screen.getByText(messages.strength0)).toBeTruthy()
    expect(screen.getByText(messages.warning.common)).toBeTruthy()
    expect(screen.getByText(messages.suggestion["use-longer"])).toBeTruthy()
    expect(screen.getAllByText(messages.durationUnderSecond)).toHaveLength(2)
    expect(screen.getAllByRole("alert")).toHaveLength(2)
  })

  it("renders strong results for complex passwords", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "Str0ng!Passw0rd-Example" },
    })

    expect(screen.getByText(messages.strength4)).toBeTruthy()
    expect(screen.getByText("0-9")).toBeTruthy()
    expect(screen.queryAllByRole("alert")).toHaveLength(0)
  })

  it("hides digit tags when no numbers are present", () => {
    render(<PasswordStrengthCheckerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "Abc!defg" },
    })

    expect(screen.getByText("a-z")).toBeTruthy()
    expect(screen.getByText("A-Z")).toBeTruthy()
    expect(screen.getByText("#@$")).toBeTruthy()
    expect(screen.queryByText("0-9")).toBeNull()
  })
})
