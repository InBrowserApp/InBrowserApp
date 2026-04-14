import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { OptionsCard } from "./options-card"
import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  type PrettierFormatOptions,
} from "../core/prettier-languages"

const messages = {
  meta: {
    name: "Prettier Code Formatter",
    description: "",
  },
  inputLabel: "Source code",
  inputDescription: "",
  inputPlaceholder: "",
  outputLabel: "Formatted output",
  outputDescription: "",
  outputEmptyDescription: "",
  formattingLabel: "Formatting code...",
  formatErrorLabel: "Could not format this input",
  optionsLabel: "Formatting options",
  optionsDescription:
    "Choose the parser and style rules without editing the source by hand.",
  languageLabel: "Language",
  printWidthLabel: "Print width",
  tabWidthLabel: "Tab width",
  indentationLegend: "Indentation",
  styleLegend: "Style",
  useTabsLabel: "Use tabs",
  semicolonsLabel: "Semicolons",
  singleQuotesLabel: "Single quotes",
  trailingCommaLabel: "Trailing commas",
  trailingCommaNoneLabel: "None",
  trailingCommaEs5Label: "ES5",
  trailingCommaAllLabel: "All",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  importFromFileLabel: "Import from file",
  formatNowLabel: "Format now",
  formatPausedHint: "",
  copyFormattedLabel: "",
  copiedLabel: "",
  downloadFormattedLabel: "",
} as const

function renderOptionsCard(options: PrettierFormatOptions) {
  const setOptions = vi.fn()

  render(
    <OptionsCard
      messages={messages}
      options={options}
      setOptions={setOptions}
    />
  )

  return { setOptions }
}

function OptionsCardHarness() {
  const [options, setOptions] = useState(DEFAULT_PRETTIER_FORMAT_OPTIONS)

  return (
    <OptionsCard
      messages={messages}
      options={options}
      setOptions={setOptions}
    />
  )
}

describe("OptionsCard", () => {
  afterEach(() => {
    cleanup()
  })

  test("renders language and numeric controls", () => {
    renderOptionsCard(DEFAULT_PRETTIER_FORMAT_OPTIONS)

    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.languageLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("spinbutton", { name: messages.printWidthLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("spinbutton", { name: messages.tabWidthLabel })
    ).toBeTruthy()
  })

  test("shows style toggles for javascript-like languages", () => {
    renderOptionsCard(DEFAULT_PRETTIER_FORMAT_OPTIONS)

    expect(screen.getByLabelText(messages.semicolonsLabel)).toBeTruthy()
    expect(screen.getByLabelText(messages.singleQuotesLabel)).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.trailingCommaLabel })
    ).toBeTruthy()
  })

  test("hides unsupported style options for json", () => {
    renderOptionsCard({
      ...DEFAULT_PRETTIER_FORMAT_OPTIONS,
      language: "json",
    })

    expect(screen.queryByLabelText(messages.semicolonsLabel)).toBeNull()
    expect(screen.queryByLabelText(messages.singleQuotesLabel)).toBeNull()
    expect(
      screen.queryByRole("combobox", { name: messages.trailingCommaLabel })
    ).toBeNull()
  })

  test("updates numeric fields through the provided setter", () => {
    const { setOptions } = renderOptionsCard(DEFAULT_PRETTIER_FORMAT_OPTIONS)

    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.printWidthLabel }),
      {
        target: { value: "120" },
      }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.tabWidthLabel }),
      {
        target: { value: "4" },
      }
    )

    expect(setOptions).toHaveBeenCalledTimes(2)
  })

  test("updates checkbox fields through the provided setter", () => {
    const { setOptions } = renderOptionsCard(DEFAULT_PRETTIER_FORMAT_OPTIONS)

    fireEvent.click(screen.getByLabelText(messages.useTabsLabel))
    fireEvent.click(screen.getByLabelText(messages.semicolonsLabel))
    fireEvent.click(screen.getByLabelText(messages.singleQuotesLabel))

    expect(setOptions).toHaveBeenCalledTimes(3)
  })

  test("updates select fields through interactive state changes", () => {
    render(<OptionsCardHarness />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.trailingCommaLabel })
    )
    fireEvent.click(
      screen.getByRole("option", { name: messages.trailingCommaAllLabel })
    )

    expect(
      screen.getByRole("combobox", { name: messages.trailingCommaLabel })
        .textContent
    ).toContain(messages.trailingCommaAllLabel)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.languageLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: "JSON" }))

    expect(
      screen.getByRole("combobox", { name: messages.languageLabel }).textContent
    ).toContain("JSON")
    expect(screen.queryByLabelText(messages.semicolonsLabel)).toBeNull()
    expect(screen.queryByLabelText(messages.singleQuotesLabel)).toBeNull()
    expect(
      screen.queryByRole("combobox", { name: messages.trailingCommaLabel })
    ).toBeNull()
  })
})
