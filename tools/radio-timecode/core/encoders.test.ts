import { describe, expect, test } from "vitest"

import { getStationSignal } from "./encoders"
import { getStationById, resolveStation, stations } from "./stations"

describe("radio timecode encoders", () => {
  test("encodes JJY markers and minute bits", () => {
    const marker = getStationSignal(
      "jjy-60",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
    )
    const minute40 = getStationSignal(
      "jjy-60",
      new Date(Date.UTC(2024, 0, 1, 0, 40, 1))
    )

    expect(marker.symbol).toBe("M")
    expect(marker.windows[0]).toEqual({ start: 0.2, end: 1 })
    expect(minute40.symbol).toBe("1")
    expect(minute40.windows[0]).toEqual({ start: 0.5, end: 1 })
  })

  test("encodes DCF77 marker and start bit", () => {
    const marker = getStationSignal(
      "dcf77",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 59))
    )
    const startBit = getStationSignal(
      "dcf77",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 20))
    )
    const zeroBit = getStationSignal(
      "dcf77",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
    )

    expect(marker.symbol).toBe("M")
    expect(marker.windows).toHaveLength(0)
    expect(startBit.symbol).toBe("1")
    expect(startBit.windows[0]).toEqual({ start: 0, end: 0.2 })
    expect(zeroBit.symbol).toBe("0")
    expect(zeroBit.windows[0]).toEqual({ start: 0, end: 0.1 })
  })

  test("encodes WWVB markers and zeros", () => {
    const marker = getStationSignal(
      "wwvb",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
    )
    const zeroBit = getStationSignal(
      "wwvb",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 4))
    )
    const oneBit = getStationSignal(
      "wwvb",
      new Date(Date.UTC(2024, 0, 1, 0, 1, 8))
    )

    expect(marker.symbol).toBe("M")
    expect(marker.windows[0]).toEqual({ start: 0, end: 0.8 })
    expect(zeroBit.symbol).toBe("0")
    expect(zeroBit.windows[0]).toEqual({ start: 0, end: 0.2 })
    expect(oneBit.symbol).toBe("1")
    expect(oneBit.windows[0]).toEqual({ start: 0, end: 0.5 })
  })

  test("encodes MSF minute marker and data bits", () => {
    const marker = getStationSignal(
      "msf",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
    )
    const data = getStationSignal(
      "msf",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 51))
    )

    expect(marker.symbol).toBe("M")
    expect(marker.windows[0]).toEqual({ start: 0, end: 0.5 })
    expect(data.windows[0]).toEqual({ start: 0, end: 0.1 })
    expect(data.symbol.startsWith("A")).toBe(true)
  })

  test("encodes BPC frame markers", () => {
    const frameStart = getStationSignal(
      "bpc",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 0))
    )
    const frameMarker = getStationSignal(
      "bpc",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 1))
    )
    const frameMarker2 = getStationSignal(
      "bpc",
      new Date(Date.UTC(2024, 0, 1, 0, 0, 21))
    )

    expect(frameStart.symbol).toBe("P0")
    expect(frameStart.windows).toHaveLength(0)
    expect(frameMarker.windows[0]).toEqual({ start: 0, end: 0.1 })
    expect(frameMarker2.windows[0]).toEqual({ start: 0, end: 0.2 })
  })

  test("returns a placeholder for unknown stations", () => {
    const fallback = getStationSignal("unknown" as never, new Date())

    expect(fallback).toEqual({ windows: [], symbol: "-" })
  })

  test("resolves station metadata and default fallback", () => {
    expect(stations).toHaveLength(6)
    expect(getStationById("dcf77")?.timeZone).toBe("Europe/Berlin")
    expect(getStationById("unknown" as never)).toBeUndefined()
    expect(resolveStation("bpc").id).toBe("bpc")
    expect(resolveStation(undefined).id).toBe("jjy-60")
  })
})
