import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import UnitConverterClient from "./client"
import { createDefaultUnits, STORAGE_KEY } from "./client/constants"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

const messages = { meta: enMeta, ...enMessages }

function fromInput() {
  return screen.getByPlaceholderText(
    messages.valuePlaceholder
  ) as HTMLInputElement
}

function toOutput() {
  return screen.getByRole("status", {
    name: messages.toLabel,
  }) as HTMLOutputElement
}

function outputValue() {
  return toOutput().querySelector("[data-output-value]")?.textContent ?? ""
}

function renderClient(language = "en", direction: "ltr" | "rtl" = "ltr") {
  return render(
    <UnitConverterClient
      messages={messages}
      language={language}
      direction={direction}
    />
  )
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
    renderClient()

    expect(fromInput().value).toBe("1")
    expect(outputValue()).toBe("3.28084")
    expect(toOutput().getAttribute("aria-live")).toBe("polite")
    expect(
      toOutput().querySelector("[data-output-value]")?.getAttribute("dir")
    ).toBe("ltr")
  })

  test("recomputes the target when the value changes", async () => {
    renderClient()

    fireEvent.change(fromInput(), { target: { value: "2" } })

    await waitFor(() => {
      expect(outputValue()).toBe("6.56168")
    })
  })

  test("shows a validation alert for invalid input", async () => {
    renderClient()

    fireEvent.change(fromInput(), { target: { value: "abc" } })

    expect(screen.queryByText(messages.invalidValueMessage)).toBeNull()
    fireEvent.blur(fromInput())

    await waitFor(() => {
      expect(screen.getByText(messages.invalidValueMessage)).toBeTruthy()
    })
    expect(fromInput().getAttribute("aria-errormessage")).toBe(
      screen.getByText(messages.invalidValueMessage).id
    )
    expect(outputValue()).toBe("")
  })

  test("swap moves the converted value into the source", async () => {
    renderClient()

    fireEvent.click(screen.getByRole("button", { name: messages.swapLabel }))

    await waitFor(() => {
      expect(fromInput().value.startsWith("3.28")).toBe(true)
    })
    expect(outputValue()).toBe("1")
  })

  test("switching category reuses the typed value", async () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("radio", { name: messages.categories.mass })
    )

    await waitFor(() => {
      expect(outputValue()).toBe("2.20462")
    })
  })

  test("selecting a row value sets its unit as the target", async () => {
    renderClient()

    const rowValue = screen.getByText("100")

    expect(rowValue.closest("button")).not.toBeNull()
    fireEvent.click(rowValue)

    await waitFor(() => {
      expect(outputValue()).toBe("100")
    })
  })

  test("changing the source unit updates the result", async () => {
    renderClient()

    selectOption(messages.fromUnitLabel, "Kilometer (km)")

    await waitFor(() => {
      expect(outputValue()).toBe("3280.84")
    })
  })

  test("changing the target unit updates the result", async () => {
    renderClient()

    selectOption(messages.toUnitLabel, "Inch (in)")

    await waitFor(() => {
      expect(outputValue()).toBe("39.3701")
    })
  })

  test("raising precision shows more significant figures", async () => {
    renderClient()

    selectOption(messages.precisionLabel, messages.precisionOptions["10"])

    await waitFor(() => {
      expect(outputValue()).toBe("3.280839895")
    })
  })

  test("clears and reloads the sample", async () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(fromInput().value).toBe("")
    })
    expect(outputValue()).toBe("")

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(fromInput().value).toBe("1")
    })
    expect(outputValue()).toBe("3.28084")
  })

  test("restores saved state from localStorage", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        category: "temperature",
        locale: "en",
        value: "100",
        precision: "6",
        units: createDefaultUnits(),
      })
    )

    renderClient()

    await waitFor(() => {
      expect(outputValue()).toBe("212")
    })
  })

  test("ignores malformed stored units", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json")

    renderClient()

    await waitFor(() => {
      expect(fromInput().value).toBe("1")
    })
  })

  test("uses the page locale for grouped decimal input", async () => {
    renderClient("de")

    fireEvent.change(fromInput(), { target: { value: "1.234,5" } })

    await waitFor(() => {
      expect(outputValue()).toBe("4050,2")
    })
  })

  test("preserves a stored value when switching page locales", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        category: "length",
        locale: "de",
        value: "1.234",
        precision: "6",
        units: createDefaultUnits(),
      })
    )

    renderClient("en")

    await waitFor(() => {
      expect(fromInput().value).toBe("1234")
      expect(outputValue()).toBe("4048.56")
    })
  })

  test("re-localizes the current value when the island locale changes", async () => {
    const rendered = renderClient("de")

    fireEvent.change(fromInput(), { target: { value: "1.234" } })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        '"locale":"de"'
      )
    })

    rendered.rerender(
      <UnitConverterClient messages={messages} language="en" direction="ltr" />
    )

    await waitFor(() => {
      expect(fromInput().value).toBe("1234")
      expect(outputValue()).toBe("4048.56")
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        '"locale":"en"'
      )
    })
  })

  test("round-trips a localized decimal value through swap", async () => {
    renderClient("de")

    selectOption(messages.toUnitLabel, "Kilometer (km)")

    await waitFor(() => {
      expect(outputValue()).toBe("0,001")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.swapLabel }))

    await waitFor(() => {
      expect(fromInput().value).toBe("0,001")
      expect(outputValue()).toBe("1")
    })
  })

  test("forwards RTL direction to the category and select roots", () => {
    renderClient("ar", "rtl")

    expect(
      screen.getByRole("radiogroup", { name: messages.categoryLabel }).dir
    ).toBe("rtl")
    expect(
      screen
        .getByRole("combobox", { name: messages.fromUnitLabel })
        .getAttribute("dir")
    ).toBe("rtl")
  })

  test("exposes selected rows and unique compact copy actions", () => {
    renderClient()

    expect(screen.getByRole("button", { pressed: true })).toBeTruthy()
    expect(
      screen.getByRole("button", { name: "Copy value: Foot" })
    ).toBeTruthy()
  })

  test("reports numeric overflow instead of showing an empty result", async () => {
    renderClient()

    selectOption(messages.fromUnitLabel, "Kilometer (km)")
    fireEvent.change(fromInput(), { target: { value: "1e308" } })

    await waitFor(() => {
      expect(outputValue()).toBe(messages.outOfRangeMessage)
    })
    expect(
      screen
        .getByRole("button", { name: messages.swapLabel })
        .hasAttribute("disabled")
    ).toBe(true)
  })
})
