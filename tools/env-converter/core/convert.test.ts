import { describe, expect, test } from "vitest"
import { load, JSON_SCHEMA } from "js-yaml"
import { convert } from "./convert"
import { parseEnv } from "./parse-env"
import { interpolate, type Format } from "../types"

describe(".env parsing", () => {
  test("preserves strings, whitespace, comments, export, BOM and line endings", () => {
    const result = parseEnv(
      '\uFEFF# header\r\n export PORT = 0030 # port\rDEBUG=false\nEMPTY=\nSPACES=  value  \nHASH=" a # b " # comment\nEQ=a=b=c\nNAME=O\'Reilly\nREF=${PORT}\nCMD=$(echo hi)\nexport=plain'
    )
    expect(result.diagnostics).toEqual([])
    expect(result.values).toEqual({
      PORT: "0030",
      DEBUG: "false",
      EMPTY: "",
      SPACES: "value",
      HASH: " a # b ",
      EQ: "a=b=c",
      NAME: "O'Reilly",
      REF: "${PORT}",
      CMD: "$(echo hi)",
      export: "plain",
    })
  })

  test("handles each quote, literal escapes, multiline values and escaped matching quotes", () => {
    const result = parseEnv(
      'A="first\\nsecond\\rthird"\nB=\'literal\\n\'\nC=`some # text`\nD="first\nsecond"\nE="a\\"b"\nF=\'path with space\\\'\nG=""\nH=\'multi\nline\'\nI=`back\nticks`'
    )
    expect(result.diagnostics).toEqual([])
    expect(result.values).toEqual({
      A: "first\nsecond\rthird",
      B: "literal\\n",
      C: "some # text",
      D: "first\nsecond",
      E: 'a\\"b',
      F: "path with space\\",
      G: "",
      H: "multi\nline",
      I: "back\nticks",
    })
  })

  test("reports duplicate definitions at physical lines with last value winning", () => {
    const result = parseEnv(
      'A="multi\nline"\nA=second\nA=third\na=other\n__proto__=safe\nconstructor=safe'
    )
    expect(result.values.A).toBe("third")
    expect(result.values.a).toBe("other")
    expect(result.values.__proto__).toBe("safe")
    expect(result.values.constructor).toBe("safe")
    expect(result.diagnostics).toEqual([
      {
        code: "duplicate",
        severity: "warning",
        key: "A",
        line: 3,
        previousLine: 1,
      },
      {
        code: "duplicate",
        severity: "warning",
        key: "A",
        line: 4,
        previousLine: 1,
      },
    ])
  })

  test("preserves spaces inside multiline quotes, including blank lines", () => {
    expect(
      parseEnv("A=\"first  \n   \n  last \"\nB=' value \nnext  '")
    ).toEqual({
      values: { A: "first  \n   \n  last ", B: " value \nnext  " },
      diagnostics: [],
    })
  })

  test("finds malformed assignments, keys, trailing text and curly quotes", () => {
    const result = parseEnv(
      'missing\n=empty\n1BAD=x\nA.B=x\nA="value" junk\nB=“curly”\nC=\'ok\' # valid\nD="unterminated\nnext line'
    )
    expect(result.diagnostics.map(({ code, line }) => [code, line])).toEqual([
      ["assignment", 1],
      ["invalidKey", 2],
      ["invalidKey", 3],
      ["invalidKey", 4],
      ["trailingText", 5],
      ["smartQuote", 6],
      ["unclosedQuote", 8],
    ])
    expect(result.values).toEqual({ B: "“curly”", C: "ok" })
  })

  test.each(["'", '"', "`"])(
    "reports a missing %s closing quote at EOF",
    (quote) => {
      expect(parseEnv(`KEY=${quote}unfinished`).diagnostics).toEqual([
        {
          code: "unclosedQuote",
          severity: "error",
          line: 1,
          key: "KEY",
          quote,
        },
      ])
    }
  )
})

