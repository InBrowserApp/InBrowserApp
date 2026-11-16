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
import { ToolsDirectorySearch } from "./tools-directory-search"
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

function renderDirectory(options = props) {
  const host = document.createElement("div")
  host.innerHTML = directoryHtml(options)
  document.body.append(host)
  render(
    <ToolsDirectorySearch
      language={options.language}
      messages={options.messages}
    />,
    {
      container: host.querySelector<HTMLElement>("[data-search-slot]")!,
    }
  )
  return host
}

afterEach(() => {
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
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "merge" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(assign).toHaveBeenCalledWith("/zh-CN/tools/pdf-merger/")
  })

  it("opens a tool with browser navigation when a suggestion is clicked", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    renderDirectory()
    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "split" } })
    fireEvent.mouseDown(screen.getByRole("option"))

    expect(assign).toHaveBeenCalledWith("/tools/pdf-splitter/")
  })

  it("opens the localized directory with an encoded home search query", () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    render(
      <HomeSearch
        entries={entries}
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
    expect(status.textContent).toBe("2 tools")
    expect(status.querySelector("a")).toBeNull()
    expect(
      screen.getByRole("link", { name: /PDF Merger/ }).closest("[aria-live]")
    ).toBeNull()

    fireEvent.change(screen.getByRole("combobox"), {
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

    fireEvent.change(screen.getByRole("combobox"), {
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
    fireEvent.change(input, { target: { value: "missing" } })
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
    fireEvent.change(input, { target: { value: "json" } })
    await waitFor(() =>
      expect(visibleSlugs()).toEqual(["json", "json-formatter", "encoder"])
    )
    fireEvent.change(input, { target: { value: "formatter" } })
    await waitFor(() => expect(visibleSlugs()).toEqual(["json-formatter"]))
    expect(
      host.querySelector("[data-first-visible]")!.getAttribute("data-tool-row")
    ).toBe("json-formatter")
    fireEvent.change(input, { target: { value: "" } })
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
    fireEvent.focus(input)
    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: "merge" } })
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    expect(assign).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input)
    fireEvent.keyDown(input, { key: "Enter" })
    expect(assign).toHaveBeenCalledWith("/tools/pdf-merger/")
  })
})
