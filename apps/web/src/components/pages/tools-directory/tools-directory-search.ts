import type { SiteLanguage } from "@/lib/site"
import {
  readDirectoryRows,
  scrollActiveCategory,
  updateDirectoryRows,
} from "./directory-dom"
import {
  buildSearchSuggestions,
  normalizeQuery,
  rankToolEntries,
  readDirectoryQueryFromLocation,
} from "./search-core"

export function setupDirectorySearch(root: HTMLElement) {
  const directory = root.closest<HTMLElement>("[data-tools-directory]")!
  const rows = readDirectoryRows(directory)
  const language = root.dataset.language as SiteLanguage
  const labels: Record<string, string> = JSON.parse(
    root.dataset.categoryLabels!
  )
  const input = root.querySelector<HTMLInputElement>("[data-search-input]")!
  const clear = root.querySelector<HTMLButtonElement>("[data-search-clear]")!
  const shortcut = root.querySelector<HTMLElement>("[data-search-shortcut]")!
  const popup = root.querySelector<HTMLElement>("[data-search-popup]")!
  const list = root.querySelector<HTMLUListElement>("[role=listbox]")!
  const template = root.querySelector<HTMLTemplateElement>(
    "[data-search-option]"
  )!
  const count = root.querySelector<HTMLElement>("[data-suggestion-count]")!
  const status = root.querySelector<HTMLElement>("[data-search-status]")!
  const numberFormat = new Intl.NumberFormat(language)
  let query = ""
  let composing = false
  let dismissed = false
  let highlighted = 0
  let frame: number | undefined
  let suggestions: ReturnType<typeof buildSearchSuggestions> = []

  function updatePopup() {
    const open =
      document.activeElement === input &&
      normalizeQuery(query) !== "" &&
      !dismissed
    popup.hidden = !open
    input.setAttribute("aria-expanded", String(open))
    if (open && suggestions.length > 0) {
      input.setAttribute("aria-activedescendant", `${list.id}-${highlighted}`)
    } else {
      input.removeAttribute("aria-activedescendant")
    }
    for (const [index, option] of Array.from(list.children).entries()) {
      option.setAttribute("aria-selected", String(index === highlighted))
    }
  }

  function renderSuggestions() {
    suggestions = buildSearchSuggestions(rows, query, language)
    list.replaceChildren(
      ...suggestions.map((suggestion, index) => {
        const option = template.content.firstElementChild!.cloneNode(
          true
        ) as HTMLElement
        option.id = `${list.id}-${index}`
        option.dataset.index = String(index)
        for (const key of ["pre", "match", "post"] as const) {
          option.querySelector<HTMLElement>(`[data-${key}]`)!.textContent =
            suggestion[key]
        }
        option.querySelector<HTMLElement>("[data-category]")!.textContent =
          labels[suggestion.entry.category] ?? suggestion.entry.category
        return option
      })
    )
    root.querySelector<HTMLElement>("[data-search-no-suggestions]")!.hidden =
      suggestions.length > 0
    root.querySelector<HTMLElement>("[data-search-matches]")!.hidden =
      suggestions.length === 0
    const message =
      suggestions.length === 1 ? count.dataset.one! : count.dataset.many!
    count.textContent = message.replaceAll(
      "{count}",
      String(suggestions.length)
    )
    updatePopup()
  }

  function filterRows() {
    frame = undefined
    const normalized = normalizeQuery(query)
    const matches = rankToolEntries(rows, normalized, language)
    updateDirectoryRows(directory, rows, matches)
    status.textContent =
      rows.length === 0
        ? status.dataset.emptyRegistry!
        : matches.length === 0
          ? status.dataset.emptySearch!
          : `${numberFormat.format(matches.length)} ${status.dataset.suffix!}`
    status.classList.toggle(
      "sr-only",
      normalized === "" || matches.length === 0
    )
    status.setAttribute("aria-busy", "false")
  }

  function changeQuery(value: string, writeUrl = true) {
    query = value
    if (input.value !== value) input.value = value
    highlighted = 0
    dismissed = false
    input.toggleAttribute("data-filled", value.length > 0)
    clear.hidden = value.length === 0
    shortcut.hidden = value.length > 0
    if (writeUrl) {
      const url = new URL(window.location.href)
      const normalized = normalizeQuery(value)
      if (normalized) url.searchParams.set("query", normalized)
      else url.searchParams.delete("query")
      window.history.replaceState(window.history.state, "", url)
    }
    renderSuggestions()
    if (frame !== undefined) cancelAnimationFrame(frame)
    status.setAttribute("aria-busy", "true")
    frame = requestAnimationFrame(filterRows)
  }

  function openSuggestion(index: number) {
    const suggestion = suggestions[index]
    if (suggestion) {
      window.location.assign(
        rows
          .find((row) => row.slug === suggestion.entry.slug)!
          .element.getAttribute("href")!
      )
    }
  }

  function onInput() {
    if (!composing) changeQuery(input.value)
  }
  function onCompositionStart() {
    composing = true
  }
  function onCompositionEnd() {
    composing = false
    changeQuery(input.value)
  }
  function onInputKeyDown(event: KeyboardEvent) {
    if (composing || event.isComposing) return
    if (event.key === "Escape") dismissed = true
    else if (event.key === "Enter" && !popup.hidden && suggestions.length > 0) {
      event.preventDefault()
      openSuggestion(highlighted)
    } else if (!popup.hidden && suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        highlighted = Math.min(highlighted + 1, suggestions.length - 1)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        highlighted = Math.max(highlighted - 1, 0)
      }
    }
    updatePopup()
  }
  function onShortcut(event: KeyboardEvent) {
    const target = event.target
    const editable =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable)
    const command =
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
    const slash =
      event.key === "/" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !editable
    if (!command && !slash) return
    event.preventDefault()
    input.focus()
    input.select()
  }
  function keepFocus(event: PointerEvent) {
    if (event.button === 0) event.preventDefault()
  }
  function onClear() {
    changeQuery("")
    input.focus()
  }
  function onSuggestionClick(event: MouseEvent) {
    const option = (event.target as Element).closest<HTMLElement>(
      "[data-index]"
    )
    if (option) openSuggestion(Number(option.dataset.index))
  }
  function onSuggestionHover(event: PointerEvent) {
    const option = (event.target as Element).closest<HTMLElement>(
      "[data-index]"
    )
    if (option) {
      highlighted = Number(option.dataset.index)
      updatePopup()
    }
  }
  function syncLocation() {
    changeQuery(readDirectoryQueryFromLocation(), false)
  }

  const controller = new AbortController()
  const options = { signal: controller.signal }
  input.addEventListener("input", onInput, options)
  input.addEventListener("compositionstart", onCompositionStart, options)
  input.addEventListener("compositionend", onCompositionEnd, options)
  input.addEventListener("keydown", onInputKeyDown, options)
  input.addEventListener("focus", updatePopup, options)
  input.addEventListener("blur", updatePopup, options)
  clear.addEventListener("pointerdown", keepFocus, options)
  clear.addEventListener("click", onClear, options)
  list.addEventListener("pointerdown", keepFocus, options)
  list.addEventListener("click", onSuggestionClick, options)
  list.addEventListener("pointerover", onSuggestionHover, options)
  document.addEventListener("keydown", onShortcut, options)
  window.addEventListener("popstate", syncLocation, options)
  changeQuery(
    input.value || readDirectoryQueryFromLocation(),
    input.value !== ""
  )
  scrollActiveCategory(directory)

  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    controller.abort()
  }
}
