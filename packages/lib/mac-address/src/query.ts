import { REGISTRIES, type MacQuery, type Registry } from "./types"

function readQuery(search: string): MacQuery {
  const params = new URLSearchParams(search)
  const registry = params.get("registry")
  const page = params.get("page") ?? "1"
  const pageNumber = Number(page)
  return {
    q: params.get("q") ?? "",
    registry: REGISTRIES.includes(registry as Registry)
      ? (registry as Registry)
      : "all",
    org: params.get("org") ?? "",
    page:
      /^\d+$/.test(page) && Number.isSafeInteger(pageNumber) && pageNumber > 0
        ? pageNumber
        : 1,
  }
}

function makeToolHref(
  language: string,
  slug: string,
  query: Partial<MacQuery> = {}
) {
  const params = new URLSearchParams()
  if (query.q) params.set("q", query.q)
  if (query.registry && query.registry !== "all") {
    params.set("registry", query.registry)
  }
  if (query.org) params.set("org", query.org)
  if (query.page && query.page > 1) params.set("page", String(query.page))
  const search = params.toString()
  const prefix = language === "en" ? "" : `/${language}`
  return `${prefix}/tools/${slug}/${search ? `?${search}` : ""}`
}

export { makeToolHref, readQuery }
