import { afterEach, describe, expect, it, vi } from "vitest"

import { classifyFormFactor, detectBrowser } from "./core/device-info"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"
import {
  booleanValue,
  formatFormFactor,
  formatNumber,
  formatOrientation,
  valueEntry,
} from "./snapshot-format"
import {
  canUseStorage,
  getConnection,
  readGpuInfo,
  readHighEntropyValues,
  readStorageEstimate,
} from "./snapshot-readers"
import { captureDeviceSnapshot, serializeSnapshot } from "./snapshot"

import type { DeviceInformationMessages } from "./types"

const messages: DeviceInformationMessages = { meta, ...messagesCatalog }

function defineWindowValue(name: string, value: unknown) {
  Object.defineProperty(window, name, {
    configurable: true,
    value,
  })
}

function defineNavigator(value: unknown) {
  defineWindowValue("navigator", value)
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value,
  })
}

function createStorage(shouldThrow = false) {
  return {
    setItem: vi.fn(() => {
      if (shouldThrow) {
        throw new Error("blocked")
      }
    }),
    removeItem: vi.fn(),
  }
}

describe("device snapshot formatting helpers", () => {
  it("formats unavailable, boolean, number, orientation, and form-factor values", () => {
    expect(
      valueEntry("gpu", "GPU", undefined, messages, { code: true })
    ).toEqual({
      id: "gpu",
      label: "GPU",
      value: "Unavailable",
      unavailable: true,
      code: true,
    })
    expect(booleanValue(undefined, messages)).toBeUndefined()
    expect(booleanValue(false, messages)).toBe("No")
    expect(booleanValue(true, messages, messages.enabled)).toBe("Enabled")
    expect(formatNumber(undefined, "en")).toBeUndefined()
    expect(formatNumber(Number.NaN, "en")).toBeUndefined()
    expect(formatNumber(1234.5, "en")).toBe("1,234.5")
    expect(formatOrientation("portrait-primary", messages)).toBe(
      "Portrait primary"
    )
    expect(formatOrientation("portrait-secondary", messages)).toBe(
      "Portrait secondary"
    )
    expect(formatOrientation("landscape-primary", messages)).toBe(
      "Landscape primary"
    )
    expect(formatOrientation("landscape-secondary", messages)).toBe(
      "Landscape secondary"
    )
    expect(formatOrientation("sideways", messages)).toBeUndefined()
    expect(formatFormFactor("phone", messages)).toBe("Phone")
    expect(formatFormFactor("watch" as never, messages)).toBe("watch")
  })
})

