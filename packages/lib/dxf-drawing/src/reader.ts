import { DxfWorker } from "dxf-viewer/src/DxfWorker.js"
import { SceneReader } from "dxf-viewer/src/SceneReader.js"
import { dxfEncoding } from "./encoding"

import { emptyBounds, include } from "./vector"
import type { Primitive } from "dxf-viewer/src/SceneReader.js"
import type { VectorDrawing } from "./vector"

type ShapeGroup = { type: Primitive["type"]; color: string; paths: string[] }

const surveyFoot = 1_200_000 / 3937
const units = [
  undefined,
  25.4,
  304.8,
  1_609_344,
  1,
  10,
  1000,
  1e6,
  0.0000254,
  0.0254,
  914.4,
  1e-7,
  1e-6,
  0.001,
  100,
  1e4,
  1e5,
  1e12,
  149_597_870_700_000,
  9.4607304725808e18,
  3.085677581491367e19,
  surveyFoot,
  surveyFoot / 12,
  surveyFoot * 3,
  surveyFoot * 5280,
]

function lineColor(color: number) {
  // AutoCAD's adaptive white is black on a light page.
  const rgb = color === 0xffffff ? 0 : color & 0xffffff
  return `#${rgb.toString(16).padStart(6, "0")}`
}

function primitivePath({ type, vertices }: Primitive) {
  if (type === "TRIANGLE") {
    const [a, b, c] = vertices as [
      [number, number],
      [number, number],
      [number, number],
    ]
    const winding =
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (winding < 0) vertices = [a, c, b]
  }
  const path = vertices
    .map(([x, y], i) => `${i ? "L" : "M"}${x} ${-y}`)
    .join("")
  return path + (type === "TRIANGLE" ? "Z" : type === "POINT" ? "h0" : "")
}

function shape({ type, paths, color }: ShapeGroup) {
  const d = paths.join("")
  if (type === "TRIANGLE") return `<path d="${d}" fill="${color}"/>`
  const style =
    type === "POINT" ? ' stroke-linecap="round" stroke-width="2"' : ""
  return `<path d="${d}" fill="none" stroke="${color}"${style} vector-effect="non-scaling-stroke"/>`
}

export async function readVectorDrawing(
  file: File,
  fonts: string[] = []
): Promise<VectorDrawing> {
  const encoding = dxfEncoding(await file.slice(0, 65536).text())
  const url = URL.createObjectURL(file)
  try {
    const { scene, dxf } = await new DxfWorker(null).Load(url, fonts, {
      fileEncoding: encoding,
      retainParsedDxf: true,
      sceneOptions: {
        suppressPaperSpace: true,
        arcTessellationAngle: Math.PI / 180,
      },
    })
    const reader = new SceneReader(scene)
    const layers = new Map(
      [...reader.GetLayers()].map((layer) => [
        layer.name,
        {
          bounds: emptyBounds(),
          groups: new Map<string, ShapeGroup>(),
          visible: layer.visible ?? true,
          label: layer.displayName,
          color: lineColor(layer.color),
        },
      ])
    )
    for (const primitive of reader.ReadPrimitives()) {
      if (
        !primitive.vertices.length ||
        !primitive.vertices.every(
          ([x, y]) => Number.isFinite(x) && Number.isFinite(y)
        )
      )
        continue
      const name = primitive.layer ?? "0"
      const color = lineColor(primitive.color)
      let layer = layers.get(name)
      if (!layer) {
        layer = {
          bounds: emptyBounds(),
          groups: new Map(),
          visible: true,
          label: name,
          color,
        }
        layers.set(name, layer)
      }
      for (const [x, y] of primitive.vertices) include(layer.bounds, x, y)
      const key = `${primitive.type}:${color}`
      let group = layer.groups.get(key)
      if (!group) {
        group = { type: primitive.type, color, paths: [] }
        layer.groups.set(key, group)
      }
      group.paths.push(primitivePath(primitive))
    }
    return {
      layers: [...layers].flatMap(([name, { groups, ...layer }]) =>
        groups.size
          ? [
              {
                ...layer,
                name,
                content: [...groups.values()].map(shape).join("\n"),
              },
            ]
          : []
      ),
      millimetersPerUnit: units[Number(dxf.header?.$INSUNITS)],
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}
