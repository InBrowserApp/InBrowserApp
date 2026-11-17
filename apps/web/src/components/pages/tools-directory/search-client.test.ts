import { experimental_AstroContainer as AstroContainer } from "astro/container"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import SearchCombobox from "./search-combobox.astro"
import { defineSearchElement, setupSearch } from "./search-client"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"

const entries = [
  { slug: "json-formatter", name: "JSON Formatter", category: "json" },
  { slug: "json-viewer", name: "JSON Viewer", category: "json" },
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

let destroy = () => {}
const load = vi.fn<() => Promise<readonly SearchSuggestionEntry[]>>()
const navigate = vi.fn()

async function renderSearch() {
  const container = await AstroContainer.create()
  const html = await container.renderToString(SearchCombobox, {
    props: {
      id: "home",
      language: "de",
      categoryLabels: { json: "JSON" },
      messages,
    },
  })
  const root = document.createElement("div")
  root.lang = "de"
  root.innerHTML = html
  document.body.append(root)
  const search = setupSearch(root, { entries: null, loadEntries: load })
  destroy = search.destroy
  return {
    root,
    input: screen.getByRole<HTMLInputElement>("combobox"),
    form: root.querySelector("form")!,
    panel: root.querySelector<HTMLElement>("[data-search-panel]")!,
  }
}

beforeEach(() => {
  load.mockReset()
  navigate.mockReset()
  vi.spyOn(window.location, "assign").mockImplementation(navigate)
})
afterEach(() => {
  destroy()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe("Astro search", () => {
  it("renders a labeled native GET form without an island or an embedded index", async () => {
    const { root, form, input } = await renderSearch()
    expect(form.getAttribute("action")).toBe("/de/tools/")
    expect(form.method).toBe("get")
    expect(input.name).toBe("query")
    expect(screen.getByLabelText("Search tools")).toBe(input)
    expect(root.querySelector("astro-island")).toBeNull()
    expect(root.textContent).not.toContain("JSON Formatter")
    expect(load).not.toHaveBeenCalled()
  })

  it("loads once on focus and supports arrows, Escape, and localized navigation", async () => {
    load.mockResolvedValue(entries)
    const { input, panel } = await renderSearch()
    input.focus()
    fireEvent.input(input, { target: { value: "json" } })
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
    expect(screen.getAllByRole("option")[0].getAttribute("href")).toContain(
      "/de/tools/json-formatter/"
    )
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "home-suggestions-option-1"
    )
    fireEvent.keyDown(input, { key: "Enter" })
    expect(navigate.mock.calls[0][0]).toContain("/de/tools/json-viewer/")
    fireEvent.keyDown(input, { key: "Escape" })
    expect(panel.hidden).toBe(true)
    expect(input.hasAttribute("aria-activedescendant")).toBe(false)
    input.blur()
    input.focus()
    expect(load).toHaveBeenCalledTimes(1)
  })

  it("keeps GET submission available while loading, then uses the typed query when ready", async () => {
    let resolve!: (value: readonly SearchSuggestionEntry[]) => void
    load.mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    const { input, form, panel } = await renderSearch()
    input.focus()
    fireEvent.input(input, { target: { value: " json " } })
    input.blur()
    input.focus()
    expect(load).toHaveBeenCalledTimes(1)
    expect(panel.hidden).toBe(true)
    const submit = new Event("submit", { bubbles: true, cancelable: true })
    form.dispatchEvent(submit)
    expect(submit.defaultPrevented).toBe(false)
    expect(input.value).toBe("json")
    resolve(entries)
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
  })

  it("preserves input after load failure and retries on refocus", async () => {
    load
      .mockRejectedValueOnce(new Error("Network failed"))
      .mockResolvedValueOnce(entries)
    const { input, form, panel } = await renderSearch()
    input.focus()
    fireEvent.input(input, { target: { value: "json" } })
    await Promise.resolve()
    expect(input.value).toBe("json")
    expect(panel.hidden).toBe(true)
    const submit = new Event("submit", { bubbles: true, cancelable: true })
    form.dispatchEvent(submit)
    expect(submit.defaultPrevented).toBe(false)
    input.blur()
    input.focus()
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
    expect(load).toHaveBeenCalledTimes(2)
  })

  it("shows a real empty result after loading and clears without losing focus", async () => {
    load.mockResolvedValue([])
    const { input, panel, root } = await renderSearch()
    input.focus()
    fireEvent.input(input, { target: { value: "missing" } })
    await waitFor(() => expect(panel.hidden).toBe(false))
    expect(root.querySelector<HTMLElement>("[data-search-empty]")!.hidden).toBe(
      false
    )
    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    expect(input.value).toBe("")
    expect(document.activeElement).toBe(input)
    expect(panel.hidden).toBe(true)
  })

  it("ignores IME confirmation and uses shortcuts only outside editable fields", async () => {
    load.mockResolvedValue(entries)
    const { input, form } = await renderSearch()
    fireEvent.keyDown(document, { key: "/" })
    expect(document.activeElement).toBe(input)
    fireEvent.compositionStart(input)
    fireEvent.input(input, { target: { value: "json" } })
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    const submit = new Event("submit", { bubbles: true, cancelable: true })
    form.dispatchEvent(submit)
    expect(submit.defaultPrevented).toBe(true)
    expect(navigate).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input)
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
    fireEvent.keyDown(input, { key: "Enter" })
    expect(navigate).toHaveBeenCalledTimes(1)
    const editor = document.createElement("textarea")
    document.body.append(editor)
    editor.focus()
    fireEvent.keyDown(editor, { key: "/" })
    expect(document.activeElement).toBe(editor)
    fireEvent.keyDown(editor, { key: "K", metaKey: true })
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(4)
    input.blur()
    fireEvent.keyDown(document.body, { key: "k", ctrlKey: true })
    expect(document.activeElement).toBe(input)
  })

  it("renders metadata as text rather than HTML", async () => {
    load.mockResolvedValue([
      {
        slug: "safe",
        category: "json",
        name: '<img src=x onerror="alert(1)"> JSON',
      },
    ])
    const { root, input } = await renderSearch()
    input.focus()
    fireEvent.input(input, { target: { value: "json" } })
    await waitFor(() => expect(screen.getByRole("option")).toBeTruthy())
    expect(root.querySelector("img")).toBeNull()
    expect(screen.getByRole("option").textContent).toContain("<img src=x")
  })

  it("cleans up listeners when a custom element is removed and reconnects once", async () => {
    const { root } = await renderSearch()
    destroy()
    const setup = vi.fn(
      (element: HTMLElement) => setupSearch(element, { entries }).destroy
    )
    defineSearchElement("test-tool-search", setup)
    const element = document.createElement("test-tool-search")
    element.lang = "de"
    element.innerHTML = root.innerHTML
    root.remove()
    document.body.append(element)
    element.remove()
    fireEvent.keyDown(document, { key: "/" })
    expect(document.activeElement).toBe(document.body)
    document.body.append(element)
    fireEvent.keyDown(document, { key: "/" })
    expect(document.activeElement).toBe(element.querySelector("input"))
    expect(setup).toHaveBeenCalledTimes(2)
    element.remove()
  })
})
