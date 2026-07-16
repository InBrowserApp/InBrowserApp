import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import type { ToolDirectoryEntry } from "@/lib/tools-directory"

import { ToolsDirectorySearch } from "./tools-directory-search"

const MESSAGES = {
  clearSearchLabel: "Clear search",
  emptyRegistryDescription: "No tools are registered.",
  emptyRegistryTitle: "No tools",
  emptySearchDescription: "Try another search.",
  emptySearchTitle: "No matches",
  resultCountSuffix: "tools",
  searchLabel: "Search tools",
  searchPlaceholder: "Search all tools",
  toolsTitle: "Tools",
} as const

const ENTRIES = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1

  return {
    description:
      number === 25
        ? "The only off-page needle tool"
        : `Tool description ${number}`,
    icon: "wrench",
    name: number === 25 ? "Off-page Needle" : `Tool ${number}`,
    slug: `tool-${number}`,
  }
}) satisfies readonly ToolDirectoryEntry[]

function getRenderedSlugs() {
  return [...document.querySelectorAll<HTMLElement>("[data-tool-card]")].map(
    (card) => card.dataset.toolCard
  )
}

describe("ToolsDirectorySearch", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/tools/")
  })

  afterEach(cleanup)

  it("searches the full index and clears back to the original browse page", async () => {
    render(
      <ToolsDirectorySearch
        basePath="/tools/"
        entries={ENTRIES}
        language="en"
        messages={MESSAGES}
        pageNumber={1}
      />
    )

    await waitFor(() => expect(getRenderedSlugs()).toHaveLength(24))
    expect(getRenderedSlugs()).not.toContain("tool-25")

    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools" }), {
      target: { value: "Off-page Needle" },
    })

    await waitFor(() => expect(getRenderedSlugs()).toEqual(["tool-25"]))
    expect(window.location.search).toBe("?query=Off-page+Needle")

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }))

    await waitFor(() => expect(getRenderedSlugs()).toHaveLength(24))
    expect(getRenderedSlugs()).not.toContain("tool-25")
    expect(window.location.pathname).toBe("/tools/")
    expect(window.location.search).toBe("")
  })

  it("keeps the page-two pathname while paging through search results", async () => {
    window.history.replaceState(null, "", "/tools/page/2/")

    render(
      <ToolsDirectorySearch
        basePath="/tools/"
        entries={ENTRIES}
        language="en"
        messages={MESSAGES}
        pageNumber={2}
      />
    )

    await waitFor(() => expect(getRenderedSlugs()).toHaveLength(6))
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools" }), {
      target: { value: "Tool" },
    })

    const pageTwoLink = await waitFor(() => {
      const link = document.querySelector<HTMLAnchorElement>(
        'a[href="/tools/page/2/?query=Tool&page=2"]'
      )
      expect(link).toBeTruthy()
      return link as HTMLAnchorElement
    })

    fireEvent.click(pageTwoLink)

    await waitFor(() => expect(getRenderedSlugs()).toHaveLength(6))
    expect(window.location.pathname).toBe("/tools/page/2/")
    expect(window.location.search).toBe("?query=Tool&page=2")
  })
})
