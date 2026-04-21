import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import NumberBaseConverterClient from "./client"

const messages = {
  standardBasesTitle: "Common bases",
  standardBasesDescription:
    "Convert between binary, octal, decimal, and hexadecimal values.",
  extendedBasesTitle: "Extended bases",
  extendedBasesDescription:
    "Compare alphabets used by Base32, Base36, Base62, and Base64.",
  customBaseCardTitle: "Custom base",
  customBaseDescription:
    "Convert the same integer with any radix from 2 to 64.",
  customBaseHelp: "Choose a radix between 2 and 64.",
  binaryLabel: "Binary (Base 2)",
  binaryPlaceholder: "Enter binary...",
  octalLabel: "Octal (Base 8)",
  octalPlaceholder: "Enter octal...",
  decimalLabel: "Decimal (Base 10)",
  decimalPlaceholder: "Enter decimal...",
  hexLabel: "Hexadecimal (Base 16)",
  hexPlaceholder: "Enter hexadecimal...",
  base32Label: "Base 32",
  base32Placeholder: "Enter Base32...",
  base36Label: "Base 36",
  base36Placeholder: "Enter Base36...",
  base62Label: "Base 62",
  base62Placeholder: "Enter Base62...",
  base64Label: "Base 64",
  base64Placeholder: "Enter Base64...",
  customBaseLabel: "Custom base",
  customPlaceholder: "Enter number...",
  copyValueLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidInputDescription:
    "This field contains characters that do not belong to the selected base.",
  meta: {
    name: "Number Base Converter",
    description:
      "Convert numbers between binary, octal, decimal, hexadecimal, base32, base36, base62, base64, and custom bases.",
  },
} as const

const STORAGE_KEYS = {
  decimal: "tools:number-base-converter:decimal",
  customBase: "tools:number-base-converter:custom-base",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getField(label: string) {
  return screen.getByRole("textbox", { name: label }) as HTMLInputElement
}

describe("NumberBaseConverterClient", () => {
  test("renders the default example", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    await waitFor(() => {
      expect(getField(messages.decimalLabel).value).toBe("255")
    })

    expect(getField(messages.binaryLabel).value).toBe("11111111")
    expect(getField(messages.hexLabel).value).toBe("ff")
    expect(getField(messages.base64Label).value).toBe("D/")
  })

  test("updates every field when the decimal value changes", () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(getField(messages.decimalLabel), {
      target: { value: "1024" },
    })

    expect(getField(messages.binaryLabel).value).toBe("10000000000")
    expect(getField(messages.hexLabel).value).toBe("400")
    expect(getField(messages.base32Label).value).toBe("100")
  })

  test("recomputes custom output when the radix changes", () => {
    render(<NumberBaseConverterClient messages={messages} />)

    const radixInput = screen.getByRole("spinbutton", {
      name: messages.customBaseLabel,
    }) as HTMLInputElement

    fireEvent.change(radixInput, {
      target: { value: "16" },
    })

    expect(
      screen.getByRole("textbox", { name: "Custom base (16)" })
    ).toHaveProperty("value", "ff")
  })

  test("shows validation for invalid base-specific characters", () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(getField(messages.binaryLabel), {
      target: { value: "102" },
    })

    expect(screen.getByText(messages.invalidInputDescription)).toBeTruthy()
    expect(getField(messages.decimalLabel).value).toBe("255")
  })

  test("restores stored decimal and custom base preferences", async () => {
    window.localStorage.setItem(STORAGE_KEYS.decimal, "31")
    window.localStorage.setItem(STORAGE_KEYS.customBase, "16")

    render(<NumberBaseConverterClient messages={messages} />)

    await waitFor(() => {
      expect(getField(messages.decimalLabel).value).toBe("31")
    })

    expect(getField(messages.binaryLabel).value).toBe("11111")
    expect(
      screen.getByRole("textbox", { name: "Custom base (16)" })
    ).toHaveProperty("value", "1f")
  })

  test("resets the example values", () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(getField(messages.decimalLabel), {
      target: { value: "9" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect(getField(messages.decimalLabel).value).toBe("255")
    expect(getField(messages.hexLabel).value).toBe("ff")
  })
})
