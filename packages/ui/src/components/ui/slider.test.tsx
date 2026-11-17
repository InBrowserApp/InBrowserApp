import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Slider } from "./slider"

afterEach(cleanup)
describe("slider accessible names", () => {
  it("puts aria-label on the focusable thumb", () => {
    render(<Slider aria-label="Effect size" value={[20]} />)
    expect(
      screen
        .getByRole("slider", { name: "Effect size" })
        .getAttribute("aria-valuenow")
    ).toBe("20")
  })
  it("puts aria-labelledby on each thumb", () => {
    render(
      <>
        <span id="range-label">Selected range</span>
        <Slider aria-labelledby="range-label" defaultValue={[10, 90]} />
      </>
    )
    expect(
      screen.getAllByRole("slider", { name: "Selected range" })
    ).toHaveLength(2)
  })
})
