import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import IpCidrNormalizerClient from "./client"

const messages = {
  meta: {
    name: "IP/CIDR Normalizer",
    description: "Normalize IP addresses and CIDR notation for IPv4 and IPv6.",
  },
  inputTitle: "IP/CIDR Input",
  inputDescription: "Enter a single IPv4 or IPv6 address, or a CIDR range.",
  resultTitle: "Normalized Result",
  resultDescription: "Canonical IP address or network range ready to copy.",
  label: "IP/CIDR",
  placeholder: "e.g. 192.168.0.1/24 or 2001:db8::1",
  invalidInput: "Invalid IP or CIDR value",
  invalidInputDescription:
    "Use a valid IPv4 address, IPv6 address, or CIDR block such as 10.0.0.5/24 or 2001:db8::/32.",
  copyLabel: "Copy result",
  copiedLabel: "Copied",
} as const

describe("IpCidrNormalizerClient", () => {
  afterEach(() => {
    cleanup()
  })

  test("renders normalized output for valid input", () => {
    render(<IpCidrNormalizerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("IP/CIDR"), {
      target: { value: "192.168.0.1/24" },
    })

    expect(screen.getAllByText("Normalized Result").length).toBeGreaterThan(0)
    expect(screen.getByText("192.168.0.0/24")).toBeTruthy()
  })

  test("shows an error for invalid input", () => {
    render(<IpCidrNormalizerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("IP/CIDR"), {
      target: { value: "not-an-ip" },
    })

    expect(screen.getByText(messages.invalidInput)).toBeTruthy()
    expect(screen.getByText(messages.invalidInputDescription)).toBeTruthy()
  })

  test("keeps the result empty when no input is present", () => {
    render(<IpCidrNormalizerClient messages={messages} />)

    expect(screen.getByText("—")).toBeTruthy()
  })
})
