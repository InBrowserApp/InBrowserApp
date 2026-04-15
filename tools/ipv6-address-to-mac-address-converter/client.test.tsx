import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import Ipv6ToMacClient from "./client"

const messages = {
  meta: {
    name: "IPv6 Address to MAC Address Converter",
    description: "Recover a MAC address from an EUI-64 derived IPv6 address.",
  },
  placeholder: "Enter IPv6",
  invalidAddress: "Invalid IPv6 address",
  result: "Conversion Result",
  notConvertible: "Not convertible",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("Ipv6ToMacClient", () => {
  test("renders the default example and derived MAC address", () => {
    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement

    expect(input.value).toBe("fe80::a8bb:ccff:fedd:eeff")
    expect(screen.getByText("AA:BB:CC:DD:EE:FF")).toBeTruthy()
  })

  test("updates the derived MAC address when the IPv6 input changes", () => {
    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement
    fireEvent.change(input, {
      target: { value: "fe80::0211:22ff:fe33:4455" },
    })

    expect(screen.getByText("00:11:22:33:44:55")).toBeTruthy()
  })

  test("shows an invalid state for malformed IPv6 input", () => {
    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement
    fireEvent.change(input, { target: { value: "bad ipv6" } })

    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(screen.getAllByText(messages.invalidAddress).length).toBeGreaterThan(
      0
    )
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toHaveProperty("disabled", true)
  })

  test("shows not convertible for valid IPv6 addresses without embedded EUI-64 bytes", () => {
    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement
    fireEvent.change(input, { target: { value: "2001:db8::1" } })

    expect(screen.getByText(messages.notConvertible)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores the stored IPv6 value from local storage", () => {
    window.localStorage.setItem(
      "tools:ipv6-address-to-mac-address-converter:ipv6",
      "fe80::0211:22ff:fe33:4455"
    )

    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement

    expect(input.value).toBe("fe80::0211:22ff:fe33:4455")
    expect(screen.getByText("00:11:22:33:44:55")).toBeTruthy()
  })

  test("restores the legacy stored IPv6 value from the previous slug", () => {
    window.localStorage.setItem(
      "tools:ipv6-to-mac:ipv6",
      "fe80::0211:22ff:fe33:4455"
    )

    render(<Ipv6ToMacClient messages={messages} />)

    const input = screen.getByLabelText("IPv6") as HTMLInputElement

    expect(input.value).toBe("fe80::0211:22ff:fe33:4455")
    expect(screen.getByText("00:11:22:33:44:55")).toBeTruthy()
  })
})
