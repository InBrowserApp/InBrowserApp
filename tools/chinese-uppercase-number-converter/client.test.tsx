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

const props = { lang: "en", messages }

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
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1234.56")
    })

    expect(getUppercaseInput().value).toBe("壹仟贰佰叁拾肆元伍角陆分")
  })

  test("defaults to traditional on zh-TW without saving a preference", () => {
    const { unmount } = render(
      <ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />
    )

    expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    fireEvent.change(getNumberInput(), { target: { value: "12" } })
    expect(getUppercaseInput().value).toBe("壹拾貳圓整")
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBeNull()

    unmount()
    render(<ChineseUppercaseNumberConverterClient {...props} />)
    expect(getUppercaseInput().value).toBe("壹拾贰元整")
  })

  test("updates the uppercase field when the number changes", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.03" },
    })

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹拾贰元零叁分")
    })
  })

  test("updates the number field when the uppercase text changes", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getUppercaseInput(), {
      target: { value: "壹元叁角伍分" },
    })

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1.35")
    })
  })

  test("switches to traditional output", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.traditionalLabel })
    )

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    })
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBe(
      "traditional"
    )
  })

  test("shows validation feedback for invalid numbers", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.345" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.numberTooManyDecimals)).toBeTruthy()
    })

    expect(getUppercaseInput().value).toBe("")
  })

  test("shows validation feedback for invalid uppercase text", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getUppercaseInput(), {
      target: { value: "ABC" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.uppercaseInvalidCharacters)).toBeTruthy()
    })

    expect(getNumberInput().value).toBe("")
  })

  test.each([
    ["en", "traditional", "壹拾貳圓伍角"],
    ["zh-TW", "simplified", "壹拾贰元伍角"],
  ])(
    "restores the %s page's saved %s preference and number",
    (lang, variant, output) => {
      window.localStorage.setItem(STORAGE_KEYS.variant, variant)
      window.localStorage.setItem(STORAGE_KEYS.number, "12.5")

      render(<ChineseUppercaseNumberConverterClient {...props} lang={lang} />)

      expect(getNumberInput().value).toBe("12.5")
      expect(getUppercaseInput().value).toBe(output)
      expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBe(variant)
    }
  )

  test("persists number edits and resets to defaults", async () => {
    window.localStorage.setItem(STORAGE_KEYS.variant, "simplified")
    render(<ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />)

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

    expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBeNull()
  })
})
