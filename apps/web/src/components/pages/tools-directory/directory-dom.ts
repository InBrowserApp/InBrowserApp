import type { SearchSuggestionEntry } from "@/lib/tool-directory"

type DirectoryRow = SearchSuggestionEntry & {
  description: string
  element: HTMLAnchorElement
}

function readDirectoryRows(root: HTMLElement): readonly DirectoryRow[] {
  return (
    Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-tool-row]"))
      .map((element) => ({
        element,
        slug: element.dataset.toolRow!,
        category: element.dataset.category!,
        alternateName: element.dataset.alternateName,
        name: element.querySelector("[data-tool-name]")!.textContent!.trim(),
        description: element
          .querySelector("[data-tool-description]")!
          .textContent!.trim(),
      }))
      // Keep the registry's slug order as the relevance-score tie breaker,
      // independently of the alphabetical order of the rendered HTML.
      .sort((left, right) => left.slug.localeCompare(right.slug))
  )
}

function updateDirectoryRows(
  root: HTMLElement,
  rows: readonly DirectoryRow[],
  matches: readonly DirectoryRow[]
) {
  const list = root.querySelector<HTMLElement>("[data-tool-list]")!
  const visible = new Set(matches)

  for (const row of rows) {
    const shouldHide = !visible.has(row)
    if (row.element.hidden !== shouldHide) row.element.hidden = shouldHide
    const isFirst = row === matches[0]
    if (row.element.hasAttribute("data-first-visible") !== isFirst) {
      row.element.toggleAttribute("data-first-visible", isFirst)
    }
  }

  // Leave hidden nodes in place and move only visible rows whose order changed.
  let next = list.firstElementChild
  for (const row of matches) {
    while (next instanceof HTMLElement && next.hidden) {
      next = next.nextElementSibling
    }
    if (row.element === next) {
      next = next.nextElementSibling
    } else {
      list.insertBefore(row.element, next)
    }
  }

  list.hidden = matches.length === 0
  root.querySelector<HTMLElement>("[data-tool-empty]")!.hidden =
    matches.length !== 0
}

function scrollActiveCategory(root: HTMLElement) {
  const link = root.querySelector<HTMLElement>(
    "[data-category-chips] [aria-current=page]"
  )
  const container = link?.parentElement
  if (!link || !container) return

  const linkBounds = link.getBoundingClientRect()
  const containerBounds = container.getBoundingClientRect()
  container.scrollLeft +=
    linkBounds.left -
    containerBounds.left -
    (containerBounds.width - linkBounds.width) / 2
}

export { readDirectoryRows, scrollActiveCategory, updateDirectoryRows }
