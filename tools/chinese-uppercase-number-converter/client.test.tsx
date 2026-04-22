import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import ChineseUppercaseNumberConverterClient from "./client"

const messages = {
  meta: {
    name: "Number ↔ Chinese Uppercase Converter",
    description:
      "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
  },
  styleTitle: "Uppercase Style",
  simplifiedLabel: "Simplified",
  traditionalLabel: "Traditional",
  numberLabel: "Number",
  numberPlaceholder: "Enter number (e.g., 1234.56)",
  numberValid: "Valid number",
  numberInvalidFormat: "Only digits and one decimal point are allowed.",
  numberTooManyDecimals: "Use up to 2 decimal places.",
  numberOutOfRange: "Value exceeds the maximum range.",
  uppercaseLabel: "Chinese Uppercase",
  uppercasePlaceholder: "Enter Chinese uppercase amount",
  uppercaseValid: "Valid uppercase",
  uppercaseInvalidCharacters:
    "Only Chinese uppercase digits and units are allowed.",
  uppercaseInvalidFormat: "Invalid uppercase format.",
  uppercaseOutOfRange: "Value exceeds the maximum range.",
  copyNumberLabel: "Copy number",
  copyUppercaseLabel: "Copy uppercase",
  copiedLabel: "Copied",
  resetLabel: "Reset",
} as const

const STORAGE_KEYS = {
  variant: "tools:chinese-uppercase-number-converter:variant",
  number: "tools:chinese-uppercase-number-converter:number",
} as const

function getNumberInput() {
  return screen.getByRole("textbox", {
    name: messages.numberLabel,
  }) as HTMLInputElement
}

function getUppercaseInput() {
  return screen.getByRole("textbox", {
    name: messages.uppercaseLabel,
  }) as HTMLTextAreaElement
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("ChineseUppercaseNumberConverterClient", () => {
  test("renders the default number and uppercase value", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1234.56")
    })

    expect(getUppercaseInput().value).toBe("壹仟贰佰叁拾肆元伍角陆分")
  })

  test("updates the uppercase field when the number changes", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.03" },
    })

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹拾贰元零叁分")
    })
  })

  test("updates the number field when the uppercase text changes", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.change(getUppercaseInput(), {
      target: { value: "壹元叁角伍分" },
    })

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1.35")
    })
  })

  test("switches to traditional output", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.traditionalLabel })
    )

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    })
  })

  test("shows validation feedback for invalid numbers", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.345" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.numberTooManyDecimals)).toBeTruthy()
    })

    expect(getUppercaseInput().value).toBe("")
  })

  test("shows validation feedback for invalid uppercase text", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.change(getUppercaseInput(), {
      target: { value: "ABC" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.uppercaseInvalidCharacters)).toBeTruthy()
    })

    expect(getNumberInput().value).toBe("")
  })

  test("restores the last saved variant and number from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.variant, "traditional")
    window.localStorage.setItem(STORAGE_KEYS.number, "12.5")

    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    await waitFor(() => {
      expect(getNumberInput().value).toBe("12.5")
    })

    expect(getUppercaseInput().value).toBe("壹拾貳圓伍角")
  })

  test("persists number edits and resets to defaults", async () => {
    render(<ChineseUppercaseNumberConverterClient messages={messages} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "99" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.number)).toBe("99")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1234.56")
    })

    expect(getUppercaseInput().value).toBe("壹仟贰佰叁拾肆元伍角陆分")
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBe("simplified")
  })
})
