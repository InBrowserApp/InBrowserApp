import { buildSearchSuggestions, normalizeQuery } from "./search-core"
import { highlightSuggestion, renderSuggestions } from "./search-render"
import type { SiteLanguage } from "@/lib/site"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"

type SearchOptions = {
  entries: readonly SearchSuggestionEntry[] | null
  loadEntries?: () => Promise<readonly SearchSuggestionEntry[]>
  onQueryChange?: (query: string) => void
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.matches("input,textarea,select") || target.isContentEditable)
  )
}

function setupSearch(root: HTMLElement, options: SearchOptions) {
  const events = new AbortController()
  const { signal } = events
  const form = root.querySelector<HTMLFormElement>("form")!
  const input = form.querySelector<HTMLInputElement>("input")!
  const clear = form.querySelector<HTMLButtonElement>("[data-search-clear]")!
  const shortcut = form.querySelector<HTMLElement>("[data-search-shortcut]")
  const popover = form.hasAttribute("popover")
  const panel = form.querySelector<HTMLElement>("[data-search-panel]")!
  const language = root.lang as SiteLanguage
  // The directory is already showing full results as the user types.
  const initialActive = options.onQueryChange ? 0 : -1
  let query = input.value
  let entries = options.entries
  let loading = false
  let composing = false
  let dismissed = false
  let active = initialActive

  function isOpen() {
    return (
      form.contains(document.activeElement) &&
      entries !== null &&
      normalizeQuery(query) !== "" &&
      !dismissed
    )
  }

  function refresh() {
    const suggestions = buildSearchSuggestions(entries ?? [], query, language)
    active = Math.min(active, Math.max(0, suggestions.length - 1))
    renderSuggestions(root, suggestions)
    const open = isOpen()
    panel.hidden = !open
    input.setAttribute("aria-expanded", String(open))
    highlightSuggestion(root, active, open)
    clear.hidden = query.length === 0
    if (shortcut) shortcut.hidden = !clear.hidden
  }

  function setQuery(value: string) {
    query = value
    input.value = value
    dismissed = false
    active = initialActive
    refresh()
  }

  function changed() {
    query = input.value
    dismissed = false
    active = initialActive
    options.onQueryChange?.(query)
    refresh()
  }

  async function focus() {
    refresh()
    if (entries !== null || loading || !options.loadEntries) return
    loading = true
    try {
      const loaded = await options.loadEntries()
      if (signal.aborted) return
      entries = loaded
      refresh()
    } catch {
      // Native GET submission remains usable; refocusing retries the index.
    } finally {
      loading = false
    }
  }

  input.addEventListener("focus", () => void focus(), { signal })
  form.addEventListener(
    "focusout",
    (event) => {
      if (
        event.relatedTarget instanceof Node &&
        form.contains(event.relatedTarget)
      )
        return
      active = initialActive
      refresh()
    },
    { signal }
  )
  input.addEventListener(
    "input",
    () => {
      if (!composing) changed()
    },
    { signal }
  )
  input.addEventListener(
    "compositionstart",
    () => {
      composing = true
    },
    { signal }
  )
  input.addEventListener(
    "compositionend",
    () => {
      composing = false
      changed()
    },
    { signal }
  )
  input.addEventListener(
    "keydown",
    (event) => {
      if (composing || event.isComposing) return
      const items = form.querySelectorAll<HTMLAnchorElement>("[role=option]")
      if (event.key === "Escape") {
        if (popover && !isOpen()) return
        event.preventDefault()
        dismissed = true
        refresh()
      } else if (event.key === "Enter" && isOpen() && items[active]) {
        event.preventDefault()
        window.location.assign(items[active].href)
      } else if (
        isOpen() &&
        items.length &&
        ["ArrowDown", "ArrowUp"].includes(event.key)
      ) {
        event.preventDefault()
        const last = items.length - 1
        if (event.key === "ArrowDown") {
          active = Math.min(active + 1, last)
        } else {
          active = active < 0 ? last : Math.max(active - 1, 0)
        }
        highlightSuggestion(root, active, true)
        items[active].scrollIntoView({ block: "nearest" })
      }
    },
    { signal }
  )
  form.addEventListener(
    "submit",
    (event) => {
      if (composing || !normalizeQuery(input.value) || options.onQueryChange) {
        event.preventDefault()
      } else {
        input.value = normalizeQuery(input.value)
      }
    },
    { signal }
  )
  // Keep the input focused without suppressing WebKit's click after a tap.
  clear.addEventListener("mousedown", (event) => event.preventDefault(), {
    signal,
  })
  clear.addEventListener(
    "click",
    () => {
      setQuery("")
      options.onQueryChange?.("")
      input.focus()
    },
    { signal }
  )
  panel.addEventListener(
    "mousedown",
    (event) => {
      if (event.button === 0) event.preventDefault()
    },
    { signal }
  )
  panel.addEventListener(
    "pointerover",
    (event) => {
      if (!options.onQueryChange || !(event.target instanceof Element)) return
      const option = event.target.closest<HTMLElement>("[role=option]")
      if (!option) return
      active = Number(option.dataset.index)
      highlightSuggestion(root, active, isOpen())
    },
    { signal }
  )
  if (shortcut) {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.defaultPrevented || composing || event.isComposing) return
        const command =
          (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"
        const slash =
          event.key === "/" &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          !isEditable(event.target)
        if (!command && !slash) return
        event.preventDefault()
        input.focus()
        input.select()
      },
      { signal }
    )
    shortcut.textContent = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? "⌘K"
      : "Ctrl K"
  }
  refresh()
  if (document.activeElement === input) void focus()
  return { setQuery, destroy: () => events.abort() }
}

function defineSearchElement(
  name: string,
  setup: (root: HTMLElement) => () => void
) {
  if (customElements.get(name)) return
  customElements.define(
    name,
    class extends HTMLElement {
      cleanup?: () => void
      connectedCallback() {
        this.cleanup = setup(this)
      }
      disconnectedCallback() {
        this.cleanup?.()
      }
    }
  )
}

export { defineSearchElement, setupSearch }
