import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HomeSearch } from "../home-search"
import { setupDirectorySearch } from "./tools-directory-search"
import { CategoryChips, CategorySidebar } from "./category-nav"
import { DirectoryEmptyState, ToolList } from "./tool-list"
import { rankToolEntries } from "./search-core"
import type { DirectoryToolEntry } from "@/lib/tool-directory"
import catalog from "../../../messages/en.json"

const entries = [
  {
    slug: "pdf-merger",
    category: "pdf",
    icon: "file-text",
    name: "PDF Merger",
    description: "Merge PDF files.",
  },
  {
    slug: "pdf-splitter",
    category: "pdf",
    icon: "file-text",
    name: "PDF Splitter",
    description: "Split PDF files.",
  },
]
const props: {
  entries: DirectoryToolEntry[]
  category?: string
  categoryCounts: { category: string; count: number }[]
  language: "en" | "zh-CN"
  messages: typeof catalog.tools & {
    categoryLabels: typeof catalog.tools.categories
  }
} = {
  entries,
  category: "pdf",
  categoryCounts: [
    { category: "pdf", count: 2 },
    { category: "json", count: 1 },
  ],
  language: "en" as const,
  messages: { ...catalog.tools, categoryLabels: catalog.tools.categories },
}

function directoryHtml(options = props) {
  const navProps = {
    allLabel: catalog.tools.categoryAll,
    categoriesLabel: catalog.tools.categoriesLabel,
    counts: options.categoryCounts,
    formatCount: String,
    labels: catalog.tools.categories,
    language: options.language,
    selected: options.category ?? null,
    totalCount: 3,
  }
  return renderToStaticMarkup(
    <div data-tools-directory>
      <CategorySidebar {...navProps} />
      <CategoryChips {...navProps} />
      <div data-search-slot />
      <ToolList
        entries={rankToolEntries(options.entries, "", options.language)}
        language={options.language}
        categoryLabels={catalog.tools.categories}
        showCategory={!options.category}
      />
      <div data-tool-empty hidden>
        <DirectoryEmptyState
          icon="search"
          title={catalog.tools.emptySearchTitle}
          description={catalog.tools.emptySearchDescription}
        />
      </div>
    </div>
  )
}

const disposers: (() => void)[] = []

function searchHtml(options = props) {
  const root = document.createElement("div")
  root.dataset.directorySearch = ""
  root.dataset.language = options.language
  root.dataset.categoryLabels = JSON.stringify(options.messages.categoryLabels)
  root.innerHTML = `
    <input data-search-input role="combobox" aria-expanded="false" aria-controls="tools-search-suggestions">
    <button data-search-clear hidden></button><kbd data-search-shortcut></kbd>
    <div data-search-popup hidden>
      <div data-search-no-suggestions></div>
      <div data-search-matches>
        <ul role="listbox" id="tools-search-suggestions"></ul>
        <span data-suggestion-count></span>
      </div>
    </div>
    <template data-search-option>
      <li role="option"><span data-pre></span><span data-match></span><span data-post></span><span data-category></span></li>
    </template>
    <p data-search-status role="status" aria-live="polite" aria-atomic="true" class="sr-only"></p>`
  root
    .querySelector("input")!
    .setAttribute("aria-label", options.messages.searchLabel)
  root
    .querySelector("button")!
    .setAttribute("aria-label", options.messages.clearSearchLabel)
  Object.assign(
    root.querySelector<HTMLElement>("[data-suggestion-count]")!.dataset,
    {
      one: options.messages.suggestionMatchCountOne,
      many: options.messages.suggestionMatchCount,
    }
  )
  Object.assign(
    root.querySelector<HTMLElement>("[data-search-status]")!.dataset,
    {
      suffix: options.messages.resultCountSuffix,
      emptyRegistry: options.messages.emptyRegistryTitle,
      emptySearch: options.messages.emptySearchTitle,
    }
  )
  return root.outerHTML
}

function renderDirectory(options = props, initialInput = "") {
  const host = document.createElement("div")
  host.innerHTML = directoryHtml(options)
  host.querySelector("[data-search-slot]")!.innerHTML = searchHtml(options)
  document.body.append(host)
  host.querySelector<HTMLInputElement>("[data-search-input]")!.value =
    initialInput
  disposers.push(
    setupDirectorySearch(host.querySelector("[data-directory-search]")!)
  )
  return host
}

