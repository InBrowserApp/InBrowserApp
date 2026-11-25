// @vitest-environment node
import { readFile } from "node:fs/promises"
import { expect, test } from "vitest"
import { readVectorDrawing } from "./reader"
import { exportSvg } from "./vector"

const bracket = new URL("./bracket.dxf", import.meta.url)

async function sample(transform = (text: string) => text) {
  return new File([transform(await readFile(bracket, "utf8"))], "bracket.dxf")
}

test("writes selected DXF model-space layers as paths at declared physical scale", async () => {
  const drawing = await readVectorDrawing(await sample())
  expect(drawing.millimetersPerUnit).toBe(1)
  const result = exportSvg(drawing, new Set(["Profile", "Drill holes"]))!
  expect(result.width).toBeCloseTo(138)
  expect(result.height).toBeCloseTo(82)
  const text = await result.svg.text()
  expect(text).toContain('width="144.9mm"')
  expect(text).toContain('<g data-layer="Profile">')
  expect(text).toContain('<g data-layer="Drill holes">')
  expect(text).not.toContain('<g data-layer="Centerlines">')
  expect(text).toContain("<path")
  expect(
    drawing.layers
      .find((layer) => layer.name === "Drill holes")
      ?.content.match(/L/g)?.length
  ).toBeGreaterThan(100)
  expect(exportSvg(drawing, new Set())).toBeUndefined()
})

test("scales inches in the SVG viewport while retaining drawing-space coordinates", async () => {
  const drawing = await readVectorDrawing(
    await sample((text) => text.replace("$INSUNITS\n70\n4", "$INSUNITS\n70\n1"))
  )
  const result = exportSvg(drawing, new Set(["Profile"]))!
  expect(result.width).toBeCloseTo(138 * 25.4)
  expect(result.height).toBeCloseTo(82 * 25.4)
  const svg = await result.svg.text()
  expect(svg).toContain('viewBox="-3.45 -85.45 144.9 88.9"')
  const width = Number(svg.match(/width="([\d.]+)mm"/)?.[1])
  expect(width / 144.9).toBeCloseTo(25.4)
})

test("keeps unitless drawing coordinates and the initial visibility of an off layer", async () => {
  const drawing = await readVectorDrawing(
    await sample((text) =>
      text
        .replace("$INSUNITS\n70\n4", "$INSUNITS\n70\n0")
        .replace("Drill holes\n70\n0\n62\n5", "Drill holes\n70\n0\n62\n-5")
    )
  )
  expect(drawing.millimetersPerUnit).toBeUndefined()
  expect(
    drawing.layers.find((layer) => layer.name === "Drill holes")?.visible
  ).toBe(false)
  const result = exportSvg(drawing, new Set(["Profile"]))!
  expect(await result.svg.text()).toContain('width="144.9"')
})

test("escapes a layer name in generated SVG", async () => {
  const result = exportSvg(
    {
      layers: [
        {
          name: 'Contour & "<details>"',
          label: 'Contour & "<details>"',
          color: "#000000",
          visible: true,
          bounds: { x1: 0, x2: 10, y1: 1, y2: 9 },
          content: '<path d="M0 -1L10 -9"/>',
        },
      ],
    },
    new Set(['Contour & "<details>"'])
  )
  expect(await result?.svg.text()).toContain(
    'data-layer="Contour &amp; &quot;&lt;details&gt;&quot;"'
  )
})

test("uses the placement layer for instanced blocks", async () => {
  const layers = [
    ["Definition", 1],
    ["Visible", 2],
    ["Hidden", -3],
  ].flatMap(([name, color]) => [
    0,
    "LAYER",
    2,
    name,
    70,
    0,
    62,
    color,
    6,
    "CONTINUOUS",
  ])
  const inserts = [0, 10, 20, 30].flatMap((x) => [
    0,
    "INSERT",
    2,
    "Hole",
    8,
    x === 0 ? "Visible" : "Hidden",
    10,
    x,
    20,
    0,
    30,
    0,
  ])
  const dxf = [
    0,
    "SECTION",
    2,
    "TABLES",
    0,
    "TABLE",
    2,
    "LAYER",
    70,
    3,
    ...layers,
    0,
    "ENDTAB",
    0,
    "ENDSEC",
    0,
    "SECTION",
    2,
    "BLOCKS",
    0,
    "BLOCK",
    2,
    "Hole",
    8,
    "Definition",
    70,
    0,
    10,
    0,
    20,
    0,
    30,
    0,
    0,
    "CIRCLE",
    8,
    "Definition",
    10,
    0,
    20,
    0,
    30,
    0,
    40,
    2,
    0,
    "ENDBLK",
    0,
    "ENDSEC",
    0,
    "SECTION",
    2,
    "ENTITIES",
    ...inserts,
    0,
    "ENDSEC",
    0,
    "EOF",
  ].join("\n")
  const drawing = await readVectorDrawing(new File([dxf], "instanced.dxf"))
  expect(drawing.layers.map((layer) => layer.name).sort()).toEqual([
    "Hidden",
    "Visible",
  ])
  expect(drawing.layers.find((layer) => layer.name === "Hidden")?.visible).toBe(
    false
  )
  const result = exportSvg(drawing, new Set(["Visible"]))!
  expect(result.width).toBeCloseTo(4)
  expect(await result.svg.text()).not.toContain('data-layer="Hidden"')
})
