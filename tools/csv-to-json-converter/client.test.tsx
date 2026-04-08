import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CsvToJsonConverterClient from "./client"
import {
  DEFAULT_CSV_TO_JSON_OPTIONS,
  convertCsvToJsonText,
} from "./core/convert-csv-to-json"

const messages = {
  meta: {
    name: "CSV to JSON Converter",
    description:
      "Convert CSV to JSON. Paste CSV or import a file; adjust options, preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  csvLabel: "CSV",
  csvDescription:
    "Paste CSV directly or import a .csv or .txt file from this device.",
  csvPlaceholder: "Paste CSV here...",
  jsonLabel: "JSON",
  jsonDescription:
    "JSON output updates as soon as the input contains valid CSV.",
  downloadJsonLabel: "Download JSON",
  jsonEmptyDescription:
    "Paste valid CSV on the left to preview the converted JSON here.",
  invalidCsvLabel: "Invalid CSV",
  optionsLabel: "Options",
  optionsDescription:
    "Adjust how CSV rows are parsed before you copy or download the converted JSON.",
  noHeaderLabel: "No header row",
  headersLabel: "Custom headers",
  headersPlaceholder: "name,age,email",
  delimiterLabel: "Delimiter",
  quoteLabel: "Quote character",
  trimLabel: "Trim cells",
  checkTypeLabel: "Infer value types",
  skipEmptyLinesLabel: "Skip empty lines",
  skipEmptyLinesNoneLabel: "Don't skip",
  skipEmptyLinesTrueLabel: "Skip empty",
  skipEmptyLinesGreedyLabel: "Skip greedy",
  escapeCharLabel: "Escape character",
  newlineLabel: "Newline",
  previewLabel: "Preview rows",
  commentsLabel: "Comments",
  commentsPlaceholder: "# or //",
  fastModeLabel: "Fast mode",
  skipFirstNLinesLabel: "Skip first N lines",
  delimitersToGuessLabel: "Fallback delimiters",
  delimitersToGuessPlaceholder: ",,\\t,|,;",
  includeColumnsLabel: "Include columns (regex)",
  ignoreColumnsLabel: "Ignore columns (regex)",
  regexPlaceholder: ".*name|age",
  indentSizeLabel: "Indent size",
  indentSizeDescription:
    "Choose 0 for compact output or 1-8 for pretty-printed indentation.",
  copyJsonLabel: "Copy JSON",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  csvText: "tools:csv-to-json-converter:csv-text",
  options: "tools:csv-to-json-converter:options",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-json"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getCsvInput() {
  return screen.getByRole("textbox", {
    name: messages.csvLabel,
  }) as HTMLTextAreaElement
}

function getHeadersInput() {
  return screen.getByRole("textbox", {
    name: messages.headersLabel,
  }) as HTMLInputElement
}

function getDelimiterInput() {
  return screen.getByRole("textbox", {
    name: messages.delimiterLabel,
  }) as HTMLInputElement
}

function getIndentSizeInput() {
  return screen.getByRole("spinbutton", {
    name: messages.indentSizeLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function getJsonOutput() {
  return screen.getByRole("region", {
    name: messages.jsonLabel,
  })
}

describe("CsvToJsonConverterClient", () => {
  test("renders the default example and converted JSON output", () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    const csvInput = getCsvInput()
    const jsonOutput = getJsonOutput()
    const result = convertCsvToJsonText(
      csvInput.value,
      DEFAULT_CSV_TO_JSON_OPTIONS
    )

    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(screen.getByText(messages.csvDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(csvInput.value).toContain("name,age,email")
    expect(jsonOutput.textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid CSV and disables export actions", () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    fireEvent.change(getCsvInput(), {
      target: { value: 'name,quote\nAda,"unterminated' },
    })

    const jsonOutput = getJsonOutput()
    const outputAlert = within(jsonOutput).getByRole("alert")

    expect(outputAlert.textContent).toContain(messages.invalidCsvLabel)
    expect(jsonOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyJsonLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadJsonLabel })
    ).toHaveProperty("disabled", true)
  })

  test("updates the output when CSV options change", () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    fireEvent.change(getCsvInput(), {
      target: { value: "Ada;36" },
    })
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: messages.noHeaderLabel,
      })
    )
    fireEvent.change(getHeadersInput(), {
      target: { value: "name,age" },
    })
    fireEvent.change(getDelimiterInput(), {
      target: { value: ";" },
    })
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: messages.checkTypeLabel,
      })
    )
    fireEvent.change(getIndentSizeInput(), {
      target: { value: "0" },
    })

    expect(getJsonOutput().textContent).toBe('[{"name":"Ada","age":36}]')
  })

  test("imports CSV from a selected file", async () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    const file = new File(["name,age\nAda,36"], "demo.csv", {
      type: "text/csv",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getCsvInput().value).toBe("name,age\nAda,36")
    })

    expect(getJsonOutput().textContent).toContain('"name": "Ada"')
  })

  test("restores the last stored input and options", () => {
    window.localStorage.setItem(STORAGE_KEYS.csvText, "Ada;36")
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        noHeader: true,
        headersText: "name,age",
        delimiter: ";",
        checkType: true,
        indentSize: 0,
      })
    )

    render(<CsvToJsonConverterClient messages={messages} />)

    expect(getCsvInput().value).toBe("Ada;36")
    expect(getHeadersInput().value).toBe("name,age")
    expect(getIndentSizeInput().value).toBe("0")
    expect(getJsonOutput().textContent).toBe('[{"name":"Ada","age":36}]')
  })

  test("persists edits and options to local storage", () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    fireEvent.change(getCsvInput(), {
      target: { value: "name,age\nAda,36" },
    })
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: messages.checkTypeLabel,
      })
    )

    expect(window.localStorage.getItem(STORAGE_KEYS.csvText)).toBe(
      "name,age\nAda,36"
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.options)).toContain(
      '"checkType":true'
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<CsvToJsonConverterClient messages={messages} />)

    fireEvent.change(getCsvInput(), {
      target: { value: 'name,quote\nAda,"unterminated' },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-json")
  })
})
