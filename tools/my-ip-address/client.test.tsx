import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import MyIpAddressClient from "./client"

const lookupPublicIpMock = vi.fn()
const lookupIpInfoMock = vi.fn()
const discoverWebRtcAddressesMock = vi.fn()
const getIpsMock = vi.fn()
const clipboardWriteTextMock = vi.fn()

vi.mock("./core/my-ip", async () => {
  const actual =
    await vi.importActual<typeof import("./core/my-ip")>("./core/my-ip")

  return {
    ...actual,
    discoverWebRtcAddresses: (...args: unknown[]) =>
      discoverWebRtcAddressesMock(...args),
    lookupIpInfo: (...args: unknown[]) => lookupIpInfoMock(...args),
    lookupPublicIp: (...args: unknown[]) => lookupPublicIpMock(...args),
  }
})

vi.mock("webrtc-ips", () => ({
  getIPs: (...args: unknown[]) => getIpsMock(...args),
}))

const messages = {
  meta: {
    name: "My IP Address",
    description: "Discover your public IP address and network details.",
  },
  webrtcLeak: "WebRTC Leak",
  webrtcDescription:
    "Additional interface and local candidate addresses exposed during WebRTC negotiation.",
  unableToGetIp: "Unable to get IP",
  unableToGetIpDescription:
    "The lookup did not return a public address. Check your connection, VPN, proxy, or privacy settings and try again.",
  fetchingIp: "Fetching IP address",
  fetchingIpDescription:
    "Looking up your public address and network details from multiple providers.",
  copyIp: "Copy IP",
  copied: "Copied",
  ipv4Description:
    "Public IPv4 address currently visible to websites and APIs.",
  ipv6Description:
    "Public IPv6 address visible when your network supports native or tunneled IPv6.",
  hostname: "Hostname",
  isp: "ISP",
  ipOrganization: "IP Organization",
  asn: "ASN",
  asnOrganization: "ASN Organization",
  location: "Location",
  country: "Country",
  timezone: "Timezone",
} as const

const emptyInfo = {
  hostname: null,
  isp: null,
  organization: null,
  asn: null,
  asnOrganization: null,
  country: null,
  timezone: null,
  latitude: null,
  longitude: null,
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
  discoverWebRtcAddressesMock.mockReset()
  getIpsMock.mockReset()
  lookupIpInfoMock.mockReset()
  lookupPublicIpMock.mockReset()
})

