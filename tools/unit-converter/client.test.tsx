import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import UnitConverterClient from "./client"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

const messages = { meta: enMeta, ...enMessages }

function fromInput() {
  return screen.getByPlaceholderText(
    messages.valuePlaceholder
  ) as HTMLInputElement
}

function toInput() {
  return screen.getByLabelText(messages.toLabel) as HTMLInputElement
}

function selectOption(comboboxName: string, optionName: string) {
  fireEvent.click(screen.getByRole("combobox", { name: comboboxName }))
  fireEvent.click(screen.getByRole("option", { name: optionName }))
}

describe("UnitConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test("renders the default sample (1 m → ft)", () => {
    render(<UnitConverterClient messages={messages} />)

    expect(fromInput().value).toBe("1")
    expect(toInput().value).toBe("3.28084")
  })

  test("recomputes the target when the value changes", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.change(fromInput(), { target: { value: "2" } })

    await waitFor(() => {
      expect(toInput().value).toBe("6.56168")
    })
  })

  test("shows a validation alert for invalid input", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.change(fromInput(), { target: { value: "abc" } })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidValueMessage)).toBeTruthy()
    })
    expect(toInput().value).toBe("")
  })

  test("swap moves the converted value into the source", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.swapLabel }))

    await waitFor(() => {
      expect(fromInput().value.startsWith("3.28")).toBe(true)
    })
    expect(toInput().value).toBe("1")
  })

  test("switching category reuses the typed value", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.categories.mass })
    )

    await waitFor(() => {
      expect(toInput().value).toBe("2.20462")
    })
  })

  test("selecting a unit from the list sets it as the target", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: /Centimeter/ }))

    await waitFor(() => {
      expect(toInput().value).toBe("100")
    })
  })

  test("changing the source unit updates the result", async () => {
    render(<UnitConverterClient messages={messages} />)

    selectOption(messages.fromUnitLabel, "Kilometer (km)")

    await waitFor(() => {
      expect(toInput().value).toBe("3280.84")
    })
  })

  test("changing the target unit updates the result", async () => {
    render(<UnitConverterClient messages={messages} />)

    selectOption(messages.toUnitLabel, "Inch (in)")

    await waitFor(() => {
      expect(toInput().value).toBe("39.3701")
    })
  })

  test("raising precision shows more significant figures", async () => {
    render(<UnitConverterClient messages={messages} />)

    selectOption(messages.precisionLabel, messages.precisionOptions["10"])

    await waitFor(() => {
      expect(toInput().value).toBe("3.280839895")
    })
  })

  test("clears and reloads the sample", async () => {
    render(<UnitConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(fromInput().value).toBe("")
    })
    expect(toInput().value).toBe("")

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(fromInput().value).toBe("1")
    })
    expect(toInput().value).toBe("3.28084")
  })

  test("restores saved state from localStorage", async () => {
    window.localStorage.setItem("tools:unit-converter:category", "temperature")
    window.localStorage.setItem("tools:unit-converter:value", "100")
    window.localStorage.setItem("tools:unit-converter:precision", "6")
    window.localStorage.setItem(
      "tools:unit-converter:units",
      JSON.stringify({ temperature: { from: "celsius", to: "fahrenheit" } })
    )

    render(<UnitConverterClient messages={messages} />)

    await waitFor(() => {
      expect(toInput().value).toBe("212")
    })
  })

  test("ignores malformed stored units", async () => {
    window.localStorage.setItem("tools:unit-converter:units", "{not json")

    render(<UnitConverterClient messages={messages} />)

    await waitFor(() => {
      expect(fromInput().value).toBe("1")
    })
  })
})
