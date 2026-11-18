import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"
import { z, type ZodType } from "zod"

import { generateCode } from "./generate-code"

function generate(input: string) {
  const result = generateCode(input)
  if (result.status !== "ok") throw new Error("Expected generated code")
  return result
}

function schema(source: string): ZodType {
  const expression = source
    .split("export const apiResponseSchema = ")[1]!
    .split("\n\nexport type ApiResponse")[0]!
  return runInNewContext(expression, { z }) as ZodType
}

describe("generateCode", () => {
  it("distinguishes blank input from an invalid sample", () => {
    expect(generateCode(" \n ")).toEqual({ status: "empty" })
    expect(generateCode('{"id":')).toEqual({ status: "invalid" })
  })

  it("merges nested records and keeps absent fields distinct from null", () => {
    const input = {
      users: [
        {
          id: 1,
          profile: { name: "Ava", email: "ava@example.com" },
          roles: [],
        },
        { id: 2, profile: { name: null }, roles: ["admin"], enabled: false },
      ],
    }
    const result = generate(JSON.stringify(input))

    expect(result.typescript).toBe(`export type ApiResponse = {
  users: Array<{
    id: number
    profile: {
      name: string | null
      email?: string
    }
    roles: Array<string>
    enabled?: boolean
  }>
}
`)
    const validator = schema(result.zod)
    expect(validator.parse(input)).toEqual(input)
    expect(validator.parse({ ...input, extra: true })).toEqual(input)
    expect(validator.safeParse({ users: [{ id: 1, roles: [] }] }).success).toBe(
      false
    )
    expect(
      validator.safeParse({
        users: [{ ...input.users[0], profile: { name: 5 } }],
      }).success
    ).toBe(false)
  })

  it("uses a union for mixed arrays and combines arrays of arrays", () => {
    const result = generate('[5,"five",null,false,[],[1],{"name":"five"}]')
    expect(result.typescript).toBe(
      "export type ApiResponse = Array<number | string | null | boolean | Array<number> | {\n  name: string\n}>\n"
    )
    const validator = schema(result.zod)
    expect(
      validator.safeParse([0, "six", null, true, [3], { name: "six" }]).success
    ).toBe(true)
    expect(validator.safeParse([[true]]).success).toBe(false)
  })

  it.each([
    ["null", "null", "z.null()"],
    ["false", "boolean", "z.boolean()"],
    ["42", "number", "z.number()"],
    ['"x"', "string", "z.string()"],
    ["[]", "Array<unknown>", "z.array(z.unknown())"],
    ["{}", "Record<string, unknown>", "z.object({})"],
  ])("handles %s as a root value", (input, type, validator) => {
    const result = generate(input)
    expect(result.typescript).toBe(`export type ApiResponse = ${type}\n`)
    expect(result.zod).toContain(
      `export const apiResponseSchema = ${validator}\n`
    )
    expect(schema(result.zod).safeParse(JSON.parse(input)).success).toBe(true)
  })

  it("quotes unusual field names and emits __proto__ as an own property", () => {
    const input =
      '{"__proto__":"value","user-id":1,"a\\"b":true,"":null,"名":"Ava"}'
    const result = generate(input)
    expect(result.typescript).toContain('"user-id": number')
    expect(result.typescript).toContain('"a\\"b": boolean')
    expect(result.typescript).toContain('"": null')
    expect(result.typescript).toContain('"名": string')
    expect(result.zod).toContain('["__proto__"]: z.string()')
    expect(schema(result.zod).safeParse(JSON.parse(input)).success).toBe(true)
  })
})
