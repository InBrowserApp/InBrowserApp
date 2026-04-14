import { describe, expect, test } from "vitest"

import {
  filterPorts,
  normalizePortQuery,
  type PortCategoryFilter,
} from "./port-lookup"

const fixturePorts = [
  {
    port: 22,
    service: "SSH",
    protocol: "TCP",
    description: "Secure Shell",
    category: "system",
    common: true,
  },
  {
    port: 53,
    service: "DNS",
    protocol: "TCP/UDP",
    description: "Domain Name System",
    category: "system",
    common: true,
  },
  {
    port: 3306,
    service: "MySQL",
    protocol: "TCP",
    description: "MySQL database server",
    category: "registered",
  },
  {
    port: 5353,
    service: "mDNS",
    protocol: "UDP",
    description: "Multicast DNS",
    category: "registered",
    common: true,
  },
] as const

describe("normalizePortQuery", () => {
  test("trims whitespace and lowercases the query", () => {
    expect(normalizePortQuery("  SSH Server ")).toBe("ssh server")
  })
})

describe("filterPorts", () => {
  test("returns every entry when the search query is blank", () => {
    expect(filterPorts(fixturePorts, "   ", "all")).toEqual(fixturePorts)
  })

  test.each([
    ["common", [22, 53, 5353]],
    ["system", [22, 53]],
    ["registered", [3306, 5353]],
  ] satisfies ReadonlyArray<[PortCategoryFilter, number[]]>)(
    "filters the %s category",
    (category, expectedPorts) => {
      expect(
        filterPorts(fixturePorts, "", category).map((port) => port.port)
      ).toEqual(expectedPorts)
    }
  )

  test("matches ports by number, service, and description", () => {
    expect(
      filterPorts(fixturePorts, "53", "all").map((port) => port.port)
    ).toEqual([53, 5353])
    expect(
      filterPorts(fixturePorts, "mysql", "all").map((port) => port.port)
    ).toEqual([3306])
    expect(
      filterPorts(fixturePorts, "secure shell", "all").map((port) => port.port)
    ).toEqual([22])
  })

  test("applies search after the category filter", () => {
    expect(
      filterPorts(fixturePorts, "dns", "registered").map((port) => port.port)
    ).toEqual([5353])
  })
})
