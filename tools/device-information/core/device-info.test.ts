import { describe, expect, it } from "vitest"

import {
  classifyFormFactor,
  describeColorDepth,
  detectBrowser,
  detectCpuArchitecture,
  formatBytes,
  formatResolution,
  formatTimezone,
  normalizeConnectionType,
} from "./device-info"

describe("formatBytes", () => {
  it.each([
    [Number.NaN, undefined],
    [-1, undefined],
    [0, "0 B"],
    [512, "512 B"],
    [1536, "1.5 KB"],
    [15 * 1024, "15 KB"],
    [2 * 1024 ** 2, "2 MB"],
    [3.25 * 1024 ** 3, "3.3 GB"],
    [5 * 1024 ** 5, "5120 TB"],
  ])("formats %s bytes as %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected)
  })
})

describe("formatResolution", () => {
  it.each([
    [1920, 1080, "1920 x 1080"],
    [390.4, 844.6, "390 x 845"],
    [undefined, 1080, undefined],
    [1920, undefined, undefined],
    [0, 1080, undefined],
    [1920, -1, undefined],
    [Number.POSITIVE_INFINITY, 1080, undefined],
  ])("formats %s by %s", (width, height, expected) => {
    expect(formatResolution(width, height)).toBe(expected)
  })
})

describe("formatTimezone", () => {
  it.each([
    ["America/Los_Angeles", -420, "America/Los_Angeles (UTC-07:00)"],
    ["Asia/Kolkata", 330, "Asia/Kolkata (UTC+05:30)"],
    ["UTC", undefined, "UTC"],
    ["", 0, undefined],
    ["UTC", Number.NaN, "UTC"],
  ])("formats timezone %s with offset %s", (timeZone, offset, expected) => {
    expect(formatTimezone(timeZone, offset)).toBe(expected)
  })
})

describe("detectBrowser", () => {
  it.each([
    ["Edge", "Mozilla/5.0 Chrome/120.0 Edg/120.0"],
    ["Opera", "Mozilla/5.0 Chrome/120.0 OPR/90.0"],
    ["Firefox", "Mozilla/5.0 Firefox/120.0"],
    ["Chrome", "Mozilla/5.0 Chrome/120.0 Safari/537.36"],
    ["Safari", "Mozilla/5.0 Version/17.0 Safari/605.1.15"],
  ])("detects %s from the user agent", (expected, userAgent) => {
    expect(detectBrowser({ userAgent })).toBe(expected)
  })

  it.each([
    ["Edge", "Microsoft Edge"],
    ["Opera", "Opera"],
    ["Firefox", "Firefox"],
    ["Chrome", "Google Chrome"],
    ["Safari", "Safari"],
  ])("falls back to client hint brand %s", (expected, brand) => {
    expect(
      detectBrowser({
        userAgent: "CustomBrowser/1.0",
        brands: [{ brand }],
      })
    ).toBe(expected)
  })

  it("returns undefined when no known browser signal exists", () => {
    expect(detectBrowser({ userAgent: "CustomBrowser/1.0" })).toBeUndefined()
  })

  it("returns undefined for unknown client hint brands", () => {
    expect(
      detectBrowser({
        userAgent: "CustomBrowser/1.0",
        brands: [{ brand: "Custom Brand" }],
      })
    ).toBeUndefined()
  })
})

describe("detectCpuArchitecture", () => {
  it("prefers explicit client hint architecture", () => {
    expect(
      detectCpuArchitecture({
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
        architecture: "arm64",
      })
    ).toBe("arm64")
  })

  it.each([
    ["ARM64", "Mozilla/5.0 (Linux; Android 14; arm64)"],
    ["ARM64", "Mozilla/5.0 (Linux; aarch64)"],
    ["ARM", "Mozilla/5.0 (Linux; ARMv8)"],
    ["x86_64", "Mozilla/5.0 (X11; Linux x86_64)"],
    ["x86_64", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"],
    ["x86", "Mozilla/5.0 (X11; Linux i686)"],
    ["x86", "Mozilla/5.0 (X11; Linux i386)"],
  ])("detects %s from %s", (expected, userAgent) => {
    expect(detectCpuArchitecture({ userAgent })).toBe(expected)
  })

  it("returns undefined when architecture is unknown", () => {
    expect(
      detectCpuArchitecture({ userAgent: "Mozilla/5.0 (Unknown)" })
    ).toBeUndefined()
  })
})

describe("classifyFormFactor", () => {
  it.each([
    ["desktop", { explicitFormFactor: "desktop" }, "desktop"],
    [
      "phone",
      { mobile: true, viewportWidth: 390, viewportHeight: 844 },
      "phone",
    ],
    [
      "tablet",
      { mobile: true, viewportWidth: 820, viewportHeight: 1180 },
      "tablet",
    ],
    [
      "tablet",
      { maxTouchPoints: 5, viewportWidth: 744, viewportHeight: 1133 },
      "tablet",
    ],
    [
      "touchDesktop",
      { maxTouchPoints: 10, viewportWidth: 1280, viewportHeight: 800 },
      "touchDesktop",
    ],
    ["desktop", { viewportWidth: 1440, viewportHeight: 900 }, "desktop"],
    ["unknown", {}, "unknown"],
  ])("classifies %s", (_name, input, expected) => {
    expect(classifyFormFactor(input)).toBe(expected)
  })
})

describe("describeColorDepth", () => {
  it.each([
    [undefined, undefined],
    [0, undefined],
    [24, { bits: 24, hdr: false }],
    [30.4, { bits: 30, hdr: true }],
    [Number.NaN, undefined],
  ])("describes %s", (bits, expected) => {
    expect(describeColorDepth(bits)).toEqual(expected)
  })
})

describe("normalizeConnectionType", () => {
  it("prefers effective connection type", () => {
    expect(normalizeConnectionType("4g", "wifi")).toBe("4g")
  })

  it("falls back to connection type", () => {
    expect(normalizeConnectionType("", "wifi")).toBe("wifi")
  })

  it("returns undefined when both values are empty", () => {
    expect(normalizeConnectionType(" ", undefined)).toBeUndefined()
  })
})
