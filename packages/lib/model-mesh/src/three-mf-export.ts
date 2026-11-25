import { strToU8, zipSync } from "fflate"
import {
  modelNamespace,
  modelRelationship,
  relationshipNamespace,
  rootRelationships,
} from "./three-mf-package"
import type { BufferAttribute, InterleavedBufferAttribute } from "three"
import type { ThreeMfUnit } from "./three-mf-package"

export function export3mf(
  positions: BufferAttribute | InterleavedBufferAttribute,
  unit: ThreeMfUnit,
  objectType: "model" | "surface"
) {
  const vertexIndices = new Map<string, number>()
  const vertices: string[] = []
  const triangles = []
  for (let i = 0; i < positions.count; i += 3) {
    const face: number[] = []
    for (let vertex = i; vertex < i + 3; vertex++) {
      const point = `<vertex x="${positions.getX(vertex)}" y="${positions.getY(vertex)}" z="${positions.getZ(vertex)}"/>`
      let index = vertexIndices.get(point)
      // Each triangle needs three distinct indices even at coincident coordinates.
      if (index === undefined || face.includes(index)) {
        const next = vertices.length
        if (index === undefined) vertexIndices.set(point, next)
        vertices.push(point)
        index = next
      }
      face.push(index)
    }
    triangles.push(
      `<triangle v1="${face[0]}" v2="${face[1]}" v3="${face[2]}"/>`
    )
  }
  const modelPath = "3D/3dmodel.model"
  const zipped = zipSync({
    "[Content_Types].xml": strToU8(
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>`
    ),
    [rootRelationships]: strToU8(
      `<Relationships xmlns="${relationshipNamespace}"><Relationship Target="/${modelPath}" Id="model" Type="${modelRelationship}"/></Relationships>`
    ),
    [modelPath]: strToU8(
      `<model unit="${unit}" xml:lang="en" xmlns="${modelNamespace}"><resources><object id="1" type="${objectType}"><mesh><vertices>${vertices.join("")}</vertices><triangles>${triangles.join("")}</triangles></mesh></object></resources><build><item objectid="1"/></build></model>`
    ),
  })
  return new Blob([zipped.slice().buffer], { type: "model/3mf" })
}
