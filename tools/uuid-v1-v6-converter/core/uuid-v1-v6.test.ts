import { describe, expect, test } from "vitest"

import { convertUuid, parseUuid } from "./uuid-v1-v6"

const V1_SAMPLE = "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
const V6_SAMPLE = "1f034bdc-1ed6-67f0-b3fe-02d71e841f4f"

describe("uuid v1/v6 conversion", () => {
  test("normalizes canonical, compact, uppercase, URN, and braced UUID input", () => {
    expect(parseUuid(V1_SAMPLE.toUpperCase(), "v1")).toEqual({
      compact: "c1ed67f034bd11f0b3fe02d71e841f4f",
      kind: "valid",
      uuid: V1_SAMPLE,
    })
    expect(parseUuid("c1ed67f034bd11f0b3fe02d71e841f4f", "v1")).toEqual({
      compact: "c1ed67f034bd11f0b3fe02d71e841f4f",
      kind: "valid",
      uuid: V1_SAMPLE,
    })
    expect(parseUuid(`urn:uuid:${V1_SAMPLE}`, "v1")).toEqual({
      compact: "c1ed67f034bd11f0b3fe02d71e841f4f",
      kind: "valid",
      uuid: V1_SAMPLE,
    })
    expect(parseUuid(`{${V1_SAMPLE}}`, "v1")).toEqual({
      compact: "c1ed67f034bd11f0b3fe02d71e841f4f",
      kind: "valid",
      uuid: V1_SAMPLE,
    })
  })

  test("rejects empty, malformed, wrong-version, and wrong-variant input", () => {
    expect(parseUuid("", "v1")).toEqual({ kind: "invalid", error: "empty" })
    expect(parseUuid("not-a-uuid", "v1")).toEqual({
      kind: "invalid",
      error: "format",
    })
    expect(parseUuid(V6_SAMPLE, "v1")).toEqual({
      kind: "invalid",
      error: "version",
    })
    expect(parseUuid("c1ed67f0-34bd-11f0-c3fe-02d71e841f4f", "v1")).toEqual({
      kind: "invalid",
      error: "variant",
    })
  })

  test("converts UUID v1 to UUID v6 by reordering the timestamp bits", () => {
    expect(convertUuid("v1-to-v6", V1_SAMPLE)).toEqual({
      input: V1_SAMPLE,
      kind: "valid",
      output: V6_SAMPLE,
    })
  })

  test("converts UUID v6 back to UUID v1 without changing sequence or node bits", () => {
    expect(convertUuid("v6-to-v1", V6_SAMPLE)).toEqual({
      input: V6_SAMPLE,
      kind: "valid",
      output: V1_SAMPLE,
    })
  })

  test("returns empty and invalid conversion states without throwing", () => {
    expect(convertUuid("v1-to-v6", " ")).toEqual({ kind: "empty" })
    expect(convertUuid("v6-to-v1", V1_SAMPLE)).toEqual({
      kind: "invalid",
      error: "version",
    })
  })
})
