import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import DeviceInformationClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = { meta, ...messagesCatalog }

function defineWindowValue(name: string, value: unknown) {
  Object.defineProperty(window, name, {
    configurable: true,
    value,
  })
}

function installBrowserEnvironment() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  const navigatorValue = {
    userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36",
    language: "en-US",
    languages: ["en-US", "fr-CA"],
    cookieEnabled: true,
    platform: "MacIntel",
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    deviceMemory: 16,
    onLine: true,
    doNotTrack: null,
    clipboard: { writeText },
    storage: {
      estimate: vi.fn(async () => ({
        quota: 1024 ** 3,
        usage: 2 * 1024 ** 2,
      })),
    },
    connection: {
      effectiveType: "4g",
      downlink: 25,
      rtt: 40,
      saveData: false,
    },
    userAgentData: {
      brands: [{ brand: "Google Chrome", version: "120" }],
      mobile: false,
      platform: "macOS",
      getHighEntropyValues: vi.fn(async () => ({
        architecture: "arm64",
        bitness: "64",
        model: "Mac",
      })),
    },
  }

  defineWindowValue("navigator", navigatorValue)
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: navigatorValue,
  })
  defineWindowValue("screen", {
    width: 1920,
    height: 1080,
    availWidth: 1680,
    availHeight: 1050,
    colorDepth: 30,
    orientation: { type: "landscape-primary" },
    isExtended: true,
  })
  defineWindowValue("innerWidth", 1440)
  defineWindowValue("innerHeight", 900)
  defineWindowValue("outerWidth", 1500)
  defineWindowValue("outerHeight", 980)
  defineWindowValue("devicePixelRatio", 2)
  defineWindowValue("isSecureContext", true)

  return { writeText }
}

describe("DeviceInformationClient", () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("renders browser, display, hardware, and connection details", async () => {
    installBrowserEnvironment()

    render(<DeviceInformationClient language="en" messages={messages} />)

    expect((await screen.findAllByText("Chrome")).length).toBeGreaterThan(0)
    expect(screen.getAllByText("1920 x 1080").length).toBeGreaterThan(0)
    expect(screen.getByText("Landscape primary")).toBeTruthy()
    expect(screen.getByText("arm64")).toBeTruthy()
    expect(screen.getByText("64-bit")).toBeTruthy()
    expect(screen.getByText("16 GB")).toBeTruthy()
    expect(screen.getByText("25 Mbps")).toBeTruthy()
    expect(screen.getByText("1 GB")).toBeTruthy()
  })

  it("copies the JSON snapshot", async () => {
    const { writeText } = installBrowserEnvironment()

    render(<DeviceInformationClient language="en" messages={messages} />)

    await screen.findAllByText("Chrome")
    fireEvent.click(screen.getByRole("button", { name: "Copy JSON" }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1)
    })
    expect(writeText.mock.calls[0]?.[0]).toContain('"id": "browser"')
    expect(writeText.mock.calls[0]?.[0]).toContain('"value": "Chrome"')
    expect(writeText.mock.calls[0]?.[0]).toContain('"label": "Device memory"')
    expect(writeText.mock.calls[0]?.[0]).toContain('"value": "16 GB"')
  })
})
