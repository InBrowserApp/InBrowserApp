import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JmespathTesterClient from "./client"
import {
  DEFAULT_JSON_TEXT,
  DEFAULT_QUERY_TEXT,
  STORAGE_KEYS,
} from "./client/constants"

const messages = {
  meta: {
    name: "JMESPath Tester",
    description:
      "Evaluate JMESPath expressions against JSON data and inspect the result.",
  },
  jsonLabel: "JSON",
  jsonDescription:
    "Paste JSON directly or import a file from this device. Invalid JSON is flagged before the query runs.",
  jsonPlaceholder: "Paste JSON here...",
  queryLabel: "JMESPath Expression",
  queryDescription:
    "Enter a JMESPath expression to evaluate against the JSON input on the left. Load an example to try the tool quickly.",
  queryPlaceholder: "Enter JMESPath expression, e.g. people[*].last",
  examplesLabel: "Example queries",
  examplesPlaceholder: "Load an example expression",
  formatJsonLabel: "Format JSON",
  importFromFileLabel: "Import from file",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  copyQueryLabel: "Copy query",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resultLabel: "Results",
  resultDescription:
    "Results update as soon as both the JSON input and the JMESPath expression are valid.",
  resultCountLabel: "Results: {count}",
  resultEmptyDescription:
    "Enter valid JSON and a JMESPath expression to inspect the query output here.",
  noResultsLabel: "No results found",
  downloadJsonLabel: "Download JSON",
  invalidJsonLabel: "Invalid JSON",
  invalidQueryLabel: "Invalid JMESPath",
  exampleLastNamesLabel: "All last names",
  exampleAdultsLabel: "People age 30+",
  exampleOrdersLabel: "Orders over 20",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:jmespath-result"),
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

function getQueryInput() {
  return screen.getByRole("textbox", {
    name: messages.queryLabel,
  }) as HTMLTextAreaElement
}

function getResultRegion() {
  return screen.getByRole("region", {
    name: messages.resultLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("JmespathTesterClient", () => {
  test("renders the sample input, query, and result", () => {
    render(<JmespathTesterClient messages={messages} />)

    expect(getJsonInput().value).toBe(DEFAULT_JSON_TEXT)
    expect(getQueryInput().value).toBe(DEFAULT_QUERY_TEXT)
    expect(getResultRegion().textContent).toContain("Smith")
    expect(screen.getByText("Results: 3")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows a JSON error state when the input is invalid", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(screen.getAllByText(/Invalid JSON:/).length).toBeGreaterThan(0)
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
  })

  test("shows a query error state when the expression is invalid", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.change(getQueryInput(), {
      target: { value: "[" },
    })

    expect(screen.getAllByText(/Invalid JMESPath:/).length).toBeGreaterThan(0)
    expect(getResultRegion().textContent).toContain(messages.invalidQueryLabel)
  })

  test("formats JSON in place", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"people":[{"last":"Smith"}]}' },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.formatJsonLabel })
    )

    expect(getJsonInput().value).toBe(
      '{\n  "people": [\n    {\n      "last": "Smith"\n    }\n  ]\n}'
    )
  })

  test("imports JSON from a selected file", async () => {
    render(<JmespathTesterClient messages={messages} />)

    const file = new File(
      ['{"people":[{"last":"Ada"},{"last":"Lovelace"}]}'],
      "people.json",
      {
        type: "application/json",
      }
    )

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getJsonInput().value).toContain("Lovelace")
    })

    expect(getResultRegion().textContent).toContain("Ada")
    expect(getResultRegion().textContent).toContain("Lovelace")
  })

  test("can clear the tool and then restore the sample", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    expect(getJsonInput().value).toBe("")
    expect(getQueryInput().value).toBe("")
    expect(getResultRegion().textContent).toContain(
      messages.resultEmptyDescription
    )

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    expect(getJsonInput().value).toBe(DEFAULT_JSON_TEXT)
    expect(getQueryInput().value).toBe(DEFAULT_QUERY_TEXT)
    expect(getResultRegion().textContent).toContain("Smith")
  })

  test("restores JSON and query from local storage", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.jsonText,
      '{"people":[{"last":"Ng"}]}'
    )
    window.localStorage.setItem(STORAGE_KEYS.queryText, "people[*].last")

    render(<JmespathTesterClient messages={messages} />)

    expect(getJsonInput().value).toContain("Ng")
    expect(getQueryInput().value).toBe("people[*].last")
    expect(getResultRegion().textContent).toContain("Ng")
  })

  test("persists edits to local storage", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"orders":[{"id":"A1"}]}' },
    })
    fireEvent.change(getQueryInput(), {
      target: { value: "orders[*].id" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"orders":[{"id":"A1"}]}'
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.queryText)).toBe(
      "orders[*].id"
    )
  })

  test("shows the zero-result hint when the query matches nothing", () => {
    render(<JmespathTesterClient messages={messages} />)

    fireEvent.change(getQueryInput(), {
      target: { value: "people[?age > `100`].last" },
    })

    expect(screen.getByText("Results: 0")).toBeTruthy()
    expect(screen.getByText(messages.noResultsLabel)).toBeTruthy()
    expect(getResultRegion().textContent).toContain("[]")
  })
})
