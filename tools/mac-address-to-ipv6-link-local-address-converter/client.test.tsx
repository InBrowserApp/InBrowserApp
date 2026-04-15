import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import MacToIpv6LinkLocalClient from "./client"

const messages = {
  meta: {
    name: "MAC Address to IPv6 Link-Local Address Converter",
    description:
      "Convert MAC addresses to IPv6 link-local addresses in EUI-64 format.",
  },
  macLabel: "MAC Address",
  macPlaceholder: "AA:BB:CC:DD:EE:FF",
  networkInterfaceLabel: "Network Interface",
  networkInterfacePlaceholder: "eth0",
  invalidAddress: "Invalid MAC Address",
  resultLabel: "IPv6 Link-Local Address",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("MacToIpv6LinkLocalClient", () => {
  test("renders the default example and derived IPv6 link-local address", () => {
    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const input = screen.getByLabelText(messages.macLabel) as HTMLInputElement

    expect(input.value).toBe("aa:bb:cc:dd:ee:ff")
    expect(screen.getByText("fe80::a8bb:ccff:fedd:eeff")).toBeTruthy()
  })

  test("updates the derived IPv6 address when the MAC input changes", () => {
    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const input = screen.getByLabelText(messages.macLabel) as HTMLInputElement
    fireEvent.change(input, {
      target: { value: "00:11:22:33:44:55" },
    })

    expect(screen.getByText("fe80::211:22ff:fe33:4455")).toBeTruthy()
  })

  test("appends a network interface suffix to the generated address", () => {
    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const networkInput = screen.getByLabelText(
      messages.networkInterfaceLabel
    ) as HTMLInputElement
    fireEvent.change(networkInput, { target: { value: "eth0" } })

    expect(screen.getByText("fe80::a8bb:ccff:fedd:eeff%eth0")).toBeTruthy()
  })

  test("shows an invalid state for malformed MAC input", () => {
    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const input = screen.getByLabelText(messages.macLabel) as HTMLInputElement
    fireEvent.change(input, { target: { value: "bad mac" } })

    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(screen.getAllByText(messages.invalidAddress).length).toBeGreaterThan(
      0
    )
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores the stored MAC and network interface values from local storage", () => {
    window.localStorage.setItem(
      "tools:mac-address-to-ipv6-link-local-address-converter:mac",
      "00:11:22:33:44:55"
    )
    window.localStorage.setItem(
      "tools:mac-address-to-ipv6-link-local-address-converter:network-interface",
      "en0"
    )

    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const macInput = screen.getByLabelText(
      messages.macLabel
    ) as HTMLInputElement
    const networkInput = screen.getByLabelText(
      messages.networkInterfaceLabel
    ) as HTMLInputElement

    expect(macInput.value).toBe("00:11:22:33:44:55")
    expect(networkInput.value).toBe("en0")
    expect(screen.getByText("fe80::211:22ff:fe33:4455%en0")).toBeTruthy()
  })

  test("restores the legacy stored MAC and network interface values", () => {
    window.localStorage.setItem(
      "tools:mac-to-ipv6-link-local:mac",
      "00:11:22:33:44:55"
    )
    window.localStorage.setItem(
      "tools:mac-to-ipv6-link-local:network-interface",
      "en0"
    )

    render(<MacToIpv6LinkLocalClient messages={messages} />)

    const macInput = screen.getByLabelText(
      messages.macLabel
    ) as HTMLInputElement
    const networkInput = screen.getByLabelText(
      messages.networkInterfaceLabel
    ) as HTMLInputElement

    expect(macInput.value).toBe("00:11:22:33:44:55")
    expect(networkInput.value).toBe("en0")
    expect(screen.getByText("fe80::211:22ff:fe33:4455%en0")).toBeTruthy()
  })
})
