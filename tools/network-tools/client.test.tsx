import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import NetworkToolsClient from "./client"

import type { NetworkToolsMessages } from "./types"

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

describe("NetworkToolsClient", () => {
  afterEach(() => {
    cleanup()
  })

  test("renders grouped network tool links", () => {
    render(<NetworkToolsClient language="en" messages={messages} />)

    const link = screen.getByRole("link", { name: "Open DNS Lookup" })

    expect(link.getAttribute("href")).toBe("/tools/dns-lookup")
    expect(screen.getByText("Tools shown: 17")).toBeTruthy()
    expect(screen.getAllByText("IP and CIDR").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Keys and certificates").length).toBeGreaterThan(
      0
    )
  })

  test("filters visible cards by search query and can clear search", () => {
    render(<NetworkToolsClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.searchLabel), {
      target: { value: "punycode" },
    })

    expect(
      screen.getByRole("link", { name: "Open Unicode Punycode Converter" })
    ).toBeTruthy()
    expect(screen.queryByRole("link", { name: "Open CIDR Parser" })).toBeNull()
    expect(screen.getByText("Tools shown: 1")).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearSearchLabel })
    )

    expect(screen.getByRole("link", { name: "Open CIDR Parser" })).toBeTruthy()
  })

  test("filters by group and uses localized links", () => {
    render(<NetworkToolsClient language="de" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "DNS and domains (3)" }))

    const link = screen.getByRole("link", { name: "Open DNS Lookup" })

    expect(link.getAttribute("href")).toBe("/de/tools/dns-lookup")
    expect(
      screen.queryByRole("link", { name: "Open Certificate parser" })
    ).toBeNull()
  })

  test("shows an empty state when no tools match", () => {
    render(<NetworkToolsClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.searchLabel), {
      target: { value: "not a network task" },
    })

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyDescription)).toBeTruthy()
  })
})
