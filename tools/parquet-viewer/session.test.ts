import { Blob as NodeBlob } from "node:buffer"
import { readFile } from "node:fs/promises"
import { describe, expect, test, vi } from "vitest"
import { Session } from "./session"

async function fixture(name: string) {
  return new NodeBlob([
    await readFile(`tools/parquet-viewer/fixtures/${name}.parquet`),
  ]) as unknown as Blob
}

describe("real Parquet decoding", () => {
  test("preserves special field names and distinguishes literal dots from nesting", async () => {
    const session = await Session.open(await fixture("field-names"))
    const rows = await session.page(0, 3)
    expect(Object.hasOwn(rows[0]!, "__proto__")).toBe(true)
    expect(rows[0]!["__proto__"]).toBe("preserved")
    expect(rows[0]!["a.b"]).toBe("10")
    expect(rows[0]!.a).toEqual({ b: 40 })
    expect(rows[0]!.outer).toEqual(
      JSON.parse('{"a.b":1,"a":{"b":2},"__proto__":"nested"}')
    )
    expect(rows[0]!.items).toEqual(JSON.parse('[{"__proto__":"inside-list"}]'))
    const output = await session.export(0, 3, "json", vi.fn())
    expect(JSON.parse(await output.blob.text())).toEqual(rows)
    const csv = await session.export(0, 1, "csv", vi.fn())
    expect(await csv.blob.text()).toContain("preserved,10")
  })
  test("keeps Map entries with timestamp, binary, struct and special string keys", async () => {
    const session = await Session.open(await fixture("maps"))
    const rows = await session.page(0, 3)
    expect(rows[0]).toEqual({
      text_map: [
        ["__proto__", "1"],
        ["normal", "2"],
      ],
      time_map: [
        ["2026-01-01T00:00:00.001Z", 1],
        ["2026-01-01T00:00:00.002Z", null],
      ],
      binary_map: [
        ["0x00ff", "first"],
        ["0x01", "second"],
      ],
      nested_maps: [
        [
          ["2026-01-01T00:00:00.001Z", 1],
          ["2026-01-01T00:00:00.002Z", null],
        ],
        [],
        null,
      ],
      struct_map: [
        [{ tag: "x", count: 1 }, "one"],
        [{ tag: "y", count: 2 }, "two"],
      ],
    })
    expect(rows[1]).toEqual({
      text_map: [],
      time_map: [],
      binary_map: [],
      nested_maps: null,
      struct_map: [],
    })
    expect(rows[2]).toEqual({
      text_map: null,
      time_map: null,
      binary_map: null,
      nested_maps: [],
      struct_map: null,
    })
    const output = await session.export(0, 3, "json", vi.fn())
    expect(JSON.parse(await output.blob.text())).toEqual(rows)
    const csv = await session.export(0, 1, "csv", vi.fn())
    expect(await csv.blob.text()).toContain("2026-01-01T00:00:00.001Z")
    expect(await csv.blob.text()).toContain("2026-01-01T00:00:00.002Z")
  })
  test.each(["duplicate-names", "nested-duplicate-names"])(
    "refuses lossy decoding of %s while retaining schema",
    async (name) => {
      const session = await Session.open(await fixture(name))
      expect(session.info.fields).toHaveLength(
        name === "duplicate-names" ? 2 : 3
      )
      await expect(session.page(0, 1)).rejects.toThrow(
        "Duplicate Parquet field names"
      )
      await expect(session.export(0, 1, "json", vi.fn())).rejects.toThrow(
        "Duplicate Parquet field names"
      )
    }
  )
  test("opens metadata and reads a range across row groups with nested values", async () => {
    const session = await Session.open(await fixture("sample"))
    expect(session.info).toMatchObject({
      rows: 125,
      groups: 3,
      codecs: ["SNAPPY"],
      columns: ["id", "name", "active", "score", "tags", "profile"],
    })
    expect(
      session.info.fields.find((field) => field.name === "city")
    ).toMatchObject({
      depth: 1,
      physical: "BYTE_ARRAY",
      logical: "STRING",
      repetition: "OPTIONAL",
    })
    expect(
      session.info.fields.find((field) => field.name === "profile")
    ).toMatchObject({ physical: "" })
    const rows = await session.page(48, 52)
    expect(rows).toHaveLength(4)
    expect(rows[0]).toMatchObject({
      id: "9007199254741041",
      name: "陈小明",
      tags: ["analytics"],
      profile: { city: "Tokyo", visits: 7 },
    })
    expect(rows[2]?.name).toBe("Alice")
    expect(await session.page(0, 0)).toEqual([])
  })
  test.each(["snappy", "gzip", "brotli", "zstd", "lz4", "none"])(
    "decodes %s with binary, dates, decimals and signed 64-bit integers",
    async (codec) => {
      const session = await Session.open(await fixture(codec))
      const rows = await session.page(0, 3)
      expect(rows[0]).toMatchObject({
        text: 'a,"quoted"\nline',
        big: "9007199254740993",
        binary: "0x00ff",
        at: "2026-01-01T00:00:00.000Z",
        amount: 123.45,
      })
      expect(rows[1]).toMatchObject({
        text: "",
        big: "-9223372036854775808",
        binary: "0x",
        at: null,
        amount: null,
      })
      expect(rows[2]?.amount).toBe(-0.01)
    }
  )
  test("exports the selected range and full file, with progress and correct CSV escaping", async () => {
    const session = await Session.open(await fixture("gzip"))
    const progress = vi.fn()
    const output = await session.export(1, 3, "json", progress)
    expect(output.rows).toBe(2)
    const rows = JSON.parse(await output.blob.text())
    expect(rows).toHaveLength(2)
    expect(rows[0].big).toBe("-9223372036854775808")
    expect(progress).toHaveBeenCalledWith(2)
    const csv = await session.export(0, 3, "csv", progress)
    expect(await csv.blob.text()).toContain(
      'text,big,binary,at,amount\r\n"a,""quoted""\nline",9007199254740993,0x00ff'
    )
  })
  test("joins batches without dropping or duplicating rows", async () => {
    const session = await Session.open(await fixture("batches"))
    for (const format of ["json", "csv"] as const) {
      const progress = vi.fn()
      const output = await session.export(0, 2105, format, progress)
      expect(progress.mock.calls).toEqual([[1000], [2000], [2105]])
      const text = await output.blob.text()
      if (format === "json") expect(JSON.parse(text)).toHaveLength(2105)
      else expect(text.split("\r\n")).toHaveLength(2106)
    }
  })
  test("empty files still expose schema and export valid headers or empty JSON", async () => {
    const session = await Session.open(await fixture("empty"))
    expect(session.info.rows).toBe(0)
    expect(session.info.columns).toContain("id")
    expect(
      JSON.parse(
        await (await session.export(0, 0, "json", vi.fn())).blob.text()
      )
    ).toEqual([])
    expect(await (await session.export(0, 0, "csv", vi.fn())).blob.text()).toBe(
      "id,name,active,score,tags,profile\r\n"
    )
  })
  test("invalid files fail without pretending they are an empty table", async () => {
    await expect(
      Session.open(new NodeBlob(["invalid"]) as unknown as Blob)
    ).rejects.toThrow(/parquet|file|metadata/i)
  })
})
