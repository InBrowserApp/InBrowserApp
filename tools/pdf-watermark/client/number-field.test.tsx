import { useState } from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import { NumberField } from "./number-field"

afterEach(cleanup)
function Field({ min = 10, initial = 50 }: { min?: number; initial?: number }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <NumberField
        label="Width"
        value={value}
        min={min}
        max={100}
        unit="%"
        onChange={setValue}
      />
      <output data-testid="value">{value}</output>
    </>
  )
}

test("allows intermediate numeric drafts and clamps on blur", () => {
  render(<Field />)
  const input = screen.getByRole("spinbutton", {
    name: "Width",
  }) as HTMLInputElement
  fireEvent.change(input, { target: { value: "2" } })
  expect(input.value).toBe("2")
  expect(screen.getByTestId("value").textContent).toBe("50")
  fireEvent.change(input, { target: { value: "25" } })
  expect(screen.getByTestId("value").textContent).toBe("25")
  fireEvent.change(input, { target: { value: "200" } })
  fireEvent.blur(input)
  expect(input.value).toBe("100")
  fireEvent.change(input, { target: { value: "" } })
  fireEvent.blur(input)
  expect(input.value).toBe("100")
})

test("accepts negative angles and keeps arrow-key slider updates synchronized", () => {
  render(<Field min={-180} initial={0} />)
  const input = screen.getByRole("spinbutton", {
    name: "Width",
  }) as HTMLInputElement
  fireEvent.change(input, { target: { value: "-35" } })
  expect(screen.getByTestId("value").textContent).toBe("-35")
  fireEvent.keyDown(screen.getByRole("slider", { name: "Width" }), {
    key: "ArrowRight",
  })
  expect(input.value).toBe("-34")
})
