import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import MacToIpv6Client from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test.each([
  [messages.linkLocalPrefixLabel, "fe80::/64", "fe80::ff:fe00:1"],
  [
    messages.ulaPrefixLabel,
    "fd12:3456:789a:1::/64",
    "fd12:3456:789a:1:0:ff:fe00:1",
  ],
])(
  "applies %s while keeping the entered MAC address",
  (label, prefix, ipv6) => {
    render(<MacToIpv6Client messages={messages} />)
    const mac = screen.getByLabelText<HTMLInputElement>(messages.macLabel)
    fireEvent.change(mac, { target: { value: "0200.0000.0001" } })

    fireEvent.click(screen.getByRole("button", { name: label }))

    expect(mac.value).toBe("0200.0000.0001")
    expect(
      screen.getByLabelText<HTMLInputElement>(messages.prefixLabel).value
    ).toBe(prefix)
    expect(
      screen.getByRole("status", { name: messages.resultLabel }).textContent
    ).toBe(ipv6)
  }
)

test("fills the example, updates the address, and copies the latest result", async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue()
  render(<MacToIpv6Client messages={messages} />)
  const copy = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.copyLabel,
  })
  expect(copy.disabled).toBe(true)

  fireEvent.click(screen.getByRole("button", { name: messages.exampleLabel }))
  const result = screen.getByRole("status", { name: messages.resultLabel })
  expect(result.textContent).toBe("2001:db8:1:2:211:22ff:fe33:4455")

  fireEvent.change(screen.getByLabelText(messages.prefixLabel), {
    target: { value: "fe80::/64" },
  })
  expect(result.textContent).toBe("fe80::211:22ff:fe33:4455")
  fireEvent.click(screen.getByRole("button", { name: messages.copyLabel }))
  await waitFor(() => {
    expect(writeText).toHaveBeenCalledWith("fe80::211:22ff:fe33:4455")
    expect(
      screen.getByRole("button", { name: messages.copiedLabel })
    ).toBeTruthy()
  })
})

test("keeps invalid input editable and hides obsolete results until corrected", () => {
  render(<MacToIpv6Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.exampleLabel }))

  const mac = screen.getByLabelText<HTMLInputElement>(messages.macLabel)
  const prefix = screen.getByLabelText<HTMLInputElement>(messages.prefixLabel)
  const result = screen.getByRole("status", { name: messages.resultLabel })

  fireEvent.change(mac, { target: { value: "00:11" } })
  fireEvent.blur(mac)
  expect(screen.getByText(messages.invalidMac)).toBeTruthy()
  expect(mac.value).toBe("00:11")
  expect(result.textContent).toBe("—")

  fireEvent.change(mac, { target: { value: "0200.0000.0001" } })
  expect(screen.queryByText(messages.invalidMac)).toBeNull()
  expect(result.textContent).toBe("2001:db8:1:2:0:ff:fe00:1")

  fireEvent.change(prefix, { target: { value: "fd00::/48" } })
  fireEvent.blur(prefix)
  expect(screen.getByText(messages.invalidPrefix)).toBeTruthy()
  expect(prefix.value).toBe("fd00::/48")
  expect(result.textContent).toBe("—")

  fireEvent.change(prefix, { target: { value: "fd00::/64" } })
  expect(screen.queryByText(messages.invalidPrefix)).toBeNull()
  expect(result.textContent).toBe("fd00::ff:fe00:1")
})
