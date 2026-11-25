import type { AnimationClip, Object3D, Vector3 } from "three"
import type { LengthUnit } from "../../../lib/model-length-format"

type ParsedModel = {
  object: Object3D
  missingResources?: boolean
  animations?: AnimationClip[]
}

type FormatOptions = {
  extensions: string[]
  companions?: { accept: string[]; labels: string[] }
  example: { name: string; read: () => Promise<BlobPart> }
  zUp: boolean
  unit?: LengthUnit
  parse: (file: File, files: File[]) => Promise<ParsedModel>
}

const formats = {
  stl: {
    extensions: [".stl"],
    example: {
      name: "mounting-bracket.stl",
      read: async () => (await import("./mounting-bracket.stl?raw")).default,
    },
    zUp: true,
    async parse(file) {
      const { parseStl } = await import("@workspace/model-mesh/stl")
      return { object: parseStl(await file.arrayBuffer()) }
    },
  },
  obj: {
    extensions: [".obj"],
    companions: {
      accept: [".mtl", "image/*"],
      labels: [".mtl", "PNG", "JPG", "WebP"],
    },
    example: {
      name: "mounting-bracket.obj",
      read: async () => (await import("./mounting-bracket.obj?raw")).default,
    },
    zUp: false,
    async parse(file, files) {
      const { loadObj } = await import("@workspace/model-mesh/obj")
      return loadObj(
        file,
        files.filter((candidate) => candidate !== file)
      )
    },
  },
  gltf: {
    extensions: [".glb", ".gltf"],
    unit: "meter",
    companions: {
      accept: [".bin", "image/*"],
      labels: [".bin", "PNG", "JPG", "WebP"],
    },
    example: {
      name: "orbiting-pyramid.gltf",
      read: async () => (await import("./orbiting-pyramid.gltf?raw")).default,
    },
    zUp: false,
    async parse(file, files) {
      const { loadGltf } = await import("@workspace/model-mesh/gltf")
      return loadGltf(
        file,
        files.filter((candidate) => candidate !== file)
      )
    },
  },
  "3mf": {
    extensions: [".3mf"],
    unit: "millimeter",
    example: {
      name: "print-brackets.3mf",
      async read() {
        const { default: url } = await import("./print-brackets.3mf?url")
        const response = await fetch(url)
        if (!response.ok) throw new Error("Could not read the example")
        return response.blob()
      },
    },
    zUp: true,
    async parse(file) {
      const { load3mf } = await import("@workspace/model-mesh/three-mf")
      return { object: await load3mf(await file.arrayBuffer()) }
    },
  },
} satisfies Record<string, FormatOptions>

export type ModelFormat = keyof typeof formats
export type OpenModel = {
  name: string
  object: Object3D
  center: Vector3
  size: Vector3
  missingResources?: boolean
  animations?: AnimationClip[]
  zUp: boolean
  unit?: LengthUnit
  dispose: () => void
}

export function getModelFormat(format: ModelFormat): FormatOptions {
  return formats[format]
}

export async function exampleFile(format: ModelFormat) {
  const { example } = formats[format]
  return new File([await example.read()], example.name)
}

export async function loadModel(
  files: File[],
  format: ModelFormat
): Promise<OpenModel> {
  const options = getModelFormat(format)
  const file = files.find((candidate) => {
    const name = candidate.name.toLowerCase()
    return options.extensions.some((extension) => name.endsWith(extension))
  })
  if (!file) throw new Error("Missing model")

  const [
    { object, missingResources, animations },
    { Box3, Vector3 },
    { disposeModel },
  ] = await Promise.all([
    options.parse(file, files),
    import("three"),
    import("@workspace/model-mesh/dispose"),
  ])
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
    animations,
    zUp: options.zUp,
    unit: options.unit,
    dispose: () => disposeModel(object),
  }
}