describe("conversion", () => {
  test.each(["", " \n\t"])(
    "returns an empty state for blank input",
    (input) => {
      expect(convert(input, "env", "json")).toEqual({
        state: "empty",
        output: "",
        values: {},
        diagnostics: [],
      })
    }
  )

  test("keeps warnings exportable and errors clear the output", () => {
    expect(convert("A=one\nA=two", "env", "json")).toMatchObject({
      state: "converted",
      output: '{\n  "A": "two"\n}',
    })
    expect(convert('A="bad', "env", "json")).toMatchObject({
      state: "error",
      output: "",
    })
    expect(convert("# only comments", "env", "json").output).toBe("{}")
    expect(convert("{}", "json", "env").output).toBe("")
  })

  test("quotes YAML strings and preserves their exact values on return", () => {
    const yaml = convert(
      "A=0012\nB=false\nC=null\nD=2026-01-01\nE=on\nF=",
      "env",
      "yaml"
    )
    expect(yaml.state).toBe("converted")
    expect(load(yaml.output, { schema: JSON_SCHEMA })).toEqual({
      A: "0012",
      B: "false",
      C: "null",
      D: "2026-01-01",
      E: "on",
      F: "",
    })
    expect(convert(yaml.output, "yaml", "env").values).toEqual(yaml.values)
  })

  test.each(["json", "yaml"] as const)(
    "accepts flat %s scalars and validates the object shape",
    (format) => {
      const input =
        format === "json"
          ? '{"PORT":3000,"DEBUG":false,"ENABLED":true,"EMPTY":""}'
          : 'PORT: 3000\nDEBUG: false\nENABLED: true\nEMPTY: ""'
      expect(convert(input, format, "env")).toMatchObject({
        state: "converted",
        output: "PORT=3000\nDEBUG=false\nENABLED=true\nEMPTY=",
      })
      for (const invalid of ["null", "[]", "1", '"string"', "true"]) {
        expect(convert(invalid, format, "env").diagnostics[0]?.code).toBe(
          "rootObject"
        )
      }
    }
  )

  test("YAML dates stay strings; null, nested values, invalid keys and nonfinite numbers are errors", () => {
    expect(convert("DATE: 2026-01-01", "yaml", "env").output).toBe(
      "DATE=2026-01-01"
    )
    const result = convert(
      "BAD-KEY: x\nNULL: null\nARRAY: []\nNESTED: {}",
      "yaml",
      "env"
    )
    expect(result.state).toBe("error")
    expect(result.diagnostics.map((item) => item.code)).toEqual([
      "invalidKey",
      "invalidValue",
      "invalidValue",
      "invalidValue",
    ])
    expect(
      convert('{"INFINITE":1e999}', "json", "env").diagnostics[0]?.code
    ).toBe("invalidValue")
    expect(convert("# no mapping", "yaml", "env").diagnostics[0]?.code).toBe(
      "syntax"
    )
  })

  test.each([
    ["json", '{"A":"1","A":"2"}', 1],
    ["json", '{"A":"1","\\u0041":"2"}', 1],
    ["yaml", "A: one\nA: two", 2],
    ["yaml", "A: [", 1],
    ["json", '{"A":1,}', undefined],
    ["json", "{'A':1}", undefined],
    ["json", "// comment\n{}", undefined],
    ["json", "{", undefined],
  ] as [Format, string, number | undefined][])(
    "rejects invalid or duplicate %s keys",
    (format, input, line) => {
      const result = convert(input, format, "env")
      expect(result.state).toBe("error")
      expect(result.output).toBe("")
      expect(result.diagnostics).toEqual([
        {
          code: "syntax",
          severity: "error",
          format: format.toUpperCase(),
          line,
        },
      ])
    }
  )

  test("serializes difficult values without changing their contents", () => {
    const values = {
      EMPTY: "",
      SIMPLE: "a=b",
      HASH: "a#b",
      SPACE: " a ",
      SINGLE: "it's #fine",
      BACKTICK: "both'\" #yes",
      SLASH: "a space\\",
      LITERAL: "literal\\n",
      MIXED: "all'\"`",
      SMART: "“value”",
      CR: "a\rb",
      NEWLINE: "a\nb",
      TWO: "'\\n #hash",
    }
    const env = convert(JSON.stringify(values), "json", "env")
    expect(env.state).toBe("converted")
    expect(convert(env.output, "env", "json").values).toEqual(values)
    expect(convert(env.output, "env", "json").diagnostics).toEqual([])
  })

  test("reports values that cannot be represented in the supported dotenv syntax", () => {
    for (const value of [
      "all'\"` #hash",
      "'\"\r",
      "'\"\\n #hash`",
      "'\"`\nmultiline",
    ]) {
      const result = convert(JSON.stringify({ KEY: value }), "json", "env")
      expect(result).toMatchObject({
        state: "error",
        output: "",
        diagnostics: [
          { code: "unrepresentable", severity: "error", key: "KEY" },
        ],
      })
    }
  })

  test("keeps special object keys as data through every format", () => {
    const env = "__proto__=safe\nconstructor=also_safe\ntoString=value"
    const json = convert(env, "env", "json").output
    expect(JSON.parse(json)).toEqual(
      JSON.parse(
        '{"__proto__":"safe","constructor":"also_safe","toString":"value"}'
      )
    )
    const yaml = convert(json, "json", "yaml").output
    expect(convert(yaml, "yaml", "env").output).toBe(env)
  })

  test("formats localized diagnostic placeholders without touching unknown tokens", () => {
    expect(interpolate("{key}, {line}, {missing}", { key: "A", line: 3 })).toBe(
      "A, 3, {missing}"
    )
  })
})
