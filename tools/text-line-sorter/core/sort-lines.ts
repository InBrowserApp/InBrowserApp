type SortOptions = Readonly<{
  descending: boolean
  ignoreCase: boolean
  trim: boolean
  removeBlank: boolean
  deduplicate: boolean
}>

export const DEFAULT_OPTIONS: SortOptions = {
  descending: false,
  ignoreCase: false,
  trim: false,
  removeBlank: false,
  deduplicate: false,
}

export function sortLines(input: string, options: SortOptions): string {
  const seen = new Set<string>()
  const lines = input.split(/\r\n|\r|\n/).flatMap((raw) => {
    const text = options.trim ? raw.trim() : raw
    if (options.removeBlank && text.trim() === "") return []
    const key = options.ignoreCase ? text.toLowerCase() : text
    if (options.deduplicate && seen.has(key)) return []
    seen.add(key)
    return [{ text, key }]
  })

  lines.sort((a, b) => {
    const order = a.key < b.key ? -1 : a.key > b.key ? 1 : 0
    return options.descending ? -order : order
  })
  return lines.map(({ text }) => text).join("\n")
}
