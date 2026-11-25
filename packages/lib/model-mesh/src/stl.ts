import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
} from "three"
import { STLLoader } from "three/addons/loaders/STLLoader.js"

export function parseStl(data: ArrayBuffer) {
  const geometry = new STLLoader().parse(data)
  return new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: geometry.hasAttribute("color") ? 0xffffff : 0x659ce8,
      vertexColors: geometry.hasAttribute("color"),
      side: DoubleSide,
      roughness: 0.75,
    })
  )
}

export function isBinaryStl(data: ArrayBuffer) {
  if (data.byteLength >= 84) {
    const faces = new DataView(data).getUint32(80, true)
    if (84 + faces * 50 === data.byteLength) return true
  }
  const prefix = new TextDecoder().decode(data.slice(0, 32))
  return !prefix.trimStart().toLowerCase().startsWith("solid")
}

export function parseStlForProcessing(data: ArrayBuffer) {
  if (isBinaryStl(data)) return parseStl(data)

  const text = new TextDecoder().decode(data)
  // Solid names can contain facet keywords. Also accept single-line STL.
  const body = text.replace(/^[\t ]*(?:end)?solid\b[^\r\n]*$/gim, "").trim()
  const coordinates: number[] = []
  for (const [, facet] of (body || text).matchAll(
    /\bfacet\b([\s\S]*?)\bendfacet\b/gi
  )) {
    const vertices = [...facet!.matchAll(/\bvertex\s+(\S+)\s+(\S+)\s+(\S+)/gi)]
    if (vertices.length !== 3) throw new Error("Incomplete mesh triangle")
    for (const vertex of vertices)
      coordinates.push(...vertex.slice(1).map(Number))
  }
  const geometry = new BufferGeometry()
  // ASCII STL can represent distinct coordinates that collapse at Float32 precision.
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float64Array(coordinates), 3)
  )
  return new Mesh(geometry)
}
