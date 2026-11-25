import { unzipSync } from "fflate"
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js"

const millimeters = new Map([
  ["micron", 0.001],
  ["millimeter", 1],
  ["centimeter", 10],
  ["inch", 25.4],
  ["foot", 304.8],
  ["meter", 1000],
])

function readXml(bytes: Uint8Array) {
  return new DOMParser().parseFromString(
    new TextDecoder().decode(bytes),
    "application/xml"
  )
}

export function parse3mf(buffer: ArrayBuffer) {
  const archive = new Uint8Array(buffer)
  const relationships = unzipSync(archive, {
    filter: ({ name }) => name === "_rels/.rels",
  })["_rels/.rels"]
  if (!relationships) throw new Error("Missing 3MF package relationships")
  const target = [...readXml(relationships).querySelectorAll("Relationship")]
    .find((item) => item.getAttribute("Type")?.endsWith("/3dmodel"))
    ?.getAttribute("Target")
    ?.replace(/^\//, "")
  if (!target) throw new Error("Missing 3MF model relationship")
  const modelXml = unzipSync(archive, {
    filter: ({ name }) => name === target,
  })[target]
  if (!modelXml) throw new Error("Missing 3MF model")
  // The renderer reads numeric coordinates without applying the package unit.
  const unit =
    readXml(modelXml).documentElement?.getAttribute("unit") ?? "millimeter"
  const scale = millimeters.get(unit)
  if (scale === undefined) throw new Error("Unsupported 3MF unit")
  const object = new ThreeMFLoader().parse(buffer)
  object.scale.setScalar(scale)
  return object
}
