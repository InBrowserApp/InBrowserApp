// @vitest-environment node
import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { unzipSync, zipSync, strFromU8, strToU8 } from "fflate"
import * as CFB from "cfb"
import { binaryResources } from "./binary"
import { xmlResources } from "./xml"
const fixture = (ext: string) =>
  readFileSync(new URL(`../fixtures/river-survey.${ext}`, import.meta.url))

test.each(["hwp", "hwpx"])(
  "checks owned bilingual %s content and embedded PNG",
  (ext) => {
    const resources = (ext === "hwp" ? binaryResources : xmlResources)(
      fixture(ext)
    )
    expect(resources).toHaveLength(1)
    expect(resources[0]!.mime).toBe("image/png")
    expect(Array.from(resources[0]!.bytes.subarray(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ])
  }
)
test("rejects missing embedded HWPX images before rendering can omit them", () => {
  const files = unzipSync(fixture("hwpx"))
  delete files["BinData/image1.png"]
  expect(() => xmlResources(zipSync(files))).toThrow("unsupported")
})
test("rejects missing embedded HWP images before rendering can omit them", () => {
  const files = CFB.read(fixture("hwp"), { type: "buffer" })
  CFB.utils.cfb_del(files, "/BinData/BIN0001.png")
  CFB.utils.cfb_gc(files)
  expect(() => binaryResources(CFB.write(files, { type: "buffer" }))).toThrow(
    "invalid"
  )
})
test("rejects an undeclared image reference", () => {
  const files = unzipSync(fixture("hwpx"))
  files["Contents/section0.xml"] = strToU8(
    strFromU8(files["Contents/section0.xml"]!).replace(
      'binaryItemIDRef="image1"',
      'binaryItemIDRef="missing"'
    )
  )
  expect(() => xmlResources(zipSync(files))).toThrow("unsupported")
})
