import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import JsonPatchApplierClient from "./client"
import messages from "./messages/en.json"

const original = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.originalLabel,
  })
const patch = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.patchLabel,
  })
const button = (name: string) =>
  screen.getByRole<HTMLButtonElement>("button", { name })
const apply = () => fireEvent.click(button(messages.applyLabel))
const change = (element: HTMLTextAreaElement, value: string) =>
  fireEvent.change(element, { target: { value } })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("applies the example, copies the updated JSON, and clears stale previews on edit", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  render(<JsonPatchApplierClient messages={messages} />)
  const status = screen.getByRole("status")
  expect(status.textContent).toBe(messages.resultHint)
  expect(button(messages.applyLabel).disabled).toBe(true)
  expect(button(messages.clearLabel).disabled).toBe(true)
  fireEvent.click(button(messages.sampleLabel))
  apply()

  expect(screen.getByRole("status")).toBe(status)
  expect(status.textContent).toBe(messages.resultLabel)
  const output = screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.resultLabel,
  })
  expect(output.readOnly).toBe(true)
  expect(JSON.parse(output.value)).toEqual({
    status: "published",
    tags: ["api", "release"],
  })
  fireEvent.click(button(messages.copyLabel))
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(output.value))

  change(patch(), "[]")
  expect(
    screen.queryByRole("textbox", { name: messages.resultLabel })
  ).toBeNull()
  expect(screen.queryByRole("button", { name: messages.copyLabel })).toBeNull()
  fireEvent.click(button(messages.clearLabel))
  expect(original().value).toBe("")
  expect(patch().value).toBe("")
})

test("points at the failed operation and lets the user retry without losing inputs", () => {
  render(<JsonPatchApplierClient messages={messages} />)
  change(original(), '{"a":1}')
  const invalid =
    '[{"op":"add","path":"/b","value":2},{"op":"move","from":"/missing","path":""},{"op":"remove","path":"/a"}]'
  change(patch(), invalid)
  apply()
  const alert = screen.getByRole("alert")
  expect(alert.textContent).toContain("Operation 2 failed")
  expect(alert.textContent).toContain('"move"')
  expect(alert.textContent).toContain('""')
  expect(alert.textContent).toContain('"/missing"')
  expect(alert.textContent).toContain(messages.missingFrom)
  expect(alert.textContent).toContain(messages.stoppedHint)
  expect(
    screen.queryByRole("textbox", { name: messages.resultLabel })
  ).toBeNull()
  expect(patch().value).toBe(invalid)
  expect(original().value).toBe('{"a":1}')

  change(
    patch(),
    invalid
      .replace("/missing", "/b")
      .replace(',{"op":"remove","path":"/a"}', "")
  )
  apply()
  expect(screen.queryByRole("alert")).toBeNull()
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.resultLabel,
    }).value
  ).toBe("2")
  change(patch(), '[{"op":"remove","path":""}]')
  apply()
  expect(screen.getByRole("status").textContent).toBe(messages.documentRemoved)
})

test("associates parsing and patch shape errors with the relevant input", () => {
  render(<JsonPatchApplierClient messages={messages} />)
  change(original(), "{")
  change(patch(), "{}")
  apply()
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidOriginal)
  expect(original().getAttribute("aria-invalid")).toBe("true")
  change(original(), "{}")
  apply()
  expect(screen.getByRole("alert").textContent).toBe(messages.patchNotArray)
  expect(patch().getAttribute("aria-invalid")).toBe("true")
  change(patch(), "[")
  apply()
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidPatch)
})