describe("device snapshot browser readers", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("reads high entropy values and storage estimates when available", async () => {
    const getHighEntropyValues = vi.fn(async (_hints: readonly string[]) => ({
      architecture: "arm",
      bitness: "64",
    }))
    const estimate = vi.fn(async () => ({ quota: 4096, usage: 1024 }))

    await expect(
      readHighEntropyValues({
        userAgentData: { getHighEntropyValues },
      } as never)
    ).resolves.toEqual({
      architecture: "arm",
      bitness: "64",
    })
    expect(getHighEntropyValues.mock.calls[0]?.[0]).toContain("architecture")
    await expect(
      readStorageEstimate({ storage: { estimate } } as never)
    ).resolves.toEqual({
      quota: 4096,
      usage: 1024,
    })
  })

  it("returns undefined when optional browser readers are absent or blocked", async () => {
    await expect(readHighEntropyValues({} as never)).resolves.toBeUndefined()
    await expect(
      readHighEntropyValues({
        userAgentData: {
          getHighEntropyValues: vi.fn(async () => {
            throw new Error("blocked")
          }),
        },
      } as never)
    ).resolves.toBeUndefined()
    await expect(readStorageEstimate({} as never)).resolves.toBeUndefined()
    await expect(
      readStorageEstimate({
        storage: {
          estimate: vi.fn(async () => {
            throw new Error("blocked")
          }),
        },
      } as never)
    ).resolves.toBeUndefined()
  })

  it("checks storage availability without leaking test keys", () => {
    const availableStorage = createStorage()
    defineWindowValue("localStorage", availableStorage)

    expect(canUseStorage("localStorage")).toBe(true)
    expect(availableStorage.setItem).toHaveBeenCalledWith(
      "device-information-storage-check",
      "1"
    )
    expect(availableStorage.removeItem).toHaveBeenCalledWith(
      "device-information-storage-check"
    )

    defineWindowValue("sessionStorage", createStorage(true))
    expect(canUseStorage("sessionStorage")).toBe(false)

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("private mode")
      },
    })
    expect(canUseStorage("localStorage")).toBe(false)
  })

  it("uses connection fallbacks in browser order", () => {
    expect(getConnection({ connection: { type: "wifi" } } as never)).toEqual({
      type: "wifi",
    })
    expect(
      getConnection({ mozConnection: { type: "cellular" } } as never)
    ).toEqual({
      type: "cellular",
    })
    expect(
      getConnection({ webkitConnection: { type: "ethernet" } } as never)
    ).toEqual({
      type: "ethernet",
    })
  })

  it("reads WebGL renderer details when the debug extension is exposed", () => {
    const debugInfo = {
      UNMASKED_VENDOR_WEBGL: 1,
      UNMASKED_RENDERER_WEBGL: 2,
    }
    const webgl = {
      getExtension: vi.fn(() => debugInfo),
      getParameter: vi.fn((name: number) =>
        name === 1 ? "GPU vendor" : "GPU renderer"
      ),
    }
    const canvas = {
      getContext: vi.fn((name: string) => {
        if (name === "webgl") {
          return webgl
        }

        if (name === "webgl2") {
          return {}
        }

        return null
      }),
    } as unknown as HTMLCanvasElement
    vi.spyOn(document, "createElement").mockReturnValue(canvas)

    expect(readGpuInfo()).toEqual({
      webgl: true,
      webgl2: true,
      vendor: "GPU vendor",
      renderer: "GPU renderer",
    })
  })

  it("handles WebGL fallbacks and blocked canvas access", () => {
    const webgl = {
      getExtension: vi.fn(() => undefined),
      getParameter: vi.fn(),
    }
    const canvas = {
      getContext: vi.fn((name: string) =>
        name === "experimental-webgl" ? webgl : null
      ),
    } as unknown as HTMLCanvasElement
    vi.spyOn(document, "createElement").mockReturnValue(canvas)

    expect(readGpuInfo()).toEqual({
      webgl: true,
      webgl2: false,
      vendor: undefined,
      renderer: undefined,
    })

    vi.spyOn(document, "createElement").mockImplementation(() => {
      throw new Error("blocked")
    })
    expect(readGpuInfo()).toEqual({
      webgl: false,
      webgl2: false,
    })
  })
})

describe("captureDeviceSnapshot", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("serializes unavailable values from a restricted browser session", async () => {
    defineNavigator({
      userAgent: "CustomBrowser/1.0",
      language: "en-US",
      languages: [],
      cookieEnabled: false,
      platform: "",
      maxTouchPoints: 0,
      onLine: false,
      doNotTrack: "1",
    })
    defineWindowValue("screen", {
      width: 0,
      height: 0,
      availWidth: 0,
      availHeight: 0,
      colorDepth: 0,
      orientation: { type: "unknown" },
      isExtended: false,
    })
    defineWindowValue("innerWidth", 0)
    defineWindowValue("innerHeight", 0)
    defineWindowValue("outerWidth", 0)
    defineWindowValue("outerHeight", 0)
    defineWindowValue("devicePixelRatio", Number.NaN)
    defineWindowValue("isSecureContext", false)
    vi.spyOn(document, "createElement").mockImplementation(() => {
      throw new Error("blocked")
    })

    const snapshot = await captureDeviceSnapshot(messages, "en")
    const serialized = serializeSnapshot(snapshot)
    const browser = snapshot.summary.find((item) => item.id === "browser")
    const screen = snapshot.summary.find((item) => item.id === "screen")

    expect(browser).toMatchObject({
      value: "Unavailable",
      unavailable: true,
    })
    expect(screen).toMatchObject({
      value: "Unavailable",
      unavailable: true,
    })
    expect(serialized).toContain('"capturedAt"')
    expect(serialized).toContain('"sections"')
  })
})

describe("device information core browser branches", () => {
  it("detects Chrome for iOS client hints and explicit unknown form factors", () => {
    expect(detectBrowser({ userAgent: "Mozilla/5.0 CriOS/120.0" })).toBe(
      "Chrome"
    )
    expect(
      classifyFormFactor({
        explicitFormFactor: "watch",
        viewportWidth: 200,
        viewportHeight: 200,
      })
    ).toBe("watch")
  })
})
