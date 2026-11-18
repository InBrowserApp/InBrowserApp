import type { CSL } from "@citation-js/core"

export type Duplicate = {
  reason: "doi" | "metadata"
  entries: number[]
  title?: string
}

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim()
}

function doiOf(entry: CSL) {
  const resolver = /^https?:\/\/(?:dx\.)?doi\.org\//i
  const url = entry.URL?.trim() ?? ""
  const doi = (entry.DOI?.trim() || (resolver.test(url) ? url : ""))
    .replace(resolver, "")
    .replace(/^doi:\s*/i, "")
    .toLowerCase()
  return /^10\.\d{4,}\/\S+$/.test(doi) ? doi : ""
}

function metadataOf(entry: CSL) {
  const title = normalize(entry.title?.replace(/<\/?[a-z][^>]*>/gi, "") ?? "")
  const year = entry.issued?.["date-parts"]?.[0]?.[0]
  const author = entry.author?.[0]
  const family = normalize(author?.family ?? "")
  const initial = Array.from(normalize(author?.given ?? ""))[0]
  const name =
    family && initial ? [family, initial] : [normalize(author?.literal ?? "")]
  if (!title || !year || !name[0]) return ""
  return JSON.stringify([title, String(year), name])
}

function addMatch(matches: Map<string, number[]>, key: string, index: number) {
  if (!key) return
  const group = matches.get(key)
  if (group) group.push(index)
  else matches.set(key, [index])
}

export function findDuplicates(entries: CSL[]): Duplicate[] {
  const byDoi = new Map<string, number[]>()
  const byMetadata = new Map<string, number[]>()
  const dois = entries.map(doiOf)
  entries.forEach((entry, index) => {
    addMatch(byDoi, dois[index]!, index)
    addMatch(byMetadata, metadataOf(entry), index)
  })

  const duplicates: Duplicate[] = []
  function addGroup(indexes: number[], reason: Duplicate["reason"]) {
    duplicates.push({
      reason,
      entries: indexes.map((index) => index + 1),
      title: indexes.map((index) => entries[index]!.title).find(Boolean),
    })
  }

  for (const indexes of byDoi.values()) {
    if (indexes.length > 1) addGroup(indexes, "doi")
  }

  for (const indexes of byMetadata.values()) {
    if (indexes.length < 2) continue
    const keys = new Set(indexes.map((index) => dois[index]).filter(Boolean))
    // A metadata match should neither override conflicting DOIs nor repeat a DOI match.
    if (keys.size > 1 || indexes.every((index) => dois[index])) continue
    addGroup(indexes, "metadata")
  }

  return duplicates.sort((a, b) => a.entries[0]! - b.entries[0]!)
}
