import { describe, expect, test } from "vitest"

import {
  ALL_GROUPS,
  buildLocalizedToolHref,
  countNetworkToolsByGroup,
  createLocalizedNetworkTools,
  filterNetworkTools,
  formatCount,
} from "./network-tools"

import type { NetworkToolsMessages } from "../types"

const messages: NetworkToolsMessages = {
  searchLabel: "Search network tools",
  searchPlaceholder: "Search by IP, DNS, CIDR, HTTP, TLS, SSH, or port",
  clearSearchLabel: "Clear",
  allGroupsLabel: "All",
  resultCountTemplate: "Tools shown: {count}",
  emptyTitle: "No matching tools",
  emptyDescription: "Try a broader network term.",
  openToolLabel: "Open {name}",
  groups: {
    ip: {
      label: "IP and CIDR",
      description: "Inspect and convert address ranges.",
    },
    dns: {
      label: "DNS and domains",
      description: "Query records and normalize domain names.",
    },
    reference: {
      label: "Protocol references",
      description: "Look up network protocol values.",
    },
    security: {
      label: "Keys and certificates",
      description: "Inspect network security artifacts.",
    },
  },
  tools: {
    "certificate-public-key-parser": {
      name: "Certificate parser",
      description: "Read X.509 and public key details.",
    },
    "cidr-parser": {
      name: "CIDR Parser",
      description: "Inspect subnet range boundaries.",
    },
    "cidrs-merger-excluder": {
      name: "CIDR Merger",
      description: "Merge or subtract CIDR blocks.",
    },
    "current-network-time": {
      name: "Current Network Time",
      description: "Compare network and local clock time.",
    },
    "dns-lookup": {
      name: "DNS Lookup",
      description: "Query DNS-over-HTTPS records.",
    },
    "http-status-code-lookup": {
      name: "HTTP Status Codes",
      description: "Browse HTTP response meanings.",
    },
    "ip-cidr-normalizer": {
      name: "IP/CIDR Normalizer",
      description: "Normalize IPv4 and IPv6 notation.",
    },
    "ip-info-lookup": {
      name: "IP Info Lookup",
      description: "Look up ASN and geolocation details.",
    },
    "ip-range-to-cidr-converter": {
      name: "IP Range to CIDR",
      description: "Convert start and end addresses.",
    },
    "ipv6-address-to-mac-address-converter": {
      name: "IPv6 to MAC",
      description: "Extract a MAC from an IPv6 address.",
    },
    "mac-address-to-ipv6-link-local-address-converter": {
      name: "MAC to IPv6 Link-Local",
      description: "Generate link-local IPv6 addresses.",
    },
    "mime-type-lookup": {
      name: "MIME Type Lookup",
      description: "Find content types and file extensions.",
    },
    "my-ip-address": {
      name: "My IP Address",
      description: "Show public IP and connection details.",
    },
    "port-number-lookup": {
      name: "Port Number Lookup",
      description: "Search TCP and UDP service ports.",
    },
    "reverse-ip-lookup": {
      name: "Reverse IP Lookup",
      description: "Resolve PTR records for IP addresses.",
    },
    "ssh-public-key-fingerprint": {
      name: "SSH Public Key Fingerprint",
      description: "Generate SSH key fingerprints.",
    },
    "unicode-punycode-converter": {
      name: "Unicode Punycode Converter",
      description: "Convert IDN domains both ways.",
    },
  },
}

describe("network tools catalog", () => {
  test("creates localized links for default and non-default languages", () => {
    expect(buildLocalizedToolHref("dns-lookup", "en")).toBe("/tools/dns-lookup")
    expect(buildLocalizedToolHref("dns-lookup", "fr")).toBe(
      "/fr/tools/dns-lookup"
    )
  })

  test("uses localized copy and counts groups", () => {
    const tools = createLocalizedNetworkTools(messages, "en")
    const counts = countNetworkToolsByGroup(tools)

    expect(tools[0]).toMatchObject({
      href: "/tools/my-ip-address",
      name: "My IP Address",
    })
    expect(counts).toEqual({
      dns: 3,
      ip: 8,
      reference: 4,
      security: 2,
    })
  })

  test("filters by group while preserving priority order", () => {
    const tools = createLocalizedNetworkTools(messages, "en")
    const filtered = filterNetworkTools(tools, {
      group: "dns",
      query: "",
    })

    expect(filtered.map((tool) => tool.slug)).toEqual([
      "dns-lookup",
      "reverse-ip-lookup",
      "unicode-punycode-converter",
    ])
  })

  test("searches names, slugs, descriptions, and keywords", () => {
    const tools = createLocalizedNetworkTools(messages, "en")

    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "DNS Lookup",
      }).map((tool) => tool.slug)[0]
    ).toBe("dns-lookup")
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "Unicode",
      }).map((tool) => tool.slug)
    ).toEqual(["unicode-punycode-converter"])
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "ip-info",
      }).map((tool) => tool.slug)
    ).toEqual(["ip-info-lookup"])
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "PTR",
      }).map((tool) => tool.slug)
    ).toEqual(["reverse-ip-lookup"])
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "content type",
      }).map((tool) => tool.slug)
    ).toEqual(["mime-type-lookup"])
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "lookup",
      }).map((tool) => tool.slug)[0]
    ).toBe("ip-info-lookup")
    expect(
      filterNetworkTools(tools, {
        group: "security",
        query: "lookup",
      }).map((tool) => tool.slug)
    ).toEqual([])
    expect(
      filterNetworkTools(tools, {
        group: ALL_GROUPS,
        query: "not a network task",
      }).map((tool) => tool.slug)
    ).toEqual([])
  })

  test("formats localized count templates", () => {
    expect(formatCount("Tools shown: {count}", 1700, "en")).toBe(
      "Tools shown: 1,700"
    )
    expect(formatCount("Outils affichés : {count}", 1700, "fr")).toBe(
      "Outils affichés : 1 700"
    )
  })
})
