import { describe, expect, it } from "vitest"

import { makeToolHref, readQuery } from "./query"

describe("URL query state", () => {
  it("supplies deterministic empty defaults", () => {
    expect(readQuery("")).toEqual({ q: "", registry: "all", org: "", page: 1 })
  })

  it("reads shareable Unicode and exact organization names", () => {
    expect(
      readQuery(
        "?q=Apple+Inc.&registry=MA-S&org=ACME+%26+%E5%85%AC%E5%8F%B8&page=2"
      )
    ).toEqual({
      q: "Apple Inc.",
      registry: "MA-S",
      org: "ACME & 公司",
      page: 2,
    })
  })

  it.each(["MA-L", "MA-M", "MA-S", "IAB", "CID"])(
    "preserves supported registry %s",
    (registry) => {
      expect(readQuery(`registry=${registry}`).registry).toBe(registry)
    }
  )

  it("ignores unknown registry values", () => {
    expect(readQuery("registry=unknown").registry).toBe("all")
    expect(readQuery("registry=ma-l").registry).toBe("all")
  })

  it.each(["", "0", "-1", "1.5", "1e3", "Infinity", "NaN", "9007199254740992"])(
    "uses page 1 for an invalid page %s",
    (page) => {
      expect(readQuery(`page=${page}`).page).toBe(1)
    }
  )

  it("retains safe positive integer page values", () => {
    expect(readQuery("page=42").page).toBe(42)
    expect(readQuery("page=9007199254740991").page).toBe(9007199254740991)
  })

  it("uses real localized MPA links and omits default state", () => {
    expect(makeToolHref("en", "mac-address-lookup")).toBe(
      "/tools/mac-address-lookup/"
    )
    expect(
      makeToolHref("zh-CN", "mac-address-block-lookup", {
        q: "",
        registry: "all",
        page: 1,
      })
    ).toBe("/zh-CN/tools/mac-address-block-lookup/")
    expect(
      makeToolHref("he", "mac-address-vendor-lookup", {
        q: "00:11:22",
        registry: "CID",
        org: "ACME & 公司",
        page: 3,
      })
    ).toBe(
      "/he/tools/mac-address-vendor-lookup/?q=00%3A11%3A22&registry=CID&org=ACME+%26+%E5%85%AC%E5%8F%B8&page=3"
    )
  })

  it("round-trips filter state without changing exact organization punctuation", () => {
    const state = {
      q: "#1 + & /",
      registry: "IAB" as const,
      org: "Vendor (HQ), Inc.",
      page: 5,
    }
    const href = makeToolHref("fr", "mac-address-block-lookup", state)
    expect(readQuery(href.slice(href.indexOf("?")))).toEqual(state)
  })
})
