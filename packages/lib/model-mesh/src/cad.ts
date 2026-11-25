import initialize from "occt-import-js"
import wasmUrl from "occt-import-js/dist/occt-import-js.wasm?url"

export type ImportedMesh = {
  attributes: { position: { array: number[] }; normal?: { array: number[] } }
  index: { array: number[] }
  color?: [number, number, number]
  brep_faces: {
    first: number
    last: number
    color: [number, number, number] | null
  }[]
}

export type CadFormat = "step" | "iges"

export async function readCad(data: ArrayBuffer, format: CadFormat) {
  const occt = await initialize({ locateFile: () => wasmUrl })
  const bytes = new Uint8Array(data)
  const options = {
    linearUnit: "millimeter",
    angularDeflection: 0.2,
  } as const
  const result =
    format === "iges"
      ? occt.ReadIgesFile(bytes, options)
      : occt.ReadStepFile(bytes, options)
  return result.success ? result.meshes : null
}

export function readStep(data: ArrayBuffer) {
  return readCad(data, "step")
}
