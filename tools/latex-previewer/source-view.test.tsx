import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import { SourceView } from "./source-view"
import m from "./messages/en.json"
afterEach(cleanup)
test("browses and jumps through the full source without mounting it all at once", () => {
  render(
    <SourceView
      source={"a".repeat(65_536) + "b".repeat(65_536) + "final section"}
      messages={m}
    />
  )
  const text = () => screen.getByRole("textbox") as HTMLTextAreaElement
  expect(text().value).toHaveLength(65_536)
  expect(text().readOnly).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.nextSourceSection }))
  expect(text().value.startsWith("b")).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.previousSourceSection }))
  expect(text().value.startsWith("a")).toBe(true)
  const number = screen.getByLabelText(m.sourceSection)
  fireEvent.change(number, { target: { value: "3" } })
  fireEvent.keyDown(number, { key: "Enter" })
  expect(text().value).toBe("final section")
  expect(
    (
      screen.getByRole("button", {
        name: m.nextSourceSection,
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true)
})
