import type { ToolSearchSuggestion } from "./search-core"

function renderSuggestions(
  root: HTMLElement,
  suggestions: readonly ToolSearchSuggestion[]
) {
  const form = root.querySelector<HTMLFormElement>("[data-search-form]")!
  const input = form.querySelector<HTMLInputElement>("input")!
  const list = form.querySelector<HTMLUListElement>("[role=listbox]")!
  const template = form.querySelector<HTMLTemplateElement>(
    "[data-search-option]"
  )!
  const labels = JSON.parse(form.dataset.categoryLabels!) as Record<
    string,
    string
  >
  const fragment = document.createDocumentFragment()

  for (const [index, suggestion] of suggestions.entries()) {
    const row = template.content.cloneNode(true) as DocumentFragment
    const option = row.querySelector<HTMLAnchorElement>("[role=option]")!
    option.id = `${list.id}-option-${index}`
    option.href = `${form.action}${suggestion.entry.slug}/`
    option.dataset.index = String(index)
    row.querySelector("[data-pre]")!.textContent = suggestion.pre
    row.querySelector("[data-match]")!.textContent = suggestion.match
    row.querySelector("[data-post]")!.textContent = suggestion.post
    row.querySelector("[data-category]")!.textContent =
      labels[suggestion.entry.category] ?? suggestion.entry.category
    fragment.append(row)
  }

  list.replaceChildren(fragment)
  list.hidden = suggestions.length === 0
  form.querySelector<HTMLElement>("[data-search-empty]")!.hidden =
    suggestions.length !== 0
  form.querySelector<HTMLElement>("[data-search-footer]")!.hidden =
    suggestions.length === 0
  const count = form.querySelector<HTMLElement>("[data-search-count]")!
  const message =
    suggestions.length === 1 ? count.dataset.one! : count.dataset.many!
  count.textContent = message.replace(
    /\{count\}/g,
    new Intl.NumberFormat(root.lang).format(suggestions.length)
  )
  input.removeAttribute("aria-activedescendant")
}

function highlightSuggestion(root: HTMLElement, index: number, open: boolean) {
  const input = root.querySelector<HTMLInputElement>("input")!
  const options = root.querySelectorAll<HTMLElement>("[role=option]")
  options.forEach((option, position) => {
    option.setAttribute("aria-selected", String(position === index))
  })
  if (open && options[index]) {
    input.setAttribute("aria-activedescendant", options[index].id)
  } else {
    input.removeAttribute("aria-activedescendant")
  }
}

export { highlightSuggestion, renderSuggestions }
