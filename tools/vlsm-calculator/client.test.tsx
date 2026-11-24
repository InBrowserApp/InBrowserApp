import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function renderCalculator() {
  render(<Client messages={messages} language="en" />)
}

function change(element: HTMLElement, value: string) {
  fireEvent.change(element, { target: { value } })
}

function click(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }))
}

test("loads the sample, shows the plan and copies the allocated and free blocks", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  renderCalculator()
  click(messages.example)

  expect(screen.getByRole("heading", { name: messages.result })).toBeTruthy()
  expect(screen.getByText("192.168.10.224/31")).toBeTruthy()
  expect(screen.getByText("192.168.10.240/28")).toBeTruthy()
  click(messages.copy)
  expect(await screen.findByText(messages.copied)).toBeTruthy()
  expect(writeText).toHaveBeenCalledWith(
    expect.stringContaining("192.168.10.224/31")
  )
  expect(writeText).toHaveBeenCalledWith(
    expect.stringContaining("192.168.10.240/28")
  )
})

test("focuses the invalid field, preserves the requirements, and clears outdated results", () => {
  renderCalculator()
  const parent = screen.getByLabelText(messages.parent)
  click(messages.calculate)
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidParent)
  expect(document.activeElement).toBe(parent)

  change(parent, " 203.0.113.9/24 ")
  click(messages.calculate)
  const hosts = screen.getByLabelText(messages.hosts)
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidHosts)
  expect(document.activeElement).toBe(hosts)

  change(hosts, "30")
  click(messages.add)
  const names = screen.getAllByLabelText(messages.name)
  expect(document.activeElement).toBe(names[1])
  change(names[1]!, "Router")
  change(screen.getAllByLabelText(messages.type)[1]!, "singleHost")
  click(messages.calculate)
  expect(screen.getByText("203.0.113.32/32")).toBeTruthy()

  click(`${messages.remove} 2`)
  expect(document.activeElement).toBe(names[0])
  expect(screen.queryByRole("heading", { name: messages.result })).toBeNull()
  expect(screen.getAllByLabelText(messages.hosts)).toHaveLength(1)
  change(parent, "203.0.113.0/28")
  click(messages.calculate)
  expect(screen.getByRole("alert").textContent).toBe(messages.doesNotFit)
  expect((hosts as HTMLInputElement).value).toBe("30")

  change(parent, "203.0.113.0/27")
  click(messages.calculate)
  expect(screen.getByText(messages.none)).toBeTruthy()
})

test("keeps unnamed subnet identities when sorting by allocation size", () => {
  renderCalculator()
  change(screen.getByLabelText(messages.parent), "203.0.113.0/24")
  click(messages.add)
  const [first, second] = screen.getAllByLabelText(messages.hosts)
  change(first!, "10")
  change(second!, "50")
  click(messages.calculate)
  expect(screen.getByText("Subnet 2").closest("li")?.textContent).toContain(
    "203.0.113.0/26"
  )
  expect(screen.getByText("Subnet 1").closest("li")?.textContent).toContain(
    "203.0.113.64/28"
  )
})
