import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import RomanNumeralConverterClient from "./client"

const messages = {
  meta: {
    name: "Roman Numeral Converter",
    description:
      "Convert Roman numerals and Arabic numbers in both directions.",
  },
  converterTitle: "Converter",
  converterDescription:
    "Edit either field and the matching value updates instantly using standard Roman numeral rules.",
  arabicNumber: "Arabic Number (1-3999)",
  arabicPlaceholder: "Enter Arabic number...",
  romanNumeral: "Roman Numeral",
  romanPlaceholder: "Enter Roman numeral...",
  invalidRomanNumeral: "Please enter a valid Roman numeral",
  invalidArabicNumber: "Enter a whole number using digits only.",
  outOfRangeArabicNumber: "Use a value from 1 to 3999.",
  resultTitle: "Live result",
  resultDescription:
    "Review the normalized output, status, and converted value.",
  emptyState: "Enter an Arabic number or a Roman numeral to start converting.",
  validLabel: "Valid",
  invalidLabel: "Invalid",
  rangeHint: "Supported range: 1-3999",
  notationHint: "Standard Roman notation only",
  loadSample: "Load sample",
  clearLabel: "Clear",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

describe("RomanNumeralConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test("renders the default sample state", () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    expect(screen.getByDisplayValue("2024")).toBeTruthy()
    expect(screen.getAllByDisplayValue("MMXXIV")[0]).toBeTruthy()
    expect(screen.getAllByText(messages.validLabel).length).toBe(2)
  })

  test("converts arabic input to roman numerals", async () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.arabicNumber), {
      target: { value: "3999" },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.romanNumeral) as HTMLInputElement).value
      ).toBe("MMMCMXCIX")
    })
  })

  test("restores saved inputs from localStorage", async () => {
    window.localStorage.setItem(
      "tools:roman-numeral-converter:arabic-input",
      "39"
    )
    window.localStorage.setItem(
      "tools:roman-numeral-converter:roman-input",
      "XXXIX"
    )

    render(<RomanNumeralConverterClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.arabicNumber) as HTMLInputElement).value
      ).toBe("39")
    })

    expect(
      (screen.getByLabelText(messages.romanNumeral) as HTMLInputElement).value
    ).toBe("XXXIX")
  })

  test("shows arabic validation errors", async () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.arabicNumber), {
      target: { value: "12.5" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidArabicNumber)).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText(messages.arabicNumber), {
      target: { value: "4000" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.outOfRangeArabicNumber)).toBeTruthy()
    })
  })

  test("converts roman numerals to arabic numbers", async () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.romanNumeral), {
      target: { value: "xiv" },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.arabicNumber) as HTMLInputElement).value
      ).toBe("14")
    })
  })

  test("shows roman numeral validation errors", async () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.romanNumeral), {
      target: { value: "VX" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidRomanNumeral)).toBeTruthy()
    })
  })

  test("supports sample and clear actions", async () => {
    render(<RomanNumeralConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.emptyState)).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.arabicNumber) as HTMLInputElement).value
      ).toBe("2024")
    })
  })
})
