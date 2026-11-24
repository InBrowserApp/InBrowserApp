import { describe, expect, test } from "vitest"
import { readSpf } from "./spf"

describe("readSpf", () => {
  test("parses mechanisms, qualifiers and modifiers with case-insensitive names", () => {
    const result = readSpf(
      " V=SpF1   ip4:192.0.2.0/24 +A -MX//64 ?include:_spf.example.com ~exists:foo.%{d} exp=info.example.com ignored-tag= "
    )
    expect(result.errors).toEqual([])
    expect(result.lookupCount).toBe(4)
    expect(result.warnings).toEqual([])
    expect(result.terms).toEqual([
      { raw: "ip4:192.0.2.0/24", kind: "mechanism", qualifier: "+" },
      { raw: "+A", kind: "mechanism", qualifier: "+" },
      { raw: "-MX//64", kind: "mechanism", qualifier: "-" },
      { raw: "?include:_spf.example.com", kind: "mechanism", qualifier: "?" },
      { raw: "~exists:foo.%{d}", kind: "mechanism", qualifier: "~" },
      { raw: "exp=info.example.com", kind: "modifier" },
      { raw: "ignored-tag=", kind: "extension" },
    ])
    expect(readSpf("v=spf1").errors).toEqual([])
  })

  test("supports address limits, domain suffixes, and literal slashes inside macros", () => {
    expect(
      readSpf(
        "v=spf1 a:%{l1r/-}.example.org./0//128 mx:x.example-a/32 ip6:2001:db8:: ip6:::ffff:192.0.2.11/128 ptr:example.com redirect=%{d}"
      ).errors
    ).toEqual([])
    expect(
      readSpf(
        "v=spf1 ip4:255.255.255.255/32 ip4:0.0.0.0/0 include:foo.e1xists x.y_1=%{c}%%%-"
      ).errors
    ).toEqual([])
  })

  test.each([
    ["", "version"],
    ["v=spf10 -all", "version"],
    ["v=spf1\t-all", "spacing"],
    ["v=spf1\n-all", "spacing"],
    ["v=spf1 all:foo.example", "unexpectedArgument"],
    ["v=spf1 -notreal", "unknown"],
    ["v=spf1 ~", "unknown"],
    ["v=spf1 exists", "domain"],
    ["v=spf1 include:company", "domain"],
    ["v=spf1 include:a.1234", "domain"],
    ["v=spf1 ptr/32", "domain"],
    ["v=spf1 ptr:", "domain"],
    ["v=spf1 a:example.%{z}", "domain"],
    ["v=spf1 mx:%{c}", "domain"],
    ["v=spf1 mx:example.%", "domain"],
    ["v=spf1 a/33", "prefix"],
    ["v=spf1 a/03", "prefix"],
    ["v=spf1 mx/24/64", "prefix"],
    ["v=spf1 mx//129", "prefix"],
    ["v=spf1 ip6:hello/128", "address"],
    ["v=spf1 ip6:abcd", "address"],
    ["v=spf1 ip6:::1/129", "address"],
    ["v=spf1 ip4", "address"],
    ["v=spf1 ip4:999.0.0.1", "address"],
    ["v=spf1 ip4:01.0.0.1", "address"],
    ["v=spf1 ip4:192.0.2.0/33", "address"],
    ["v=spf1 redirect=", "invalidModifier"],
    ["v=spf1 -redirect=example.com", "invalidModifier"],
    ["v=spf1 exp=bad%{t}.example.com", "invalidModifier"],
    ["v=spf1 ignored=%{bad}", "invalidModifier"],
    [
      "v=spf1 redirect=example.com REDIRECT=elsewhere.example.com",
      "duplicateModifier",
    ],
    ["v=spf1 exp=example.com exp=other.example", "duplicateModifier"],
  ])("reports the first syntax error for %s", (value, expected) => {
    expect(readSpf(value).errors[0]?.code).toBe(expected)
  })

  test("counts potentially evaluated lookup terms before all and ignores inactive redirect", () => {
    const beforeAll = readSpf(
      "v=spf1 redirect=example.com ptr mx -all include:_spf.example.com"
    )
    expect(beforeAll.errors).toEqual([])
    expect(beforeAll.lookupCount).toBe(2)
    expect(beforeAll.warnings).toEqual(["deprecatedPtr", "unreachable"])
    expect(readSpf("v=spf1 a redirect=example.com").lookupCount).toBe(2)
    expect(readSpf("v=spf1 " + "a ".repeat(11)).warnings).toEqual(["overLimit"])
  })
})
