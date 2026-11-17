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
