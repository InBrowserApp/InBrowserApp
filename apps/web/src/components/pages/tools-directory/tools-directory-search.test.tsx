import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ToolsDirectorySearch } from "./tools-directory-search"
import catalog from "../../../messages/en.json"

vi.mock("astro:transitions/client", () => ({ navigate: vi.fn() }))

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
const props = {
  entries,
  category: "pdf",
  categoryCounts: [
    { category: "pdf", count: 2 },
    { category: "json", count: 1 },
  ],
  language: "en" as const,
  messages: { ...catalog.tools, categoryLabels: catalog.tools.categories },
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, "", "/")
})

describe("category directory", () => {
  it("renders its tools and localized category links before JavaScript runs", () => {
    const html = renderToStaticMarkup(
      <ToolsDirectorySearch {...props} language="zh-CN" />
    )
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
    render(<ToolsDirectorySearch {...props} />)

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
    render(<ToolsDirectorySearch {...props} category={undefined} />)

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
