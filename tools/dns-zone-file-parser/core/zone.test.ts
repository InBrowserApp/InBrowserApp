import { describe, expect, test } from "vitest"
import { readZone } from "./zone"

describe("readZone", () => {
  test("parses owner inheritance, default TTL, class order, multiline SOA, and TXT", () => {
    const source = [
      "$ORIGIN example.org.",
      "$TTL 1h",
      "@ IN SOA ns hostmaster (",
      "  1000 3600 ; refresh",
      "  1800 604800 300",
      ")",
      "www 15m in A 192.0.2.1",
      "    IN AAAA 2001:db8::1 ; inherits www",
      '@ CH TXT "hello; (world)" "more"',
      "mail MX 10 mx",
      "absolute.test. A 192.0.2.8",
    ].join("\r\n")
    expect(readZone("\uFEFF" + source)).toEqual({
      notes: [],
      records: [
        {
          line: 3,
          name: "example.org.",
          class: "IN",
          type: "SOA",
          ttl: 3600,
          data: "ns hostmaster 1000 3600 1800 604800 300",
        },
        {
          line: 7,
          name: "www.example.org.",
          class: "IN",
          type: "A",
          ttl: 900,
          data: "192.0.2.1",
        },
        {
          line: 8,
          name: "www.example.org.",
          class: "IN",
          type: "AAAA",
          ttl: 3600,
          data: "2001:db8::1",
        },
        {
          line: 9,
          name: "example.org.",
          class: "CH",
          type: "TXT",
          ttl: 3600,
          data: '"hello; (world)" "more"',
        },
        {
          line: 10,
          name: "mail.example.org.",
          class: "CH",
          type: "MX",
          ttl: 3600,
          data: "10 mx",
        },
        {
          line: 11,
          name: "absolute.test.",
          class: "CH",
          type: "A",
          ttl: 3600,
          data: "192.0.2.8",
        },
      ],
    })
  })

  test("resolves relative origins and recognizes escaped dot, semicolon, and quoted text", () => {
    const source = String.raw`$ORIGIN lab
svc\. 1D2h3m4S5 IN TYPE123 \# 1 ff
txt TXT "foo\"bar\;baz"
open\;label A 192.0.2.1`
    expect(readZone(source, " example.org ")).toMatchObject({
      notes: [],
      records: [
        {
          name: String.raw`svc\..lab.example.org.`,
          ttl: 93789,
          type: "TYPE123",
          data: String.raw`\# 1 ff`,
        },
        {
          name: "txt.lab.example.org.",
          ttl: 93789,
          data: String.raw`"foo\"bar\;baz"`,
        },
        { name: String.raw`open\;label.lab.example.org.` },
      ],
    })
  })

  test("leaves owner and TTL unspecified when no origin or TTL is available", () => {
    expect(readZone('@ TXT ""\nname HS A 192.0.2.1')).toMatchObject({
      records: [
        { name: "@", ttl: null, data: '""' },
        { name: "name", ttl: null, class: "HS" },
      ],
    })
  })

  test("reports each malformed line while retaining readable records", () => {
    const { records, notes } = readZone(
      [
        "  A 192.0.2.10",
        "$ORIGIN",
        '$ORIGIN "quoted.example."',
        "$ORIGIN example.org. extra",
        "$TTL",
        "$TTL 1x",
        "$TTL 2147483648",
        "$INCLUDE external",
        "$GENERATE 1-4 host$ IN A 192.0.2.$",
        "first A",
        "bad 1x IN A 192.0.2.2",
        'bad TXT "unclosed',
        "bad TXT escaped\\",
        "bad TXT )",
        "bad TXT ((",
        "good CLASS65280 0 A 192.0.2.1",
        "bad TXT (",
      ].join("\n")
    )
    expect(records).toEqual([
      {
        line: 16,
        name: "good",
        class: "CLASS65280",
        type: "A",
        ttl: 0,
        data: "192.0.2.1",
      },
    ])
    expect(notes).toEqual([
      { line: 1, code: "owner" },
      { line: 2, code: "invalidOrigin" },
      { line: 3, code: "invalidOrigin" },
      { line: 4, code: "invalidOrigin" },
      { line: 5, code: "invalidTtl" },
      { line: 6, code: "invalidTtl" },
      { line: 7, code: "invalidTtl" },
      { line: 8, code: "unsupported", directive: "$INCLUDE" },
      { line: 9, code: "unsupported", directive: "$GENERATE" },
      { line: 10, code: "record" },
      { line: 11, code: "invalidTtl" },
      { line: 12, code: "quote" },
      { line: 13, code: "quote" },
      { line: 14, code: "parentheses" },
      { line: 15, code: "parentheses" },
      { line: 17, code: "parentheses" },
    ])
  })

  test("ignores blank lines and comments and accepts the DNS root as origin", () => {
    expect(readZone("  \n;comment\n")).toEqual({ records: [], notes: [] })
    expect(readZone("$origin .\rwww 10 a 192.0.2.1")).toMatchObject({
      records: [{ name: "www.", ttl: 10, type: "A" }],
    })
  })

  test("does not reinterpret missing or repeated record header fields", () => {
    expect(
      readZone(
        [
          "owner",
          "owner IN CH A 192.0.2.1",
          "owner 60 30 A 192.0.2.1",
          "owner 2x 30 A 192.0.2.1",
        ].join("\n")
      )
    ).toEqual({
      records: [],
      notes: [
        { line: 1, code: "record" },
        { line: 2, code: "record" },
        { line: 3, code: "record" },
        { line: 4, code: "invalidTtl" },
      ],
    })
  })
})
