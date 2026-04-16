import type {
  HttpStatusCodeCategory,
  HttpStatusCodeInfo,
} from "../data/status-codes"

type HttpStatusCodeFilter = "all" | "common" | HttpStatusCodeCategory

function normalizeStatusCodeQuery(value: string) {
  return value.trim().toLowerCase()
}

function filterStatusCodes(
  codes: readonly HttpStatusCodeInfo[],
  searchQuery: string,
  filter: HttpStatusCodeFilter
) {
  let filteredCodes = codes

  if (filter === "common") {
    filteredCodes = filteredCodes.filter((code) => code.common === true)
  } else if (filter !== "all") {
    filteredCodes = filteredCodes.filter((code) => code.category === filter)
  }

  const normalizedQuery = normalizeStatusCodeQuery(searchQuery)

  if (normalizedQuery === "") {
    return filteredCodes
  }

  return filteredCodes.filter((code) => {
    return (
      String(code.code).includes(normalizedQuery) ||
      code.name.toLowerCase().includes(normalizedQuery) ||
      code.description.toLowerCase().includes(normalizedQuery)
    )
  })
}

export { filterStatusCodes, normalizeStatusCodeQuery }
export type { HttpStatusCodeFilter }
