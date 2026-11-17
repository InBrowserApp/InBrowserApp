import { experimental_AstroContainer as AstroContainer } from "astro/container"
import reactRenderer from "@astrojs/react/server.js"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import CategoryNav from "./category-nav.astro"
import DirectoryEmptyState from "./directory-empty-state.astro"
import ToolList from "./tool-list.astro"
import ToolsDirectorySearch from "./tools-directory-search.astro"
import { setupDirectorySearch } from "./directory-client"
import { rankToolEntries } from "./search-core"
import type { DirectoryToolEntry } from "@/lib/tool-directory"
import type { SiteLanguage } from "@/lib/site"
import catalog from "../../../messages/en.json"

const entries: readonly DirectoryToolEntry[] = [
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
const cleanups: (() => void)[] = []

async function renderDirectory(
  options: {
    entries?: readonly DirectoryToolEntry[]
    language?: SiteLanguage
    category?: string | null
    initialInput?: string
  } = {}
) {
  const language = options.language ?? "en"
  const tools = options.entries ?? entries
  const nav = {
    counts: [
      { category: "pdf", count: 2 },
      { category: "json", count: 1 },
    ],
    totalCount: 3,
    selected: options.category === undefined ? "pdf" : options.category,
    language,
    labels: catalog.tools.categories,
    allLabel: catalog.tools.categoryAll,
    categoriesLabel: catalog.tools.categoriesLabel,
  }
  const container = await AstroContainer.create()
  container.addServerRenderer({
    name: "@astrojs/react",
    renderer: reactRenderer,
  })
  const [sidebar, chips, search, list, empty] = await Promise.all([
    container.renderToString(CategoryNav, {
      props: { ...nav, variant: "sidebar" },
    }),
    container.renderToString(CategoryNav, {
      props: { ...nav, variant: "chips" },
    }),
    container.renderToString(ToolsDirectorySearch, {
      props: {
        language,
        messages: {
          ...catalog.tools,
          categoryLabels: catalog.tools.categories,
        },
      },
    }),
    container.renderToString(ToolList, {
      props: {
        entries: rankToolEntries(tools, "", language),
        language,
        categoryLabels: catalog.tools.categories,
        showCategory: !nav.selected,
      },
    }),
    container.renderToString(DirectoryEmptyState, {
      props: {
        icon: tools.length ? "search" : "registry",
        title: tools.length
          ? catalog.tools.emptySearchTitle
          : catalog.tools.emptyRegistryTitle,
        description: catalog.tools.emptySearchDescription,
      },
    }),
  ])
  const host = document.createElement("div")
  host.innerHTML = `<div data-tools-directory>${sidebar}<div>${chips}${search}${list}<div data-tool-empty hidden>${empty}</div></div></div>`
  document.body.append(host)
  host.querySelector<HTMLInputElement>("input")!.value =
    options.initialInput ?? ""
  cleanups.push(setupDirectorySearch(host.querySelector("directory-search")!))
  await new Promise(requestAnimationFrame)
  return {
    host,
    input: screen.getByRole<HTMLInputElement>("combobox"),
    visibleSlugs: () =>
      Array.from(
        host.querySelectorAll<HTMLElement>("[data-tool-row]:not([hidden])")
      ).map((row) => row.dataset.toolRow),
  }
}

async function updateQuery(input: HTMLInputElement, query: string) {
  fireEvent.input(input, { target: { value: query } })
  await waitFor(() =>
    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("false")
  )
}

afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  document.body.replaceChildren()
  vi.restoreAllMocks()
  window.history.replaceState(null, "", "/")
})

