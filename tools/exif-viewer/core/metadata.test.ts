import { describe, expect, it } from "vitest"

import {
  createMapUrls,
  formatBytes,
  formatMetadataValue,
  getGpsCoordinates,
  getMetadataFieldCount,
  getVisibleMetadataGroups,
  groupMetadata,
  isSupportedImageFile,
  metadataToJson,
  normalizeMetadata,
} from "./metadata"

describe("EXIF metadata helpers", () => {
  it("checks supported image files by MIME type or extension", () => {
    expect(isSupportedImageFile({ name: "photo.jpg", type: "" })).toBe(true)
    expect(isSupportedImageFile({ name: "capture", type: "image/heic" })).toBe(
      true
    )
    expect(
      isSupportedImageFile({ name: "notes.txt", type: "text/plain" })
    ).toBe(false)
  })

  it("formats byte counts for compact display", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(12_582_912)).toBe("12.0 MB")
    expect(formatBytes(Number.NaN)).toBe("0 B")
  })

  it("normalizes values that are unsafe or noisy for display", () => {
    const binary = new ArrayBuffer(4)
    const normalized = normalizeMetadata({
      Binary: binary,
      Created: new Date("2026-05-14T12:00:00.000Z"),
      Empty: undefined,
      Nested: { Exposure: Number.POSITIVE_INFINITY },
    })

    expect(normalized).toEqual({
      Binary: "[Binary data: 4 bytes]",
      Created: "2026-05-14T12:00:00.000Z",
      Nested: { Exposure: "Infinity" },
    })
    expect(normalizeMetadata(null)).toEqual({})
  })

  it("formats field values for table display", () => {
    expect(formatMetadataValue(["Canon", "EOS"])).toBe("Canon, EOS")
    expect(formatMetadataValue(1.234567)).toBe("1.2346")
    expect(formatMetadataValue({ Lens: "35mm" })).toBe('{"Lens":"35mm"}')
    expect(formatMetadataValue(null)).toBe("-")
    expect(formatMetadataValue(undefined)).toBe("-")
  })

  it("groups known fields and leaves uncommon fields in advanced", () => {
    const groups = groupMetadata({
      CreateDate: "2026-05-14T12:00:00.000Z",
      ImageWidth: 4000,
      Make: "Canon",
      UnknownTag: "value",
      latitude: 37.7749,
      longitude: -122.4194,
    })
    const visibleGroups = getVisibleMetadataGroups(groups)

    expect(visibleGroups.map((group) => group.id)).toEqual([
      "basic",
      "camera",
      "gps",
      "advanced",
    ])
    expect(getMetadataFieldCount(visibleGroups)).toBe(6)
  })

  it("creates map links when GPS coordinates are present", () => {
    const metadata = { latitude: 37.7749, longitude: -122.4194 }

    expect(getGpsCoordinates(metadata)).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
    })
    expect(createMapUrls(37.7749, -122.4194)).toEqual({
      googleMaps: "https://www.google.com/maps?q=37.7749,-122.4194",
      amap: "https://uri.amap.com/marker?position=-122.4194,37.7749",
    })
    expect(getGpsCoordinates({ latitude: "37", longitude: -122 })).toBe(null)
    expect(getGpsCoordinates({ latitude: Number.NaN, longitude: -122 })).toBe(
      null
    )
  })

  it("serializes metadata as stable sanitized JSON", () => {
    expect(
      metadataToJson({
        Array: [1, new Uint8Array([1, 2])],
        Date: new Date("2026-05-14T12:00:00.000Z"),
      })
    ).toBe(
      '{\n  "Array": [\n    1,\n    "[Binary data: 2 bytes]"\n  ],\n  "Date": "2026-05-14T12:00:00.000Z"\n}'
    )
  })
})
