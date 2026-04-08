import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonToCsvConverterClient from "./client"
import {
  DEFAULT_JSON_TO_CSV_OPTIONS,
  convertJsonToCsvText,
} from "./core/convert-json-to-csv"

const messages = {
  meta: {
    name: "JSON to CSV Converter",
    description:
      "Convert JSON to CSV. Paste JSON or import a file; adjust options, preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  jsonLabel: "JSON",
  jsonDescription:
    "Paste JSON directly or import a .json or .txt file from this device.",
  jsonPlaceholder: "Paste a JSON array of objects here...",
  csvLabel: "CSV",
  csvDescription:
    "CSV output updates as soon as the input contains valid JSON.",
  csvEmptyDescription:
    "Paste valid JSON on the left to preview the converted CSV here.",
  invalidJsonLabel: "Invalid JSON",
  downloadCsvLabel: "Download CSV",
  copyCsvLabel: "Copy CSV",
  copiedLabel: "Copied",
  optionsLabel: "Options",
  optionsDescription:
    "Adjust delimiter, quote, header, and formula escaping before you copy or download the converted CSV.",
  delimiterLabel: "Delimiter",
  quoteCharLabel: "Quote character",
  includeHeaderRowLabel: "Include header row",
  escapeFormulaeLabel: "Escape spreadsheet formulae",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:json-to-csv-converter:json-text",
  options: "tools:json-to-csv-converter:options",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-csv"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getJsonInput() {
  return screen.getByRole("textbox", {
    name: messages.jsonLabel,
  }) as HTMLTextAreaElement
}

function getDelimiterInput() {
  return screen.getByRole("textbox", {
    name: messages.delimiterLabel,
  }) as HTMLInputElement
}

function getQuoteCharInput() {
  return screen.getByRole("textbox", {
    name: messages.quoteCharLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function getCsvOutput() {
  return screen.getByRole("region", {
    name: messages.csvLabel,
  })
}

describe("JsonToCsvConverterClient", () => {
  test("renders the default example and converted CSV output", () => {
    render(<JsonToCsvConverterClient messages={messages} />)

    const jsonInput = getJsonInput()
    const csvOutput = getCsvOutput()
    const result = convertJsonToCsvText(
      jsonInput.value,
      DEFAULT_JSON_TO_CSV_OPTIONS
    )

    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(screen.getByText(messages.csvDescription)).toBeTruthy()
    expect(jsonInput.value).toContain('"name": "Ada"')
    expect(csvOutput.textContent).toBe(
      result.state === "converted" ? result.csv : ""
    )
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid JSON and disables export actions", () => {
    render(<JsonToCsvConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"name": "Ada"' },
    })

    const csvOutput = getCsvOutput()
    const outputAlert = within(csvOutput).getByRole("alert")

    expect(outputAlert.textContent).toContain(messages.invalidJsonLabel)
    expect(
      screen.getByRole("button", { name: messages.copyCsvLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadCsvLabel })
    ).toHaveProperty("disabled", true)
  })

  test("updates the output when JSON to CSV options change", () => {
    render(<JsonToCsvConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: {
        value: '[{"name":"Ada","age":36},{"name":"Linus","age":32}]',
      },
    })
    fireEvent.change(getDelimiterInput(), {
      target: { value: ";" },
    })
    fireEvent.change(getQuoteCharInput(), {
      target: { value: "" },
    })
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.includeHeaderRowLabel,
      })
    )

    expect(getCsvOutput().textContent).toBe("Ada;36\r\nLinus;32")
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonToCsvConverterClient messages={messages} />)

    const file = new File(['[{"name":"Ada","age":36}]'], "demo.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getJsonInput().value).toBe('[{"name":"Ada","age":36}]')
    })

    expect(getCsvOutput().textContent).toContain("name,age")
  })

  test("restores the last stored input and options", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.jsonText,
      '[{"name":"Ada","age":36}]'
    )
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        delimiter: ";",
        quoteChar: "",
        includeHeaderRow: false,
      })
    )

    render(<JsonToCsvConverterClient messages={messages} />)

    expect(getJsonInput().value).toBe('[{"name":"Ada","age":36}]')
    expect(getDelimiterInput().value).toBe(";")
    expect(getQuoteCharInput().value).toBe("")
    expect(getCsvOutput().textContent).toBe("Ada;36")
  })

  test("persists edits and options to local storage", () => {
    render(<JsonToCsvConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '[{"name":"Ada","age":36}]' },
    })
    fireEvent.change(getDelimiterInput(), {
      target: { value: ";" },
    })
    fireEvent.click(
      screen.getByRole("switch", {
        name: messages.escapeFormulaeLabel,
      })
    )

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '[{"name":"Ada","age":36}]'
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.options)).toBe(
      JSON.stringify({
        ...DEFAULT_JSON_TO_CSV_OPTIONS,
        delimiter: ";",
        escapeFormulae: false,
      })
    )
  })
})
