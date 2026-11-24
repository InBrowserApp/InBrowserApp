import initialize from "occt-import-js"
import wasmUrl from "occt-import-js/dist/occt-import-js.wasm?url"
import { prepareModel } from "./step-data"

self.onmessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
  try {
    const occt = await initialize({ locateFile: () => wasmUrl })
    const result = occt.ReadStepFile(new Uint8Array(data), {
      linearUnit: "millimeter",
      angularDeflection: 0.2,
    })
    const model = result.success ? prepareModel(result.meshes) : null
    const transfer = model?.meshes.flatMap(({ positions, indices, normals }) =>
      normals
        ? [positions.buffer, indices.buffer, normals.buffer]
        : [positions.buffer, indices.buffer]
    )
    postMessage(model, { transfer })
  } catch {
    postMessage(undefined)
  }
}
