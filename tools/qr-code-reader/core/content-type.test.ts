import { describe, expect, it } from "vitest"

import { classifyQrContent, parseHttpUrl } from "./content-type"

describe("parseHttpUrl", () => {
  it("accepts http and https URLs", () => {
    expect(parseHttpUrl("https://example.com/path?q=1")).toBe(
      "https://example.com/path?q=1"
    )
    expect(parseHttpUrl("http://example.com/")).toBe("http://example.com/")
  })

  it("normalizes domain-like values to https URLs", () => {
    expect(parseHttpUrl("www.example.com/docs")).toBe(
      "https://www.example.com/docs"
    )
    expect(parseHttpUrl("example.com")).toBe("https://example.com/")
  })

  it("rejects unsafe or plain text values", () => {
    expect(parseHttpUrl("javascript:alert(1)")).toBe(null)
    expect(parseHttpUrl("just some words")).toBe(null)
  })
})

describe("classifyQrContent", () => {
  it("classifies link-like payloads with safe open targets", () => {
    expect(classifyQrContent("https://inbrowser.app/tools")).toEqual({
      href: "https://inbrowser.app/tools",
      kind: "url",
    })
    expect(classifyQrContent("mailto:hello@example.com")).toEqual({
      href: "mailto:hello@example.com",
      kind: "email",
    })
    expect(classifyQrContent("tel:+15551234567")).toEqual({
      href: "tel:+15551234567",
      kind: "phone",
    })
    expect(classifyQrContent("sms:+15551234567")).toEqual({
      href: "sms:+15551234567",
      kind: "sms",
    })
    expect(classifyQrContent("geo:37.786971,-122.399677")).toEqual({
      href: "geo:37.786971,-122.399677",
      kind: "location",
    })
  })

  it("classifies structured non-link QR payloads", () => {
    expect(classifyQrContent("WIFI:T:WPA;S:Office;P:secret;;")).toEqual({
      href: null,
      kind: "wifi",
    })
    expect(classifyQrContent("BEGIN:VCARD\nFN:Ada\nEND:VCARD")).toEqual({
      href: null,
      kind: "vcard",
    })
    expect(
      classifyQrContent("BEGIN:VCALENDAR\nSUMMARY:Meeting\nEND:VCALENDAR")
    ).toEqual({
      href: null,
      kind: "calendar",
    })
  })

  it("falls back to text", () => {
    expect(classifyQrContent("hello world")).toEqual({
      href: null,
      kind: "text",
    })
  })
})