afterEach(() => {
  disposers.splice(0).forEach((dispose) => dispose())
  cleanup()
  document.body.replaceChildren()
  vi.restoreAllMocks()
  window.history.replaceState(null, "", "/")
})

describe("search navigation", () => {
  it("opens a localized tool with browser navigation on Enter", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory({ ...props, language: "zh-CN" })
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.input(input, { target: { value: "merge" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(assign).toHaveBeenCalledWith("/zh-CN/tools/pdf-merger/")
  })

  it("opens a tool with browser navigation when a suggestion is clicked", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory()
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.input(input, { target: { value: "split" } })
    fireEvent.click(screen.getByRole("option"))

    expect(assign).toHaveBeenCalledWith("/tools/pdf-splitter/")
  })

  it("opens the localized directory with an encoded home search query", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    render(
      <HomeSearch
        language="zh-CN"
        categoryLabels={catalog.tools.categories}
        messages={catalog.tools}
      />
    )
    const input = screen.getByRole("combobox")
    fireEvent.change(input, { target: { value: "  编码 & text?  " } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(assign).toHaveBeenCalledWith(
      `/zh-CN/tools/?query=${encodeURIComponent("编码 & text?")}`
    )
  })
})

describe("category directory", () => {
  it("announces a concise result count outside the changing tool list", async () => {
    renderDirectory()

    const status = screen.getByRole("status")

    expect(status.getAttribute("aria-live")).toBe("polite")
    expect(status.getAttribute("aria-atomic")).toBe("true")
    await waitFor(() => expect(status.textContent).toBe("2 tools"))
    expect(status.querySelector("a")).toBeNull()
    expect(
      screen.getByRole("link", { name: /PDF Merger/ }).closest("[aria-live]")
    ).toBeNull()

    fireEvent.input(screen.getByRole("combobox"), {
      target: { value: "merge" },
    })

    await waitFor(() => {
      expect(status.textContent).toBe("1 tools")
    })
    expect(status.querySelector("a")).toBeNull()
  })

  it("renders its tools and localized category links before JavaScript runs", () => {
    const html = directoryHtml({ ...props, language: "zh-CN" })
    const document = new DOMParser().parseFromString(html, "text/html")

    expect(
      document.querySelector('a[href="/zh-CN/tools/pdf-merger/"]')
    ).not.toBeNull()
    expect(
      document.querySelector('a[href="/zh-CN/tools/pdf-splitter/"]')
    ).not.toBeNull()
    expect(
      document.querySelector('a[href="/zh-CN/categories/json/"]')
    ).not.toBeNull()
    expect(
      document.querySelectorAll(
        'a[href="/zh-CN/categories/pdf/"][aria-current="page"]'
      )
    ).toHaveLength(2)
    expect(document.querySelector('a[href="/zh-CN/tools/"]')).not.toBeNull()
    expect(html).not.toContain("?category=")
  })

  it("restores a shared search URL without removing its initial query", async () => {
    window.history.replaceState(null, "", "/categories/pdf/?query=merge")
    renderDirectory()

    await waitFor(() => {
      expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe(
        "merge"
      )
      expect(screen.queryByRole("link", { name: /PDF Splitter/ })).toBeNull()
    })
    expect(window.location.search).toBe("?query=merge")

    fireEvent.input(screen.getByRole("combobox"), {
      target: { value: "split" },
    })
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /PDF Merger/ })).toBeNull()
      expect(screen.getByRole("link", { name: /PDF Splitter/ })).toBeTruthy()
    })
    expect(window.location.pathname).toBe("/categories/pdf/")
    expect(window.location.search).toBe("?query=split")
  })

  it("ignores the removed category parameter and restores searches on popstate", async () => {
    window.history.replaceState(null, "", "/tools/?category=json")
    renderDirectory({ ...props, category: undefined })

    expect(screen.getByRole("link", { name: /PDF Merger/ })).toBeTruthy()
    expect(
      document.querySelector('a[href="/tools/"][aria-current="page"]')
    ).not.toBeNull()

    window.history.replaceState(null, "", "/tools/?query=split")
    window.dispatchEvent(new PopStateEvent("popstate"))
    await waitFor(() => {
      expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe(
        "split"
      )
      expect(screen.queryByRole("link", { name: /PDF Merger/ })).toBeNull()
    })
  })
})

