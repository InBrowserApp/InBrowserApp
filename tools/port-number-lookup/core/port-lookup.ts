import type { PortInfo } from "../data/ports"

type PortCategoryFilter = "all" | "common" | "system" | "registered"

function normalizePortQuery(value: string) {
  return value.trim().toLowerCase()
}

function filterPorts(
  ports: readonly PortInfo[],
  searchQuery: string,
  category: PortCategoryFilter
) {
  let filteredPorts = ports

  if (category === "common") {
    filteredPorts = filteredPorts.filter((port) => port.common === true)
  } else if (category === "system") {
    filteredPorts = filteredPorts.filter((port) => port.category === "system")
  } else if (category === "registered") {
    filteredPorts = filteredPorts.filter(
      (port) => port.category === "registered"
    )
  }

  const normalizedQuery = normalizePortQuery(searchQuery)

  if (normalizedQuery === "") {
    return filteredPorts
  }

  return filteredPorts.filter((port) => {
    return (
      String(port.port).includes(normalizedQuery) ||
      port.service.toLowerCase().includes(normalizedQuery) ||
      port.description.toLowerCase().includes(normalizedQuery)
    )
  })
}

export { filterPorts, normalizePortQuery }
export type { PortCategoryFilter }
