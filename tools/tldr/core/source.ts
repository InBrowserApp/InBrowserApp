import type { Catalog, Variant } from "./lookup"

const repository = "tldr-pages/tldr"

function pagePath({ q, os, locale }: Variant) {
  const directory = locale === "en" ? "pages" : `pages.${locale}`
  return `${directory}/${os}/${encodeURIComponent(q)}.md`
}

export function sourceLink(revision: string, page: Variant) {
  return `https://github.com/${repository}/blob/${revision}/${pagePath(page)}`
}

export async function fetchPage(
  revision: string,
  page: Variant,
  signal: AbortSignal
) {
  const path = pagePath(page)
  const sources = [
    `https://cdn.jsdelivr.net/gh/${repository}@${revision}/${path}`,
    `https://raw.githubusercontent.com/${repository}/${revision}/${path}`,
  ]

  for (const url of sources) {
    signal.throwIfAborted()
    try {
      const response = await fetch(url, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(4_000)]),
        credentials: "omit",
        referrerPolicy: "no-referrer",
      })
      if (!response.ok) continue
      const markdown = await response.text()
      if (/^#\s+\S/.test(markdown)) return markdown
    } catch {
      signal.throwIfAborted()
      // A timeout or a failed request can be recovered by the next source.
    }
  }
  throw new Error("tldr page is unavailable")
}

export async function fetchCatalog(signal: AbortSignal) {
  const response = await fetch(new URL("../commands.json", import.meta.url), {
    signal,
  })
  if (!response.ok) throw new Error("tldr catalog is unavailable")
  return (await response.json()) as Catalog
}
