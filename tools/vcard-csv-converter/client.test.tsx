import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

test("retains each conversion draft and removes stale output when the source changes", () => {
  render(<Client language="en" messages={messages} />)
  const button = (name: string) => screen.getByRole("button", { name })
  const source = () =>
    screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.input })

  fireEvent.click(button(messages.sample))
  const vcard = source().value
  fireEvent.click(button(messages.convert))
  expect(
    within(screen.getByRole("table")).getByText("Taylor Morgan")
  ).toBeTruthy()

  fireEvent.click(button(messages.reverse))
  expect(source().value).toBe("")
  fireEvent.change(source(), {
    target: { value: "Name,Email\n,jane@example.com" },
  })
  fireEvent.click(button(messages.convert))
  expect(screen.getByRole("alert").textContent).toBe(
    "Check the values in CSV row 2."
  )

  fireEvent.click(button(messages.forward))
  expect(source().value).toBe(vcard)
  expect(screen.getByRole("table")).toBeTruthy()
  fireEvent.change(source(), { target: { value: "" } })
  expect(screen.queryByRole("table")).toBeNull()
})
