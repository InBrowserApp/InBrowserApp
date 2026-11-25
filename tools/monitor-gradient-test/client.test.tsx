import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import MonitorGradientTest from "./client"
import messages from "./messages/en.json"

function mount() {
  return render(<MonitorGradientTest language="en" messages={messages} />)
}

function choose(
  name: string,
  scope: typeof screen | ReturnType<typeof within> = screen
) {
  fireEvent.click(scope.getByRole("button", { name }))
}

afterEach(cleanup)

describe("MonitorGradientTest", () => {
  it("shows both the smooth grayscale and 16 distinct steps", () => {
    mount()
    expect(
      screen
        .getByRole("button", { name: messages.grayscale })
        .getAttribute("aria-pressed")
    ).toBe("true")
    const smooth = screen.getByRole("img", { name: messages.smoothGrayscale })
    expect(smooth.style.backgroundImage).toContain("#000000, #ffffff")
    const steps = screen.getByRole("img", { name: messages.grayscaleSteps })
    const values = [...steps.querySelectorAll("span")].map(
      (step) => step.style.backgroundColor
    )
    expect(values).toHaveLength(16)
    expect(new Set(values).size).toBe(16)
    expect(values[0]).toContain("0 0 0")
    expect(values.at(-1)).toContain("255 255 255")
  })

  it("displays separate red, green and blue ramps with the selected hint", () => {
    mount()
    choose(messages.rgb)
    expect(
      screen.queryByRole("img", { name: messages.smoothGrayscale })
    ).toBeNull()
    const red = screen.getByRole("img", { name: messages.red })
    const green = screen.getByRole("img", { name: messages.green })
    const blue = screen.getByRole("img", { name: messages.blue })
    expect(red.style.backgroundImage).toContain("#000000, #ff0000")
    expect(green.style.backgroundImage).toContain("#000000, #00ff00")
    expect(blue.style.backgroundImage).toContain("#000000, #0000ff")
    expect(
      screen.getByText(messages.rgbHint, { selector: "section > p" })
    ).toBeTruthy()
  })

  it("exposes exact near-black and near-white level numbers", () => {
    mount()
    choose(messages.black)
    let panel = screen.getByRole("group", { name: messages.black })
    expect(
      [...panel.querySelectorAll("[aria-hidden] span")].map(
        (patch) => patch.style.backgroundColor
      )
    ).toEqual(
      [0, 4, 8, 12, 16, 20, 24, 32].map(
        (value) => `rgb(${value} ${value} ${value})`
      )
    )
    expect(within(panel).getByText("32")).toBeTruthy()
    choose(messages.white)
    panel = screen.getByRole("group", { name: messages.white })
    expect(
      [...panel.querySelectorAll("[aria-hidden] span")].map(
        (patch) => patch.style.backgroundColor
      )
    ).toEqual(
      [223, 231, 235, 239, 243, 247, 251, 255].map(
        (value) => `rgb(${value} ${value} ${value})`
      )
    )
    expect(within(panel).getByText("255")).toBeTruthy()
  })

  it("keeps a pattern selected in the fullscreen fallback when returning", () => {
    const { container } = mount()
    choose(messages.black)
    choose(messages.fullscreen)
    const dialog = container.querySelector("dialog")!
    const fullscreen = within(dialog)
    expect(dialog.open).toBe(true)
    expect(
      fullscreen
        .getByRole("button", { name: messages.black })
        .getAttribute("aria-pressed")
    ).toBe("true")
    choose(messages.white, fullscreen)
    expect(fullscreen.getByRole("group", { name: messages.white })).toBeTruthy()
    choose(messages.exit, fullscreen)
    expect(dialog.open).toBe(false)
    expect(
      screen
        .getByRole("button", { name: messages.white })
        .getAttribute("aria-pressed")
    ).toBe("true")
  })
})
