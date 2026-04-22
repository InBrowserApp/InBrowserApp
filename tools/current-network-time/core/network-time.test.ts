import { describe, expect, test } from "vitest"

import {
  createNetworkBaseline,
  parseCloudflareTraceTimestamp,
  readNetworkClockTime,
} from "./network-time"

describe("network-time", () => {
  test("parses the Cloudflare trace timestamp", () => {
    expect(
      parseCloudflareTraceTimestamp("fl=29f43\nh=cloudflare.com\nts=123.456")
    ).toBe(123456)
  })

  test("throws when the trace timestamp is missing", () => {
    expect(() => {
      parseCloudflareTraceTimestamp("fl=29f43\nh=cloudflare.com")
    }).toThrow("Failed to parse Cloudflare trace timestamp")
  })

  test("creates a baseline and reads the network clock", () => {
    const baseline = createNetworkBaseline({
      trace: "ts=1700000000.123",
      startPerformanceMs: 1_000,
      endPerformanceMs: 1_240,
      localEpochMs: 1_700_000_000_000,
    })

    expect(baseline).toEqual({
      performanceStartMs: 1_120,
      networkStartMs: 1_700_000_000_123,
      roundTripTimeMs: 240,
      offsetMs: 123,
    })
    expect(readNetworkClockTime(baseline, 1_620)).toBe(1_700_000_000_623)
  })
})
