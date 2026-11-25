import { strToU8, unzipSync, zipSync } from "fflate"
import { LoadingManager } from "three"
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js"

const rootRelationships = "_rels/.rels"
const modelRelationship =
  "http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"
const production =
  "http://schemas.microsoft.com/3dmanufacturing/production/2015/06"
const millimeters = new Map([
  ["micron", 0.001],
  ["millimeter", 1],
  ["centimeter", 10],
  ["inch", 25.4],
  ["foot", 304.8],
  ["meter", 1000],
])

function readPart(archive: Uint8Array, path: string) {
  const bytes = unzipSync(archive, { filter: ({ name }) => name === path })[
    path
  ]
  if (!bytes) throw new Error(`Missing 3MF package part: ${path}`)
  return new DOMParser().parseFromString(
    new TextDecoder().decode(bytes),
    "application/xml"
  )
}

function modelUnit(model: Document) {
  const unit = model.documentElement?.getAttribute("unit") ?? "millimeter"
  const scale = millimeters.get(unit)
  if (scale === undefined) throw new Error("Unsupported 3MF unit")
  return scale
}

function references(model: Document) {
  return Array.from(model.querySelectorAll("component, item"))
}

function partReference(element: Element) {
  return element.getAttributeNS(production, "path")?.replace(/^\//, "")
}

function normalizeTransforms(model: Document, scale: number) {
  for (const element of references(model)) {
    const transform = element.getAttribute("transform")
    if (!transform) continue
    const values = transform.trim().split(/\s+/)
    element.setAttribute(
      "transform",
      values
        .map((value, index) =>
          index >= 9 && scale !== 1 ? String(Number(value) * scale) : value
        )
        .join(" ")
    )
  }
}

function normalizePackage(
  archive: Uint8Array,
  root: Document,
  rootPath: string,
  rootUnit: number,
  childPaths: Set<string>
) {
  const parts = new Map(
    [...childPaths].map((path) => [path, readPart(archive, path)] as const)
  )
  // Three uses one object-ID map for all model parts, in archive order.
  parts.set(rootPath, root)
  const ids = new Map<string, Map<string, string>>()
  const resourceIds = new Set(
    [...parts.values()].flatMap((model) =>
      [...model.querySelectorAll("resources > :not(object)[id]")].map((item) =>
        item.getAttribute("id")
      )
    )
  )
  let nextId = 1
  for (const [path, model] of parts) {
    const remapped = new Map<string, string>()
    for (const object of model.querySelectorAll("resources > object[id]")) {
      while (resourceIds.has(String(nextId))) nextId += 1
      const id = String(nextId++)
      remapped.set(object.getAttribute("id")!, id)
      object.setAttribute("id", id)
    }
    ids.set(path, remapped)
  }

  const entries = unzipSync(archive, {
    filter: ({ name }) =>
      /^3D\/Textures?\//.test(name) ||
      /^3D\/_rels\/.*\.model\.rels$/.test(name),
  })
  const rootName = "3D/3dmodel.model"
  entries[rootRelationships] = strToU8(
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/${rootName}" Id="model" Type="${modelRelationship}"/></Relationships>`
  )
  const serializer = new XMLSerializer()
  let partIndex = 0
  for (const [path, model] of parts) {
    if (path !== rootPath) model.querySelector("build")?.replaceChildren()
    const scale = modelUnit(model) / rootUnit
    if (scale !== 1) {
      for (const vertex of model.querySelectorAll("vertices > vertex")) {
        for (const axis of ["x", "y", "z"]) {
          vertex.setAttribute(
            axis,
            String(Number(vertex.getAttribute(axis)) * scale)
          )
        }
      }
    }
    for (const element of references(model)) {
      const target = partReference(element) ?? path
      const original = element.getAttribute("objectid")
      const id = original && ids.get(target)?.get(original)
      if (!id) throw new Error("Missing 3MF object reference")
      element.setAttribute("objectid", id)
      element.removeAttributeNS(production, "path")
    }
    normalizeTransforms(model, scale)
    const name = path === rootPath ? rootName : `3D/Parts/${++partIndex}.model`
    entries[name] = strToU8(serializer.serializeToString(model))
  }
  return zipSync(entries, { level: 0 }).slice().buffer
}

export async function load3mf(buffer: ArrayBuffer) {
  const archive = new Uint8Array(buffer)
  const target = readPart(archive, rootRelationships)
    .querySelector('Relationship[Type$="/3dmodel"]')
    ?.getAttribute("Target")
  if (!target) throw new Error("Missing 3MF model relationship")
  const rootPath = target.replace(/^\//, "")
  const root = readPart(archive, rootPath)
  const scale = modelUnit(root)
  const rootReferences = references(root)
  const childPaths = new Set(
    rootReferences.flatMap((element) => {
      const path = partReference(element)
      return path && path !== rootPath ? [path] : []
    })
  )
  const needsNormalization =
    childPaths.size > 0 ||
    !/^\/3D\/[^/]+\.model$/.test(target) ||
    rootReferences.some((element) => {
      const value = element.getAttribute("transform") ?? ""
      return value !== value.trim().replace(/\s+/g, " ")
    })
  const input = needsNormalization
    ? normalizePackage(archive, root, rootPath, scale, childPaths)
    : buffer

  const manager = new LoadingManager()
  let loadingTextures = false
  const ready = new Promise<void>((resolve) => {
    manager.onStart = () => {
      loadingTextures = true
    }
    manager.onLoad = resolve
  })
  manager.onError = (url) => URL.revokeObjectURL(url)
  const object = new ThreeMFLoader(manager).parse(input)
  object.scale.setScalar(scale)
  if (loadingTextures) await ready
  return object
}
