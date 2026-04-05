/**
 * Resolve a localized asset from a Vite eager-glob record.
 *
 * The record is keyed by file path (e.g. `"./meta/en.json"`) and the
 * language is extracted from the filename stem.  Resolution order:
 *
 *   requested `lang`  →  `"en"` fallback  →  first available entry
 *
 * Returns `undefined` only when the record is empty.
 */
function resolveLocale<T>(
  modules: Record<string, T>,
  lang: string
): T | undefined {
  const byLang = new Map<string, T>()

  for (const [path, value] of Object.entries(modules)) {
    const filename = path.split("/").at(-1) ?? ""
    const language = filename.replace(/\.[^.]+$/u, "")
    byLang.set(language, value)
  }

  return byLang.get(lang) ?? byLang.get("en") ?? byLang.values().next().value
}

export { resolveLocale }
