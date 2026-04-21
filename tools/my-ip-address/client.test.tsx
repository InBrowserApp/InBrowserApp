import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import MyIpAddressClient from "./client"

const lookupPublicIpMock = vi.fn()
const lookupIpInfoMock = vi.fn()
const discoverWebRtcAddressesMock = vi.fn()
const getIpsMock = vi.fn()

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
  unableToGetIp: "Unable to get IP",
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

afterEach(() => {
  cleanup()
  discoverWebRtcAddressesMock.mockReset()
  getIpsMock.mockReset()
  lookupIpInfoMock.mockReset()
  lookupPublicIpMock.mockReset()
})

describe("MyIpAddressClient", () => {
  test("renders IPv4, IPv6, and WebRTC-discovered addresses", async () => {
    lookupPublicIpMock.mockImplementation(async (version: string) =>
      version === "ipv4" ? "203.0.113.10" : "2001:db8::1"
    )
    lookupIpInfoMock.mockImplementation(async (ip: string) => ({
      hostname: `${ip}.example.test`,
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

    expect(screen.getByText("WebRTC Leak")).toBeTruthy()
    expect(screen.getAllByText("Example ISP").length).toBeGreaterThan(0)
    expect(getIpsMock).not.toHaveBeenCalled()
  })

  test("shows an unavailable state when public address lookups fail", async () => {
    lookupPublicIpMock.mockRejectedValue(new Error("failed"))
    discoverWebRtcAddressesMock.mockResolvedValue([])

    render(<MyIpAddressClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getAllByText("Unable to get IP")).toHaveLength(2)
    })

    expect(screen.queryByText("WebRTC Leak")).toBeNull()
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
