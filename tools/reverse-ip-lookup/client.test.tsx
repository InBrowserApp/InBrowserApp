import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import ReverseIpLookupClient from "./client"

import type { ReverseIpLookupMessages } from "./types"

const lookupReverseIpMock = vi.fn()
const clipboardWriteTextMock = vi.fn()

vi.mock("./core/reverse-ip", async () => {
  const actual =
    await vi.importActual<typeof import("./core/reverse-ip")>(
      "./core/reverse-ip"
    )

  return {
    ...actual,
    lookupReverseIp: (...args: unknown[]) => lookupReverseIpMock(...args),
  }
})

const messages = {
  meta: {
    name: "Reverse IP Lookup",
    description: "Look up reverse DNS PTR records.",
  },
  inputTitle: "Reverse Lookup",
  inputDescription: "Query the PTR record.",
  ipLabel: "IP address",
  ipPlaceholder: "e.g. 1.1.1.1 or 2001:4860:4860::8888",
  ipDescription: "Enter a single IPv4 or IPv6 address.",
  resolverLabel: "DNS resolver",
  resolverDescription: "The lookup runs in your browser.",
  resolverGroupLabel: "Public resolvers",
  lookupButton: "Lookup PTR record",
  loadingButton: "Looking up...",
  invalidIpTitle: "Invalid IP address",
  invalidIpDescription: "Use a valid IPv4 or IPv6 address.",
  resultTitle: "DNS Result",
  resultDescription: "Reverse DNS target and PTR hostnames.",
  idleTitle: "Ready to query",
  idleDescription: "Enter an address and run the lookup. Current resolver:",
  loadingTitle: "Querying reverse DNS",
  loadingDescription: "Requesting the PTR record.",
  lookupFailedTitle: "Lookup failed",
  lookupFailedDescription: "The DNS-over-HTTPS request did not complete.",
  reverseDomain: "Reverse DNS domain",
  dnsStatus: "DNS status",
  resolver: "Resolver",
  addressFamily: "Address family",
  ptrRecordsTitle: "PTR records",
  ptrRecordsDescription: "Hostnames published by the address owner.",
  hostname: "Hostname",
  ttl: "TTL",
  rawValue: "Raw value",
  noRecordsTitle: "No PTR records found",
  noRecordsDescription: "The resolver answered, but no PTR hostname exists.",
  copyReverseDomain: "Copy domain",
  copyHostnames: "Copy hostnames",
  copied: "Copied",
  ipv4: "IPv4",
  ipv6: "IPv6",
  secondsAbbreviation: "s",
} as const satisfies ReverseIpLookupMessages

function makeResult(status = 0) {
  return {
    target: {
      input: "1.1.1.1",
      ip: "1.1.1.1",
      version: "ipv4",
      reverseDomain: "1.1.1.1.in-addr.arpa",
    },
    resolverUrl: "https://cloudflare-dns.com/dns-query",
    response: {
      Status: status,
      Answer:
        status === 0
          ? [
              {
                name: "1.1.1.1.in-addr.arpa.",
                type: 12,
                TTL: 300,
                data: "one.one.one.one.",
              },
            ]
          : [],
    },
    rcode: status === 0 ? "NOERROR" : "NXDOMAIN",
    answers:
      status === 0
        ? [
            {
              hostname: "one.one.one.one",
              rawHostname: "one.one.one.one.",
              ttl: 300,
            },
          ]
        : [],
  } as const
}

afterEach(() => {
  cleanup()
  lookupReverseIpMock.mockReset()
  clipboardWriteTextMock.mockReset()
  window.localStorage.clear()
})

describe("ReverseIpLookupClient", () => {
  test("runs a lookup and renders PTR answers", async () => {
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: clipboardWriteTextMock,
      },
    })
    clipboardWriteTextMock.mockResolvedValue(undefined)
    lookupReverseIpMock.mockResolvedValue(makeResult())

    render(<ReverseIpLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getByText("one.one.one.one")).toBeTruthy()
    })

    expect(lookupReverseIpMock).toHaveBeenCalledWith(
      "1.1.1.1",
      "https://cloudflare-dns.com/dns-query"
    )
    expect(screen.getByText("1.1.1.1.in-addr.arpa")).toBeTruthy()
    expect(screen.getAllByText("NOERROR").length).toBeGreaterThan(0)

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyHostnames })
    )

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith("one.one.one.one.")
    })
  })

  test("shows validation feedback before querying invalid input", () => {
    render(<ReverseIpLookupClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.ipLabel), {
      target: { value: "example.com" },
    })

    expect(
      screen.getAllByText(messages.invalidIpDescription).length
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.lookupButton,
      }).disabled
    ).toBe(true)
    expect(lookupReverseIpMock).not.toHaveBeenCalled()
  })

  test("shows loading feedback while a lookup is pending", () => {
    lookupReverseIpMock.mockImplementation(() => new Promise(() => {}))

    render(<ReverseIpLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    expect(screen.getByText(messages.loadingTitle)).toBeTruthy()
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.loadingButton,
      }).disabled
    ).toBe(true)
  })

  test("renders an empty PTR state when the resolver has no answer", async () => {
    lookupReverseIpMock.mockResolvedValue(makeResult(3))

    render(<ReverseIpLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.noRecordsTitle)).toBeTruthy()
    })
    expect(screen.getAllByText("NXDOMAIN").length).toBeGreaterThan(0)
  })

  test("renders a request error state when lookup fails", async () => {
    lookupReverseIpMock.mockRejectedValue(new Error("resolver failed"))

    render(<ReverseIpLookupClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.lookupFailedTitle)).toBeTruthy()
    })
    expect(screen.getByText(messages.lookupFailedDescription)).toBeTruthy()
  })

  test("restores and persists the IP input", () => {
    window.localStorage.setItem("tools:reverse-ip-lookup:ip", "8.8.8.8")

    render(<ReverseIpLookupClient messages={messages} />)

    expect(screen.getByDisplayValue("8.8.8.8")).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.ipLabel), {
      target: { value: "9.9.9.9" },
    })

    expect(window.localStorage.getItem("tools:reverse-ip-lookup:ip")).toBe(
      "9.9.9.9"
    )
  })
})
