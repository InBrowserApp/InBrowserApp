import { Box3, Vector3 } from "three"
import { disposeModel } from "@workspace/model-mesh/dispose"
import stlExample from "./mounting-bracket.stl?raw"
import objExample from "./mounting-bracket.obj?raw"
import type { Object3D } from "three"

const formats = {
  stl: {
    extensions: ".stl",
    accept: ".stl",
    multiple: false,
    example: stlExample,
    zUp: true,
  },
  obj: {
    extensions: ".obj",
    accept: ".obj,.mtl,image/*",
    multiple: true,
    example: objExample,
    zUp: false,
  },
}

export type ModelFormat = keyof typeof formats
export type OpenModel = {
  name: string
  object: Object3D
  center: Vector3
  size: Vector3
  missingResources: boolean
  zUp: boolean
}

export function getModelFormat(format: ModelFormat) {
  return formats[format]
}

export function exampleFile(format: ModelFormat) {
  return new File([formats[format].example], `mounting-bracket.${format}`)
}

export async function loadModel(
  files: File[],
  format: ModelFormat
): Promise<OpenModel> {
  const options = formats[format]
  const file = files.find((candidate) =>
    candidate.name.toLowerCase().endsWith(options.extensions)
  )
  if (!file) throw new Error("Missing model")
  let object: Object3D
  let missingResources = false
  if (format === "stl") {
    const { parseStl } = await import("@workspace/model-mesh/stl")
    object = parseStl(await file.arrayBuffer())
  } else {
    const { loadObj } = await import("@workspace/model-mesh/obj")
    ;({ object, missingResources } = await loadObj(
      file,
      files.filter((candidate) => candidate !== file)
    ))
  }
  const bounds = new Box3().setFromObject(object)
  const size = bounds.getSize(new Vector3())
  const center = bounds.getCenter(new Vector3())
  if (
    bounds.isEmpty() ||
    size.lengthSq() === 0 ||
    !Number.isFinite(size.lengthSq()) ||
    !Number.isFinite(center.lengthSq())
  ) {
    disposeModel(object)
    throw new Error("Invalid model bounds")
  }
  return {
    name: file.name,
    object,
    size,
    center,
    missingResources,
    zUp: options.zUp,
  }
}
