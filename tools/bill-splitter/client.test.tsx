import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import BillSplitter from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

function enter(label: string, value: string) {
  fireEvent.change(screen.getByRole("textbox", { name: label }), {
    target: { value },
  })
}

function select(label: string) {
  fireEvent.click(screen.getByRole("radio", { name: label }))
}

function shares() {
  return within(screen.getByRole("list"))
    .getAllByRole("listitem")
    .map((item) => Array.from(item.children, (child) => child.textContent))
}

it("validates the inputs and divides a named bill equally", () => {
  render(<BillSplitter lang="en" messages={messages} />)
  expect(screen.getByText(messages.empty)).toBeTruthy()
  expect(screen.getByRole("button", { name: messages.copy })).toHaveProperty(
    "disabled",
    true
  )
  enter(messages.total, "-1")
  expect(screen.getByText(messages.totalError)).toBeTruthy()
  enter(messages.total, "100")
  enter(messages.people, "1")
  expect(screen.getByText(messages.peopleError)).toBeTruthy()
  expect(screen.getByText(messages.unavailable)).toBeTruthy()
  enter(messages.people, "3")
  enter("Names (optional) · Person 1", "Alex")
  expect(shares()).toEqual([
    ["Alex", "33.34"],
    ["Person 2", "33.33"],
    ["Person 3", "33.33"],
  ])
})

it("uses separate inputs for fixed amounts and weights and preserves edits", () => {
  render(<BillSplitter lang="en" messages={messages} />)
  enter(messages.total, "100")
  select(messages.fixed)
  expect(screen.getByText(messages.fixedHint)).toBeTruthy()
  enter("Fixed amount · Person 1", "-5")
  expect(screen.getByText(messages.fixedError)).toBeTruthy()
  expect(
    screen
      .getByRole("textbox", { name: "Fixed amount · Person 1" })
      .getAttribute("aria-invalid")
  ).toBe("true")
  enter("Fixed amount · Person 1", "110")
  expect(screen.getByText(messages.fixedOver)).toBeTruthy()
  enter("Fixed amount · Person 1", "20")
  expect(shares().map(([, amount]) => amount)).toEqual([
    "20.00",
    "40.00",
    "40.00",
  ])

  select(messages.weighted)
  expect(screen.getByText(messages.weightHint)).toBeTruthy()
  enter("Ratio weight · Person 1", "2")
  expect(shares().map(([, amount]) => amount)).toEqual([
    "50.00",
    "25.00",
    "25.00",
  ])
  select(messages.fixed)
  expect(shares().map(([, amount]) => amount)).toEqual([
    "20.00",
    "40.00",
    "40.00",
  ])
})

it("copies the current names, rounded shares and total together", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard")
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })

  try {
    render(<BillSplitter lang="en" messages={messages} />)
    enter(messages.total, "100")
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    expect(await screen.findByText(messages.copied)).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith(
      "Person 1\t33.34\nPerson 2\t33.33\nPerson 3\t33.33\nBill total\t100.00"
    )
  } finally {
    if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor)
    else Reflect.deleteProperty(navigator, "clipboard")
  }
})