describe("MyIpAddressClient", () => {
  test("renders IPv4, IPv6, WebRTC addresses, and copy actions", async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined)
    lookupPublicIpMock.mockImplementation(async (version: string) =>
      version === "ipv4" ? "203.0.113.10" : "2001:db8::1"
    )
    lookupIpInfoMock.mockImplementation(async (ip: string) => ({
      hostname: ip + ".example.test",
      isp: "Example ISP",
      organization: "Example Org",
      asn: 64496,
      asnOrganization: "Example ASN",
      country: "Exampleland",
      timezone: "Etc/UTC",
      latitude: 40.7128,
      longitude: -74.006,
    }))
    discoverWebRtcAddressesMock.mockResolvedValue(["10.0.0.1", "fe80::1"])

    render(<MyIpAddressClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("203.0.113.10")).toBeTruthy()
      expect(screen.getByText("2001:db8::1")).toBeTruthy()
      expect(screen.getByText("10.0.0.1")).toBeTruthy()
      expect(screen.getByText("fe80::1")).toBeTruthy()
    })

    expect(screen.getByText(messages.ipv4Description)).toBeTruthy()
    expect(screen.getByText(messages.ipv6Description)).toBeTruthy()
    expect(screen.getByText(messages.webrtcDescription)).toBeTruthy()
    expect(screen.getAllByText("Example ISP").length).toBeGreaterThan(0)
    expect(getIpsMock).not.toHaveBeenCalled()

    const copyButton = screen.getAllByRole("button", { name: "Copy IP" })[0]!

    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith("203.0.113.10")
    })

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy()
    })
  })

  test("shows fetching states before the lookups resolve", () => {
    lookupPublicIpMock.mockImplementation(() => new Promise(() => {}))
    discoverWebRtcAddressesMock.mockImplementation(() => new Promise(() => {}))

    render(<MyIpAddressClient messages={messages} />)

    expect(screen.getAllByText(messages.fetchingIp)).toHaveLength(2)
    expect(screen.getAllByText(messages.fetchingIpDescription)).toHaveLength(2)
  })

  test("shows an unavailable state when public address lookups fail", async () => {
    lookupPublicIpMock.mockRejectedValue(new Error("failed"))
    discoverWebRtcAddressesMock.mockResolvedValue([])

    render(<MyIpAddressClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getAllByText(messages.unableToGetIp)).toHaveLength(2)
    })

    expect(screen.getAllByText(messages.unableToGetIpDescription)).toHaveLength(
      2
    )
    expect(screen.queryByText("WebRTC Leak")).toBeNull()
  })

  test("keeps the copy action unchanged when clipboard access fails", async () => {
    clipboardWriteTextMock.mockRejectedValue(new Error("denied"))
    lookupPublicIpMock.mockImplementation(async (version: string) =>
      version === "ipv4" ? "203.0.113.10" : "2001:db8::1"
    )
    lookupIpInfoMock.mockResolvedValue(emptyInfo)
    discoverWebRtcAddressesMock.mockResolvedValue([])

    render(<MyIpAddressClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("203.0.113.10")).toBeTruthy()
    })

    const copyButton = screen.getAllByRole("button", { name: "Copy IP" })[0]!

    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith("203.0.113.10")
    })

    expect(screen.queryByRole("button", { name: "Copied" })).toBeNull()
  })

  test("hides the WebRTC section when discovery fails", async () => {
    lookupPublicIpMock.mockImplementation(async (version: string) =>
      version === "ipv4" ? "203.0.113.10" : "2001:db8::1"
    )
    lookupIpInfoMock.mockResolvedValue(emptyInfo)
    discoverWebRtcAddressesMock.mockRejectedValue(new Error("webrtc failed"))

    render(<MyIpAddressClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("203.0.113.10")).toBeTruthy()
      expect(screen.getByText("2001:db8::1")).toBeTruthy()
    })

    expect(screen.queryByText("WebRTC Leak")).toBeNull()
  })

  test("ignores late async results after unmount", async () => {
    let resolveIpv4: ((value: string) => void) | undefined
    let rejectIpv6: ((reason?: unknown) => void) | undefined
    let resolveWebRtc: ((value: string[]) => void) | undefined

    lookupPublicIpMock.mockImplementation(
      (version: string) =>
        new Promise((resolve, reject) => {
          if (version === "ipv4") {
            resolveIpv4 = resolve
            return
          }

          rejectIpv6 = reject
        })
    )
    lookupIpInfoMock.mockResolvedValue(emptyInfo)
    discoverWebRtcAddressesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveWebRtc = resolve
        })
    )

    const { unmount } = render(<MyIpAddressClient messages={messages} />)
    unmount()

    resolveIpv4?.("203.0.113.10")
    rejectIpv6?.(new Error("failed"))
    resolveWebRtc?.(["10.0.0.1"])

    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(lookupIpInfoMock).toHaveBeenCalled()
  })

  test("ignores late WebRTC failures after unmount", async () => {
    let rejectWebRtc: ((reason?: unknown) => void) | undefined

    lookupPublicIpMock.mockResolvedValue("203.0.113.10")
    lookupIpInfoMock.mockResolvedValue(emptyInfo)
    discoverWebRtcAddressesMock.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectWebRtc = reject
        })
    )

    const { unmount } = render(<MyIpAddressClient messages={messages} />)
    unmount()

    rejectWebRtc?.(new Error("failed"))

    await Promise.resolve()
    await Promise.resolve()

    expect(lookupPublicIpMock).toHaveBeenCalled()
  })
})
