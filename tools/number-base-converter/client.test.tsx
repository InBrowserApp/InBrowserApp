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
  meta: {
    name: "Number Base Converter",
    description:
      "Convert numbers between binary, octal, decimal, hex, base32, base36, base62, base64, and custom bases.",
  },
  converterTitle: "Live base converter",
  converterDescription:
    "Edit any supported field and the matching values update instantly in the browser.",
  commonBasesTitle: "Common bases",
  commonBasesDescription:
    "Binary, octal, decimal, and hexadecimal cover most debugging and systems work.",
  extendedBasesTitle: "Extended bases",
  extendedBasesDescription:
    "Use these when you need compact IDs or developer-facing encodings.",
  customBaseTitle: "Custom base",
  customBaseDescription:
    "Pick any radix from 2 to 64 and convert with the standard numeric alphabet.",
  customBaseValueLabel: "Base value",
  binaryLabel: "Binary (Base 2)",
  binaryPlaceholder: "Enter binary digits...",
  octalLabel: "Octal (Base 8)",
  octalPlaceholder: "Enter octal digits...",
  decimalLabel: "Decimal (Base 10)",
  decimalPlaceholder: "Enter decimal digits...",
  hexadecimalLabel: "Hexadecimal (Base 16)",
  hexadecimalPlaceholder: "Enter hexadecimal digits...",
  base32Label: "Base 32",
  base32Placeholder: "Enter base32 digits...",
  base36Label: "Base 36",
  base36Placeholder: "Enter base36 digits...",
  base62Label: "Base 62",
  base62Placeholder: "Enter base62 digits...",
  base64Label: "Base 64",
  base64Placeholder: "Enter base64 digits...",
  customLabel: "Custom output",
  customPlaceholder: "Enter digits for the selected base...",
  invalidValueMessage: "This value is not valid for {base}.",
  standardAlphabetHint:
    "Standard bases above 36 use the alphabet 0-9 a-z A-Z + /, while bases up to 36 ignore letter case.",
  base64AlphabetHint:
    "The numeric base64 field uses A-Z a-z 0-9 + /, so it is different from regular base64 text encoding.",
  copyValueLabel: "Copy value",
  copiedLabel: "Copied",
  loadSampleLabel: "Load sample",
  clearAllLabel: "Clear all",
} as const

describe("NumberBaseConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test("renders the default sample across the main bases", () => {
    render(<NumberBaseConverterClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
    ).toBe("255")
    expect(
      (screen.getByLabelText(messages.hexadecimalLabel) as HTMLInputElement)
        .value
    ).toBe("ff")
    expect(
      (screen.getByLabelText(messages.base64Label) as HTMLInputElement).value
    ).toBe("D/")
  })

  test("normalizes case-insensitive bases", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.hexadecimalLabel), {
      target: { value: "FF" },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.hexadecimalLabel) as HTMLInputElement)
          .value
      ).toBe("ff")
    })

    expect(
      (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
    ).toBe("255")
  })

  test("treats base62 as case-sensitive", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.base62Label), {
      target: { value: "A" },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
      ).toBe("36")
    })
  })

  test("shows a validation alert for invalid input", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.binaryLabel), {
      target: { value: "102" },
    })

    await waitFor(() => {
      expect(
        screen.getByText("This value is not valid for Binary (Base 2).")
      ).toBeTruthy()
    })

    expect(
      (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
    ).toBe("")
  })

  test("recomputes the custom field when the base changes", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.customBaseValueLabel), {
      target: { value: "16" },
    })
    fireEvent.blur(screen.getByLabelText(messages.customBaseValueLabel))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.customLabel) as HTMLInputElement).value
      ).toBe("ff")
    })
  })

  test("restores the saved editing state from localStorage", async () => {
    window.localStorage.setItem(
      "tools:number-base-converter:source-field",
      "custom"
    )
    window.localStorage.setItem(
      "tools:number-base-converter:source-value",
      "4n"
    )
    window.localStorage.setItem("tools:number-base-converter:custom-base", "58")

    render(<NumberBaseConverterClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
      ).toBe("255")
    })
  })

  test("supports clearing and loading the sample state", async () => {
    render(<NumberBaseConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
      ).toBe("")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.decimalLabel) as HTMLInputElement).value
      ).toBe("255")
    })
  })
})