describe("Astro directory search", () => {
  it("renders static tools, a native form, and localized category links without hydration", async () => {
    const { host } = await renderDirectory({ language: "zh-CN" })
    expect(host.querySelector("astro-island")).toBeNull()
    expect(
      host.querySelector('a[href="/zh-CN/tools/pdf-merger/"]')
    ).not.toBeNull()
    expect(
      host.querySelector('a[href="/zh-CN/tools/pdf-splitter/"]')
    ).not.toBeNull()
    expect(
      host.querySelectorAll(
        'a[href="/zh-CN/categories/pdf/"][aria-current="page"]'
      )
    ).toHaveLength(2)
    expect(
      host.querySelector('a[href="/zh-CN/categories/json/"]')
    ).not.toBeNull()
    expect(host.querySelector('a[href="/zh-CN/tools/"]')).not.toBeNull()
    expect(host.innerHTML).not.toContain("?category=")
  })

  it("announces a short count outside the filtered list", async () => {
    const { input } = await renderDirectory()
    const status = screen.getByRole("status")
    expect(status.getAttribute("aria-live")).toBe("polite")
    expect(status.getAttribute("aria-atomic")).toBe("true")
    expect(status.textContent).toBe("2 tools")
    expect(
      screen.getByRole("link", { name: /PDF Merger/ }).closest("[aria-live]")
    ).toBeNull()
    await updateQuery(input, "merge")
    expect(status.textContent).toBe("1 tools")
    expect(status.querySelector("a")).toBeNull()
  })

  it("restores shared URLs, keeps the category path, and responds to popstate", async () => {
    window.history.replaceState(null, "", "/categories/pdf/?query=merge")
    const { input, visibleSlugs } = await renderDirectory()
    expect(input.value).toBe("merge")
    expect(visibleSlugs()).toEqual(["pdf-merger"])
    expect(window.location.search).toBe("?query=merge")
    await updateQuery(input, "split")
    expect(visibleSlugs()).toEqual(["pdf-splitter"])
    expect(window.location.pathname).toBe("/categories/pdf/")
    expect(window.location.search).toBe("?query=split")
    window.history.replaceState(null, "", "/categories/pdf/?query=merge")
    window.dispatchEvent(new PopStateEvent("popstate"))
    await waitFor(() =>
      expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("false")
    )
    expect(input.value).toBe("merge")
    expect(visibleSlugs()).toEqual(["pdf-merger"])
  })

  it("ignores the obsolete category query parameter", async () => {
    window.history.replaceState(null, "", "/tools/?category=json")
    const { visibleSlugs, host } = await renderDirectory({ category: null })
    expect(visibleSlugs()).toHaveLength(2)
    expect(
      host.querySelector('a[href="/tools/"][aria-current="page"]')
    ).not.toBeNull()
  })

  it("preserves rows through empty results and clear-button activation", async () => {
    const { host, input } = await renderDirectory()
    const original = host.querySelector('[data-tool-row="pdf-merger"]')
    await updateQuery(input, "missing")
    expect(host.querySelector<HTMLElement>("[data-tool-list]")!.hidden).toBe(
      true
    )
    expect(host.querySelector<HTMLElement>("[data-tool-empty]")!.hidden).toBe(
      false
    )
    expect(host.querySelector('[data-tool-row="pdf-merger"]')).toBe(original)
    fireEvent.click(
      screen.getByRole("button", { name: catalog.tools.clearSearchLabel })
    )
    await waitFor(() =>
      expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("false")
    )
    expect(screen.getByRole("link", { name: /PDF Merger/ })).toBe(original)
    expect(host.querySelector<HTMLElement>("[data-tool-empty]")!.hidden).toBe(
      true
    )
    expect(document.activeElement).toBe(input)
    expect(window.location.search).toBe("")
  })

  it("sorts existing rows by relevance and restores alphabetical order", async () => {
    const { host, input, visibleSlugs } = await renderDirectory({
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
    await updateQuery(input, "json")
    expect(visibleSlugs()).toEqual(["json", "json-formatter", "encoder"])
    await updateQuery(input, "formatter")
    expect(visibleSlugs()).toEqual(["json-formatter"])
    expect(
      host.querySelector("[data-first-visible]")!.getAttribute("data-tool-row")
    ).toBe("json-formatter")
    await updateQuery(input, "")
    expect(visibleSlugs()).toEqual(["encoder", "json", "json-formatter"])
  })

  it("keeps suggestions as real localized links and ignores IME confirmation", async () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {})
    const { input } = await renderDirectory({ language: "zh-CN" })
    input.focus()
    fireEvent.compositionStart(input)
    fireEvent.input(input, { target: { value: "merge" } })
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    expect(assign).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input)
    expect(screen.getByRole("option").getAttribute("href")).toContain(
      "/zh-CN/tools/pdf-merger/"
    )
    fireEvent.keyDown(input, { key: "Enter" })
    expect(assign.mock.calls[0][0]).toContain("/zh-CN/tools/pdf-merger/")
  })

  it("announces an empty registry without navigation on Enter", async () => {
    const { host, input } = await renderDirectory({ entries: [] })
    expect(screen.getByRole("status").textContent).toBe(
      catalog.tools.emptyRegistryTitle
    )
    fireEvent.input(input, { target: { value: "missing" } })
    const submit = new Event("submit", { bubbles: true, cancelable: true })
    host.querySelector("form")!.dispatchEvent(submit)
    expect(submit.defaultPrevented).toBe(true)
  })

  it("preserves input entered before startup and URL state around normalized queries", async () => {
    window.history.replaceState(
      { marker: 1 },
      "",
      "/categories/pdf/?source=home#tools"
    )
    const { input, visibleSlugs } = await renderDirectory({
      initialInput: "merge",
    })
    expect(input.value).toBe("merge")
    expect(visibleSlugs()).toEqual(["pdf-merger"])
    await updateQuery(input, "  pdf   split  ")
    expect(input.value).toBe("  pdf   split  ")
    expect(new URL(window.location.href).searchParams.get("query")).toBe(
      "pdf split"
    )
    expect(new URL(window.location.href).searchParams.get("source")).toBe(
      "home"
    )
    expect(window.location.hash).toBe("#tools")
    expect(window.history.state).toEqual({ marker: 1 })
    fireEvent.click(
      screen.getByRole("button", { name: catalog.tools.clearSearchLabel })
    )
    expect(window.location.search).toBe("?source=home")
    expect(window.location.hash).toBe("#tools")
  })

  it("defers row filtering during CJK composition and announces the final update", async () => {
    const { input, visibleSlugs } = await renderDirectory({
      language: "zh-CN",
      entries: [
        { ...entries[0], name: "编码工具", description: "处理文本。" },
        { ...entries[1], name: "其他工具", description: "另一个工具。" },
      ],
    })
    input.focus()
    fireEvent.compositionStart(input)
    fireEvent.input(input, { target: { value: "编码" } })
    expect(input.value).toBe("编码")
    expect(window.location.search).toBe("")
    expect(visibleSlugs()).toHaveLength(2)
    fireEvent.compositionEnd(input)
    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true")
    await waitFor(() => expect(visibleSlugs()).toEqual(["pdf-merger"]))
    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("false")
    expect(new URL(window.location.href).searchParams.get("query")).toBe("编码")
    expect(input.value).toBe("编码")
  })

  it("supports touch and pointer highlight without moving focus into the list", async () => {
    const { input } = await renderDirectory()
    input.focus()
    fireEvent.input(input, { target: { value: "pdf" } })
    const option = screen.getAllByRole("option")[1]
    fireEvent.pointerOver(option.querySelector("[data-match]")!)
    expect(option.getAttribute("aria-selected")).toBe("true")
    expect(
      fireEvent.pointerDown(option, { button: 0, pointerType: "touch" })
    ).toBe(false)
    expect(document.activeElement).toBe(input)
    expect(option.getAttribute("href")).toContain("/tools/pdf-splitter/")
  })

  it("cancels pending filtering and global listeners on disposal", async () => {
    const { input } = await renderDirectory()
    fireEvent.input(input, { target: { value: "merge" } })
    const url = window.location.href
    cleanups.pop()!()
    fireEvent.input(input, { target: { value: "split" } })
    fireEvent.keyDown(document.body, { key: "k", ctrlKey: true })
    expect(document.activeElement).not.toBe(input)
    expect(window.location.href).toBe(url)
    await new Promise(requestAnimationFrame)
    expect(screen.getByRole("status").textContent).toBe("2 tools")
  })
})