describe("HTML-backed filtering", () => {
  it("keeps the same HTML rows when filtering, showing an empty state, and clearing by keyboard click", async () => {
    const host = renderDirectory()
    const original = host.querySelector('[data-tool-row="pdf-merger"]')
    const input = screen.getByRole("combobox")
    fireEvent.input(input, { target: { value: "missing" } })
    await waitFor(() =>
      expect(host.querySelector<HTMLElement>("[data-tool-list]")!.hidden).toBe(
        true
      )
    )
    expect(host.querySelector<HTMLElement>("[data-tool-empty]")!.hidden).toBe(
      false
    )
    expect(host.querySelector('[data-tool-row="pdf-merger"]')).toBe(original)
    expect(screen.queryByRole("link", { name: /PDF Merger/ })).toBeNull()
    fireEvent.click(
      screen.getByRole("button", { name: catalog.tools.clearSearchLabel })
    )
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /PDF Merger/ })).toBe(original)
    )
    expect(host.querySelector<HTMLElement>("[data-tool-empty]")!.hidden).toBe(
      true
    )
    expect(window.location.search).toBe("")
    expect(document.activeElement).toBe(input)
  })

  it("reorders existing rows by relevance and restores alphabetical order when cleared", async () => {
    const host = renderDirectory({
      ...props,
      entries: [
        {
          ...entries[0],
          slug: "encoder",
          name: "Encoder",
          description: "Encode JSON values.",
        },
        {
          ...entries[0],
          slug: "json-formatter",
          name: "JSON Formatter",
          description: "Indent files.",
        },
        {
          ...entries[0],
          slug: "json",
          name: "JSON",
          description: "Serialize values.",
        },
      ],
    })
    const visibleSlugs = () =>
      Array.from(
        host.querySelectorAll<HTMLElement>("[data-tool-row]:not([hidden])")
      ).map((row) => row.dataset.toolRow)
    const input = screen.getByRole("combobox")
    fireEvent.input(input, { target: { value: "json" } })
    await waitFor(() =>
      expect(visibleSlugs()).toEqual(["json", "json-formatter", "encoder"])
    )
    fireEvent.input(input, { target: { value: "formatter" } })
    await waitFor(() => expect(visibleSlugs()).toEqual(["json-formatter"]))
    expect(
      host.querySelector("[data-first-visible]")!.getAttribute("data-tool-row")
    ).toBe("json-formatter")
    fireEvent.input(input, { target: { value: "" } })
    await waitFor(() =>
      expect(visibleSlugs()).toEqual(["encoder", "json", "json-formatter"])
    )
  })

  it("does not open a suggestion while confirming IME composition", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory()
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.compositionStart(input)
    fireEvent.input(input, { target: { value: "merge" } })
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    expect(assign).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input)
    fireEvent.keyDown(input, { key: "Enter" })
    expect(assign).toHaveBeenCalledWith("/tools/pdf-merger/")
  })
})

