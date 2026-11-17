import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { HomeSearch } from "./home-search"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"

const { load, navigate } = vi.hoisted(() => ({
  load: vi.fn<() => Promise<readonly SearchSuggestionEntry[]>>(),
  navigate: vi.fn(),
}))

vi.mock("@workspace/tool-registry/search-suggestions", () => ({
  loadToolSearchSuggestions: load,
}))

const entries = [
  { slug: "json-formatter", name: "JSON Formatter", category: "json" },
]
const messages = {
  clearSearchLabel: "Clear",
  emptySearchDescription: "Try another search",
  emptySearchTitle: "No matches",
  searchLabel: "Search tools",
  searchPlaceholder: "Search tools",
  suggestionMatchCount: "{count} matches",
  suggestionMatchCountOne: "{count} match",
  suggestionsHint: "Enter to open",
  suggestionsLabel: "Suggestions",
}

function renderSearch() {
  render(
    <HomeSearch
      language="de"
      categoryLabels={{ json: "JSON" }}
      messages={messages}
    />
  )
  return screen.getByRole("combobox")
}

describe("HomeSearch lazy index", () => {
  beforeEach(() => {
    load.mockReset()
    navigate.mockReset()
    vi.spyOn(window.location, "assign").mockImplementation(navigate)
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("loads only after focus, reuses the index, and opens localized suggestions", async () => {
    load.mockResolvedValue(entries)
    const input = renderSearch()
    expect(load).not.toHaveBeenCalled()

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "json" } })
    expect(await screen.findByRole("option")).toBeTruthy()
    expect(load).toHaveBeenCalledWith("de")

    fireEvent.blur(input)
    fireEvent.focus(input)
    expect(load).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(input, { key: "Enter" })
    expect(navigate).toHaveBeenCalledWith("/de/tools/json-formatter/")
  })

  it("keeps Enter search working while the index is loading without showing false empty results", async () => {
    let resolve!: (value: readonly SearchSuggestionEntry[]) => void
    load.mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    const input = renderSearch()

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "json" } })
    fireEvent.blur(input)
    fireEvent.focus(input)
    expect(load).toHaveBeenCalledTimes(1)
    expect(screen.queryByText("No matches")).toBeNull()
    fireEvent.keyDown(input, { key: "Enter" })
    expect(navigate).toHaveBeenCalledWith("/de/tools/?query=json")

    await act(async () => {
      resolve(entries)
    })
    expect(await screen.findByRole("option")).toBeTruthy()
  })

  it("allows directory search after a load failure and retries on the next focus", async () => {
    load
      .mockRejectedValueOnce(new Error("Network failed"))
      .mockResolvedValueOnce(entries)
    const input = renderSearch()
    fireEvent.focus(input)
    await act(async () => {})
    fireEvent.change(input, { target: { value: "json" } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(navigate).toHaveBeenCalledWith("/de/tools/?query=json")
    expect(screen.queryByText("No matches")).toBeNull()

    fireEvent.blur(input)
    fireEvent.focus(input)
    expect(await screen.findByRole("option")).toBeTruthy()
    expect(load).toHaveBeenCalledTimes(2)
  })

  it("shows no matches only after the index has loaded", async () => {
    load.mockResolvedValue([])
    const input = renderSearch()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "missing" } })
    await waitFor(() => expect(screen.getByText("No matches")).toBeTruthy())
  })
})
