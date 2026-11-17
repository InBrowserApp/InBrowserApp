import {
  readDirectoryRows,
  scrollActiveCategory,
  updateDirectoryRows,
} from "./directory-dom"
import {
  normalizeQuery,
  rankToolEntries,
  readDirectoryQueryFromLocation,
} from "./search-core"
import { setupSearch } from "./search-client"
import type { SiteLanguage } from "@/lib/site"

function setupDirectorySearch(root: HTMLElement) {
  const directory = root.closest<HTMLElement>("[data-tools-directory]")!
  const rows = readDirectoryRows(directory)
  const status = root.querySelector<HTMLElement>("[data-directory-status]")!
  const language = root.lang as SiteLanguage
  const count = new Intl.NumberFormat(language)
  let frame: number | undefined

  function filterRows(query: string) {
    frame = undefined
    const normalized = normalizeQuery(query)
    const matches = rankToolEntries(rows, normalized, language)
    updateDirectoryRows(directory, rows, matches)
    status.textContent =
      rows.length === 0
        ? status.dataset.registry!
        : matches.length === 0
          ? status.dataset.empty!
          : `${count.format(matches.length)} ${status.dataset.suffix}`
    status.classList.toggle("sr-only", !normalized || matches.length === 0)
    status.setAttribute("aria-busy", "false")
  }

  function filter(query: string, syncUrl: boolean) {
    if (syncUrl) {
      const url = new URL(window.location.href)
      const normalized = normalizeQuery(query)
      if (normalized) url.searchParams.set("query", normalized)
      else url.searchParams.delete("query")
      window.history.replaceState(window.history.state, "", url)
    }
    if (frame !== undefined) cancelAnimationFrame(frame)
    status.setAttribute("aria-busy", "true")
    frame = requestAnimationFrame(() => filterRows(query))
  }

  const search = setupSearch(root, {
    entries: rows,
    onQueryChange: (query) => filter(query, true),
  })
  function sync() {
    const query = readDirectoryQueryFromLocation()
    search.setQuery(query)
    filter(query, false)
  }
  const input = root.querySelector<HTMLInputElement>("input")!
  const typed = input.value
  const initial = typed || readDirectoryQueryFromLocation()
  search.setQuery(initial)
  filter(initial, typed !== "")
  scrollActiveCategory(directory)
  window.addEventListener("popstate", sync)
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    window.removeEventListener("popstate", sync)
    search.destroy()
  }
}

export { setupDirectorySearch }