describe("native search interactions", () => {
  it("keeps keyboard selection in bounds and dismisses suggestions until the query changes", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory()
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.input(input, { target: { value: "pdf" } })
    const options = screen.getAllByRole("option")
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(options[1].getAttribute("aria-selected")).toBe("true")
    expect(input.getAttribute("aria-activedescendant")).toBe(options[1].id)
    fireEvent.keyDown(input, { key: "ArrowUp" })
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(options[0].getAttribute("aria-selected")).toBe("true")
    fireEvent.keyDown(input, { key: "Escape" })
    expect(input.getAttribute("aria-expanded")).toBe("false")
    expect(input.hasAttribute("aria-activedescendant")).toBe(false)
    fireEvent.keyDown(input, { key: "Enter" })
    expect(assign).not.toHaveBeenCalled()
    fireEvent.input(input, { target: { value: "split" } })
    expect(input.getAttribute("aria-expanded")).toBe("true")
    fireEvent.keyDown(input, { key: "Enter" })
    expect(assign).toHaveBeenCalledWith("/tools/pdf-splitter/")
  })

  it("focuses and selects the search with shortcuts without stealing slash from editors", () => {
    renderDirectory()
    const input = screen.getByRole("combobox") as HTMLInputElement
    fireEvent.input(input, { target: { value: "pdf" } })
    fireEvent.keyDown(document.body, { key: "k", ctrlKey: true })
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(3)
    input.blur()
    fireEvent.keyDown(document.body, { key: "/" })
    expect(document.activeElement).toBe(input)
    const editor = document.createElement("textarea")
    document.body.append(editor)
    editor.focus()
    fireEvent.keyDown(editor, { key: "/" })
    expect(document.activeElement).toBe(editor)
    fireEvent.keyDown(editor, { key: "K", metaKey: true })
    expect(document.activeElement).toBe(input)
  })

  it("supports pointer selection and click activation while keeping the input focused", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory()
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.input(input, { target: { value: "pdf" } })
    const option = screen.getAllByRole("option")[1]
    fireEvent.pointerOver(option.querySelector("[data-match]")!)
    expect(option.getAttribute("aria-selected")).toBe("true")
    expect(
      fireEvent.pointerDown(option, { button: 0, pointerType: "touch" })
    ).toBe(false)
    expect(document.activeElement).toBe(input)
    fireEvent.click(option.querySelector("[data-match]")!)
    expect(assign).toHaveBeenCalledWith("/tools/pdf-splitter/")
    input.blur()
    expect(input.getAttribute("aria-expanded")).toBe("false")
  })

  it("leaves in-progress CJK composition intact and applies filtering only after confirmation", async () => {
    const host = renderDirectory({
      ...props,
      language: "zh-CN",
      entries: [
        { ...entries[0], name: "编码工具", description: "处理文本。" },
        { ...entries[1], name: "其他工具", description: "另一个工具。" },
      ],
    })
    const input = screen.getByRole("combobox") as HTMLInputElement
    input.focus()
    fireEvent.compositionStart(input)
    fireEvent.input(input, { target: { value: "编码" } })
    expect(input.value).toBe("编码")
    expect(window.location.search).toBe("")
    expect(host.querySelectorAll("[data-tool-row]:not([hidden])")).toHaveLength(
      2
    )
    fireEvent.compositionEnd(input)
    await waitFor(() =>
      expect(
        host.querySelectorAll("[data-tool-row]:not([hidden])")
      ).toHaveLength(1)
    )
    expect(input.value).toBe("编码")
    expect(new URL(window.location.href).searchParams.get("query")).toBe("编码")
    expect(screen.getByRole("option").textContent).toContain("编码工具")
  })

  it("normalizes shared query URLs without losing other parameters, the fragment, or history state", async () => {
    window.history.replaceState(
      { marker: 1 },
      "",
      "/categories/pdf/?source=home#tools"
    )
    renderDirectory()
    const input = screen.getByRole("combobox") as HTMLInputElement
    fireEvent.input(input, { target: { value: "  pdf   merge  " } })
    expect(input.value).toBe("  pdf   merge  ")
    expect(new URL(window.location.href).searchParams.get("query")).toBe(
      "pdf merge"
    )
    expect(new URL(window.location.href).searchParams.get("source")).toBe(
      "home"
    )
    expect(window.location.hash).toBe("#tools")
    expect(window.history.state).toEqual({ marker: 1 })
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: /PDF Splitter/ })).toBeNull()
    )
    fireEvent.click(
      screen.getByRole("button", { name: catalog.tools.clearSearchLabel })
    )
    expect(window.location.search).toBe("?source=home")
    expect(window.location.hash).toBe("#tools")
  })

  it("renders suggestion names as text rather than interpreting markup", () => {
    renderDirectory({
      ...props,
      entries: [{ ...entries[0], name: "<img src=x onerror=alert(1)>" }],
    })
    const input = screen.getByRole("combobox")
    input.focus()
    fireEvent.input(input, { target: { value: "img" } })
    const option = screen.getByRole("option")
    expect(option.textContent).toContain("<img src=x onerror=alert(1)>")
    expect(option.querySelector("img")).toBeNull()
    expect(option.querySelector("[data-match]")!.textContent).toBe("img")
  })

  it("announces an empty registry and removes its event listeners on disposal", async () => {
    renderDirectory({ ...props, entries: [] })
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe(
        catalog.tools.emptyRegistryTitle
      )
    )
    const input = screen.getByRole("combobox") as HTMLInputElement
    const dispose = disposers.pop()!
    dispose()
    fireEvent.keyDown(document.body, { key: "k", ctrlKey: true })
    expect(document.activeElement).not.toBe(input)
    fireEvent.input(input, { target: { value: "merge" } })
    expect(window.location.search).toBe("")
  })
})

it("preserves a query typed before the native module finishes loading", async () => {
  renderDirectory(props, "merge")
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("merge")
  expect(new URL(window.location.href).searchParams.get("query")).toBe("merge")
  await waitFor(() =>
    expect(screen.queryByRole("link", { name: /PDF Splitter/ })).toBeNull()
  )
})
