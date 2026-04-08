import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonpathTesterClient from "./client"
import {
  DEFAULT_JSON_TEXT,
  DEFAULT_QUERY_TEXT,
  STORAGE_KEYS,
} from "./client/constants"

const messages = {
  meta: {
    name: "JSONPath Tester",
    description:
      "Test JSONPath queries against JSON data and inspect matched values and paths.",
  },
  jsonLabel: "JSON",
  jsonDescription:
    "Paste JSON directly or import a file from this device. Invalid JSON is flagged before the query runs.",
  jsonPlaceholder: "Paste JSON here...",
  queryLabel: "JSONPath Query",
  queryDescription:
    "Enter a JSONPath query to evaluate against the JSON input on the left. Load an example to try the tool quickly.",
  queryPlaceholder: "Enter JSONPath query, e.g. $.store.book[*].author",
  examplesLabel: "Example queries",
  examplesPlaceholder: "Load an example query",
  formatJsonLabel: "Format JSON",
  importFromFileLabel: "Import from file",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  copyQueryLabel: "Copy query",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resultLabel: "Results",
  resultDescription:
    "Matched values and paths update as soon as both the JSON input and the JSONPath query are valid.",
  resultModeLabel: "Result mode",
  matchCountLabel: "Matches: {count}",
  valuesTabLabel: "Values",
  pathsTabLabel: "Paths",
  resultEmptyDescription:
    "Enter JSON and a JSONPath query to inspect matched values and paths here.",
  noMatchesLabel: "No matches found",
  downloadJsonLabel: "Download JSON",
  invalidJsonLabel: "Invalid JSON",
  invalidQueryLabel: "Invalid JSONPath",
  exampleAuthorsLabel: "All authors",
  exampleCheapBooksLabel: "Books under $10",
  exampleBicycleColorLabel: "Bicycle color",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:jsonpath-result"),
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

describe("JsonpathTesterClient", () => {
  test("renders the sample input, query, and values result", () => {
    render(<JsonpathTesterClient messages={messages} />)

    expect(getJsonInput().value).toBe(DEFAULT_JSON_TEXT)
    expect(getQueryInput().value).toBe(DEFAULT_QUERY_TEXT)
    expect(getResultRegion().textContent).toContain("Nigel Rees")
    expect(screen.getByText("Matches: 4")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows a JSON error state when the input is invalid", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(screen.getAllByText(/Invalid JSON:/).length).toBeGreaterThan(0)
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
  })

  test("shows a query error state when the expression is invalid", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.change(getQueryInput(), {
      target: { value: "$.store.book[?(@.price < )]" },
    })

    expect(getResultRegion().textContent).toContain(messages.invalidQueryLabel)
  })

  test("formats JSON in place", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"store":{"book":[{"author":"Nigel Rees"}]}}' },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.formatJsonLabel })
    )

    expect(getJsonInput().value).toBe(
      '{\n  "store": {\n    "book": [\n      {\n        "author": "Nigel Rees"\n      }\n    ]\n  }\n}'
    )
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonpathTesterClient messages={messages} />)

    const file = new File(
      ['{"store":{"book":[{"author":"Ada"},{"author":"Lovelace"}]}}'],
      "books.json",
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
    render(<JsonpathTesterClient messages={messages} />)

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
    expect(getResultRegion().textContent).toContain("Nigel Rees")
  })

  test("restores JSON and query from local storage", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.jsonText,
      '{"store":{"book":[{"author":"Ng"}]}}'
    )
    window.localStorage.setItem(
      STORAGE_KEYS.queryText,
      "$.store.book[*].author"
    )

    render(<JsonpathTesterClient messages={messages} />)

    expect(getJsonInput().value).toContain("Ng")
    expect(getQueryInput().value).toBe("$.store.book[*].author")
    expect(getResultRegion().textContent).toContain("Ng")
  })

  test("persists edits to local storage", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"store":{"bicycle":{"color":"blue"}}}' },
    })
    fireEvent.change(getQueryInput(), {
      target: { value: "$.store.bicycle.color" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"store":{"bicycle":{"color":"blue"}}}'
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.queryText)).toBe(
      "$.store.bicycle.color"
    )
  })

  test("shows the zero-match hint when the query matches nothing", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.change(getQueryInput(), {
      target: { value: "$.store.book[?(@.price < 1)].title" },
    })

    expect(screen.getByText("Matches: 0")).toBeTruthy()
    expect(screen.getByText(messages.noMatchesLabel)).toBeTruthy()
    expect(getResultRegion().textContent).toContain("[]")
  })

  test("switches to the path output mode", () => {
    render(<JsonpathTesterClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.pathsTabLabel }))

    expect(getResultRegion().textContent).toContain(
      "$['store']['book'][0]['author']"
    )
    expect(URL.createObjectURL).toHaveBeenCalled()
  })
})
