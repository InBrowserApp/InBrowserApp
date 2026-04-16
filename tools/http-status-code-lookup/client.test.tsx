import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import HttpStatusCodeLookupClient from "./client"

const messages = {
  meta: {
    name: "HTTP Status Code Lookup",
    description: "Search and browse HTTP status codes and their meanings.",
  },
  searchPlaceholder: "Search by status code, name, or description...",
  all: "All",
  common: "Common",
  informationalFilter: "Informational (1xx)",
  successFilter: "Success (2xx)",
  redirectionFilter: "Redirection (3xx)",
  clientErrorFilter: "Client Error (4xx)",
  serverErrorFilter: "Server Error (5xx)",
  code: "Code",
  name: "Name",
  category: "Category",
  description: "Description",
  informational: "Informational",
  success: "Success",
  redirection: "Redirection",
  clientError: "Client Error",
  serverError: "Server Error",
  noResultsTitle: "No matching status codes",
  noResultsDescription:
    "Try a different code, phrase, or category to broaden the results.",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("HttpStatusCodeLookupClient", () => {
  test("renders the default status code list", () => {
    render(<HttpStatusCodeLookupClient language="en" messages={messages} />)

    expect(
      screen.getByRole("textbox", { name: messages.searchPlaceholder })
    ).toHaveProperty("value", "")
    expect(screen.getByText("200")).toBeTruthy()
    expect(screen.getByText("OK")).toBeTruthy()
    expect(screen.getByText("404")).toBeTruthy()
  })

  test("filters the list by search query", () => {
    render(<HttpStatusCodeLookupClient language="en" messages={messages} />)

    const input = screen.getByRole("textbox", {
      name: messages.searchPlaceholder,
    })
    fireEvent.change(input, { target: { value: "teapot" } })

    expect(screen.getByText("I'm a teapot")).toBeTruthy()
    expect(screen.queryByText("Continue")).toBeNull()
  })

  test("filters the list by category", () => {
    render(<HttpStatusCodeLookupClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.common }))

    expect(screen.getByText("OK")).toBeTruthy()
    expect(screen.queryByText("Continue")).toBeNull()
  })

  test("shows the empty state when nothing matches", () => {
    render(<HttpStatusCodeLookupClient language="en" messages={messages} />)

    const input = screen.getByRole("textbox", {
      name: messages.searchPlaceholder,
    })
    fireEvent.change(input, { target: { value: "zzzzzz" } })

    expect(screen.getByText(messages.noResultsTitle)).toBeTruthy()
    expect(screen.getByText(messages.noResultsDescription)).toBeTruthy()
  })

  test("restores the stored search query and category filter", async () => {
    window.localStorage.setItem(SEARCH_STORAGE_KEY, "gateway")
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, "server-error")

    render(<HttpStatusCodeLookupClient language="en" messages={messages} />)

    expect(await screen.findByDisplayValue("gateway")).toBeTruthy()
    expect(screen.getByText("Gateway Timeout")).toBeTruthy()
    expect(screen.queryByText("OK")).toBeNull()
  })
})

const SEARCH_STORAGE_KEY = "tools:http-status-code-lookup:search"
const CATEGORY_STORAGE_KEY = "tools:http-status-code-lookup:category"
