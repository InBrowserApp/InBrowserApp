import type { PageLayout, RtfDocument } from "rtf-viewer"

export function pageText(page: PageLayout) {
  return page.lines
    .map((line) =>
      line.fragments
        .map((fragment) => (fragment.kind === "text" ? fragment.text : ""))
        .join("")
    )
    .join("\n")
}

export type Match = { page: number; start: number; end: number }

export async function findMatches(
  document: RtfDocument,
  query: string,
  signal: AbortSignal
) {
  const matches: Match[] = []
  // A Unicode-insensitive RegExp preserves original UTF-16 offsets (lowercasing does not).
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  if (!escaped) return matches
  const pattern = new RegExp(escaped.replace(/\s+/g, "\\s+"), "giu")
  for (let page = 0; page < document.pageCount; page++) {
    signal.throwIfAborted()
    const text = pageText(document.getPageLayout(page))
    for (const match of text.matchAll(pattern))
      matches.push({
        page: page + 1,
        start: match.index,
        end: match.index + match[0].length,
      })
    if (page % 32 === 0)
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }
  signal.throwIfAborted()
  return matches
}
