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

export async function readStep(data: ArrayBuffer) {
  const occt = await initialize({ locateFile: () => wasmUrl })
  const result = occt.ReadStepFile(new Uint8Array(data), {
    linearUnit: "millimeter",
    angularDeflection: 0.2,
  })
  return result.success ? result.meshes : null
}
