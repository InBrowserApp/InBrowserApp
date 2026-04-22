import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import IpRangeToCidrClient from "./client"

const messages = {
  meta: {
    name: "IP Range to CIDR Converter",
    description: "Convert IP ranges into minimal CIDR blocks.",
  },
  inputTitle: "IP Range Input",
  inputDescription: "Enter the first and last IP address in the range.",
  startLabel: "Start IP address",
  startPlaceholder: "e.g. 192.168.1.10",
  endLabel: "End IP address",
  endPlaceholder: "e.g. 192.168.1.25",
  resultTitle: "CIDR Covering Result",
  resultDescription: "Minimal CIDR blocks for the range.",
  copyLabel: "Copy CIDR list",
  copiedLabel: "Copied",
  rangeLabel: "Normalized range",
  familyLabel: "Address family",
  blockCountLabel: "CIDR blocks",
  ipv4: "IPv4",
  ipv6: "IPv6",
  emptyTitle: "Enter an IP range",
  emptyDescription: "Provide both addresses to see CIDR blocks.",
  incompleteTitle: "Range needs two addresses",
  incompleteDescription: "Fill in both the start and end address.",
  invalidTitle: "Invalid IP address",
  invalidDescription: "Use valid IPv4 or IPv6 addresses.",
  mixedFamilyTitle: "Address families do not match",
  mixedFamilyDescription:
    "Use either two IPv4 addresses or two IPv6 addresses.",
  reversedRangeTitle: "Start address must come first",
  reversedRangeDescription:
    "The start address must be less than or equal to the end address.",
} as const

describe("IpRangeToCidrClient", () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  test("renders minimal IPv4 covering blocks", () => {
    render(<IpRangeToCidrClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.startLabel), {
      target: { value: "192.168.1.10" },
    })
    fireEvent.change(screen.getByLabelText(messages.endLabel), {
      target: { value: "192.168.1.25" },
    })

    expect(screen.getByText("192.168.1.10 → 192.168.1.25")).toBeTruthy()
    expect(screen.getByText("192.168.1.16/29")).toBeTruthy()
    expect(screen.getAllByText("4").length).toBeGreaterThan(0)
  })

  test("shows an error for mixed IPv4 and IPv6 input", () => {
    render(<IpRangeToCidrClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.startLabel), {
      target: { value: "192.168.1.10" },
    })
    fireEvent.change(screen.getByLabelText(messages.endLabel), {
      target: { value: "2001:db8::1" },
    })

    expect(
      screen.getAllByText(messages.mixedFamilyTitle).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(messages.mixedFamilyDescription).length
    ).toBeGreaterThan(0)
  })

  test("restores the legacy stored range values from the previous slug", () => {
    window.localStorage.setItem("tools:ip-range-to-cidr:start", "192.168.1.10")
    window.localStorage.setItem("tools:ip-range-to-cidr:end", "192.168.1.25")

    render(<IpRangeToCidrClient messages={messages} />)

    const startInput = screen.getByLabelText(
      messages.startLabel
    ) as HTMLInputElement
    const endInput = screen.getByLabelText(
      messages.endLabel
    ) as HTMLInputElement

    expect(startInput.value).toBe("192.168.1.10")
    expect(endInput.value).toBe("192.168.1.25")
    expect(screen.getByText("192.168.1.16/29")).toBeTruthy()
  })

  test("shows the incomplete state when only one address is present", () => {
    render(<IpRangeToCidrClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.startLabel), {
      target: { value: "192.168.1.10" },
    })

    expect(screen.getByText(messages.incompleteTitle)).toBeTruthy()
    expect(screen.getByText(messages.incompleteDescription)).toBeTruthy()
  })
})
