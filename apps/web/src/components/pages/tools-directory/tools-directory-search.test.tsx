import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { ToolsDirectorySearch } from "./tools-directory-search"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"

vi.mock("astro:transitions/client", () => ({
  navigate: vi.fn(),
}))

afterEach(cleanup)

const entries = [
  {
    slug: "json-formatter",
    category: "json",
    icon: "braces",
    tags: [],
    locales: { en: { name: "JSON Formatter", description: "Format JSON" } },
  },
  {
    slug: "uuid-generator",
    category: "developer",
    icon: "code",
    tags: [],
    locales: { en: { name: "UUID Generator", description: "Generate UUIDs" } },
  },
] satisfies readonly ToolSearchIndexEntry[]

const messages = {
  categoriesLabel: "Categories",
  categoryAll: "All tools",
  categoryLabels: { json: "JSON", developer: "Developer" },
  clearSearchLabel: "Clear search",
  emptyRegistryDescription: "No tools are registered.",
  emptyRegistryTitle: "No tools available",
  emptySearchDescription: "Try another search.",
  emptySearchTitle: "No matching tools",
  resultCountSuffix: "tools",
  searchLabel: "Search tools",
  searchPlaceholder: "Search tools",
  sortLabel: "Sort: A–Z",
  suggestionMatchCount: "{count} suggestions",
  suggestionMatchCountOne: "1 suggestion",
  suggestionsHint: "Use arrow keys to select.",
  suggestionsLabel: "Suggestions",
} as const

test("announces a concise result count outside the changing tool list", async () => {
  render(
    <ToolsDirectorySearch entries={entries} language="en" messages={messages} />
  )

  const status = screen.getByRole("status")

  expect(status.getAttribute("aria-live")).toBe("polite")
  expect(status.getAttribute("aria-atomic")).toBe("true")
  expect(status.textContent).toBe("2 tools")
  expect(status.querySelector("a")).toBeNull()

  fireEvent.change(screen.getByRole("combobox", { name: "Search tools" }), {
    target: { value: "json" },
  })

  await waitFor(() => {
    expect(status.textContent).toBe("1 tools")
  })
  expect(status.querySelector("a")).toBeNull()
})
