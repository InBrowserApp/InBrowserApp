import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

function renderChecker() {
  render(<Client messages={messages} language="en" />)
}

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }))
const input = (value: string) =>
  fireEvent.change(screen.getByLabelText(messages.value), { target: { value } })

test("loads a usable example and clears old results while editing", () => {
  renderChecker()
  expect(
    (screen.getByRole("button", { name: messages.check }) as HTMLButtonElement)
      .disabled
  ).toBeTruthy()
  click(messages.example)
  expect(screen.getByRole("heading", { name: messages.valid })).toBeTruthy()
  expect(screen.getByText("include:_spf.example.com")).toBeTruthy()
  expect(screen.getByText(messages.lookupHelp)).toBeTruthy()
  input("v=spf1 -all")
  expect(screen.queryByRole("heading", { name: messages.valid })).toBeNull()
  click(messages.check)
  expect(screen.getByText("0")).toBeTruthy()
})

test("shows error guidance and retains valid terms for correction", () => {
  renderChecker()
  input("v=spf1 ip4:192.0.2.1/99 -all")
  click(messages.check)
  expect(screen.getByRole("heading", { name: messages.invalid })).toBeTruthy()
  expect(
    screen.getByLabelText(messages.value).getAttribute("aria-invalid")
  ).toBe("true")
  expect(screen.getByText("ip4:192.0.2.1/99")).toBeTruthy()
  expect(screen.getByText(messages.address)).toBeTruthy()
  expect(screen.getByText("-all")).toBeTruthy()
  input("spf2")
  click(messages.check)
  expect(screen.getByText(messages.version)).toBeTruthy()
})

test("explains ignored modifiers and valid preferred corrections", () => {
  renderChecker()
  input("v=spf1 ptr x=custom redirect=example.org -all")
  click(messages.check)
  expect(screen.getByText(messages.extension)).toBeTruthy()
  expect(screen.getByText(messages.modifier)).toBeTruthy()
  expect(screen.getByText(messages.deprecatedPtr)).toBeTruthy()
  expect(screen.getByText(messages.unreachable)).toBeTruthy()
})
