import { describe, expect, it } from "vitest"

import { normalizeEmail, validateEmail } from "./email"

describe("normalizeEmail", () => {
  it("trims whitespace and lowercases only the domain", () => {
    expect(normalizeEmail("  User.Name@Example.COM  ")).toBe(
      "User.Name@example.com"
    )
  })

  it("returns the trimmed input when the separator is invalid", () => {
    expect(normalizeEmail("missing-at")).toBe("missing-at")
    expect(normalizeEmail("user@@example.com")).toBe("user@@example.com")
    expect(normalizeEmail("user@")).toBe("user@")
  })
})

describe("validateEmail", () => {
  it("reports an empty result for blank input", () => {
    expect(validateEmail("   ")).toEqual({
      raw: "   ",
      normalized: "",
      length: 0,
      localPart: "",
      domain: "",
      localLength: 0,
      domainLength: 0,
      domainLabels: [],
      hasSingleAt: false,
      isLengthValid: true,
      isLocalLengthValid: false,
      isDomainLengthValid: false,
      isLocalCharsValid: false,
      isLocalDotsValid: false,
      isDomainCharsValid: false,
      isDomainDotsValid: false,
      isDomainLabelLengthValid: false,
      isDomainLabelCharsValid: false,
      isTldValid: false,
      isValid: false,
    })
  })

  it("validates a typical email address", () => {
    expect(validateEmail("User.Name+tag@Example.COM")).toEqual({
      raw: "User.Name+tag@Example.COM",
      normalized: "User.Name+tag@example.com",
      length: 25,
      localPart: "User.Name+tag",
      domain: "Example.COM",
      localLength: 13,
      domainLength: 11,
      domainLabels: ["Example", "COM"],
      hasSingleAt: true,
      isLengthValid: true,
      isLocalLengthValid: true,
      isDomainLengthValid: true,
      isLocalCharsValid: true,
      isLocalDotsValid: true,
      isDomainCharsValid: true,
      isDomainDotsValid: true,
      isDomainLabelLengthValid: true,
      isDomainLabelCharsValid: true,
      isTldValid: true,
      isValid: true,
    })
  })

  it("rejects emails without a single at sign", () => {
    const result = validateEmail("invalid.example.com")

    expect(result.hasSingleAt).toBe(false)
    expect(result.localPart).toBe("")
    expect(result.domain).toBe("")
    expect(result.isValid).toBe(false)
  })

  it("rejects invalid local-part dot placement", () => {
    const result = validateEmail("john..doe@example.com")

    expect(result.isLocalCharsValid).toBe(true)
    expect(result.isLocalDotsValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("rejects leading and trailing dots in local and domain parts", () => {
    const localResult = validateEmail(".user@example.com")
    const domainResult = validateEmail("user@example.com.")

    expect(localResult.isLocalDotsValid).toBe(false)
    expect(localResult.isValid).toBe(false)

    expect(domainResult.isDomainDotsValid).toBe(false)
    expect(domainResult.domainLabels).toEqual([])
    expect(domainResult.isTldValid).toBe(false)
    expect(domainResult.isValid).toBe(false)
  })

  it("rejects invalid domain labels", () => {
    const result = validateEmail("user@-example.com")

    expect(result.isDomainCharsValid).toBe(true)
    expect(result.isDomainDotsValid).toBe(true)
    expect(result.isDomainLabelLengthValid).toBe(true)
    expect(result.isDomainLabelCharsValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("rejects unsupported characters in domain labels", () => {
    const result = validateEmail("user@exam_ple.com")

    expect(result.isDomainCharsValid).toBe(false)
    expect(result.isDomainDotsValid).toBe(true)
    expect(result.isDomainLabelCharsValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("rejects domains without a valid top-level domain", () => {
    const result = validateEmail("user@mailserver")

    expect(result.domainLabels).toEqual(["mailserver"])
    expect(result.isTldValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("rejects overlong addresses and domains", () => {
    const longLocal = "a".repeat(65)
    const longDomain = `${"b".repeat(64)}.${"c".repeat(64)}.${"d".repeat(64)}.${"e".repeat(64)}`

    const localResult = validateEmail(`${longLocal}@example.com`)
    const domainResult = validateEmail(`user@${longDomain}`)

    expect(localResult.isLengthValid).toBe(true)
    expect(localResult.isLocalLengthValid).toBe(false)
    expect(localResult.isValid).toBe(false)

    expect(domainResult.isLengthValid).toBe(false)
    expect(domainResult.isDomainLengthValid).toBe(false)
    expect(domainResult.isDomainLabelLengthValid).toBe(false)
    expect(domainResult.isValid).toBe(false)
  })
})
