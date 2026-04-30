import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import CidrParserClient from "./client"

const messages = {
  meta: {
    name: "CIDR Parser",
    description: "Parse CIDR blocks into network details.",
  },
  inputTitle: "CIDR Input",
  inputDescription: "Inspect IPv4 and IPv6 blocks in the browser.",
  inputLabel: "CIDR block",
  inputPlaceholder: "e.g. 192.168.0.15/24",
  inputHint: "Host bits are allowed.",
  resultTitle: "Parsed Network",
  resultDescription:
    "Canonical range, numeric boundaries, and routing details.",
  emptyTitle: "Nothing parsed yet",
  emptyDescription: "Enter a CIDR block to inspect it.",
  invalidTitle: "Invalid CIDR block",
  invalidDescription: "Use a valid IPv4 or IPv6 address followed by a prefix.",
  overviewTitle: "Overview",
  overviewDescription: "Quick sanity check for the network you mean to use.",
  rangeTitle: "Address Range",
  rangeDescription: "Boundary values for the block.",
  routingTitle: "Routing Details",
  routingDescription: "Prefix math and integer values.",
  familyLabel: "Address family",
  prefixLabel: "Prefix length",
  hostBitsLabel: "Host bits",
  totalAddressesLabel: "Total addresses",
  usableAddressesLabel: "Usable addresses",
  canonicalLabel: "Canonical CIDR",
  originalAddressLabel: "Original address",
  networkAddressLabel: "Network address",
  rangeStartLabel: "Range start",
  rangeEndLabel: "Range end",
  firstUsableLabel: "First usable",
  lastUsableLabel: "Last usable",
  broadcastAddressLabel: "Broadcast address",
  netmaskLabel: "Netmask",
  wildcardMaskLabel: "Wildcard mask",
  startIntegerLabel: "Start integer",
  endIntegerLabel: "End integer",
  ipv4Label: "IPv4",
  ipv6Label: "IPv6",
  notApplicableLabel: "Not applicable",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

describe("CidrParserClient", () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  test("renders the empty state by default", () => {
    render(<CidrParserClient language="en" messages={messages} />)

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.getByText(messages.resultDescription)).toBeTruthy()
  })

  test("parses IPv4 CIDR input and shows canonical network details", () => {
    render(<CidrParserClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputLabel), {
      target: { value: "192.168.10.34/24" },
    })

    expect(screen.getAllByText("192.168.10.0/24").length).toBeGreaterThan(0)
    expect(screen.getAllByText("192.168.10.255").length).toBeGreaterThan(0)
    expect(screen.getByText("255.255.255.0")).toBeTruthy()
    expect(screen.getAllByText("IPv4").length).toBeGreaterThan(0)
  })

  test("shows an invalid state for malformed CIDR input", () => {
    render(<CidrParserClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputLabel), {
      target: { value: "hello world" },
    })

    expect(screen.getAllByText(messages.invalidTitle).length).toBeGreaterThan(0)
    expect(
      screen.getAllByText(messages.invalidDescription).length
    ).toBeGreaterThan(0)
  })

  test("restores the stored CIDR value from local storage", () => {
    window.localStorage.setItem("tools:cidr-parser:input", "2001:db8::1/64")

    render(<CidrParserClient language="en" messages={messages} />)

    const input = screen.getByLabelText(messages.inputLabel) as HTMLInputElement

    expect(input.value).toBe("2001:db8::1/64")
    expect(screen.getAllByText("2001:db8::/64").length).toBeGreaterThan(0)
    expect(screen.getAllByText("IPv6").length).toBeGreaterThan(0)
    expect(
      screen.getAllByText(messages.notApplicableLabel).length
    ).toBeGreaterThan(0)
  })
})
