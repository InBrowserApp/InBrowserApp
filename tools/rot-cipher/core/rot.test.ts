import { describe, expect, test } from "vitest"

import { rot, rot13Char, rot18Char, rot47Char, rot5Char } from "./rot"

describe("rot13Char", () => {
  test("rotates uppercase letters", () => {
    expect(rot13Char("A")).toBe("N")
    expect(rot13Char("Z")).toBe("M")
  })

  test("rotates lowercase letters", () => {
    expect(rot13Char("a")).toBe("n")
    expect(rot13Char("z")).toBe("m")
  })

  test("leaves non-letters unchanged", () => {
    expect(rot13Char("1")).toBe("1")
    expect(rot13Char("!")).toBe("!")
  })
})

describe("rot5Char", () => {
  test("rotates digits", () => {
    expect(rot5Char("0")).toBe("5")
    expect(rot5Char("9")).toBe("4")
  })

  test("leaves non-digits unchanged", () => {
    expect(rot5Char("A")).toBe("A")
  })
})

describe("rot18Char", () => {
  test("combines rot13 and rot5", () => {
    expect(rot18Char("a")).toBe("n")
    expect(rot18Char("7")).toBe("2")
  })

  test("leaves unsupported characters unchanged", () => {
    expect(rot18Char("?")).toBe("?")
  })
})

describe("rot47Char", () => {
  test("rotates printable ascii characters", () => {
    expect(rot47Char("!")).toBe("P")
    expect(rot47Char("~")).toBe("O")
  })

  test("leaves non-printable ascii unchanged", () => {
    expect(rot47Char("\n")).toBe("\n")
  })
})

describe("rot", () => {
  test("encodes and decodes rot13 text", () => {
    expect(rot("Hello World!", "rot13")).toBe("Uryyb Jbeyq!")
    expect(rot("Uryyb Jbeyq!", "rot13")).toBe("Hello World!")
  })

  test("encodes and decodes digits with rot5", () => {
    expect(rot("12345", "rot5")).toBe("67890")
    expect(rot("67890", "rot5")).toBe("12345")
  })

  test("encodes letters and digits with rot18", () => {
    expect(rot("Hello 123", "rot18")).toBe("Uryyb 678")
  })

  test("encodes printable ascii with rot47", () => {
    expect(rot("Hello World!", "rot47")).toBe("w6==@ (@C=5P")
  })

  test("is self-reversing for every supported rot type", () => {
    const sample = "Hello World! 12345 ~"

    expect(rot(rot(sample, "rot13"), "rot13")).toBe(sample)
    expect(rot(rot(sample, "rot5"), "rot5")).toBe(sample)
    expect(rot(rot(sample, "rot18"), "rot18")).toBe(sample)
    expect(rot(rot(sample, "rot47"), "rot47")).toBe(sample)
  })
})
