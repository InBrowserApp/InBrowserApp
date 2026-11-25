import { unzipSync } from "fflate"
import { SaxesParser } from "saxes"
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
} from "three"
import {
  modelNamespace,
  modelRelationship,
  production,
  rootRelationships,
  unitScale,
} from "./three-mf-package"
import type { SaxesTagNS } from "saxes"
import type { Object3D } from "three"

type Placement = { objectId: number; path?: string; matrix?: Matrix4 }
type Shape = { positions: number[]; indices: number[]; components: Placement[] }

function attributes(tag: SaxesTagNS) {
  return (name: string) => tag.attributes[name]?.value
}

function numeric(value?: string) {
  const number = value?.trim() ? Number(value) : NaN
  if (!Number.isFinite(number)) throw new Error("Invalid 3MF coordinate")
  return number
}

function resourceId(value?: string) {
  const id = numeric(value)
  if (!Number.isInteger(id) || id < 1 || id >= 2 ** 31)
    throw new Error("Invalid 3MF object ID")
  return id
}

function placement(tag: SaxesTagNS, scale: number): Placement {
  const get = attributes(tag)
  const objectId = resourceId(get("objectid"))
  const path = Object.values(tag.attributes)
    .find(({ uri, local }) => uri === production && local === "path")
    ?.value.replace(/^\//, "")
  const transform = get("transform")
  if (!transform) return { objectId, path }
  const values = transform.trim().split(/\s+/).map(numeric)
  if (values.length !== 12) throw new Error("Invalid 3MF transform")
  const [a, b, c, d, e, f, g, h, i, x, y, z] = values as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  return {
    objectId,
    path,
    matrix: new Matrix4().set(
      a,
      d,
      g,
      x * scale,
      b,
      e,
      h,
      y * scale,
      c,
      f,
      i,
      z * scale,
      0,
      0,
      0,
      1
    ),
  }
}

function parseModel(xml: string) {
  const shapes = new Map<number, Shape>()
  const build: Placement[] = []
  const parents: string[] = []
  let scale = 1
  let shape: Shape | undefined
  const parser = new SaxesParser({ xmlns: true })
  parser.on("opentag", (tag) => {
    const get = attributes(tag)
    const parent = parents.at(-1)
    const core = !tag.uri || tag.uri === modelNamespace
    parents.push(core ? tag.local : "")
    if (!core) return
    if (tag.local === "model" && parents.length === 1) {
      scale = unitScale(get("unit"))
      const materials =
        "http://schemas.microsoft.com/3dmanufacturing/material/2015/02"
      const required =
        get("requiredextensions")?.trim().split(/\s+/).filter(Boolean) ?? []
      if (
        required.some(
          (prefix) =>
            tag.ns[prefix] !== production && tag.ns[prefix] !== materials
        )
      ) {
        throw new Error("Unsupported required 3MF extension")
      }
    }
    if (tag.local === "object" && parent === "resources") {
      const id = resourceId(get("id"))
      if (shapes.has(id)) throw new Error("Duplicate 3MF object ID")
      shape = { positions: [], indices: [], components: [] }
      shapes.set(id, shape)
    }
    if (shape && tag.local === "vertex" && parent === "vertices") {
      shape.positions.push(
        ...["x", "y", "z"].map((axis) => numeric(get(axis)) * scale)
      )
    }
    if (shape && tag.local === "triangle" && parent === "triangles") {
      shape.indices.push(
        ...["v1", "v2", "v3"].map((vertex) => numeric(get(vertex)))
      )
    }
    if (shape && tag.local === "component" && parent === "components")
      shape.components.push(placement(tag, scale))
    if (tag.local === "item" && parent === "build")
      build.push(placement(tag, scale))
  })
  parser.on("closetag", () => {
    if (parents.pop() === "object") shape = undefined
  })
  parser.write(xml).close()
  return { shapes, build }
}

export function read3mfGeometry(data: ArrayBuffer) {
  const parts = unzipSync(new Uint8Array(data), {
    filter: ({ name }) =>
      name === rootRelationships || name.toLowerCase().endsWith(".model"),
  })
  const decoder = new TextDecoder()
  function part(path: string) {
    const bytes = parts[path]
    if (!bytes) throw new Error("Missing 3MF package part")
    return decoder.decode(bytes)
  }
  let rootPath: string | undefined
  const relationships = new SaxesParser({ xmlns: true })
  relationships.on("opentag", (tag) => {
    const get = attributes(tag)
    if (tag.local === "Relationship" && get("Type") === modelRelationship)
      rootPath = get("Target")?.replace(/^\//, "")
  })
  relationships.write(part(rootRelationships)).close()
  if (!rootPath) throw new Error("Missing 3MF model relationship")

  const models = new Map<string, ReturnType<typeof parseModel>>()
  function model(path: string) {
    let current = models.get(path)
    if (!current) {
      current = parseModel(part(path))
      models.set(path, current)
    }
    return current
  }
  const built = new Map<string, Object3D>()
  const active = new Set<string>()
  const material = new MeshBasicMaterial()
  let meshCount = 0
  function instantiate(parentPath: string, item: Placement): Object3D {
    const path = item.path ?? parentPath
    const key = `${path}\0${item.objectId}`
    let object = built.get(key)
    if (!object) {
      if (active.has(key)) throw new Error("Circular 3MF component")
      active.add(key)
      const shape = model(path).shapes.get(item.objectId)
      if (!shape) throw new Error("Missing 3MF object")
      const { positions, indices, components } = shape
      if (indices.length) {
        if (
          indices.some(
            (index) =>
              !Number.isInteger(index) ||
              index < 0 ||
              index >= positions.length / 3
          )
        )
          throw new Error("Invalid 3MF triangle index")
        const geometry = new BufferGeometry()
        geometry.setAttribute(
          "position",
          new BufferAttribute(new Float64Array(positions), 3)
        )
        geometry.setIndex(indices)
        object = new Mesh(geometry, material)
        meshCount++
      } else {
        object = group(path, components)
      }
      active.delete(key)
      built.set(key, object)
    }
    const placed = object.clone()
    if (item.matrix) {
      placed.matrix.copy(item.matrix)
      placed.matrixAutoUpdate = false
    }
    return placed
  }
  function group(path: string, items: Placement[]) {
    const result = new Group()
    for (const item of items) result.add(instantiate(path, item))
    return result
  }
  const build = group(rootPath, model(rootPath).build)
  if (!meshCount) throw new Error("No 3MF mesh geometry")
  build.updateMatrixWorld(true)
  const mirrored = new Map<BufferGeometry, BufferGeometry>()
  build.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh || mesh.matrixWorld.determinant() >= 0) return
    let geometry = mirrored.get(mesh.geometry)
    if (!geometry) {
      geometry = mesh.geometry.clone()
      const index = geometry.index!
      // A mirrored placement retains the original solid's volume sign.
      for (let i = 0; i < index.count; i += 3) {
        const second = index.getX(i + 1)
        index.setX(i + 1, index.getX(i + 2))
        index.setX(i + 2, second)
      }
      mirrored.set(mesh.geometry, geometry)
    }
    mesh.geometry = geometry
  })
  return build
}
