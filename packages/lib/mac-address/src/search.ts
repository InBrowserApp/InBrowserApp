import { parseMacInput } from "./parse"
import type { Assignment, Registry } from "./types"

type AssignmentFilters = Readonly<{
  query?: string
  registry?: Registry | "all"
  organization?: string
}>

function filterAssignments(
  records: readonly Assignment[],
  { query = "", registry = "all", organization = "" }: AssignmentFilters = {}
) {
  const search = query.trim().toLowerCase()
  const hex =
    parseMacInput(query)?.hex ??
    (/^[\da-f:.-]+$/i.test(search)
      ? search.replace(/[:.-]/g, "").toUpperCase()
      : "")

  return records.filter((record) => {
    if (registry !== "all" && record.registry !== registry) return false
    if (organization && record.organization !== organization) return false
    return (
      search === "" ||
      (hex !== "" &&
        (record.assignment.startsWith(hex) ||
          hex.startsWith(record.assignment))) ||
      record.organization.toLowerCase().includes(search) ||
      record.address.toLowerCase().includes(search)
    )
  })
}

function getOrganizations(records: readonly Assignment[], query = "") {
  const search = query.trim().toLowerCase()
  const organizations = new Map<
    string,
    { name: string; count: number; matches: boolean }
  >()
  for (const record of records) {
    const existing = organizations.get(record.organization)
    const matches =
      record.organization.toLowerCase().includes(search) ||
      record.address.toLowerCase().includes(search)
    if (existing) {
      existing.count += 1
      existing.matches ||= matches
    } else {
      organizations.set(record.organization, {
        name: record.organization,
        count: 1,
        matches,
      })
    }
  }
  return [...organizations.values()]
    .filter(({ matches }) => matches)
    .map(({ name, count }) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
}

export { filterAssignments, getOrganizations }
export type { AssignmentFilters }
