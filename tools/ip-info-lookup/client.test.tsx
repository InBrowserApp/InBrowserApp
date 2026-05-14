import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import IpInfoLookupClient from "./client"

import type { IpInfoLookupMessages } from "./types"

const lookupIpInfoTargetMock = vi.fn()
const clipboardWriteTextMock = vi.fn()

vi.mock("./core/ip-info-lookup", async () => {
  const actual = await vi.importActual<typeof import("./core/ip-info-lookup")>(
    "./core/ip-info-lookup"
  )

  return {
    ...actual,
    lookupIpInfoTarget: (...args: unknown[]) => lookupIpInfoTargetMock(...args),
  }
})

const messages = {
  meta: {
    name: "IP Info Lookup",
    description: "Look up IP network details.",
  },
  inputTitle: "Lookup Target",
  inputDescription: "Enter an IP address, domain, or URL.",
  targetLabel: "IP, domain, or URL",
  targetPlaceholder: "e.g. 8.8.8.8",
  targetDescription: "IPv4, IPv6, bare domains, and URLs are accepted.",
  invalidTargetTitle: "Invalid target",
  invalidTargetDescription: "Enter a valid target.",
  resolverLabel: "DNS resolver",
  resolverDescription: "Used only when the target is a domain or URL.",
  resolverGroupLabel: "Public resolvers",
  lookupButton: "Lookup IP info",
  loadingButton: "Looking up...",
  resultTitle: "IP Information",
  resultDescription: "Resolved addresses and network ownership.",
  idleTitle: "Ready to look up",
  idleDescription: "Enter a target and run the lookup.",
  loadingTitle: "Looking up IP information",
  loadingDescription: "Resolving the target and enriching each address.",
  lookupFailedTitle: "Lookup failed",
  lookupFailedDescription: "The DNS or metadata request did not complete.",
  noAddressesTitle: "No addresses found",
  noAddressesDescription: "The resolver did not return A or AAAA records.",
  target: "Target",
  normalizedTarget: "Normalized target",
  resolver: "Resolver",
  addressCount: "Addresses",
  address: "Address",
  addressFamily: "Address family",
  domainRecords: "DNS address records",
  domainRecordsDescription: "A and AAAA answers.",
  recordType: "Type",
  ttl: "TTL",
  hostname: "Hostname",
  isp: "ISP",
  organization: "Organization",
  asn: "ASN",
  asnOrganization: "ASN organization",
  location: "Location",
  country: "Country",
  region: "Region",
  city: "City",
  postalCode: "Postal code",
  timezone: "Timezone",
  coordinates: "Coordinates",
  unavailable: "Unavailable",
  copyAddress: "Copy address",
  copyAllAddresses: "Copy all",
  openMap: "Open map",
  copied: "Copied",
  ipTarget: "IP address",
  domainTarget: "Domain",
  ipv4: "IPv4",
  ipv6: "IPv6",
  secondsAbbreviation: "s",
} as const satisfies IpInfoLookupMessages

const emptyInfo = {
  hostname: null,
  isp: null,
  organization: null,
  asn: null,
  asnOrganization: null,
  country: null,
  countryCode: null,
  region: null,
  city: null,
  postalCode: null,
  timezone: null,
  latitude: null,
  longitude: null,
}

function makeResult() {
  return {
    target: {
      kind: "domain",
      input: "example.com",
      normalized: "example.com",
    },
    resolverUrl: "https://cloudflare-dns.com/dns-query",
    records: [
      {
        type: "A",
        value: "93.184.216.34",
        ttl: 300,
      },
      {
        type: "AAAA",
        value: "2001:db8::1",
        ttl: null,
      },
    ],
    addresses: [
      {
        address: "93.184.216.34",
        version: "ipv4",
        info: {
          ...emptyInfo,
          hostname: "edge.example.test",
          isp: "Example ISP",
          organization: "Example Org",
          asn: 64496,
          asnOrganization: "Example ASN",
          country: "Exampleland",
          countryCode: "EX",
          region: "Example Region",
          city: "Example City",
          postalCode: "10001",
          timezone: "Etc/UTC",
          latitude: 40.7,
          longitude: -74,
        },
      },
      {
        address: "2001:db8::1",
        version: "ipv6",
        info: emptyInfo,
      },
    ],
  } as const
}

beforeEach(() => {
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: clipboardWriteTextMock,
    },
  })
})

afterEach(() => {
  cleanup()
  clipboardWriteTextMock.mockReset()
  lookupIpInfoTargetMock.mockReset()
  window.localStorage.clear()
})

describe("IpInfoLookupClient", () => {
  test("runs a lookup, renders records and metadata, and copies addresses", async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined)
    lookupIpInfoTargetMock.mockResolvedValue(makeResult())

    render(<IpInfoLookupClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getAllByText("93.184.216.34").length).toBeGreaterThan(0)
      expect(screen.getAllByText("2001:db8::1").length).toBeGreaterThan(0)
    })

    expect(lookupIpInfoTargetMock).toHaveBeenCalledWith(
      "example.com",
      "https://cloudflare-dns.com/dns-query"
    )
    expect(screen.getByText("edge.example.test")).toBeTruthy()
    expect(screen.getByText("Exampleland (EX)")).toBeTruthy()
    expect(screen.getByRole("link", { name: messages.openMap })).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyAllAddresses })
    )

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith(
        "93.184.216.34\n2001:db8::1"
      )
    })
  })

  test("validates invalid targets before querying", () => {
    render(<IpInfoLookupClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.targetLabel), {
      target: { value: "localhost" },
    })

    expect(
      screen.getAllByText(messages.invalidTargetDescription).length
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.lookupButton,
      }).disabled
    ).toBe(true)
    expect(lookupIpInfoTargetMock).not.toHaveBeenCalled()
  })

  test("shows loading, request error, and empty-domain states", async () => {
    lookupIpInfoTargetMock.mockImplementationOnce(() => new Promise(() => {}))

    const { unmount } = render(<IpInfoLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    expect(screen.getByText(messages.loadingTitle)).toBeTruthy()
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.loadingButton,
      }).disabled
    ).toBe(true)
    unmount()

    lookupIpInfoTargetMock.mockRejectedValueOnce(new Error("failed"))
    render(<IpInfoLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.lookupFailedTitle)).toBeTruthy()
    })
    cleanup()

    lookupIpInfoTargetMock.mockResolvedValueOnce({
      target: {
        kind: "domain",
        input: "empty.example",
        normalized: "empty.example",
      },
      resolverUrl: "https://cloudflare-dns.com/dns-query",
      records: [],
      addresses: [],
    })
    render(<IpInfoLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.noAddressesTitle)).toBeTruthy()
    })
  })

  test("restores and persists the target input", () => {
    window.localStorage.setItem("tools:ip-info-lookup:target", "8.8.8.8")

    render(<IpInfoLookupClient messages={messages} />)

    expect(screen.getByDisplayValue("8.8.8.8")).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.targetLabel), {
      target: { value: "1.1.1.1" },
    })

    expect(window.localStorage.getItem("tools:ip-info-lookup:target")).toBe(
      "1.1.1.1"
    )
  })
})
