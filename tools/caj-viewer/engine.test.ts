// @vitest-environment node
import { readFile } from "node:fs/promises"
import { inflateSync } from "node:zlib"
import { beforeAll, expect, test } from "vitest"
import { convert, loadModule } from "caj2pdf-rust/node"

let wasm: WebAssembly.Module
beforeAll(async () => {
  wasm = await loadModule(
    new URL("./vendor/caj2pdf_wasm.wasm", import.meta.url)
  )
})

async function convertFixture(name: string, edit?: (input: Buffer) => void) {
  const input = await readFile(new URL(`./fixtures/${name}`, import.meta.url))
  edit?.(input)
  const chunks: Uint8Array[] = []
  const report = await convert(
    wasm,
    new Blob([input]),
    {
      async writeChunk(bytes) {
        chunks.push(bytes.slice())
        return bytes.length
      },
      async flush() {},
    },
    { allowDamaged: false, includeBookmarks: true }
  )
  return { report, output: Buffer.concat(chunks) }
}

test("places original JPEG rows at the top without reflecting their rectangle", async () => {
  const { report, output } = await convertFixture("asymmetric-jpeg.nh")
  expect(report.pagesConverted).toBe(1)
  expect(report.omittedPages).toEqual([])
  const content = output.toString("latin1")
  const placement = content.match(/([\d.e+\- ]+) cm\n\/Im0 Do/)
  expect(placement).not.toBeNull()
  const [width, skewX, skewY, height, left, bottom] = placement![1]!
    .trim()
    .split(/\s+/)
    .map(Number)
  expect(width).toBeCloseTo(7.763849575)
  expect(height).toBeCloseTo(width!)
  expect([skewX, skewY, left, bottom]).toEqual([0, 0, 0, 0])
  // Losslessly retain the original red/green top and blue/yellow bottom JPEG.
  const source = await readFile(
    new URL("./fixtures/asymmetric-jpeg.nh", import.meta.url)
  )
  expect(output.includes(source.subarray(0x19c))).toBe(true)
})

test("keeps an offset JPEG inside its declared source rectangle", async () => {
  const { output } = await convertFixture("asymmetric-jpeg.nh", (input) => {
    input.writeUInt16LE(200, 0xa8)
    input.writeUInt16LE(180, 0xaa)
    input.writeUInt16LE(20, 0x174)
    input.writeUInt16LE(30, 0x176)
    input.writeUInt16LE(40, 0x17a)
  })
  const placement = output
    .toString("latin1")
    .match(/([\d.e+\- ]+) cm\n\/Im0 Do/)
  expect(placement).not.toBeNull()
  const actual = placement![1]!.trim().split(/\s+/).map(Number)
  const expected = [7.763849575, 0, 0, 3.881924788, 1.940962394, 10.67529317]
  expected.forEach((value, index) => expect(actual[index]).toBeCloseTo(value))
})

test("preserves asymmetric decoded scan rows and their original placement", async () => {
  const { output } = await convertFixture("image-pages.nh")
  const content = output.toString("latin1")
  const images = [
    ...content.matchAll(
      /\/Subtype \/Image[\s\S]*?stream\n([\s\S]*?)\nendstream/g
    ),
  ]
  expect(images).toHaveLength(2)
  expect([...inflateSync(Buffer.from(images[0]![1]!, "latin1"))]).toEqual([
    0xa0, 0x40,
  ])
  expect([...inflateSync(Buffer.from(images[1]![1]!, "latin1"))]).toEqual([
    0xc0, 0x20,
  ])
  expect(content).toContain(
    "7.7638495754144765 0 0 3.8819247877072383 0 15.527699150828955 cm"
  )
})

test("keeps decoded bilevel image placement and CAJ/KDH conversion working", async () => {
  for (const [file, pages] of [
    ["image-pages.nh", 1],
    ["image-c8.caj", 1],
    ["field-notes.caj", 3],
    ["field-notes.kdh", 3],
  ] as const) {
    const { report, output } = await convertFixture(file)
    expect(report.pagesConverted).toBe(pages)
    expect(report.omittedPages).toEqual([])
    expect(output.subarray(0, 5).toString()).toBe("%PDF-")
  }
})
